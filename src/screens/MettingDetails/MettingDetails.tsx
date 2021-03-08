import React from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Content, Button } from 'native-base';
import { colors } from '../../theme';
import { NavigationScreenProps } from 'react-navigation';
import { navigationRouteNames } from '../../navigation';
import { Header } from '../../common/Header';
import { TextFieldWithLabelAndIcon } from '../../common/TextFieldWithLabelAndIcon';
import { Text } from '../../common/Text';
import { Mettings } from '../../redux/redux.types';
import { Loading } from '../../common/Loading';
import { showToast } from '../../utils/general/general';
import { actions as mettingActions } from '../../redux/mettingRedux';
import moment from 'moment';
import { DialogInput } from '../../components/InputDialog';
import { insertToRealm } from '../../realm/helpers';
import { MettingTime } from '../../realm/schemas/schema.types';
import { METTING_TIME_ID } from '../../realm/schemas/constants';

/**
 * interfaces and types
 */
interface MettingDetailsProps extends NavigationScreenProps<{}>, Mettings {
    fetchMettingById: (mettingId: string | null) => void;
    cancelMeeting: (meetingId: any, notes: string) => void;
    resetMeetingState: () => void;
}

interface MettingDetailsState {
    customer: string;
    mobile: string;
    locationDescription: string;
    dateTime: string;
    userName: string;
    status: string;
    duration: string;
    notes: string;
    showNotesDialog: boolean;
}

/**
 * The trip screen 
 */
class MettingDetailsScreen extends React.Component
    <MettingDetailsProps, MettingDetailsState>
{

    /**
     * locale state
     */
    state = {
        customer: '',
        mobile: '',
        locationDescription: '',
        dateTime: '',
        userName: '',
        status: '',
        duration: '',
        showNotesDialog: false,
        notes: ''
    };

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderListOfInputs()}
                {this._renderFooterBtns()}

                {this._renderLoading()}
                {this._renderDialogInputNotes()}
            </View>
        );
    }

    /**
     * life cycle
     */
    componentDidMount() {
        const { selectedMettingId } = this.props;
        this.props.fetchMettingById(selectedMettingId);
    }

    UNSAFE_componentWillReceiveProps(nextProps: MettingDetailsProps) {

        //grap props
        const { success, error, mettingDetails,
            cancelingMettingError, cancelingMettingSuccess } = nextProps;

        if (success && !error) {
            this._updateMettingDetailsState(mettingDetails);
        }
        else if (error && !success) {
            showToast(error, null, 1500, 'danger');
        }

        //cancelling metting cases
        if (cancelingMettingSuccess && !cancelingMettingError) {
            showToast('Cancelled', null, 1500, 'warning');
            this.props.navigation.goBack();
            this.props.resetMeetingState();
        }
        else if (cancelingMettingError && !cancelingMettingSuccess) {
            showToast('an error has been occured', null, 1500, 'danger');
            this.props.resetMeetingState();
        }
    }

    /**
     * locale component functions
     */
    _renderDialogInputNotes = () => {
        return (
            <DialogInput
                closeDialog={() => this.setState({ showNotesDialog: false })}
                title='Cancel Reason:'
                placeholder='type ...'
                isDialogVisible={this.state.showNotesDialog}
                onSubmit={() => {
                    this.setState({ showNotesDialog: false });
                    this.props.cancelMeeting(this.props.selectedMettingId, this.state.notes)
                }}
                onChangeText={notes => this.setState({ notes })}
                value={this.state.notes}
            />
        );
    }

    _renderLoading = () => {
        return (
            (this.props.loading || this.props.cancelingMetting)
            && <Loading overlay />
        );
    }

    _renderHeader = () => {
        return (
            <Header
                title='Meeting Details'
                onBack={() => this.props.navigation.goBack()}
            />
        );
    }

    _renderFooterBtns = () => {
        if (this.state.status != 'New')
            return null;

        return (
            <View style={styles.externalFooter}>
                <View style={styles.footerBtnsContainer}>
                    <Button
                        onPress={this._handleStartTripPress}
                        style={styles.footerBtn}
                    >
                        <Text style={styles.footerStartTripBtnTxt}>
                            {'Start Trip'}
                        </Text>
                    </Button>

                    <Button
                        onPress={this._handleCancelMetting}
                        style={[styles.footerBtn,
                        { backgroundColor: colors.light }]}
                    >
                        <Text style={styles.footerCancelMettingBtnTxt}>
                            {'Cancel Meeting'}
                        </Text>
                    </Button>
                </View>
            </View>
        );
    }

    _renderListOfInputs = () => {
        return (
            <View style={styles.listOfInputeExternalContainer}>
                <View style={styles.listOfInputeInternalContainer}>
                    <Content>
                        <TextFieldWithLabelAndIcon
                            noIcon
                            label='Customer Name:'
                            disabled
                            labelStyle={styles.lableStyle}
                            textStyle={styles.textInputTextStyle}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            value={this.state.customer}
                            containerStyle={styles.textFieldContainer}
                        />
                        <TextFieldWithLabelAndIcon
                            noIcon
                            labelStyle={styles.lableStyle}
                            label='Mobile:'
                            disabled
                            textStyle={styles.textInputTextStyle}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            value={this.state.mobile}
                            containerStyle={styles.textFieldContainer}
                        />
                        <TextFieldWithLabelAndIcon
                            noIcon
                            labelStyle={styles.lableStyle}
                            label='Location:'
                            disabled
                            textStyle={styles.textInputTextStyle}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            value={this.state.locationDescription}
                            containerStyle={styles.textFieldContainer}
                        />
                        <TextFieldWithLabelAndIcon
                            noIcon
                            labelStyle={styles.lableStyle}
                            label='Date Time:'
                            disabled
                            textStyle={styles.textInputTextStyle}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            value={this.state.dateTime}
                            containerStyle={styles.textFieldContainer}
                        />

                        <TextFieldWithLabelAndIcon
                            noIcon
                            labelStyle={styles.lableStyle}
                            label='User:'
                            disabled
                            textStyle={styles.textInputTextStyle}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            value={this.state.userName}
                            containerStyle={styles.textFieldContainer}
                        />

                        <TextFieldWithLabelAndIcon
                            noIcon
                            labelStyle={styles.lableStyle}
                            label='Status:'
                            disabled
                            textStyle={styles.textInputTextStyle}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            value={this.state.status}
                            containerStyle={styles.textFieldContainer}
                        />

                        <TextFieldWithLabelAndIcon
                            noIcon
                            labelStyle={styles.lableStyle}
                            label='Trip Duration:'
                            disabled
                            textStyle={styles.textInputTextStyle}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            value={this.state.duration}
                            containerStyle={styles.textFieldContainer}
                        />
                    </Content>
                </View>
            </View>
        );
    }

    /**
     * locale functions
     */
    _cancelMetting = () => {
        if (this.state.notes.length == 0) { return this.setState({ showNotesDialog: true }); }
    }

    _handleCancelMetting = () => {
        Alert.alert(
            '',
            'Are you sure?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                { text: 'yes', onPress: this._cancelMetting },
            ],
            { cancelable: false },
        );
    }

    _handleStartTripPress = () => {
        Alert.alert(
            '', 'Are you sure do you want to start trip?',
            [
                {
                    text: 'no',
                    style: 'cancel',
                },
                {
                    text: 'yes', onPress: async () => {
                        
                        //add start tie metting to realm
                        const mettingTimeToRealm: MettingTime = {
                            _id: METTING_TIME_ID,
                            departureDateTime: new Date().getTime(),
                            arrivalDateTime: 0
                        }
                        await insertToRealm('MettingTime', mettingTimeToRealm);

                        this.props.navigation.navigate(navigationRouteNames.map);
                    }
                },
            ],
            { cancelable: false },
        );
    }

    _updateMettingDetailsState = (mettingDetails: any) => {

        this.setState({
            customer: mettingDetails.CustomerName,
            mobile: mettingDetails.CustomerMobile,
            locationDescription: mettingDetails.LocationDescription,
            dateTime: moment(mettingDetails.MeetingDateTime).format('DD-MMM-YYYY hh:mm'),
            userName: mettingDetails.Owner,
            status: mettingDetails.Status,
            duration: moment(mettingDetails.MeetingDateTime).format('dddd MMMM D YYYY') //TODO
        });
    }
}

