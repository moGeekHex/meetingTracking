import Realm from 'realm';
import { schemas } from './schemas';

/**
 * open realm object
 */
const realmOptions = {
    path: 'meetingTracking.realm',
    schema: schemas,
    schemaVersion: 1
};

//export realm instance
const realmInstance = new Realm(realmOptions);
export default realmInstance;