import { Action, Dispatch, Auth, TeamLocations } from "./redux.types";
import { services } from "../services/services";
import { types } from "./reduxActionTypes";

/**
 * actions
 */
export const actions = {
    getUsers: () => {
        return async (dispatch: Dispatch) => {
            dispatch({ type: types.FETCHING_USERS });

            try {
                const users = await services.getUsers();

                if (users.kind == 'ok') {
                    dispatch({
                        type: types.FETCHING_USERS_SUCCESS,
                        payload: users.users
                    });
                }
                else if (users.kind == 'rejected') {
                    dispatch({
                        type: types.FETCHING_USERS_FAIL,
                        error: users.message
                    });
                }
            }
            catch (error) {
                dispatch({
                    type: types.FETCHING_USERS_FAIL,
                    error: 'unknown errror'
                });
            }
        }
    },
    getUserLocation: (userId: number) => {
        return async (dispatch: Dispatch) => {
            try {
                dispatch({ type: types.FETCHING_TEAM_LOCATIONS });

                const userLocation = await services.getUserLocation(userId);
         
                if (userLocation.kind == 'ok') {
                    dispatch({
                        type: types.FETCHING_TEAM_LOCATIONS_SUCCESS,
                        payload: userLocation.userLocation
                    });
                }
                else {
                    dispatch({
                        type: types.FETCHING_TEAM_LOCATIONS_FAIL,
                        error: 'error in team locations'
                    });
                }
            }
            catch (error) {
                console.log('error is', error)
                dispatch({
                    type: types.FETCHING_TEAM_LOCATIONS_FAIL,
                    error: 'User has no locations'
                });
            }
        }
    }
};

/**
 * reducer
 */
const initialState: TeamLocations = {
    loading: false,
    error: undefined,
    success: false,
    users: [],
    userLocation: {}
}
export const reducer = (state: TeamLocations = initialState, action: Action) => {

    switch (action.type) {

        /**
         * users cases
         */
        case types.FETCHING_USERS:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.FETCHING_USERS_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.FETCHING_USERS_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true, users: action.payload
            });

        /**
         * team location cases
         */
        case types.FETCHING_TEAM_LOCATIONS:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.FETCHING_TEAM_LOCATIONS_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.FETCHING_TEAM_LOCATIONS_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true, userLocation: action.payload
            });

        /**
         * default state
         */
        default: return state;
    }
}