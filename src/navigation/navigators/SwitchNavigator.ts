import { createSwitchNavigator, createAppContainer } from 'react-navigation';

//import routes
import { Login } from '../../screens/Login/Login';
import { TabNavigator } from './TabNavigator';
import { navigationRouteNames } from '../NavigationConstants';
import { SplashScreen } from '../../screens/Splash';

/**
 * A switch navigator is a
 * stack navigator but user for navigation flow
 * because it is not supoort back to previous screen
 * so it is very helpful to navigation flow
 */
const SwitchNavigator = createSwitchNavigator({
    [navigationRouteNames.app]: TabNavigator,
    [navigationRouteNames.auth]: Login,
    [navigationRouteNames.loading]: SplashScreen
}, { initialRouteName: navigationRouteNames.loading });

export const MainNavigator = createAppContainer(SwitchNavigator);