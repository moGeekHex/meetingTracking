import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProps, NavigationEvents, } from 'react-navigation';
import { colors } from '../../theme';
import { Text } from '../../common/Text';
import { navigationRouteNames } from '../../navigation';
import { Header } from '../../common/Header';
import { MettingBtn } from './MettingBtn';
import { Loading } from '../../common/Loading';
import { Mettings as MettingsInterface, MettingFilters } from '../../redux/redux.types';
import { actions as mettingActions } from '../../redux/mettingRedux';
import { NoData } from '../../common/NoData';
import { showToast } from '../../utils/general/general';
import Metting from '../../services/models/Metting';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { getData } from '../../utils/asyncStorage';
import isEmpty from 'lodash/isEmpty';

/**
 * interfaces and types
 */
interface MettingsScreenProps extends NavigationScreenProps<{}>, MettingsInterface, MettingFilters {
    getMettings: (from: string, to: string, statuses: string | undefined, users: string) => void;
    updateSelectedMettingId: (mettingId: number) => void;

}
interface MettingsScreenState {
    mettings: Metting[];
    showFilters: boolean;
    isRefreshing: boolean;
}

/**
 * The mettings screen
 * that shows calendar and list of meetings
 */
class MettingsScreen extends React.Component<MettingsScreenProps, MettingsScreenState>
{

    /**
     * locale state
     */
    state: MettingsScreenState = {
        mettings: [],
        showFilters: false,
        isRefreshing: false
    };

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderListOfMeetings()}
            </View>
        );
    }

    /**
     * life cycle
     */
    componentDidMount() {
        this._getTodayMettings();
    }

    UNSAFE_componentWillReceiveProps(nextProps: MettingsScreenProps) {

        //grap data
        const { error, success, mettings } = nextProps;

        if (success && !error) {
            this.setState({ mettings })
        }
        else if (error && !success) {
            showToast(error, null, 1500, 'danger');
        }

    }

    /**
     * locale component functions
     */
    _renderHeader = () => {
        return (
            <Header
                right={this._renderRightHeader()}
                title='Meetings'
                containerStyle={styles.headerContainerStyle}
                onBack={() => this.props.navigation.navigate(navigationRouteNames.tabNavigators.menuTab)}
            />
        );
    }

    _isMettingsFiltered = () => {
        const { selectedUsers, selectedStatuses, startTime, endTime } = this.props;

        if (startTime == 0 && endTime == 0 && isEmpty(selectedUsers) && isEmpty(selectedStatuses)) {
            return false;
        }

        return true;
    }

    _renderRightHeader = () => {

        //constants
        const filterIcnColor = this._isMettingsFiltered() ? colors.success : colors.orange;

        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate(navigationRouteNames.filtersModal)}
                activeOpacity={1}
                style={styles.rightHeaderContainer}>
                <Icon
                    type='material-community'
                    name='filter-variant'
                    color={filterIcnColor}
                    containerStyle={styles.filterIcn}
                />

                <Text style={styles.filterTxt}>
                    {this._isMettingsFiltered() ? 'Filtered' : 'FILTERS'}
                </Text>
            </TouchableOpacity>
        );
    }

    _renderMetting = ({ item: metting }: { item: Metting }) => {
        return (<MettingBtn
            status={metting.Status}
            date={`${new Date(parseInt(metting.MeetingDateTime as any)).toLocaleDateString()}`}
            customerName={metting.CustomerName}
            onPress={() => this._handleMettingPress(metting.ID)}
        />);
    }

    _renderListOfMeetings = () => {

        //grap data
        const { loading } = this.props;
        const { mettings } = this.state;
        const refreshControl = (<RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._handleRefreshMettings}
        />);

        const listOfMettings = (<FlatList
            refreshControl={refreshControl}
            data={mettings}
            keyExtractor={item => `${item.ID}`}
            renderItem={this._renderMetting}
        />);
        const loadingMettings = <Loading
            overlay={false}
        />

        return loading ? (loadingMettings) : (
            mettings.length > 0 ? listOfMettings :
                <NoData
                    refreshControl={refreshControl}
                    noDataText='No Meetings'
                />
        );
    }

    /**
     * locale functions
     */
    _getTodayMettings = async () => {
        const currentUser: any = await getData('UserData');
        const todayDate = moment().format('YYYY-MM-DD');
        this.props.getMettings(todayDate, todayDate, undefined, `${currentUser.LoggedInUserID}`);
    }

    _handleRefreshMettings = () => {
        const { startTime, endTime, selectedStatuses, selectedUsers } = this.props;

        //constnats
        const fromDate = startTime > 0 ? moment(startTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const endDate = endTime > 0 ? moment(endTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const users = selectedUsers.length > 0 ? selectedUsers.toString() : undefined;
        const statuses = selectedStatuses.length > 0 ? selectedStatuses.toString() : undefined;

        this.props.getMettings(fromDate, endDate, statuses, users as string);
        this.setState({ isRefreshing: false });
    }

    _handleMettingPress = (mettingId: number) => {
        this.props.updateSelectedMettingId(mettingId);
        this.props.navigation.navigate(navigationRouteNames.MettingDetails);
    }

}

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.iron },
    customBtnStyle: { alignSelf: 'center' },
    rightHeaderContainer: {
        flexDirection: 'row', flex: 1,
        alignItems: 'center'
    },
    filterTxt: { color: colors.dark },
    filterIcn: { marginRight: 4 },
    headerContainerStyle: {
        borderBottomWidth: 0.75,
        borderBottomColor: colors['international-orange']
    }
});

/**
 * redux config
 */
const mapStateToProps = ({ Metting, MettingsFilters }:
    { Metting: MettingsInterface, MettingsFilters: MettingFilters }) => {

    return {
        loading: Metting.loading,
        error: Metting.error,
        success: Metting.success,
        mettings: Metting.mettings,

        startTime: MettingsFilters.startTime,
        endTime: MettingsFilters.endTime,
        selectedUsers: MettingsFilters.selectedUsers,
        selectedStatuses: MettingsFilters.selectedStatuses,
    };
};
const containerActions = {
    getMettings: mettingActions.getMettings,
    updateSelectedMettingId: mettingActions.updateSelectedMettingId
};
export const Mettings = connect(mapStateToProps, containerActions)(MettingsScreen);