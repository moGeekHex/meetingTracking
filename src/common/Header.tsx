import React, { ReactElement } from 'react';
import {
    StyleSheet, TouchableOpacity, ViewStyle,
    TextStyle, StatusBarProps
} from 'react-native';
import { Header as ReactNativeElementsHeader, Icon } from 'react-native-elements';
import { colors } from '../theme';

/**
 * interfaces and types
 */
interface HeaderProps {
    left?: ReactElement,
    right?: ReactElement,
    onBack?: () => void,
    containerStyle?: ViewStyle,
    title?: string,
    titleStyle?: TextStyle,
    backgroundColor?: string
}

/**
 * The header component
 * @param {*} props 
 */
export const Header = (props: HeaderProps) => {

    //grap props
    const { left, right, onBack, backgroundColor = colors.iron,
        containerStyle } = props;

    //constants
    const LeftView = onBack ? backIcon(onBack) : left;
    const statusBarProps: StatusBarProps = {
        barStyle: 'dark-content',
        backgroundColor: colors["titan-white"],
        animated: true,
        networkActivityIndicatorVisible: true
    };
    const containerStyles = [styles.containerStyle, containerStyle];
    const titleStyles = [styles.titleStyle, props.titleStyle];

    return (
        <ReactNativeElementsHeader
            barStyle='dark-content'
            backgroundColor={backgroundColor}
            statusBarProps={statusBarProps}
            containerStyle={containerStyles}
            placement="center"
            rightComponent={right}
            leftComponent={LeftView}
            centerComponent={{
                text: props.title,
                style: titleStyles
            }}
        />
    )
}

/**
 * Header functions
 */
const backIcon = (onBack: () => void) => {
    return (
        <TouchableOpacity
            style={styles.backIconContainer}
            activeOpacity={1}
            onPress={onBack}
        >
            <Icon
                color={colors.thunder}
                type="ionicon"
                name='ios-arrow-back'
                size={24}
            />
        </TouchableOpacity>
    );
}

/**
 * constants
 */

/**
 * styles
 */
const styles = StyleSheet.create({
    containerStyle: {
        elevation: 0, borderBottomWidth: 0,
        backgroundColor: colors["titan-white"]
    },
    titleStyle: {
        color: colors.thunder, fontSize: 24,
    },
    backIconContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", width: 50
    }
});