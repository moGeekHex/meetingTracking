import React from 'react';
import {
    View, StyleSheet,
    Dimensions, TouchableOpacity, Platform,
    PermissionsAndroid, Image, Alert
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { colors } from '../../theme';
import { BUTTON_HEIGHT } from '../../common/TransparentFooterButton';
import MapView,
{
    PROVIDER_DEFAULT, AnimatedRegion, LatLng,
    Polyline, MarkerAnimated
}
    from 'react-native-maps';
import { Icon } from 'react-native-elements';
import { getMyLocation } from '../../utils/location';
import geolocation, { GeolocationConfiguration } from '@react-native-community/geolocation';
import { navigationRouteNames } from '../../navigation';
import { insertToRealm, queryAllObjects, deleteFromRealm } from '../../realm/helpers';
import { Location, MettingTime } from '../../realm/schemas/schema.types';
import uuidV4 from 'uuid/v4';
import { Header } from '../../common/Header';
import { Button } from 'native-base';
import { Text } from '../../common/Text';
import { METTING_TIME_ID } from '../../realm/schemas/constants';

/**
 * interfaces and types
 */
type Position = { coords: LatLng }
interface MapScreenProps extends NavigationScreenProps<{}> {

}

interface MapScreenState {
    latitude: number,
    longitude: number,
    routeCoordinates: Array<LatLng>,
    coordinate: AnimatedRegion,

    mapIsLoaded: boolean
}

/**
 * The map screen
 */
export class MapScreen extends React.Component
    <MapScreenProps, MapScreenState>
{

    /**
     * locale state
     */
    state = {
        latitude: 0.0,
        longitude: 0.0,
        routeCoordinates: [],
        coordinate: new AnimatedRegion({
            latitude: 0.0,
            longitude: 0.0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        mapIsLoaded: false
    };

    /**
     * locale variables
     */
    _map: any
    _watchID: any
    _marker: any
    _watchPositionConfig = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        // distanceFilter: 100,
        // useSignificantChanges: true
    };

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderMap()}
                {/* {this._renderGetMyLocationFab()} */}
                {this._renderFooter()}
            </View>
        );
    }

    /**
     * life cycle
     */
    async componentDidMount() {
        try {

            if (Platform.OS == 'android') {

                /**
                 * request location permission (android only)
                 * ios will ask permission automatically
                 */
                await this._requestLocationPermission();
            }

            //get current user rep
            this._getCurrentUserLocation();

            //config geolocation
            this._configGeolocation();

            //assign watch id to track location
            await this._trackLocation();
        }
        catch (error) {
            console.log('error in did mount', error)
        }
    }

    componentWillUnmount() {
        this._clearWatchPositionId();
    }

    /**
     * locale component functions
     */
    _renderFooter = () => {
        return (
            <View style={styles.footerView}>
                <Button
                    rounded
                    onPress={this._handleFinishTrip}
                    style={styles.footerViewButton}
                >
                    <Text style={styles.footerBtnTxt}>
                        {'Finish Trip'}
                    </Text>
                </Button>
            </View>
        );
    }

    _renderHeader = () => {
        return (
            <Header
                title='Trip Map'
                onBack={() => this.props.navigation.goBack()}
            />
        );
    }

    _renderGetMyLocationFab = () => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.currentLocationIconContainer}
                onPress={async () => await this._handleLocationIconPress()}
            >
                <Icon
                    type='ionicon'
                    name='md-locate'
                    size={32}
                    color={colors.iron}
                />
            </TouchableOpacity>
        );
    }

    _renderAnimatedMarker = () => {

        /**
         * The marker will not appear until user is start moving
         * or can set initial lat lng (user lat lng)
          
         * in this case i added inital coords
         */
        return (
            <MarkerAnimated
                tracksViewChanges
                tracksInfoWindowChanges={true}
                title='user'
                ref={marker => {
                    this._marker = marker;
                }}
                coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }}
            >
                <Image
                    source={require('./car.png')}
                    style={styles.imgCarStyle}
                />
            </MarkerAnimated>
        );
    }

    _renderPolyline = () => {
        return (
            <Polyline
                strokeColor={colors["limed-spruce"]}
                coordinates={this.state.routeCoordinates}
                strokeWidth={5}
            />
        );
    }

    _renderMap = () => {
        return (<MapView
            provider={PROVIDER_DEFAULT}
            loadingEnabled
            showsUserLocation={true}
            ref={component => this._map = component}
            followsUserLocation
            region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }}
            style={styles.map}
        >
            {this._renderPolyline()}
            {this._renderAnimatedMarker()}
        </MapView>);
    }

    /**
     * locale functions
     */
    _clearWatchPositionId = () => {
        navigator.geolocation.clearWatch(this._watchID);
    }

    _handleIconFooterPress = () => {
        this.props.navigation.goBack();
    }

    _getCurrentUserLocation = () => {
        getMyLocation().then(async coordinates => {
            this.setState({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                mapIsLoaded: true
            });
        }).catch(error => {
            console.warn(error);
            Alert.alert('error', 'an error has been occured when fetchig location')
        });
    }

    _configGeolocation = () => {
        const config: GeolocationConfiguration = {
            skipPermissionRequests: false,
            authorizationLevel: 'whenInUse'
        };
        geolocation.setRNConfiguration(config);
    }

    _requestLocationPermission = (): any => {

        /**
         * return promise with
         * resolve if permission granted and reject if not
         */
        return new Promise(async (resolve, reject) => {
            try {
                const permissionStatus = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

                if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
            }
            catch (error) {
                reject(error);
                // console.log('error 123', error)
            }
        })
    };

    _handleFinishTrip = async () => {
        const mettingTimeToRealm: MettingTime = {
            _id: METTING_TIME_ID,
            arrivalDateTime: new Date().getTime()
        }
        await insertToRealm('MettingTime', mettingTimeToRealm);

        //clear watch id
        this._clearWatchPositionId();
        this.props.navigation.navigate(navigationRouteNames.ConfirmationTrip)
    }

    _animateMarker = (newCoordinate: LatLng) => {
        if (Platform.OS === "android") {
            if (this._marker) {
                this._marker._component.animateMarkerToCoordinate(
                    newCoordinate,
                    500
                );
            }
        } else {
            this.state.coordinate.timing(newCoordinate).start();
        }
    }

    _storeCoordsToRealm = async (coordinates: LatLng) => {
        try {
            const dataToRealm: Location = {
                location: coordinates,
                time: new Date().getTime(),
                _id: uuidV4()
            };

            await insertToRealm('Location', dataToRealm);
        }
        catch (error) {

        }
    }

    _trackLocation = () => {
        this._watchID = navigator.geolocation.watchPosition(
            async (position: Position) => {
                const { routeCoordinates } = this.state;
                const { latitude, longitude } = position.coords;

                const newCoordinate = {
                    latitude, longitude
                };
                await this._storeCoordsToRealm(newCoordinate);
                this._animateMarker(newCoordinate);

                this.setState({
                    latitude,
                    longitude,
                    routeCoordinates: routeCoordinates.concat([newCoordinate] as any)
                });
            },
            (error: any) => console.log(error),
            { ...this._watchPositionConfig }
        );
    }

    _handleLocationIconPress = async () => {
        const { longitude, latitude } = await getMyLocation();

        this._map.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }, 1000);
    }
}

