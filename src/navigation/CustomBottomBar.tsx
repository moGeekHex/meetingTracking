import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomTabBar, BottomTabBarProps } from 'react-navigation';
import { TabNavigatorRouteNames } from './navigators/TabNavigator';
import { colors } from '../theme';

/**
 * interfaces and types
 */
interface CustomTabBarProps extends BottomTabBarProps {
    enabledRoutes: Array<TabNavigatorRouteNames>
}

/**
 * A custom design of bottom tab bar
 */
export class CustomTabBar extends React.Component<CustomTabBarProps> {

    /**
     * render function
     */
    render() {
        return (
            <BottomTabBar
                style={styles.bottomBarStyle}
                showLabel={false}
                {...this.props} />
        );
    }
}

/**
 * styles
 */
const styles = StyleSheet.create({
    bottomBarStyle: {
        elevation: 0, borderTopWidth: 0,
        backgroundColor: colors['mid-gray']
    }
});