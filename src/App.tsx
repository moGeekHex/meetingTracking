import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MainNavigator } from './navigation';
import { colors } from './theme';
import { navigationService } from './navigation/NavigatorService';

/**
 * The main app
 */
export class MainApp extends React.Component {

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                <MainNavigator
                    ref={navigatorRef => {
                        navigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </View>
        );
    }
}

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.light }
})