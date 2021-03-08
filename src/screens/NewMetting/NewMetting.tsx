import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';
import { Text } from '../../common/Text';
import { Header } from '../../common/Header';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, Content, Button } from 'native-base';
import { TextFieldWithLabelAndIcon } from '../../common/TextFieldWithLabelAndIcon';
import { connect } from 'react-redux';
import { Loading } from '../../common/Loading';
import { Customer, Mettings } from '../../redux/redux.types';
import { showToast } from '../../utils/general/general';
import { actions as customerActions } from '../../redux/customerRedux';
import { SingleSelectListModal } from '../../components/SingleSelectList';
import { DateTimePicker } from '../../components/DateTimePicker';
import { actions as mettingActions } from '../../redux/mettingRedux';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { navigationRouteNames } from '../../navigation';

/**
 * interfaces and types
 */
interface NewMettingScreenProps extends NavigationScreenProps<{}>, Customer, Mettings {
    getCustomers: () => void,
    createNewMetting: (customerId: number, mettingDateTime: string,
        locationDescription: string, description: string) => void,
    resetMettingStatus: () => void;
}
interface NewMettingScreenState {
    showCustomers: boolean;
    customers: Array<any> | null;
    description: string;
    dateTime: string;
    location: string;
    showPicker: boolean;
    selectedDate: Date;
    selectedCustomer: {} | null;
}

/**
 * A stateful component thar retuens new metting screen
 */
class NewMettingScreen extends React.Component
    <NewMettingScreenProps, NewMettingScreenState>
{

    /**
     * locale state
     */
    state = {
        showCustomers: false,
        customers: null,
        description: '',
        dateTime: '',
        location: '',
        showPicker: false,
        selectedDate: new Date(),
        selectedCustomer: null
    };

    /**
     * locale variables
     */
    _locationRef: any;
    _descriptionRef: any;

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}

                <Content>
                    {this._renderSelectCustomer()}
                    {this._renderInputs()}
                </Content>

                {this._renderFooterBtns()}
                {this._renderLoading()}
                {this._renderCustomersSingleSelect()}
                {this._renderDateTimePicker()}
            </View>
        );
    }

    /**
     * life cycle
     */
    componentDidMount() {
        this.props.getCustomers();
    }

    UNSAFE_componentWillReceiveProps(nextProps: NewMettingScreenProps) {

        //grap data
        const { error, success, customers,
            creatingMettingError, creatingMettingSuccess } = nextProps;

        if (success && !error) {
            this.setState({ customers });
        }
        else if (error && !success) {
            showToast(error, null, 1000, 'danger');
        }

        //for metting creation
        if (creatingMettingSuccess && !creatingMettingError) {
            showToast('Meeting created', null, 1500, 'success');
            this.props.resetMettingStatus();

            //navigate to mettings screen
            this.props.navigation.navigate(navigationRouteNames.mettings);
        }
        else if (creatingMettingError && !creatingMettingSuccess) {
            showToast(creatingMettingError, null, 1500, 'danger');
        }
    }

    componentWillUnmount() {
        this.props.resetMettingStatus();
    }

    /**
     * locale component functions
     */
    _renderDateTimePicker = () => {
        return (
            <DateTimePicker
                mode='datetime'
                onCancel={() => this.setState({ showPicker: false })}
                isVisisble={this.state.showPicker}
                selectedDate={this.state.selectedDate}
                getSelectedDate={this._getSelectedDate}
            />
        );
    }

    _renderCustomersSingleSelect = () => {

        if (this.state.customers == null)
            return null;

        return (
            <SingleSelectListModal
                visible={this.state.showCustomers}
                items={this.state.customers as any}
                closeModal={() => this._toggleCustomersList(false)}
                title={'Select Customer'}
                noDataTxt='No customers'
                getSelectedItem={this._getSelectedCustomer}
                id='OwnerID'
                name='Name'
            />
        );
    }

    _renderLoading = () => {
        return (
            this.props.loading || this.props.creatingMetting ?
                <Loading overlay /> : null
        );
    }

    _renderInputs = () => {
        return (
            <View style={styles.inputsContainer}>
                <TextFieldWithLabelAndIcon
                    onPress={() => this.setState({ showPicker: true })}
                    noIcon
                    returnKeyType='next'
                    label='Meeting Date Time:'
                    value={this.state.dateTime}
                    textFieldContainerStyle={styles.textFieldContainerStyle}
                    containerStyle={styles.textFieldContainer}
                    onSubmitEditing={() => this._locationRef._root.focus()}
                />
                <TextFieldWithLabelAndIcon
                    noIcon
                    inputRef={(input: any) => { this._locationRef = input; }}
                    label='Location:'
                    returnKeyType='next'
                    value={this.state.location}
                    textFieldContainerStyle={styles.textFieldContainerStyle}
                    onChangeText={(location) => this.setState({ location })}
                    containerStyle={styles.textFieldContainer}
                    onSubmitEditing={() => this._descriptionRef._root.focus()}
                />
                <TextFieldWithLabelAndIcon
                    noIcon
                    returnKeyType='done'
                    label='Description:'
                    inputRef={(input: any) => { this._descriptionRef = input; }}
                    onChangeText={(description) => this.setState({ description })}
                    value={this.state.description}
                    textFieldContainerStyle={styles.textFieldContainerStyle}
                    containerStyle={styles.textFieldContainer}
                />
            </View>
        );
    }

    _renderHeader = () => {
        return (
            <Header
                title='New Meeting'
                onBack={() => this.props.navigation.goBack()}
            />
        );
    }

    _renderSelectCustomer = () => {

        //grap data
        const { selectedCustomer } = this.state;

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => this._toggleCustomersList(true)}
                style={styles.selectCustomerView}>
                <Text style={styles.customersTxt}>
                    {isEmpty(selectedCustomer) ? 'Select Customer' : selectedCustomer.Name}
                </Text>

                <Icon
                    type='Ionicons'
                    name='md-arrow-dropdown'
                    style={styles.iconArrow}
                />
            </TouchableOpacity>
        );
    }

    _renderFooterBtns = () => {
        return (
            <View style={styles.footerBtnsContainer}>
                <Button
                    onPress={this._handleSaveMetting}
                    style={styles.footerBtn}
                >
                    <Text style={styles.footerSaveBtnTxt}>
                        {'Save'}
                    </Text>
                </Button>

                <Button
                    onPress={() => this.props.navigation.goBack()}
                    style={[styles.footerBtn,
                    { backgroundColor: colors.light }]}
                >
                    <Text style={styles.footerCancelBtnTxt}>
                        {'Cancel'}
                    </Text>
                </Button>
            </View>
        );
    }

    /**
     * locale functions
     */
    _getSelectedDate = (date: any) => {
        this.setState({
            selectedDate: date, showPicker: false,
            dateTime: moment(new Date(date).getTime()).format('DD-MMM-YYYY HH:mm')
        });
    }

    _getSelectedCustomer = (selectedItem: any) => {
        this.setState({ selectedCustomer: selectedItem });
    }

    _getAndValidateHandledData = () => {

        //grap data
        const { selectedCustomer, description, dateTime, location,
            selectedDate } = this.state;

        if (isEmpty(selectedCustomer)) {
            throw new Error('Select Customer plaese');

        }
        if (dateTime.length == 0) {
            throw new Error('metting date time is required');
        }
        if (location.length == 0) {
            throw new Error('location is required');
        }
        if (description.length == 0) {
            throw new Error('description is required');
        }

        //return handled data
        return {
            selectedCustomerId: selectedCustomer.ID,
            description: description,
            mettingDateTime: moment(selectedDate).format('YYYY-MM-DDTHH:MM:SS'),
            location: location
        };
    }

    _handleSaveMetting = () => {
        try {
            const { selectedCustomerId, description, mettingDateTime, location } = this._getAndValidateHandledData();
            this.props.createNewMetting(selectedCustomerId, mettingDateTime, location, description);
        }
        catch (error) {
            showToast(error.message, null, 1500, 'danger');
        }
    }

    _toggleCustomersList = (newValue: boolean) => {
        this.setState({ showCustomers: newValue });
    }
}

