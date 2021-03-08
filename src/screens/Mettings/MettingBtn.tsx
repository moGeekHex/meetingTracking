import React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { colors } from '../../theme';
import { Text } from '../../common/Text';

/**
 * interfaces and types
 */
interface MettingBtnProps {
    date: string;
    customerName: string;
    onPress: () => void;
    status: string;
}

/**
 * A stateless component has only one task
 * show metting list item
 */
export const MettingBtn = (props: MettingBtnProps) => {

    //grap props
    const { date, customerName, onPress, status } = props;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={styles.meetingBtn}
        >
            {renderTopRow(date)}
            {renderMiddleRow(customerName)}
            {renderFootRow(status)}
        </TouchableOpacity>
    );
}

/**
 * functions
 */
const renderKeyAndValueView = (key: string, value: string) => {
    return (
        <View style={styles.leftTopRow}>
            <Text style={styles.key}>{`${key}:`}</Text>
            <Text style={[styles.value, { paddingLeft: 10 }]}>{value}</Text>
        </View>
    );
}

const renderMiddleRow = (customerName: string) => {
    return (
        <View>
            {renderKeyAndValueView('Customer Name', customerName)}
        </View>
    );
}

const renderFootRow = (status: string) => {
    return (
        renderKeyAndValueView('Status', status)
    );
}

const renderTopRow = (date: string) => {
    return (
        renderKeyAndValueView('Date Time', date)
    );
}

/**
 * constants
 */
const { height: windowHeight } = Dimensions.get('window');
const MEETING_BUTTON_HEIGHT = windowHeight / 6;

/**
 * styles
 */
const styles = StyleSheet.create({
    meetingBtn: {
        borderRadius: 16,
        backgroundColor: colors.light,
        flex: 1, height: MEETING_BUTTON_HEIGHT,
        maxHeight: MEETING_BUTTON_HEIGHT,
        padding: 16, marginHorizontal: 16, marginVertical: 8,
        justifyContent: 'space-between'
    },
    mettingBtnTxt: {
        fontSize: 16,
        color: colors["mid-gray"],
    },
    topRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftTopRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    key: { fontSize: 15, color: colors["mid-gray"] },
    value: { color: colors.dark, fontSize: 12 }
});
