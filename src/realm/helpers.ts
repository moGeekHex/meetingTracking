import realm from './index';
import { RealmSchemNames } from './schemaNames';

/**
 * A list of functions helpers
 * to acheive realm operations
 */

/**
 * A function to insert data to realm
 * @param schemaName 
 * @param newData 
 */
export const insertToRealm = (schemaName: RealmSchemNames, newData: any) => {
    return new Promise((resolve, reject) => {
        try {
            realm.write(async () => {
                if (newData.constructor === Array) {
                    newData.map((item: any) => {
                        try { realm.create(schemaName, item, true) }
                        catch (err) { console.log('err in insert is', err) }
                    })
                }
                else {

                    /**
                     * third param 'true'
                     * to update schema not craete ny primary key
                     * if exist
                     */
                    realm.create(schemaName, newData, true);
                }
                resolve('newData');
            })
        }
        catch (err) {
            console.warn('GGGGG')
            console.log('err is', err);
            reject(err);
        }
    });
};

/**
 * A function that retrives all data from realm
 * for specific schema, without filter
 * @param schemaName 
 */
export const queryAllObjects = (schemaName: RealmSchemNames) => {
    return new Promise((resolve, reject) => {
        try {
            realm.write(() => {
                const allData = realm.objects(schemaName)
                resolve(allData)
            })
        }
        catch (err) {
            reject(err)
            console.log('err in q objects is', err)
        }
    })
};

/**
 * A helper function that delete all objects
 * for specific schema
 * @param schemaName 
 */
export const deleteFromRealm = (schemaName: RealmSchemNames) => {
    return new Promise((resolve, reject) => {
        try {
            realm.write(() => {
                try {
                    const objectToBedeleted = realm.objects(schemaName);
                    realm.delete(objectToBedeleted);
                    resolve();
                }
                catch (error) { console.log('error 56 is', error) }
            })
        }
        catch (err) {
            reject(err);
        }
    })
}