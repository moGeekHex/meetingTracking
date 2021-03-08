import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { TeamLocations, Mettings, MettingFilters } from '../../redux/redux.types';
import User from '../../services/models/User';
import { Loading } from '../../common/Loading';
import { colors } from '../../theme';
import { Header } from '../../common/Header';
import { TextFieldWithLabelAndIcon, INPUT_WIDTH } from '../../common/TextFieldWithLabelAndIcon';
import { DateTimePicker } from '../../components/DateTimePicker';
import { NavigationScreenProps } from 'react-navigation';
import { Text } from '../../common/Text';
import { actions as teamLocationActions } from '../../redux/teamLocationsRedux';
import { showToast } from '../../utils/general/general';
import { Icon, Button } from 'native-base';
import { actions as mettingActions } from '../../redux/mettingRedux';
import MettingStatus from '../../services/models/MettingStatus';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { MultiSelectListModal } from '../../components/MultiSelectList';
import { actions as mettingFiltersActions, MettingFiltersType } from '../../redux/mettingFiltersRedux';
import { getData } from '../../utils/asyncStorage';

/**
 * interfaces and types
 */
type TargetDate = 'START' | 'END';
interface FiltersComponentProps extends NavigationScreenProps<{}> {
    loading?: boolean;
    error?: undefined | string;
    success?: boolean;
    users?: Array<User>;
    loadingStatuses: boolean;
    statusError: undefined | string;
    statusSuccess: boolean;
    mettingStatuses: Array<MettingStatus>;
    getUsers: () => void;
    getMettingStatuses: () => void;
    getMettings: (from: string, to: string, statuses?: string, users?: string) => void;

    updateMettingFiltersProps: (mettingFilterType: MettingFiltersType, payload: any) => void;
    clearFilters: () => void;
    startTime: number | string;
    endTime: number | string;
    selectedDate: Date;
    selectedUsers: Array<any>;
    selectedStatuses: Array<any>;
    usersFilter: Array<any> | null;
    mettingStatusesFilter: Array<any> | null;
}
interface FiltersComponentState {
    showPicker: boolean;
    targetDate: TargetDate;
    showUser: boolean;
    showMettingStatuses: boolean;
}

/**
 * A stateful component that returns a filters modal
 */
