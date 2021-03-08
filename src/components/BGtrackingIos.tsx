import React from 'react';
import BackgroundGeolocation, { Location } from "react-native-background-geolocation";
import moment from 'moment';
import { connect } from 'react-redux';
import { actions as locationActions } from '../redux/locationRedux';

/**
 * interfaces and types
 */
interface BGTrackingIosComponentProps {
  postUserLocationsToServer: (userLocations: any[]) => void;
};

/**
 * A component with no UI to track location in ios.
 */
class BGTrackingIosComponent extends React.Component<BGTrackingIosComponentProps> {

  componentDidMount() {

    ////
    // 1.  Wire up event-listeners
    //

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation(this.onLocation, this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange(this.onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange(this.onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange(this.onProviderChange);

    BackgroundGeolocation.onHeartbeat(this.onHeartbeat);

    BackgroundGeolocation.onHttp(this.onHttp);

    BackgroundGeolocation.onGeofence(this.onGeofence);

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready({
      reset: true,

      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 5,

      // Activity Recognition
      stopTimeout: 1,
      stationaryRadius: 25,

      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      enableHeadless: false,
      geofenceInitialTriggerEntry: true,
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      BackgroundGeolocation.getCurrentPosition({
        timeout: 30,          // 30 second timeout to fetch location
        maximumAge: 2000,     // Accept the last-known-location if not older than 5000 ms.
        desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
        samples: 3,           // How many location samples to attempt.
      }).then((location: Location) => {
        this._postUserLocation(location);
      });

      if (!state.enabled) {

        ////
        // 3. Start tracking!
        //
        BackgroundGeolocation.start(function () {
          console.log("- Start success");
        });
      }
    });

  }

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  _postUserLocation = (location: Location) => {
    const formmatedDate = moment(location.timestamp).format('YYYY-MM-DDTHH:mm:ss');
    const myLocation = [
      formmatedDate,
      location.coords.longitude,
      location.coords.longitude
    ];
    this.props.postUserLocationsToServer(myLocation);
  }


  onLocation = async (location) => {
    console.log('[location] -', location);
    this._postUserLocation(location);
  }
  onError = async (error) => {
    console.warn('[location] ERROR -', error);

  }
  onActivityChange = async (event) => {
    console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'

  }
  onProviderChange = (provider) => {
    console.log('[providerchange] -', provider.enabled, provider.status);

  }
  onMotionChange = (event) => {
    console.log('[motionchange] -', event.isMoving, event.location);
  }
  onHeartbeat = (params) => {
    console.log('[heartbeat] -', params);
  }
  onHttp = async (response) => {
    console.log('[http] -', JSON.stringify(response));
  }
  onGeofence = (event) => {
    console.log('[geofence] event -', event);

  }
  onGeofencesChange = (event) => {
    console.log('[geofencesChange] -', event);
    let on = event.on;
    let off = event.off;

    on.forEach((geofence) => {
      console.log('[on geo] -', geofence);
    });

    off.forEach((geofence) => {
      console.log('[off geo] -', geofence);
    });
  }

  render() {
    return (
      null
    );
  }
}

/**
 * redux config
 */
const containerActions = {
  postUserLocationsToServer: locationActions.postUserLocationToServer
};
export const BGTrackingIos = connect(null, containerActions)(BGTrackingIosComponent);