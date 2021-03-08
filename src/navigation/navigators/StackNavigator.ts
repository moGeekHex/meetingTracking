import { createStackNavigator, StackNavigatorConfig } from 'react-navigation';
import { fromLeft } from 'react-navigation-transitions';

//import routes
import { Mettings } from '../../screens/Mettings';
import { navigationRouteNames } from '../NavigationConstants';
import { MapScreen } from '../../screens/Map';
import { MettingDetails } from '../../screens/MettingDetails';
import { ConfirmationTrip } from '../../screens/ConfirmationTrip';
import { MenuScreen } from '../../screens/Menu';
import { NewMetting } from '../../screens/NewMetting';
import { FilterModal } from '../../screens/Mettings/Filters';
import { UnitsAvailabilityScreen } from '../../screens/UnitsAvailability';

/**
 * A common stack nmavigator config
 */
const commonStackNavigatorConfig: StackNavigatorConfig = {
    headerMode: 'none'
};

/**
 * A metting stack navigator 
 */
export const MettingStack = createStackNavigator({
    [navigationRouteNames.mettings]: Mettings,
    [navigationRouteNames.filtersModal]: FilterModal,
    [navigationRouteNames.MettingDetails]: MettingDetails,
    [navigationRouteNames.map]: MapScreen,
    [navigationRouteNames.ConfirmationTrip]: ConfirmationTrip
}, {
        transitionConfig: () => fromLeft(1000),
        ...commonStackNavigatorConfig
    });

/**
 * A menu stack navigator
 */
export const MenuStack = createStackNavigator({
    [navigationRouteNames.menu]: MenuScreen,
    [navigationRouteNames.newMetting]: NewMetting,
    [navigationRouteNames.unitsAvailability]: UnitsAvailabilityScreen,
}, {
        transitionConfig: () => fromLeft(1000),
        ...commonStackNavigatorConfig
    });