class FiltersComponent extends React.Component
    <FiltersComponentProps, FiltersComponentState>
{

    /**
     * locale state
     */
    state: FiltersComponentState = {
        showPicker: false,
        targetDate: 'START',
        showUser: false,
        showMettingStatuses: false,
    };

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderCalendarView()}
                {this._renderUsersList()}
                {this._renderMettingsList()}
                {this._renderFooterBtns()}

                {this._renderUserMultiSelect()}
                {this._renderMettingStatusSelect()}
                {this._renderDateTimePicker()}
                {this._renderLoading()}
            </View>
        );
    }

    /**
     * life cycle
     */
    componentDidMount() {
        this.props.getUsers();
        this.props.getMettingStatuses();
    }

    UNSAFE_componentWillReceiveProps(nextProps: FiltersComponentProps) {

        //grap data
        const { error, success, users,
            statusError, statusSuccess, mettingStatuses } = nextProps as any;

        if (success && !error) {
            this.props.updateMettingFiltersProps('USERS', users);
        }
        if (error && !success) {
            showToast(error, null, 1500, 'danger');
        }
        if (statusSuccess && !statusError) {
            this.props.updateMettingFiltersProps('STATUSES', mettingStatuses);
        }
        if (statusError && !statusSuccess) {
            showToast(error, null, 1500, 'danger');
        }
    }

    /**
     * locale component functions
     */
    _renderFooterBtns = () => {
        return (
            <View style={styles.externalFooter}>
                <View style={styles.footerBtnsContainer}>
                    <Button
                        onPress={this._handleApplyFilter}
                        style={styles.footerBtn}
                    >
                        <Text style={styles.footerApplyBtnTxt}>
                            {'Apply'}
                        </Text>
                    </Button>

                    <Button
                        onPress={this._handleClearFilters}
                        style={[styles.footerBtn,
                        { backgroundColor: colors.light }]}
                    >
                        <Text style={styles.footerClearBtnTxt}>
                            {'Clear'}
                        </Text>
                    </Button>
                </View>
            </View>
        );
    }

    _renderMettingStatusSelect = () => {

        if (this.props.mettingStatusesFilter == null)
            return null;

        return (
            <MultiSelectListModal
                addAllOption
                selectedData={this.props.selectedStatuses}
                visible={this.state.showMettingStatuses}
                data={this.props.mettingStatusesFilter as any}
                closeModal={() => this._toggleMettingStatusList(false)}
                title={'Select Status(es)'}
                noDataTxt='No Statuses'
                getSelectedIds={this._getSelectedMettingStatuses}
                id='ID'
                name='Name'
            />
        );
    }

    _renderUserMultiSelect = () => {

        if (this.props.usersFilter == null)
            return null;

        return (
            <MultiSelectListModal
                addAllOption
                selectedData={this.props.selectedUsers}
                visible={this.state.showUser}
                data={this.props.usersFilter as any}
                closeModal={() => this._toggleUsersList(false)}
                title={'Select User(s)'}
                noDataTxt='No customers'
                getSelectedIds={this._getSelectedUsers}
                id='ID'
                name='Name'
            />
        );
    }

    _renderMettingsList = () => {

        //constants
        const { selectedStatuses } = this.props;

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => this._toggleMettingStatusList(true)}
                style={styles.selectView}>

                <Text style={styles.usersTxt}>
                    {'Statuses'}
                    {selectedStatuses.length > 0 && <Text style={{ fontSize: 11, lineHeight: 24 }}>
                        {` ( ${selectedStatuses.length} selected )`}
                    </Text>}
                </Text>

                <View style={styles.leftViewLocations}>
                    <Icon
                        type='Ionicons'
                        name='md-arrow-dropdown'
                        style={styles.iconArrow}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    _renderUsersList = () => {

        //constants
        const { selectedUsers } = this.props;

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => this._toggleUsersList(true)}
                style={styles.selectView}>

                <Text style={styles.usersTxt}>
                    {'Users'}
                    {selectedUsers.length > 0 && <Text style={styles.selectedUsersTxt}>
                        {` ( ${selectedUsers.length} selected )`}
                    </Text>}
                </Text>

                <View style={styles.leftViewLocations}>
                    <Icon
                        type='Ionicons'
                        name='md-arrow-dropdown'
                        style={styles.iconArrow}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    _renderDateTimePicker = () => {
        return (<DateTimePicker
            onCancel={() => this.setState({ showPicker: false })}
            isVisisble={this.state.showPicker}
            selectedDate={this.props.selectedDate}
            getSelectedDate={this._getSelectedDate}
        />)
    }

    _renderCalendarView = () => {

        //grap state
        const { startTime, endTime } = this.props;

        //constants
        const startTimeVal = startTime > 0 ? moment(startTime).format('YY-MM-DD') : '';
        const endTimeVal = endTime > 0 ? moment(endTime).format('YY-MM-DD') : '';

        return (
            <View style={styles.calendarView}>
                <TextFieldWithLabelAndIcon
                    onPress={this._handleSelectStartTime}
                    label='From:'
                    textStyle={styles.textInputStyle}
                    iconType='FontAwesome'
                    value={`${startTimeVal}`}
                    iconName='calendar'
                />

                <TextFieldWithLabelAndIcon
                    containerStyle={styles.secondCalendarStyle}
                    disabled={startTimeVal == 0 as any}
                    onPress={this._handleSelectEndTime}
                    label='To:'
                    textStyle={styles.textInputStyle}
                    iconType='FontAwesome'
                    value={`${endTimeVal}`}
                    iconName='calendar'
                />
            </View>
        );
    }

    _renderHeader = () => {
        return (
            <Header
                containerStyle={styles.header}
                title='Filters'
                onBack={() => this.props.navigation.goBack()}
            />
        );
    }

    _renderLoading = () => {
        return (this.props.loading ?
            <Loading overlay /> : null);
    }

    /**
     * locale functions
     */
    _getAndHandleFilterData = () => {

        //grap data
        const { startTime, endTime, selectedUsers, selectedStatuses } = this.props;

        if (startTime == 0) {
            throw new Error('select start date');
        }
        else if (endTime == 0) {
            throw new Error('select end date');
        }
        else if (isEmpty(selectedUsers)) {
            throw new Error('Select Users(s)');
        }
        else if (isEmpty(selectedStatuses)) {
            throw new Error('Select Statuses(s)');
        }


        return {
            selectedUseresIds: selectedUsers.toString(),
            selectedMettingStatusesIDs: selectedStatuses.toString(),
            from: moment(startTime).format('YYYY-MM-DD'),
            to: moment(endTime).format('YYYY-MM-DD')
        };
    }

    _handleClearFilters = async () => {
        const todayData = moment().format('YYYY-MM-DD');

        //without any statuses to get all
        const currentUser: any = await getData('UserData');
        this.props.getMettings(todayData, todayData, undefined, `${currentUser.LoggedInUserID}`);
        this.props.clearFilters();
        this.props.navigation.goBack();
    }

    _handleApplyFilter = () => {
        try {

            //grap data
            const { selectedUseresIds, selectedMettingStatusesIDs, from, to } = this._getAndHandleFilterData();
            this.props.getMettings(from, to, selectedMettingStatusesIDs, selectedUseresIds);
            this.props.navigation.goBack();
        }
        catch (error) {
            showToast(error.message, null, 1500, 'danger');
        }
    }

    _toggleMettingStatusList = (newValue: boolean) => {
        this.setState({ showMettingStatuses: newValue });
    }

    _toggleUsersList = (newValue: boolean) => {
        this.setState({ showUser: newValue });
    }

    _updateCalendarState = (date: Date) => {

        //grap state
        const { targetDate } = this.state;
        const stringDate = date.getTime();

        switch (targetDate) {
            case 'START':
                this.props.updateMettingFiltersProps('START_TIME', stringDate);
                break;

            case 'END':
                this.props.updateMettingFiltersProps('END_TIME', stringDate);
                break;
        }

    }

    _getSelectedMettingStatuses = (selectedStatuses: any) => {
        this.props.updateMettingFiltersProps('SELECTED_STATUSES', selectedStatuses);
    }

    _getSelectedUsers = (selectedUsers: any) => {
        this.props.updateMettingFiltersProps('SELECTED_USERS', selectedUsers);
    }

    _getSelectedDate = (date: any) => {
        this.setState({ showPicker: false },
            () => {
                this.props.updateMettingFiltersProps('SELECTED_DATE', date);
                this._updateCalendarState(date)
            });
    }

    _handleSelectStartTime = () => {
        this.setState({ showPicker: true, targetDate: 'START' })
    }

    _handleSelectEndTime = () => {
        this.setState({ showPicker: true, targetDate: 'END' })
    }
}

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors["titan-white"]
    },
    calendarView: {
        width: INPUT_WIDTH, alignSelf: 'center',
        marginTop: 16
    },
    secondCalendarStyle: { marginTop: 16 },
    textStyle: {
        fontSize: 16, color: colors.light,
    },
    selectView: {
        marginTop: 16, alignSelf: 'center',
        height: 50, paddingHorizontal: 8, width: INPUT_WIDTH,
        borderRadius: 8, flexDirection: 'row', backgroundColor: colors.light,
        justifyContent: 'space-between', alignItems: 'center'
    },
    selectTxt: {
        fontWeight: 'bold', fontSize: 16,
        color: colors.dark
    },
    leftViewLocations: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconArrow: {
        color: colors.dark,
        fontSize: 16
    },
    header: {
        backgroundColor: colors["titan-white"]
    },
    footerBtnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', alignItems: 'center',
    },
    footerBtn: {
        justifyContent: 'center',
        alignItems: 'center', borderRadius: 0,
        borderWidth: 1, borderColor: colors.orange,
        backgroundColor: colors.orange, width: '35%'
    },
    footerApplyBtnTxt: {
        fontSize: 18,
        color: colors.light,
        fontWeight: 'bold'
    },
    footerClearBtnTxt: {
        fontSize: 16, color: colors.orange,
        fontWeight: '900'
    },
    externalFooter: {
        flex: 1, justifyContent: 'flex-end',
        marginBottom: 16, width: '90%', alignSelf: 'center'
    },
    textInputStyle: {
        fontSize: 12, paddingTop: 15
    },
    usersTxt: {
        fontSize: 16, color: colors.dark
    },
    selectedUsersTxt: { fontSize: 11, lineHeight: 24 }
});

