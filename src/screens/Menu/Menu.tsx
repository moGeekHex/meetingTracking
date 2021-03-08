import React from 'react';
import { StyleSheet, Dimensions, Image, View, ImageRequireSource, Platform } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { colors } from '../../theme';
import { Content } from 'native-base';
import { CustomButton, IconType } from '../../common/CustomButton';
import { navigationRouteNames } from '../../navigation';
import { Header } from '../../common/Header';
import { clearAllData } from '../../utils/asyncStorage';
import BackgroundGeolocationAndroid from '@mauron85/react-native-background-geolocation';
import BackgroundGeolocationIOS from "react-native-background-geolocation";
import { BGTrackngAndroid } from '../../components/BGTrackngAndroid';
import { BGTrackingIos } from '../../components/BGtrackingIos';

/**
 * interfaces and types
 */
interface MenuScreenProps extends NavigationScreenProps {

}

/**
 * A stateful menu screen 
 */
export class MenuScreen extends React.Component<MenuScreenProps> {

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.parentContainer}>
                {this._renderHeader()}
                {this._renderListOfBtns()}

                {this._renderUserTracking()}
            </View>
        );
    }

    /**
     * locale component functions
     */
    _renderUserTracking = () => {
        if (Platform.OS == 'android')
            return <BGTrackngAndroid />;
        else
            return <BGTrackingIos />;
    }

    _renderListOfBtns = () => {

        //constants
        const calendarIcon = require('../../images/orange-calendar.png');
        const teamLocationsIcon =
            require('../../images/orange-team-locations.png');

        return (
            <View style={styles.listOfBtnsContainer}>
                <View style={styles.internalListOfBtns}>
                    <Content style={styles.contentStyle}>
                        {/* {this._renderCustomBtn('entypo', 'home',
                            'Units Availability', this._handleUnitsAvailabilityPress,
                            false)} */}

                        {this._renderCustomBtn('font-awesome', 'calendar',
                            'Meetings', this._handleMettingsPress, false)}

                        {this._renderCustomBtn('font-awesome', 'calendar-plus-o',
                            'New Meeting', this._handleNewMettingPress,
                            false)}

                        {this._renderCustomBtn('ionicon', 'md-pin',
                            'Team Locations', this._handleTeamLocationPress,
                            false)}

                        {this._renderCustomBtn('font-awesome', 'sign-out',
                            'Logout', this._handleLogoutPress,
                            false)}
                    </Content>
                </View>
            </View>
        );
    }

    _renderHeader = () => {
        return (
            <Header
                left={this._renderLogo()}
                title='Main Menu'
            />
        );
    }

    _renderLogo = () => {
        return (
            <Image
                source={require('../../images/logo.png')}
                resizeMode='contain'
                style={styles.logoImg}
            />
        );
    }

    _renderCustomBtn = (iconType: IconType, iconName: string,
        title: string, onPress: () => void, disabled: boolean,
        image?: ImageRequireSource) => {

        return (
            <CustomButton
                image={image}
                imageSize={32}
                style={styles.customBtnStyle}
                iconType={iconType}
                iconColor={'international-orange'}
                iconName={iconName}
                title={title}
                disabled={disabled}
                onPress={onPress}
            />
        );
    }

    /**
     * locale functions
     */
    _stopBackgroundService = () => {
        if (Platform.OS == 'android') {
            BackgroundGeolocationAndroid.stop();
        }
        else {
            BackgroundGeolocationIOS.stop();
        }
    }

    _handleLogoutPress = () => {
        try {

            this._stopBackgroundService();

            clearAllData().then(_ => {
                this.props.navigation.navigate(navigationRouteNames.auth);
            }).catch(error => {
                console.log('error whn try to clear data storage', error)
            })
        }
        catch (error) {
            console.log('error is', error);
        }
    }

    _handleMettingsPress = () => {
        this.props.navigation.navigate(navigationRouteNames.tabNavigators.mettingsTab);
    }

    _handleNewMettingPress = () => {
        this.props.navigation.navigate(navigationRouteNames.newMetting);
    }

    _handleUnitsAvailabilityPress = () => {
        this.props.navigation.navigate(navigationRouteNames.tabNavigators.unitsAvailabilityTab);
    }

    _handleTeamLocationPress = () => {
        this.props.navigation.navigate(navigationRouteNames.tabNavigators.locationsTab);
    }

}

/**
 * constnats
 */
const { height: windowHeight } = Dimensions.get('window');
const LIST_OF_BTNS_VIEW_HEIGHT = windowHeight * 0.85;

/**
 * styles
 */
const styles = StyleSheet.create({
    parentContainer: {
        flex: 1, backgroundColor: colors["titan-white"]
    },
    listOfBtnsContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    customBtnStyle: {
        marginTop: 16, backgroundColor: colors.light,
        alignSelf: 'center'
    },
    internalListOfBtns: {
        height: LIST_OF_BTNS_VIEW_HEIGHT * 0.75,
        width: '100%'
    },
    logoImg: {
        height: 50, width: 50
    },
    contentStyle: {
        paddingVertical: 8
    }
});
