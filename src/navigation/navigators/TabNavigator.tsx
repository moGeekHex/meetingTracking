import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from "react-navigation";
import { MettingStack, MenuStack } from './StackNavigator';
import { CustomTabBar } from '../CustomBottomBar';
import { navigationRouteNames } from '../NavigationConstants';
import { TeamLocations } from '../../screens/TeamLocations';
import { UnitsAvailabilityScreen } from '../../screens/UnitsAvailability';

/**
 * interfaces and types
 */
export type TabNavigatorRouteNames = keyof typeof routes;

/**
 * The main tab navigator
 */
const routes = {
    [navigationRouteNames.tabNavigators.menuTab]: {
        screen: MenuStack,
        navigationOptions: {
            tabBarIcon: ({ focused }: { focused: boolean }) => {
                const menuIcon = require('../../images/menu.png');
                const orangeMenuIcon = require('../../images/orange-menu.png');
                const imgSrc = focused ? orangeMenuIcon : menuIcon;

                return (
                    <Image
                        resizeMode='contain'
                        style={styles.image}
                        source={imgSrc}
                    />
                )
            }
        }
    },
    // [navigationRouteNames.tabNavigators.unitsAvailabilityTab]: {
    //     screen: UnitsAvailabilityScreen,
    //     navigationOptions: {
    //         tabBarIcon: ({ focused }: { focused: boolean }) => {
    //             const menuIcon = require('../../images/home.png');
    //             const orangeMenuIcon = require('../../images/orange-home.png');
    //             const imgSrc = focused ? orangeMenuIcon : menuIcon;

    //             return (
    //                 <Image
    //                     resizeMode='contain'
    //                     style={styles.image}
    //                     source={imgSrc}
    //                 />
    //             )
    //         }
    //     }
    // },
    [navigationRouteNames.tabNavigators.mettingsTab]: {
        screen: MettingStack,
        navigationOptions: {
            tabBarIcon: ({ focused }: { focused: boolean }) => {
                const menuIcon = require('../../images/calendar.png');
                const orangeMenuIcon = require('../../images/orange-calendar.png');
                const imgSrc = focused ? orangeMenuIcon : menuIcon;

                return (
                    <Image
                        resizeMode='contain'
                        style={styles.image}
                        source={imgSrc}
                    />
                )
            }
        }
    },
    [navigationRouteNames.tabNavigators.locationsTab]: {
        screen: TeamLocations,
        navigationOptions: {
            tabBarIcon: ({ focused }: { focused: boolean }) => {
                const menuIcon = require('../../images/team-locations.png');
                const orangeMenuIcon = require('../../images/orange-team-locations.png');
                const imgSrc = focused ? orangeMenuIcon : menuIcon;

                return (
                    <Image
                        resizeMode='contain'
                        style={styles.image}
                        source={imgSrc}
                    />
                )
            }
        },

    }
};
export const TabNavigator = createBottomTabNavigator({
    ...routes
}, {
        initialRouteName: navigationRouteNames.tabNavigators.menuTab,
        tabBarComponent: props => {
            return (<CustomTabBar
                enabledRoutes={[
                    navigationRouteNames.tabNavigators.menuTab,
                    navigationRouteNames.tabNavigators.unitsAvailabilityTab,
                    navigationRouteNames.tabNavigators.mettingsTab,
                    navigationRouteNames.tabNavigators.locationsTab
                ]}
                {...props}
            />);
        }
    });

/**
 * contants
 */
const IMAGE_SIZE = 50;

/**
 * styles
 */
const styles = StyleSheet.create({
    image: { height: IMAGE_SIZE, width: IMAGE_SIZE }
});

