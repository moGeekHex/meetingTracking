import React from 'react';
import {
    ScrollView, StyleSheet
} from 'react-native';
import { Text } from './Text';
import { colors } from '../theme';

/**
 * interfaces and types
 */
interface NoDataProps {
    noDataText: string;
    refreshControl?:any;
}

/**
 * The no data component
 * @param props 
 */
export const NoData = (props: NoDataProps) => {

    //grap props
    const { noDataText,refreshControl } = props;

    return (
        <ScrollView
        refreshControl={refreshControl}
            contentContainerStyle={styles.contntContainerStyle}
        >
            <Text style={styles.text}>{noDataText}</Text>
        </ScrollView>
    );
}

//styles
const styles = StyleSheet.create({
    contntContainerStyle: {
        flex: 1, justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 24, color: colors.dark
    }
});