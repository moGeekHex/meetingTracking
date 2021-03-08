import React from 'react';
import {
    StyleSheet, View, Dimensions, TouchableOpacity, Modal
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { colors } from '../../theme';
import { Header } from '../../common/Header';
import { connect } from 'react-redux';
import { Button, Icon } from 'native-base';
import { Text } from '../../common/Text';
import { TeamLocationsMap } from './TeamLocationsMap';
import { actions as teamLocationActions } from '../../redux/teamLocationsRedux';
import { TeamLocations as TeamLocationsType } from '../../redux/redux.types';
import { showToast } from '../../utils/general/general';
import { Loading } from '../../common/Loading';
import isEmpty from 'lodash/isEmpty';
import UserLocation from '../../services/models/UserLocation';
import { getMyLocation } from '../../utils/location';
import { SingleSelectListModal } from '../../components/SingleSelectList';
import { UserProperties } from '../../services/models/User';
import { LatLng } from 'react-native-maps';

/**
 * interfaces and types
 */
interface TeamLocationsProps extends NavigationScreenProps<{}>, TeamLocationsType {
    getUsers: () => void;
    getUserLocation: (usersIds: string) => void;
    users: Array<any>;
    userLocation: UserLocation;
}
interface TeamLocationsState {
    selectedUser: UserProperties | null;

    /**
     * null means users is not updated yet
     */
    users: Array<any> | null;
    viewUsersList: boolean;

    currentUserLocation: LatLng | {};
    showTeamLocationsMap: boolean;
}

/**
 * A stateful compoeent that shows a team locations on maps
 */
class TeamLocationsScreen extends React.Component
    <TeamLocationsProps, TeamLocationsState>
{

    /**
     * locale state
     */
    state: TeamLocationsState = {
        selectedUser: null,
        users: null,
        viewUsersList: false,
        currentUserLocation: {},
        showTeamLocationsMap: false
    };

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderViewLocations()}
                {this._renderTeamLocationsMap()}

                {this._renderModalList()}
                {this._renderLoading()}
                {this._renderFullTeamLocationsModal()}
            </View>
        );
    }

    /**
     * life cycle
     */
    componentDidMount() {
        this.props.getUsers();
        this._getCurrentUserLocation();
    }

    UNSAFE_componentWillReceiveProps(nextProps: TeamLocationsProps) {

        //grap data
        const { error, success, users } = nextProps;

        if (success && !error) {
            this.setState({ users });
        }
        else if (error && !success) {
            showToast(error, null, 1500, 'danger');
        }
    }

    /**
     * locale component functions
     */
    _renderTeamLocationsMap = () => {

        //grap data
        const currentUserLocation = this.state.currentUserLocation as LatLng;

        if (isEmpty(currentUserLocation))
            return (
                <View style={styles.mapContainer}>
                    <TouchableOpacity
                        onPress={() => this.setState({ showTeamLocationsMap: true })}
                        style={styles.showFullMapStyle}
                    >
                        <Text style={styles.showFullMapTxt}>
                            {'show full map'}
                        </Text>
                    </TouchableOpacity>

                    <TeamLocationsMap
                        userLocation={{}}
                        initialLocation={{
                            latitude: 0,
                            longitude: 0
                        }}
                    />
                </View>
            );

        return (
            <View style={styles.mapContainer}>
                <TouchableOpacity
                    onPress={() => this.setState({ showTeamLocationsMap: true })}
                    style={styles.showFullMapStyle}
                >
                    <Text style={styles.showFullMapTxt}>
                        {'show full map'}
                    </Text>
                </TouchableOpacity>

                <TeamLocationsMap
                    userLocation={this.props.userLocation}
                    initialLocation={{
                        latitude: currentUserLocation.latitude,
                        longitude: currentUserLocation.longitude
                    }}
                />
            </View>
        );
    }

    _renderModalList = () => {
        return (
            this.state.users == null ?
                null :
                <SingleSelectListModal
                    visible={this.state.viewUsersList}
                    items={this.state.users}
                    closeModal={() => this._toggleUsersList(false)}
                    title={'Select Users'}
                    noDataTxt={'No Users'}
                    getSelectedItem={this._getSelectedUser}
                    id='ID'
                    name='Name'
                />
        );
    }

    _renderViewLocations = () => {

        //constants
        const { selectedUser } = this.state;

        return (
            <View style={styles.viewLocationsContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this._toggleUsersList(true)}
                    style={styles.selectUserView}>
                    <Text style={styles.usersTxt}>
                        {selectedUser != null ? selectedUser.Name : 'Select User'}
                    </Text>

                    <View style={styles.leftViewLocations}>
                        <Icon
                            type='Ionicons'
                            name='md-arrow-dropdown'
                            style={styles.iconArrow}
                        />
                    </View>
                </TouchableOpacity>

                <Button
                    onPress={this._handleViewLocations}
                    style={styles.viewLocationBtn}
                >
                    <Text style={styles.btnContent}>
                        <Icon
                            type='FontAwesome'
                            name='map-marker'
                            style={styles.markerIcn}
                        />
                        <Text style={styles.viewLocationBtnTxt}>
                            {'\t\tView Locations'}
                        </Text>
                    </Text>
                </Button>
            </View>
        );
    }

    _renderLoading = () => {
        return (
            this.props.loading && <Loading overlay />
        );
    }

    _renderFullTeamLocationsModal = () => {

        //grap data
        const currentUserLocation = this.state.currentUserLocation as LatLng;
        let map;

        if (isEmpty(currentUserLocation)) {
            map = (<View style={styles.flex}>
                <TeamLocationsMap
                    closeIconHandler={() => this.setState({ showTeamLocationsMap: false })}
                    userLocation={{}}
                    initialLocation={{
                        latitude: 0,
                        longitude: 0
                    }}
                />
            </View>);
        }
        else {
            map = (<View style={styles.flex}>
                <TeamLocationsMap
                    closeIconHandler={() => this.setState({ showTeamLocationsMap: false })}
                    userLocation={this.props.userLocation}
                    initialLocation={{
                        latitude: currentUserLocation.latitude,
                        longitude: currentUserLocation.longitude
                    }}
                />
            </View>);
        }

        return (
            <Modal
                onRequestClose={() => this.setState({ showTeamLocationsMap: false })}
                presentationStyle='fullScreen'
                visible={this.state.showTeamLocationsMap}
            >
                {map}
            </Modal>
        );
    }

    _renderHeader = () => {
        return (
            <Header
                onBack={() => this.props.navigation.goBack()}
                title='Team Locations'
            />
        );
    }

    /**
     * locale functions
     */
    _getCurrentUserLocation = () => {

        /**
         * will be used to initial location for map
         */
        getMyLocation().then((userCoords: LatLng) => {
            this.setState({
                currentUserLocation: {
                    latitude: userCoords.latitude,
                    longitude: userCoords.longitude
                }
            })
        });
    }

    _getSelectedUser = (selectedUser: UserProperties) => {
        this.setState({ selectedUser });
    }

    _toggleUsersList = (newValue: boolean) => {
        this.setState({ viewUsersList: newValue });
    }

    _handleViewLocations = () => {

        //grap state
        const { selectedUser } = this.state;

        /**
         * should check if there is selected agent or not
         */
        if (selectedUser != null) {
            this.props.getUserLocation(selectedUser.ID as any);
        }
        else {
            showToast('you should select user first', null, 1500, 'danger');
        }
    }
}

