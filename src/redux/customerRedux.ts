import { Action, Dispatch, Customer } from "./redux.types";
import { services } from "../services/services";
import { types } from "./reduxActionTypes";

/**
 * actions
 */
export const actions = {
    getCustomers: () => {
        return async (dispatch: Dispatch) => {
            try {
                const customers = await services.getCustomers();

                if (customers.kind == 'ok') {
                    dispatch({
                        type: types.FETCHING_CUSTOMERS_SUCCESS,
                        payload: customers.customers
                    });
                }
                else if (customers.kind == 'rejected') {
                    dispatch({
                        type: types.FETCHING_CUSTOMERS_FAIL,
                        error: customers.message
                    });
                }
                else {
                    dispatch({
                        type: types.FETCHING_CUSTOMERS_FAIL,
                        error: 'unknown errror'
                    });
                }
            }
            catch (error) {
                console.log('errro in getCustomers redux', error);
                dispatch({
                    type: types.FETCHING_CUSTOMERS_FAIL,
                    error: error.message
                });
            }
        }
    }
};

/**
 * reducer
 */
const initialState: Customer = {
    loading: false,
    success: false,
    error: undefined,
    customers: []
}
export const reducer = (state: Customer = initialState, action: Action) => {

    switch (action.type) {

        case types.FETCHING_CUSTOMERS:
            return Object.assign({}, state, {
                loading: true, error: undefined,
                success: false
            });

        case types.FETCHING_CUSTOMERS_FAIL:
            return Object.assign({}, state, {
                loading: false, error: action.error,
                success: false,
            });

        case types.FETCHING_CUSTOMERS_SUCCESS:
            return Object.assign({}, state, {
                loading: false, error: undefined,
                success: true, customers: action.payload
            });

        default: return state;
    }
}