import { realmSchemaNames } from "../schemaNames";

/**
 * A list of location schemas
 */
const LocationSchema = {
    name: realmSchemaNames.Location,
    primaryKey: '_id',
    properties: {
        location: `${realmSchemaNames.LatLng}`,
        time: 'int',
        _id: 'string'
    }
};
const LatLngSchema = {
    name: realmSchemaNames.LatLng,
    properties: {
        latitude: 'double',
        longitude: 'double'
    }
};
const MettingTimeSchema = {
    name: realmSchemaNames.MettingTime,
    primaryKey: '_id',
    properties: {
        _id: 'string',
        departureDateTime: { type: 'int', default: 0 },
        arrivalDateTime: { type: 'int', default: 0 }
    }
};

/**
 * user locations
 */
const UserLocationSchema = {
    name: realmSchemaNames.UserLocation,
    primaryKey: '_id',
    properties: {
        _id: 'string',
        date: 'string',
        longitude: 'double',
        latitude: 'double'
    }
}

/**
 * export array of schemas
 */
export const AllLocationSchema = [LocationSchema, LatLngSchema, MettingTimeSchema,
    UserLocationSchema];