/**
 * constants
 */
const { width: windowWidth, } = Dimensions.get('window');
const MAP_VIEW_WIDTH = windowWidth * 0.95;

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors["titan-white"] },
    viewLocationsContainer: {
        flex: 1, width: '80%', justifyContent: 'center',
        alignItems: 'center', alignSelf: 'center'
    },
    viewLocationBtn: {
        borderRadius: 0,
        justifyContent: 'flex-start',
        alignSelf: 'center',
        width: '70%', marginTop: 8,
        backgroundColor: colors.orange
    },
    viewLocationBtnTxt: { fontSize: 16, color: colors.light },
    flex: { flex: 1 },
    selectUserView: {
        height: 50, paddingHorizontal: 8, borderWidth: 0.5,
        borderColor: colors["limed-spruce"], width: '100%',
        borderRadius: 8, flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center'
    },
    usersTxt: {
        fontWeight: 'bold', fontSize: 16,
        color: colors.dark
    },
    leftViewLocations: {
        flexDirection: 'row', alignItems: 'center'
    },
    iconArrow: {
        color: colors.dark, fontSize: 16
    },
    markerIcn: {
        color: colors.light, fontSize: 20
    },
    btnContent: { paddingLeft: 8 },
    mapContainer: {
        flex: 2, marginVertical: 8, width: MAP_VIEW_WIDTH, alignSelf: 'center',
    },
    showFullMapStyle: {
        width: '100%', alignItems: 'flex-start', justifyContent: 'center',
        paddingLeft: 8, paddingBottom: 4
    },
    showFullMapTxt: {
        color: colors.dodgerBlue, fontSize: 14,
        textDecorationLine: 'underline', textDecorationColor: colors.dodgerBlue
    }
});

/**
 * redux configt
 */
const mapStateToProps = ({ TeamLocation }: { TeamLocation: TeamLocationsType }) => {
    return {
        loading: TeamLocation.loading,
        error: TeamLocation.error,
        success: TeamLocation.success,
        users: TeamLocation.users,
        userLocation: TeamLocation.userLocation
    };
}

const containerActions = {
    getUsers: teamLocationActions.getUsers,
    getUserLocation: teamLocationActions.getUserLocation
};
export const TeamLocations = connect(mapStateToProps, containerActions)
    (TeamLocationsScreen as any);