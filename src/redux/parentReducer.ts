import { combineReducers } from 'redux';

//import all reducers
import { reducer as Location } from './locationRedux';
import { reducer as Auth } from './authRedux';
import { reducer as Metting } from './mettingRedux';
import { reducer as Trip } from './tripRedux';
import { reducer as TeamLocation } from './teamLocationsRedux';
import { reducer as Customer } from './customerRedux';
import { reducer as MettingsFilters } from './mettingFiltersRedux';

/**
 * combine all reduxers
 */
export default combineReducers({
    Location,
    Auth,
    Metting,
    Trip,
    TeamLocation,
    Customer,
    MettingsFilters
});