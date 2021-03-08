import React from 'react';
import { Alert } from 'react-native';
import BackgroundGeolocation, { Location } from '@mauron85/react-native-background-geolocation';
import { connect } from 'react-redux';
import { actions as locationActions } from '../redux/locationRedux';
import moment from 'moment';

/**
 * interfaces and types
 */
interface BGTrackngAndroidComponentProps {
    postUserLocationsToServer: (userLocations: string[]) => void;
};

/**
 * A component with no UI to track location in android.
 */
class BGTrackngAndroidComponent extends React.Component<BGTrackngAndroidComponentProps> {

    componentDidMount() {
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 1,
            notificationTitle: 'CRM tracking',
            notificationText: 'enabled',
            debug: true,
            startOnBoot: true,
            stopOnTerminate: false,
            interval: 900000,
            locationProvider: BackgroundGeolocation.RAW_PROVIDER
        });

        BackgroundGeolocation.checkStatus(status => {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
                BackgroundGeolocation.start(); //triggers start on start event
            }
        });

        BackgroundGeolocation.on('location', async (location: Location) => {
            this._postUserLocation(location);
        });

        BackgroundGeolocation.on('stationary', (stationaryLocation: Location) => {
            this._postUserLocation(stationaryLocation);
        });

        BackgroundGeolocation.on('error', (error) => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {

        });

        BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });

        BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                        { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
                    ]), 1000);
            }
        });

        BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
        });

        BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.on('abort_requested', () => {
            console.log('[INFO] Server responded with 285 Updates Not Required');

            // Here we can decide whether we want stop the updates or not.
            // If you've configured the server to return 285, then it means the server does not require further update.
            // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
            // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
        });

        BackgroundGeolocation.on('http_authorization', () => {
            console.log('[INFO] App needs to authorize the http requests');
        });

        // you can also just start without checking for status
        // BackgroundGeolocation.start();
    }

    componentWillUnmount() {
        
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
    }

    _postUserLocation = (location: Location) => {
        const formmatedDate = moment(location.time).format('YYYY-MM-DDTHH:MM:SS');
        const myLocation = [
            formmatedDate,
            `${location.longitude}`,
            `${location.latitude}`
        ];

        this.props.postUserLocationsToServer(myLocation);
    }

    render() {
        return null;
    }
}

/**
 * redux config
 */
const containerActions = {
    postUserLocationsToServer: locationActions.postUserLocationToServer
};
export const BGTrackngAndroid = connect(null, containerActions)(BGTrackngAndroidComponent);