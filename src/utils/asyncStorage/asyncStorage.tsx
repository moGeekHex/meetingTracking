import AsyncStorage from '@react-native-community/async-storage';
import { StorageKeys, StorageModels } from './asyncStorage.types';

/**
 * A helper to store data to storage
 * @param {string} storageKey 
 * @param {*} storedData 
 */
export const storeData = async (storageKey: StorageKeys, storedData: StorageModels) => {
    try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(storedData));
    } catch (e) {
        // saving error
    }
}

/**
 * A helper to get parsed data from storage
 * if no data return null
 * data is retuned parsed, no need to parsing
 * @param {string} storageKey 
 */
export const getData = async (storageKey: StorageKeys) => {
    try {
        const dataFromStorage = await AsyncStorage.getItem(storageKey);
        if (dataFromStorage !== null) {
            return JSON.parse(dataFromStorage);
        }
        else {
            return null;
        }
    } catch (e) {
        console.log('erron in get data from stoarge', e)
    }
}

/**
 * A function to clear all storage data
 * it can take an optional param of schema name
 * if no schema name provided, will clear all data in storage
 * @param storageSchemaKey 
 */
export const clearAllData = async (storageSchemaKey?: StorageKeys) => {
    try {
        if (storageSchemaKey) {
            await AsyncStorage.removeItem(storageSchemaKey);
        }
        else {
            await AsyncStorage.clear();
        }
    }
    catch (error) {
        console.log('an error whn clear data occured', error)
    }
}