import { Action, Dispatch } from "./redux.types";
import { services } from "../services/services";
import { insertToRealm, queryAllObjects, deleteFromRealm } from "../realm/helpers";
import { UserLocationSchema } from "../realm/schemas/schema.types";
import { generateUUID } from "../utils/general/general";

/**
 * actions
 */
export const actions = {
    postUserLocationToServer: (userLocation: any[]) => {
        return async (dispatch: Dispatch) => {
            try {
                const result = await services.postUserLocations(userLocation);
                
                if (result.kind != 'ok') {

                    /**
                     * if fail should save location to realm
                     */

                    //add id to data
                    const locationToRealm: UserLocationSchema = {
                        _id: generateUUID(),
                        date: userLocation[0],
                        longitude: userLocation[1],
                        latitude: userLocation[2]
                    };
                    await insertToRealm('UserLocation', locationToRealm);
                }
            }
            catch (error) {
                console.log('error in postUserLocationToServer', error);
            }
        }
    },
    syncAllUserLocations: () => {
        try {
            return async (dispatch: Dispatch) => {
                const dataFromRelam: UserLocationSchema[] = await queryAllObjects('UserLocation') as any;

                //format data from realm to api
                let formattedUserLocations: string = '';
                dataFromRelam.forEach((userLocation: UserLocationSchema) => {
                    const arr = [userLocation.date, userLocation.longitude, userLocation.latitude];
                    formattedUserLocations += `[${arr}];`;
                });
            
                const result = await services.postUserLocations(formattedUserLocations);
             
                if (result.kind == 'ok') {

                    //if success should delete user locations from realm
                    deleteFromRealm('UserLocation').catch(error => {
                        console.log('error when delete data from realm', error);
                    })
                }

            }
        }
        catch (error) {
            console.log('error in syncAllLocations', error);
        }
    }
};

/**
 * reducer
 */
const initialState = {

}
export const reducer = (state = initialState, action: Action) => {

    switch (action.type) {

        default: return state;
    }
}