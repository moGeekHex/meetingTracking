import React from 'react';
import { View, StyleSheet, Dimensions, TextInput, ScrollView, ViewStyle, Alert } from 'react-native';
import { TextField } from '../../common/TextField';
import { NavigationScreenProps } from 'react-navigation';
import { colors } from '../../theme';
import { Header } from '../../common/Header';
import { Button } from 'native-base';
import { Text } from '../../common/Text';
import { connect } from 'react-redux';
import { actions as tripActions } from '../../redux/tripRedux';
import { Trip, Mettings } from '../../redux/redux.types';
import { Loading } from '../../common/Loading';
import { showToast } from '../../utils/general/general';
import { Icon } from 'react-native-elements';
import isEmpty from 'lodash/isEmpty';
import { VerificationCodeRequestTimer } from '../../components/VerificationCodeRequestTimer';
import { queryAllObjects } from '../../realm/helpers';
import moment from 'moment';
import { MettingTime, Location } from '../../realm/schemas/schema.types';

/**
 * interfaces anf types
 */
interface ConfirmationTripScreenProps extends NavigationScreenProps<{}>, Trip {
    requestMettingVerificationCodeCode: (mettingId: string) => void;
    confirmMeeting: (mettingId: number, verificationCode: string,
        departureDateTime: string, arrivalDateTime: string,
        locations: string, notes: string) => void;
    selectedMettingId: string;
    updateIsReuestVerificationCodeEnabled: (value: 'ON' | 'OFF', time: number) => void;
}
interface ConfirmationTripScreenState {
    notes: string
}

/**
 * The verfification screen
 */
class ConfirmationTripScreen extends React.Component
    <ConfirmationTripScreenProps, ConfirmationTripScreenState>
{

    /**
     * locale state
     */
    state = {
        notes: ''
    };

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}

                <ScrollView style={styles.scrollView}>
                    {this._renderRequestMettingVerificationCode()}
                    {this._renderVerificationCodeInput()}
                    {this._renderNotesTextArea()}
                    {this._renderConfirmMettingTrip()}
                </ScrollView>

                {this._renderLoading()}
            </View>
        );
    }

    /**
     * life cycle
     */
    UNSAFE_componentWillReceiveProps(nextProps: ConfirmationTripScreenProps) {

        /**
         * should delete locations and metting time data from realm if confirm success
         */

        //grap data
        const { success, error, verificationCodeData, isMettingConfirmed,
            confirmMettingError } = nextProps;

        if (success && !error) {
            Alert.alert(verificationCodeData.message);
        }
        else if (error && !success) {
            showToast(error, null, 1500, 'danger');
        }

        if (isMettingConfirmed && !confirmMettingError) {
            showToast('Metting confirmed', null, 1500, 'success');
            this.props.navigation.popToTop();
        }
        else if (confirmMettingError && !isMettingConfirmed) {
            showToast(confirmMettingError, null, 1500, 'success');
        }
    }

    /**
     * locale component functions
     */
    _renderConfirmMettingTrip = () => {

        //constants
        const { verificationCodeData } = this.props;
        const { notes } = this.state;
        const isButtonEnabled = !isEmpty(verificationCodeData) && notes.length > 0;
        const setBackgroundColor: ViewStyle = {
            backgroundColor: isButtonEnabled ?
                colors.orange : colors.disabled
        };

        return (
            <Button
                disabled={!isButtonEnabled}
                style={[styles.confirmBtnStyle, { ...setBackgroundColor }]}
                onPress={() => {
                    Alert.alert(
                        '', 'Are you sure?',
                        [
                            {
                                text: 'no',
                                style: 'cancel',
                            },
                            { text: 'yes', onPress: this._handleConfirmTrip },
                        ],
                        { cancelable: false },
                    );
                }}
            >
                <View style={styles.internalConfirmBtnView}>
                    <Icon
                        type='antdesign'
                        name='checkcircle'
                        color={colors.light}
                        size={20}
                    />
                    <Text style={styles.btnTxt}>
                        {'Confirm Meeting Trip'}
                    </Text>
                </View>
            </Button>
        );
    }

    _renderRequestMettingVerificationCode = () => {

        //constants
        const { isRequestVerificationCodeEnabled } = this.props.verificationCodeRequest;

        return (
            <Button
                disabled={isRequestVerificationCodeEnabled == 'ON'}
                style={[styles.btnStyle,
                { backgroundColor: isRequestVerificationCodeEnabled == 'ON' ? colors.disabled : colors.orange }]}
                onPress={this._handleRequesMettingVerificationCode}
            >
                {isRequestVerificationCodeEnabled == 'ON' ?
                    this._renderVerificationCodeTimer()
                    :
                    <Text style={styles.btnTxt}>
                        {'Send Verification SMS'}
                    </Text>}
            </Button>
        );
    }

    _renderVerificationCodeTimer = () => {
        return (<VerificationCodeRequestTimer
            endTime={'00:02:00'}
            onEndTimeArrived={this._handleEndTimeArrived}
            startTime={this.props.verificationCodeRequest.requestVerificationCodeTime}
        />);
    }

    _renderLoading = () => {

        //constants
        const { confirmingMetting, loading } = this.props;

        return ((loading || confirmingMetting) ? <Loading overlay /> : null);
    }

    _renderHeader = () => {
        return (
            <Header
                title='Trip Confirmation'
                onBack={() => this.props.navigation.goBack()}
            />
        );
    }

    _renderNotesTextArea = () => {

        //constnats
        const textAreaStyle = [styles.notesContainer, styles.textFieldStyle];

        return (
            <View style={textAreaStyle}>
                <View style={{ height: windowHeight / 3 }}>
                    <TextInput
                        editable={!isEmpty(this.props.verificationCodeData)}
                        returnKeyType="done"
                        style={styles.textInputStyle}
                        placeholder={'Notes'}
                        placeholderTextColor={colors["mid-gray"]}
                        numberOfLines={10}
                        onChangeText={notes => this.setState({ notes })}
                        value={this.state.notes}
                        multiline={true}
                    />
                </View>
            </View>
        );
    }

    _renderVerificationCodeInput = () => {

        //constants
        const verificationCodeStyle = [styles.verificationCodeContainer, styles.textFieldStyle];

        return (
            <View style={verificationCodeStyle}>
                <TextField
                    editable={false}
                    textStyle={styles.textInputTextStyle}
                    placeholder='Verification Code'
                    textFieldContainerStyle={styles.verificationCodeTextInput}
                    value={this.props.verificationCodeData.verificationCode || ''}
                />
            </View>
        );
    }

    /**
     * locale functions
     */
    _handleRequesMettingVerificationCode = () => {
        this.props.updateIsReuestVerificationCodeEnabled('ON', new Date().getTime());

        const { selectedMettingId } = this.props;
        this.props.requestMettingVerificationCodeCode(selectedMettingId);
    }

    _handleEndTimeArrived = () => {
        this.props.updateIsReuestVerificationCodeEnabled('OFF', 0);
    }

    _getLocationsPathFromRealm = async (): Promise<string> => {
        try {
            const locationsFromRealm: any = await queryAllObjects('Location');

            let locations: string = '';
            locationsFromRealm.forEach((userLocation: Location) => {
                const formattedDate = moment(userLocation.time).format('YYYY-MM-DDTHH:mm:ss');
                const arr = [formattedDate, userLocation.location.longitude, userLocation.location.latitude];
                locations += `[${arr}];`;
            });

            return locations;
        }
        catch (error) {
            console.log('error in _getLocationsPathFromRealm', error);
            return '';
        }
    }

    _getMettingStartAndEndTime = async (): Promise<{ departureDateTime: string, arrivalDateTime: string } | {}> => {
        try {
            const mettingTimeFromRealm: MettingTime | any = await queryAllObjects('MettingTime');

            return {
                departureDateTime: moment(mettingTimeFromRealm.departureDateTime).format('YYYY-MM-DDTHH:ss:ss'),
                arrivalDateTime: moment(mettingTimeFromRealm.arrivalDateTime).format('YYYY-MM-DDTHH:mm:ss')
            };

        }
        catch (error) {
            console.log('error in _getMettingStartAndEndTime', error);
            return {};
        }
    }

    _handleConfirmTrip = async () => {

        //get and prepare data
        const { selectedMettingId } = this.props as any;
        const { verificationCode } = this.props.verificationCodeData;
        const { departureDateTime, arrivalDateTime } = await this._getMettingStartAndEndTime() as any;
        const locations: string = await this._getLocationsPathFromRealm();
        const { notes } = this.state;

        this.props.confirmMeeting(selectedMettingId, verificationCode, departureDateTime,
            arrivalDateTime, locations, notes);
    }
}

