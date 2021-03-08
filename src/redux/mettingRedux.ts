import { Action, Dispatch, Mettings } from "./redux.types";
import { services } from "../services/services";
import { types } from "./reduxActionTypes";
import { showToast } from "../utils/general/general";

/**
 * actions
 */
export const actions = {
    getMettings: (from: string, to: string, status: number, loggedInUserID: number) => {
        return async (dispatch: Dispatch) => {
            try {

                dispatch({ type: types.FETCHING_METTINGS });

                const mettings = await services.getMettings(from, to, status, loggedInUserID);

                if (mettings.kind == 'ok')
                    dispatch({
                        type: types.FETCHING_METTINGS_SUCCESS,
                        payload: mettings.mettings
                    });
                else if (mettings.kind == 'rejected') {
                    dispatch({
                        type: types.FETCHING_METTINGS_FAIL,
                        error: mettings.message
                    });
                }
            }
            catch (error) {
                dispatch({
                    type: types.FETCHING_METTINGS_FAIL,
                    error: 'unknown error'
                });
                console.log('ERROR:', error)
            }

        }
    },
    updateSelectedMettingId: (mettingId: number) => {
        return async (dispatch: Dispatch) => {
            try {
                dispatch({
                    type: types.UPDATE_SELECTED_METTING_ID,
                    payload: mettingId
                });
            }
            catch (errror) {
                console.log('error is', errror);
            }
        }
    },
    fetchMettingById: (mettingId: string) => {
        return async (dispatch: Dispatch) => {
            try {
                dispatch({ type: types.FETCHING_METTINGS_DETAILS });

                const mettingDetails = await services.fetchMettingDetails(mettingId);

                if (mettingDetails.kind == 'ok') {
                    dispatch({
                        type: types.FETCHING_METTINGS_DETAILS_SUCCESS,
                        payload: mettingDetails.mettingDetails
                    });
                }
                else if (mettingDetails.kind == 'rejected') {
                    dispatch({
                        type: types.FETCHING_METTINGS_DETAILS_FAIL,
                        error: mettingDetails.message
                    });
                }
            }
            catch (error) {
                dispatch({
                    type: types.FETCHING_METTINGS_DETAILS_FAIL,
                    error: 'unknown error'
                });
            }
        }
    },
    createNewMetting: (customerId: number, mettingDateTime: string,
        locationDescription: string, description: string) => {
        return async (dispatch: Dispatch) => {
            try {
                dispatch({ type: types.CREATING_NEW_METTING });

                const newMetting = await services.createNewMetting(customerId,
                    mettingDateTime, locationDescription, description);

                if (newMetting.kind == 'ok') {
                    {
                        dispatch({
                            type: types.CREATING_NEW_METTING_SUCCESS
                        });
                    }
                }
                else if (newMetting.kind == 'rejected') {
                    dispatch({
                        type: types.CREATING_NEW_METTING_FAIL,
                        error: newMetting.message
                    });
                }
            }
            catch (error) {
                dispatch({
                    type: types.CREATING_NEW_METTING_FAIL,
                    error: 'unknown error'
                });
            }
        }
    },
    getMettingStatuses: () => {
        return async (dispatch: Dispatch) => {
            try {
                dispatch({ type: types.FETCHING_METTING_STATUS });

                const mettingStatuses = await services.getMettingStatuses();

                if (mettingStatuses.kind == 'ok') {
                    dispatch({
                        type: types.FETCHING_METTING_STATUS_SUCCESS,
                        payload: mettingStatuses.statuses
                    });
                }
                else if (mettingStatuses.kind == 'rejected') {
                    dispatch({
                        type: types.FETCHING_METTING_STATUS_FAIL,
                        error: mettingStatuses.message
                    });
                }
            }
            catch (error) {
                dispatch({
                    type: types.FETCHING_METTING_STATUS_FAIL,
                    error: 'unknown error'
                });
            }
        }
    },
    cancelMeeting: (meetingId: any, notes: string) => {
        return async (dispatch: Dispatch) => {
            try {
                dispatch({ type: types.CANCELLING_MEETING });

                const cancelMeeting = await services.cancelMeeting(meetingId, notes);

                if (cancelMeeting.kind == 'ok') {
                    dispatch({
                        type: types.CANCELLING_MEETING_SUCCESS
                    });
                    showToast('Meeting canceled', null, 1500, 'success');
                }
                else if (cancelMeeting.kind == 'rejected') {
                    dispatch({
                        type: types.CANCELLING_MEETING_FAIL
                    });
                }
            }
            catch (error) {
                showToast(error.message, null, 1500, 'danger');
            }
        }
    },
    resetMeetingState: () => {
        return (dispatch: Dispatch) => {
            dispatch({ type: types.RESET_METTING_STATE });
        }
    }
};

