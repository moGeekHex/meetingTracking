import React from 'react';
import { StyleSheet } from 'react-native';
import ReactNativeDateTimePicker from "react-native-modal-datetime-picker";

/**
 * interfaces and types
 */
type GetSelectedDate = (date: Date) => void
interface DateTimePickerProps {
    isVisisble: boolean;
    getSelectedDate: GetSelectedDate;
    onCancel: () => void;
    selectedDate: Date;

    mode?: 'datetime' | 'date' | 'time'
}

/**
 * The date time picker component
 */
export const DateTimePicker = (props: DateTimePickerProps) => {

    //grap props
    const { isVisisble, onCancel, getSelectedDate,
        selectedDate, mode = 'date' } = props;

    return (
        <ReactNativeDateTimePicker
            mode={mode}
            date={selectedDate}
            isVisible={isVisisble}
            onConfirm={(date: Date) => handleDatePicked(date, getSelectedDate)}
            onCancel={onCancel}
        />
    );
}

/**
 * functions
 */
const handleDatePicked = (date: Date, getSelectedDate: GetSelectedDate) => {
    getSelectedDate(date);
}

/**
 * styles
 */
const styles = StyleSheet.create({

});