/**
 * constnats
 */
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const TEXT_AREA_HEIGHT = windowHeight / 3;

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors["titan-white"] },
    verificationCodeContainer: { flex: 1, marginTop: 8, justifyContent: 'flex-end' },
    notesContainer: { flex: 2, justifyContent: 'flex-start', paddingTop: windowHeight * 0.10 },
    textFieldStyle: { width: windowWidth * 0.75, alignSelf: 'center' },
    textInputStyle: {
        textAlign: 'left',
        borderRadius: 16, padding: 10,
        backgroundColor: colors.light,
        textAlignVertical: 'top',

        /**
         * -10 to handle padding between text area and button
         */
        height: TEXT_AREA_HEIGHT - 10,
        fontSize: 16,
        color: colors["mid-gray"]
    },
    verificationCodeTextInput: { borderRadius: 16 },
    btnStyle: {
        alignSelf: 'center', width: '75%', alignItems: 'center',
        justifyContent: 'center'
    },
    btnTxt: { color: colors.light, fontSize: 18, paddingLeft: 8 },
    textInputTextStyle: {
        fontSize: 12, textAlignVertical: 'center',
        marginTop: 4, marginLeft: 4, color: colors.dark
    },
    confirmBtnStyle: {
        alignSelf: 'center', width: '75%',
        alignItems: 'center', justifyContent: 'center'
    },
    internalConfirmBtnView: {
        flexDirection: 'row', alignItems: 'center',
        paddingLeft: 10
    },
    scrollView: {
        marginTop: 10
    }
});

/**
 * redux config
 */
const mapStateToProps = ({ Trip, Metting }: { Trip: Trip, Metting: Mettings }) => {
    return {
        loading: Trip.loading,
        error: Trip.error,
        success: Trip.success,
        selectedMettingId: Metting.selectedMettingId,
        verificationCodeData: Trip.verificationCodeData,
        verificationCodeRequest: Trip.verificationCodeRequest,

        isMettingConfirmed: Trip.isMettingConfirmed,
        confirmingMetting: Trip.confirmingMetting,
        confirmMettingError: Trip.confirmMettingError
    };
};
const containerActions = {
    confirmMeeting: tripActions.confirmMeeting,
    requestMettingVerificationCodeCode: tripActions.requestMettingVerificationCodeCode,
    updateIsReuestVerificationCodeEnabled: tripActions.updateIsReuestVerificationCodeEnabled
};
export const ConfirmationTrip = connect(mapStateToProps, containerActions)
    (ConfirmationTripScreen);