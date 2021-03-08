import { Action, Dispatch, Auth } from "./redux.types";
import { services } from "../services/services";
import { types } from "./reduxActionTypes";
import { storeData } from "../utils/asyncStorage";
import { UserData } from "../utils/asyncStorage/asyncStorage.types";
import Login from "../services/models/Login";

/**
 * functions
 */
const storeDataToStorage = async (data: Login, dispatch: Dispatch) => {
    try {

        //data to storage
        const loginDataToStorage: Login = {
            AccessToken: data.AccessToken,
            RefreshToken: data.RefreshToken,
            LoggedInUserID: data.LoggedInUserID,
            IssueDateTime: data.IssueDateTime,
            ExpiryDateTime: data.ExpiryDateTime,
            ShowTeamLocations: data.ShowTeamLocations,
            username: data.username
        };

        //store data to storage
        await storeData('UserData', data);

        //push data to redux
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: loginDataToStorage
        });
    }
    catch (error) {
        console.log('ERROR: in store data', error);
    }
}

/**
 * actions
 */
export const actions = {
    login: (username: string, password: string) => {
        return async (dispatch: Dispatch) => {
            dispatch({ type: types.LOGIN_LOADING });

            const loginRes = await services.login(username, password);
       
            if (loginRes.kind == 'ok') {
                const loginData = Object.assign(loginRes.login, { username });
                await storeDataToStorage(loginData, dispatch);
            }
            else if (loginRes.kind == 'rejected') {
                dispatch({
                    type: types.LOGIN_FAIL,
                    error: loginRes.message
                });
            }
            else {
                dispatch({
                    type: types.LOGIN_FAIL,
                    error: 'unknown errror'
                });
            }
        }
    }
};

/**
 * reducer
 */
const initialState: Auth = {
    loading: false,
    error: undefined,
    success: false,
    userData: {}
}
export const reducer = (state: Auth = initialState, action: Action) => {

    switch (action.type) {
        case types.LOGIN_LOADING:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.LOGIN_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true, userData: action.payload
            });
        default: return state;
    }
}