import geolocation, { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';
import { LatLng } from 'react-native-maps';

/**
 * A set of functions helpers for location
 */

/**
 * A function that returns current user location
 * @public
 */
export const getMyLocation = (): Promise<LatLng> => {
    return new Promise((resolve, reject) => {
        geolocation.getCurrentPosition((position: GeolocationResponse) => {
            const coordinates: LatLng = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            resolve(coordinates);
        }, (error: GeolocationError) => {
            reject(error.message);
        })
    });
}