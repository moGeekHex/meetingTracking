import React from 'react';
import { View, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Spinner } from 'native-base';
import { colors } from '../../theme';
import { getData } from '../../utils/asyncStorage';
import { NavigationRouteNames } from '../../navigation';

/**
 * interfaces and types
 */
interface SplashScreenProps extends NavigationScreenProps<{}> {

}

/**
 * A stateful component that 
 * detects auth flow
 */
export class SplashScreen extends React.Component<SplashScreenProps>
{
    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <ImageBackground
                    resizeMode='stretch'
                    style={styles.imageBackgroundStyle}
                    source={require('../../images/background-image.jpg')}
                >
                    <Spinner
                        size='large'
                        color={colors.orange}
                    />
                </ImageBackground>
            </View>
        );
    }

    /**
     * life cycle
     */
    async componentDidMount() {
        await this._isUserLoggedIn();
    }

    /**
     * locale functions 
     */
    _isUserLoggedIn = async () => {
        try {
            let navigationRoute: NavigationRouteNames;
            const userDataFromStorage = await getData('UserData');
           
            if (userDataFromStorage) {
                navigationRoute = 'app';
            }
            else {
                navigationRoute = 'auth';
            }
            this.props.navigation.navigate(navigationRoute)
        }
        catch (error) {
            console.log('error when get daat from storage')
        }
    }

}

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1 },
    imageBackgroundStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});