/**
 * constants
 */
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const LOCATION_ICON_SIZE = windowWidth / 7;
const FOOTER_BUTTON_HEIGHT = 50;
const FOOTER_VIEW_HEIGHT = windowHeight * 0.1;

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors["titan-white"] },
    map: { flex: 1 },
    currentLocationIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: LOCATION_ICON_SIZE,
        width: LOCATION_ICON_SIZE,
        borderRadius: LOCATION_ICON_SIZE / 2,
        backgroundColor: colors["limed-spruce"], elevation: 5,
        position: 'absolute', right: 8,

        /**
         * bottom should transparent button height + 8
         * to prevent button hide fab
         */
        bottom: BUTTON_HEIGHT + 8
    },
    imgCarStyle: {
        height: 50, width: 50
    },
    footerView: {
        height: FOOTER_VIEW_HEIGHT,
        backgroundColor: colors.light
    },
    footerViewButton: {
        justifyContent: 'center',
        alignItems: 'center', alignSelf: 'flex-end',
        width: windowWidth / 3, marginRight: 16,
        marginTop: -(FOOTER_BUTTON_HEIGHT / 2),
        height: FOOTER_BUTTON_HEIGHT,
        backgroundColor: colors.orange
    },
    footerBtnTxt: {
        fontSize: 16, color: colors.light
    }
})