/**
 * redux config
 */
const mapStateToProps = ({ TeamLocation, Metting, MettingsFilters }:
    { TeamLocation: TeamLocations, Metting: Mettings, MettingsFilters: MettingFilters }) => {

    return {
        loading: TeamLocation.loading,
        error: TeamLocation.error,
        success: TeamLocation.success,
        users: TeamLocation.users,
        loadingStatuses: Metting.loading,
        statusError: Metting.error,
        statusSuccess: Metting.success,
        mettingStatuses: Metting.mettingStatuses,

        startTime: MettingsFilters.startTime,
        endTime: MettingsFilters.endTime,
        selectedDate: MettingsFilters.selectedDate,
        selectedUsers: MettingsFilters.selectedUsers,
        selectedStatuses: MettingsFilters.selectedStatuses,
        usersFilter: MettingsFilters.users,
        mettingStatusesFilter: MettingsFilters.statuses
    };
};
const containerActions = {
    getUsers: teamLocationActions.getUsers,
    getMettingStatuses: mettingActions.getMettingStatuses,
    getMettings: mettingActions.getMettings,

    updateMettingFiltersProps: mettingFiltersActions.updateMettingFiltersProps,
    clearFilters: mettingFiltersActions.clearFilters
};
export const FilterModal = connect(mapStateToProps, containerActions)(FiltersComponent);