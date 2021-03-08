import { Action, MettingFilters, Dispatch } from "./redux.types";
import { types } from "./reduxActionTypes";

/**
 * interfaces and types
 */
export type MettingFiltersType = 'START_TIME' | 'END_TIME' |
    'SELECTED_DATE' | 'SELECTED_USERS' | 'SELECTED_STATUSES'
    | 'USERS' | 'STATUSES';

/**
 * actions
 */
export const actions = {
    updateMettingFiltersProps: (mettingFilterType: MettingFiltersType, payload: any) => {

        let actionType: any;

        switch (mettingFilterType) {

            case 'START_TIME':
                actionType = types.UPDATE_START_DATE_FILTER;
                break;

            case 'END_TIME':
                actionType = types.UPDATE_END_DATE_FILTER;
                break;

            case 'SELECTED_DATE':
                actionType = types.UPDATE_SELECTED_DATE_FILTER;
                break;

            case 'SELECTED_USERS':
                actionType = types.UPDATE_SELECTED_USERS_FILTER;
                break;

            case 'SELECTED_STATUSES':
                actionType = types.UPDATE_SELECTED_STATUSES_FILTER;
                break;

            case 'USERS':
                actionType = types.UPDATE_USERS_FOR_FILTER;
                break;

            case 'STATUSES':
                actionType = types.UPDATE_STATUSES_FOR_FILTER;
                break;

        }

        return (dispatch: Dispatch) => {
            dispatch({ type: actionType, payload });
        }
    },
    clearFilters: () => {
        return (dispatch: Dispatch) => {
            dispatch({ type: types.CLEAR_FILTERS });
        }
    }
};

/**
 * reducer
 */
const initialState: MettingFilters = {
    startTime: 0,
    endTime: 0,
    selectedDate: new Date(),
    selectedUsers: [],
    selectedStatuses: [],
    users: null,
    statuses: null,
};

export const reducer = (state = initialState, action: Action) => {

    switch (action.type) {

        /**
         * update filter props cases
         */
        case types.UPDATE_START_DATE_FILTER:
            return Object.assign({}, state, {
                startTime: action.payload
            });

        case types.UPDATE_END_DATE_FILTER:
            return Object.assign({}, state, {
                endTime: action.payload
            });

        case types.UPDATE_SELECTED_DATE_FILTER:
            return Object.assign({}, state, {
                selectedDate: action.payload
            });

        case types.UPDATE_SELECTED_USERS_FILTER:
            return Object.assign({}, state, {
                selectedUsers: action.payload
            });

        case types.UPDATE_SELECTED_STATUSES_FILTER:
            return Object.assign({}, state, {
                selectedStatuses: action.payload
            });

        case types.UPDATE_USERS_FOR_FILTER:
            return Object.assign({}, state, {
                users: action.payload
            });

        case types.UPDATE_STATUSES_FOR_FILTER:
            return Object.assign({}, state, {
                statuses: action.payload
            });

        /**
         * clear filters
         */
        case types.CLEAR_FILTERS:
            return Object.assign({}, state, {
                startTime: 0,
                endTime: 0,
                selectedDate: new Date(),
                selectedUsers: [],
                selectedStatuses: []
            });


        default: return state;
    }
}