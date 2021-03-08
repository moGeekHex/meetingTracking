import { Action, Dispatch, Trip } from "./redux.types";
import { services } from "../services/services";
import { types } from "./reduxActionTypes";
import { getData, storeData, clearAllData } from "../utils/asyncStorage";
import { deleteFromRealm } from "../realm/helpers";

/**
 * actions
 */
export const actions = {
    confirmMeeting: (mettingId: number, verificationCode: string,
        departureDateTime: string, arrivalDateTime: string,
        locations: string, notes: string) => {
        return async (dispatch: Dispatch) => {

            dispatch({ type: types.CONFIRMING_MEETING });

            const confirmTripResponse = await services.confirmMeeting(mettingId, verificationCode, departureDateTime,
                arrivalDateTime, locations, notes);

            if (confirmTripResponse.kind == 'ok') {
                //should delete location and metting time schema from realm
                await deleteFromRealm('Location');
                await deleteFromRealm('MettingTime');

                dispatch({
                    type: types.CONFIRMING_MEETING_SUCCESS
                });
            }
            else {
                dispatch({
                    type: types.CONFIRMING_MEETING_FAIL,
                    error: 'confirm metting error'
                });
            }
        }
    },
    requestMettingVerificationCodeCode: (mettingId: string) => {
        return async (dispatch: Dispatch) => {
            dispatch({ type: types.FETCHING_METTING_VERIFICATION_CODE });

            const result = await services.requestMettingVerificationCodeCode(mettingId);

            if (result.kind == 'ok') {
                dispatch({
                    type: types.FETCHING_METTING_VERIFICATION_CODE_SUCCESS,
                    payload: result.VerificationCodeData
                });
            }
            else {
                dispatch({
                    type: types.FETCHING_METTING_VERIFICATION_CODE_FAIL,
                    error: result.message
                });
            }
        }
    },
    updateIsReuestVerificationCodeEnabled: (newValue: 'ON' | 'OFF', time: any) => {
        return async (dispatch: Dispatch) => {

            if (time > 0)
                await storeData('RequestVerificationCode', time);
            else {

                //should delete data from storage
                await clearAllData('RequestVerificationCode');
            }

            dispatch({
                type: types.TOGGLE_REQUEST_VERIFICATION_CODE_TIMER,
                payload: {
                    isRequestVerificationCodeEnabled: newValue,
                    requestVerificationCodeTime: time
                }
            });
        }
    },
    getIsReuestVerificationCodeEnabled: () => {
        return async (dispatch: Dispatch) => {
            const requestVerificationCodeTimeFromStorage = await getData('RequestVerificationCode');

            dispatch({
                type: types.TOGGLE_REQUEST_VERIFICATION_CODE_TIMER,
                payload: {
                    isRequestVerificationCodeEnabled: requestVerificationCodeTimeFromStorage > 0 ? 'ON' : 'OFF',
                    requestVerificationCodeTime: requestVerificationCodeTimeFromStorage
                }
            });
        }
    }
};

/**
 * reducer
 */
const initialState: Trip = {
    loading: false,
    error: undefined,
    success: false,
    verificationCodeData: {},
    verificationCodeRequest: {
        isRequestVerificationCodeEnabled: 'OFF',
        requestVerificationCodeTime: 0
    },
    isMettingConfirmed: false,
    confirmingMetting: false,
    confirmMettingError: undefined
}
export const reducer = (state: Trip = initialState, action: Action) => {

    switch (action.type) {

        /**
         * verification code cases
         */
        case types.FETCHING_METTING_VERIFICATION_CODE:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.FETCHING_METTING_VERIFICATION_CODE_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false
            });

        case types.FETCHING_METTING_VERIFICATION_CODE_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true, verificationCodeData: action.payload
            });

        /**
         * posting trip cases
         */
        case types.POSTING_TRIP:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.POSTING_TRIP_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.POSTING_TRIP_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true
            });

        /**
         * request verification code cases
         */
        case types.TOGGLE_REQUEST_VERIFICATION_CODE_TIMER:
            return Object.assign({}, state, {
                verificationCodeRequest: action.payload
            });

        /**
         * confirm metting cases
         */
        case types.CONFIRMING_MEETING:
            return Object.assign({}, state, {
                isMettingConfirmed: false, confirmingMetting: true,
                confirmMettingError: undefined,

                //reset verification code state also
                loading: false, error: undefined, success: false,
            });

        case types.CONFIRMING_MEETING_FAIL:
            return Object.assign({}, state, {
                isMettingConfirmed: false, confirmingMetting: false,
                confirmMettingError: action.error
            });

        case types.CONFIRMING_MEETING_SUCCESS:
            return Object.assign({}, state, {
                isMettingConfirmed: true, confirmingMetting: false,
                confirmMettingError: undefined
            });

        /**
         * default cases
         */
        default: return state;
    }
}