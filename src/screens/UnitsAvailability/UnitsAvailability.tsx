import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { WebView } from 'react-native-webview';
import { Loading } from '../../common/Loading';
import { NavigationEvents, NavigationScreenProps } from 'react-navigation';
import { Header } from '../../common/Header';

/**
 * interfaces and types
 */
interface UnitsAvailabilityScreenProps extends NavigationScreenProps<{}> {

}

/**
 * A stateful component thar retuens units availability screen
 */
export class UnitsAvailabilityScreen extends React.Component<UnitsAvailabilityScreenProps>
{

    /**
     * locale variables
     */
    _webViewRef: any;

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                <WebView
                    ref={c => this._webViewRef = c}
                    startInLoadingState={true}
                    renderLoading={() => this._renderLoading()}
                    source={{ uri: 'http://units.tigergroup-company.com:4096/' }}
                />
                {this._renderNavigationEvent()}
            </View>
        );
    }

    /**
     * locale component functions
     */
    _renderHeader = () => {
        return (
            <Header
                title='Tiger'
                onBack={() => this.props.navigation.goBack()}
            />
        );
    }

    _renderNavigationEvent = () => {
        return (
            <NavigationEvents
                onDidFocus={(payload: any) => this._webViewRef.reload()}
            />
        )
    }

    _renderLoading = () => {
        return (
            <Loading
            />
        );
    }
}

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.light },
    title: { fontSize: 40, textAlign: 'center' }
});