/**
 * constants
 */
const VIEW_WIDTH = '90%';

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors["titan-white"]
    },
    selectCustomerView: {
        height: 50, paddingHorizontal: 8,
        backgroundColor: colors.light, width: VIEW_WIDTH,
        borderRadius: 8, flexDirection: 'row', alignSelf: 'center',
        justifyContent: 'space-between', alignItems: 'center'
    },
    customersTxt: {
        fontWeight: 'bold', fontSize: 16,
        color: colors["mid-gray"]
    },
    iconArrow: {
        color: colors.dark,
        fontSize: 16
    },
    textFieldContainer: {
        marginTop: 16, width: '100%'
    },
    inputsContainer: {
        flex: 1, alignSelf: 'center',
        width: VIEW_WIDTH
    },
    footerBtnsContainer: {
        flexDirection: 'row', paddingHorizontal: 24, marginVertical: 16,
        justifyContent: 'space-between', alignItems: 'center',
    },
    footerBtn: {
        justifyContent: 'center',
        alignItems: 'center', borderRadius: 0,
        borderWidth: 1, borderColor: colors.orange,
        backgroundColor: colors.orange, width: '35%'
    },
    footerSaveBtnTxt: {
        fontSize: 18,
        color: colors.light,
        fontWeight: 'bold'
    },
    footerCancelBtnTxt: {
        fontSize: 16, color: colors.orange,
        fontWeight: '900'
    },
    textFieldContainerStyle: {
        width: '100%'
    }
});

/**
 * redux config
 */
const mapStateToProps = ({ Customer, Metting }: { Customer: Customer, Metting: Mettings }) => {
    return {
        success: Customer.success,
        error: Customer.error,
        loading: Customer.loading,
        customers: Customer.customers,

        creatingMetting: Metting.creatingMetting,
        creatingMettingSuccess: Metting.creatingMettingSuccess,
        creatingMettingError: Metting.creatingMettingError
    };
};
const containerActons = {
    getCustomers: customerActions.getCustomers,
    createNewMetting: mettingActions.createNewMetting,
    resetMettingStatus: mettingActions.resetMeetingState
};
export const NewMetting = connect(mapStateToProps, containerActons)(NewMettingScreen);