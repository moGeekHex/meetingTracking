import { LatLng } from "react-native-maps";

/**
 * A schemas types for realm
 */

/**
 * The location schema realm type
 */
export interface Location {
    location: LatLng;
    time: number;
    _id: string;
};

/**
 * The metting time schema realm type
 */
export interface MettingTime {
    _id: string;
    departureDateTime?: number;
    arrivalDateTime: number;
};

/**
 * The UserLocationSchema
 */
export interface UserLocationSchema {
    _id: string;
    date: string;
    longitude: number;
    latitude: number;
}
