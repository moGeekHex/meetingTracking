import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import { TeamLocationCircle } from '../../components/TeamLocationCircle';
import isEmpty from 'lodash/isEmpty';
import UserLocation from '../../services/models/UserLocation';
import moment from 'moment';
import { colors } from '../../theme';
import { Icon } from 'react-native-elements';

/**
 * interfaces anf types
 */
export type MarkerData = { lat: number, lng: number, locationDate: string, name: string }
interface TeamLocationsMapProps {
    initialLocation: LatLng;

    closeIconHandler?: () => void;
    userLocation: UserLocation | any;
}

/**
 * A stateless component that shows a team locations map
 * with a custom markers
 */
export const TeamLocationsMap = (props: TeamLocationsMapProps) => {

    //grap props
    const { userLocation, initialLocation, closeIconHandler } = props;

    return (
        <View style={styles.flex}>
            <MapView
                style={styles.flex}
                region={{
                    latitude: getRegion(initialLocation, userLocation).latitude,
                    longitude: getRegion(initialLocation, userLocation).longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }}
                showsCompass
                showsUserLocation
                showsMyLocationButton
                showsBuildings
                provider='google'
            >
                {renderMarker(userLocation)}
            </MapView>

            {closeIconHandler ? renderCloseIcon(closeIconHandler) : null}
        </View>
    );

}

/**
 * functions
 */
const renderMarker = (userLocation: UserLocation) => {

    if (isEmpty(userLocation)) return null;

    if (isNaN(userLocation.LocationLatitude) || isNaN(userLocation.LocationLongitude))
        return null;

    return (
        <Marker
            coordinate={{
                latitude: userLocation.LocationLatitude,
                longitude: userLocation.LocationLongitude
            }}>
            <TeamLocationCircle
                title={userLocation.Username}
                subtitle={getSubtitle(userLocation)}
            />
        </Marker>
    );
};

const renderCloseIcon = (closeIconHandler: () => void) => {
    return (
        <TouchableOpacity
            style={styles.closeIcon}
            activeOpacity={1}
            onPress={() => closeIconHandler()}
        >
            <Icon
                type='ionicon'
                name='md-arrow-back'
                color={colors.dark}
                size={24}
            />
        </TouchableOpacity>
    );
};

const getSubtitle = (markerData: UserLocation) => {
    if (markerData.LocationDateTimeString != null && markerData.LocationDateTimeString.length > 0) {
        return markerData.LocationDateTimeString;
    }
    else if (markerData.LocationDateTime > 0) {
        return moment(markerData.LocationDateTime).format('MM DD');
    }
    else {
        return '-\n';
    }
};

const getRegion = (initialLocation: LatLng, userLocation: UserLocation): LatLng => {
    if (!isEmpty(userLocation)) {
        return {
            latitude: userLocation.LocationLatitude,
            longitude: userLocation.LocationLongitude
        };
    }

    return initialLocation;
};

/**
 * constants
 */
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;

/**
 * styles
 */
const styles = StyleSheet.create({
    flex: { flex: 1 },
    closeIcon: {
        position: 'absolute', top: 40, left: 16
    }
});