/**
 * reducer
 */
const initialState: Mettings = {
    loading: false,
    error: undefined,
    success: false,
    mettings: [],
    selectedMettingId: null,
    mettingDetails: {},
    mettingStatuses: [],

    creatingMetting: false,
    creatingMettingSuccess: false,
    creatingMettingError: undefined,

    cancelingMetting: false,
    cancelingMettingSuccess: false,
    cancelingMettingError: undefined
}
export const reducer = (state: Mettings = initialState, action: Action) => {

    switch (action.type) {

        /**
         * fetch mettings
         */
        case types.FETCHING_METTINGS:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.FETCHING_METTINGS_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.FETCHING_METTINGS_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true, mettings: action.payload
            });

        /**
         * update selected metting id
         */
        case types.UPDATE_SELECTED_METTING_ID:
            return Object.assign({}, state, {
                selectedMettingId: action.payload
            });

        /**
         * get metting by id
         */
        case types.FETCHING_METTINGS_DETAILS:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.FETCHING_METTINGS_DETAILS_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.FETCHING_METTINGS_DETAILS_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true,
                mettingDetails: action.payload
            });

        /**
         * fetch mettings statusws
         */
        case types.FETCHING_METTING_STATUS:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.FETCHING_METTING_STATUS_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.FETCHING_METTING_STATUS_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true, mettingStatuses: action.payload
            });

        /**
         * create metting cases
         */
        case types.CREATING_NEW_METTING:
            return Object.assign({}, state, {
                creatingMetting: true, creatingMettingError: undefined,
                creatingMettingSuccess: false
            });

        case types.CREATING_NEW_METTING_FAIL:
            return Object.assign({}, state, {
                creatingMetting: false, creatingMettingError: action.error,
                creatingMettingSuccess: false
            });

        case types.CREATING_NEW_METTING_SUCCESS:
            return Object.assign({}, state, {
                creatingMetting: false, creatingMettingError: undefined,
                creatingMettingSuccess: true
            });

        /**
         * canceling metting cases
         */
        case types.CANCELLING_MEETING:
            return Object.assign({}, state, {
                cancelingMetting: true, cancelingMettingError: undefined,
                cancelingMettingSuccess: false
            });

        case types.CANCELLING_MEETING_FAIL:
            return Object.assign({}, state, {
                cancelingMetting: false, cancelingMettingError: action.error,
                cancelingMettingSuccess: false
            });

        case types.CANCELLING_MEETING_SUCCESS:
            return Object.assign({}, state, {
                cancelingMetting: false, cancelingMettingError: undefined,
                cancelingMettingSuccess: true
            });

        /**
         * reset metting status
         * in first place (cancelling metting)
         */
        case types.RESET_METTING_STATE:
            return Object.assign({}, state, {
                cancelingMetting: false, cancelingMettingError: undefined,
                cancelingMettingSuccess: false, creatingMetting: false,
                creatingMettingSuccess: false, creatingMettingError: undefined,
            });

        /**
         * deafult 
         */
        default: return state;
    }
}