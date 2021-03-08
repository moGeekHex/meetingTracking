import React from 'react';
import {
    View, StyleSheet, Dimensions, Image, Alert,
    StatusBar,
    ImageBackground, KeyboardAvoidingView
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { colors } from '../../theme';
import { Text } from '../../common/Text';
import { TEXTFIELD_HEIGHT } from '../../common/TextField';
import { Button } from 'native-base';
import { navigationRouteNames } from '../../navigation';
import { validateInputs, showToast } from '../../utils/general/general';
import { Auth } from '../../redux/redux.types';
import { connect } from 'react-redux';
import { Loading } from '../../common/Loading';
import { actions as authActions } from '../../redux/authRedux';
import { TextInput } from '../../common/TextInputIcon';

/**
 * interfaces and types
 */
type LoginScreenValidateResponseType = {
    emailId: Array<any>,
    password: Array<any>,
};
interface LoginScreenProps extends NavigationScreenProps<{}>, Auth {
    login: (username: string, password: string) => void
}
interface LoginScreenState {
    username: string,
    password: string
}

/**
 * A screen name
 */
class LoginScreen extends React.Component<LoginScreenProps, LoginScreenState>
{
    /**
     * locale state
     */
    state = {
        username: 'ahmad',
        password: 'ahmad1234'
    };

    /**
     * locale variables
     */
    _passwordRef: any

    /**
     * render _renderLogofunction
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
                    {this._renderOverflowView()}
                </ImageBackground>

                {this._renderLoading()}
            </View>
        );
    }

    /**
     * life cycle
     */
    UNSAFE_componentWillReceiveProps(nextProps: LoginScreenProps) {

        //grap data
        const { success, error } = nextProps;

        if (success && !error) {
            this.props.navigation.navigate(navigationRouteNames.app);
        }
        else if (error && !success) {
            showToast(error, null, 1500, 'danger');
        }
    }

    /**
     * locale component functions
     */
    _renderLoading = () => {
        return (
            this.props.loading &&
            <Loading overlay={true} transparent />
        );
    }

    _renderLogo = () => {
        return (
            <Image
                source={require('../../images/logo.png')}
                style={styles.logoStyle}
                resizeMode='contain'
            />
        );
    }

    _renderTitleView = () => {
        return (
            <View style={styles.titleViewContainer}>
                {this._renderLogo()}
                <Text style={styles.titleStyle}>{'Tiger Meetings'}</Text>
            </View>
        );
    }

    _renderInputs = () => {
        return (
            <View style={styles.inputsContainer}>

                <TextInput
                    returnKeyType='next'
                    onChangeText={(username) => this.setState({ username })}
                    iconName='md-person'
                    iconColor={'light'}
                    iconType='ionicon'
                    placeholder='Username'
                    keyboardType='email-address'
                    placeholderTextColor='light'
                    textStyle={styles.inputStyle}
                    onSubmitEditing={() => this._passwordRef._root.focus()}
                    value={this.state.username}
                />

                <TextInput
                    returnKeyType='done'
                    inputRef={(input: any) => { this._passwordRef = input; }}
                    onChangeText={(password) => this.setState({ password })}
                    iconName='md-lock'
                    iconColor={'light'}
                    iconType='ionicon'
                    secureTextEntry
                    placeholder='Password'
                    placeholderTextColor='light'
                    textStyle={styles.inputStyle}
                    value={this.state.password}
                />
            </View>
        );
    }

    _renderBtn = () => {
        return (
            <Button
                rounded
                onPress={this._handleLoginPress}
                style={styles.buttonStyle}
            >
                <Text style={styles.btnText}>
                    {'Login'}
                </Text>
            </Button>
        );
    }

    _renderOverflowView = () => {
        return (
            <KeyboardAvoidingView
                behavior='padding'
                style={styles.overFlowParentContainer}>
                <View style={styles.overflowContainer}>
                    {this._renderTitleView()}
                    {this._renderInputs()}
                    {this._renderBtn()}
                </View>
            </KeyboardAvoidingView>
        );
    }

    /**
     * locale functions
     */
    _throwNewError = (error: string) => {
        throw new Error(error);
    }

    _validateInputs = () => {
        //form data
        const data = {
            emailId: this.state.username,
            password: this.state.password
        };

        //validation constraints
        const constraints = {
            emailId: {
                presence: true
            },
            password: {
                presence: true,
                length: {
                    minimum: 6,
                    message: "must be at least 6 characters"
                }
            }
        };

        //validate response
        const validateResponse: LoginScreenValidateResponseType
            = validateInputs(data, constraints);

        /**
         * if validateResponse is undefined that is means no errors
        */
        if (!validateResponse)
            return;

        /**
          * if validateResponse is not undefined, that is mean 
          * has errors
          * first get first key of object
          * then extract error from it
          */
        const firstError = validateResponse[Object.keys(validateResponse)[0]];
        const errorMessage = firstError[0];
        this._throwNewError(errorMessage);
    }

    _handleLoginPress = () => {
        try {
            this._validateInputs();

            //grap data
            const { username, password } = this.state;
            this.props.login(username, password);
        }
        catch (error) {
            Alert.alert(error.message);
        }
    }

}

/**
 * constnats
 */
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const OVERFLOW_VIEW_HEIGHT = windowHeight / 1.75;
const MARGIN_BTN = 16;

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors["limed-spruce"] },
    imageBackgroundStyle: { flex: 1 },
    logoStyle: {
        width: windowWidth / 4,
        height: windowWidth / 4,
        alignSelf: 'center',
    },
    overflowContainer: {
        padding: 8,
        height: OVERFLOW_VIEW_HEIGHT + MARGIN_BTN,
        width: windowWidth * 0.9, borderRadius: 8,
        backgroundColor: colors["cloud-transparent"],
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    titleViewContainer: {
        marginTop: 16, marginBottom: 8,
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 32, fontWeight: 'bold',
        color: colors.light
    },
    inputsContainer: {
        width: windowWidth * 0.75, alignSelf: 'center',
        height: (TEXTFIELD_HEIGHT * 2) + TEXTFIELD_HEIGHT / 2,
        justifyContent: 'space-between'
    },
    buttonStyle: {
        alignSelf: 'center', marginHorizontal: MARGIN_BTN,
        width: windowWidth * 0.5,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: colors["international-orange"]
    },
    btnText: {
        color: colors.light,
        fontSize: 18, width: '100%',
        textAlign: 'center'
    },
    overFlowParentContainer: {
        flex: 3, justifyContent: 'center'
    },
    inputStyle: {
        color: colors.light,
        fontSize: 14
    }
});

/**
 * redux config
 */
const mapStateToProps = ({ Auth }: { Auth: Auth }) => {
    return {
        success: Auth.success,
        error: Auth.error,
        loading: Auth.loading
    };
}
const containerActions = {
    login: authActions.login
};
export const Login = connect(mapStateToProps, containerActions)(LoginScreen);