/**
 * constants
 */
const { height: windowHeight } = Dimensions.get('window');

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors["titan-white"]
    },
    textFieldContainer: {
        marginTop: 16, justifyContent: 'center'
    },
    listOfInputeExternalContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    listOfInputeInternalContainer: {
        height: windowHeight * 0.75,
        width: '90%', alignSelf: 'center'
    },
    btnText: {
        fontSize: 16, color: colors.light
    },
    externalFooter: {
        justifyContent: 'flex-end',
        marginBottom: 16, width: '90%', alignSelf: 'center'
    },
    footerBtnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', alignItems: 'center',
    },
    footerBtn: {
        justifyContent: 'center',
        alignItems: 'center', borderRadius: 0,
        borderWidth: 1, borderColor: colors.orange,
        backgroundColor: colors.orange, width: '40%'
    },
    footerStartTripBtnTxt: {
        fontSize: 18,
        color: colors.light,
        fontWeight: 'normal'
    },
    footerCancelMettingBtnTxt: {
        fontSize: 16, color: colors.orange,
        fontWeight: 'normal'
    },
    textFieldContainerStyle: { width: '100%' },
    textInputTextStyle: {
        fontSize: 12, textAlignVertical: 'center',
        marginTop: 4, marginLeft: 4
    },
    lableStyle: {
        color: colors.dark
    }
});

/**
 * redux config
 */
const mapStateToProps = ({ Metting }: { Metting: Mettings }) => {
    return {
        selectedMettingId: Metting.selectedMettingId,
        loading: Metting.loading,
        error: Metting.error,
        success: Metting.success,
        mettingDetails: Metting.mettingDetails,

        cancelingMetting: Metting.cancelingMetting,
        cancelingMettingSuccess: Metting.cancelingMettingSuccess,
        cancelingMettingError: Metting.cancelingMettingError
    };
};
const containerActions = {
    fetchMettingById: mettingActions.fetchMettingById,
    cancelMeeting: mettingActions.cancelMeeting,
    resetMeetingState: mettingActions.resetMeetingState
}
export const MettingDetails = connect(mapStateToProps, containerActions)
    (MettingDetailsScreen as any);