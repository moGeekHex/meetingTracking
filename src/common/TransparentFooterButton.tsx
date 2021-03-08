import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { IconType } from './CustomButton';
import { colors } from '../theme';

/**
 * interfaces and types
 */
interface TransparentFooterButtonProps {
    iconType: IconType
    iconName: string
    actionTitle?: string
    onActionPress?: () => void
    style?: ViewStyle
    onIconPress?: () => void
}

/**
 * The transparent footer button
 * should be at most bottom of screen in render function
 */
export const TransparentFooterButton = (props: TransparentFooterButtonProps) => {

    /**
     * grap props
     * if title is provided will be rendered
     */
    const { style: overrideStyle, iconType,
        iconName, actionTitle: title, onIconPress,
        onActionPress } = props;

    /**
     * form container style
     * if title is provided so should set alignItmes to 'undefined',
     * when set any prop to 'undefined' automatically will take
     * the default value.
     
     * so should take the default value to implement space-between
       by justifyConetnt
     */
    const styleBasedonTitle: ViewStyle | undefined =
        title ? {
            alignItems: undefined,
            paddingRight: BUTTON_PADDING
        } : undefined;
    const containerStyle = [styles.container,
    { ...styleBasedonTitle }, overrideStyle];

    //constants
    const leftIcon =
        <TouchableOpacity
            activeOpacity={1}
            onPress={onIconPress}
        >
            <Icon
                type={iconType}
                name={iconName}
                size={ICON_SIZE}
                color={colors["pickled-bluewood"]}
            />
        </TouchableOpacity>;

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={containerStyle}>
            {title ? renderIconWithAction(leftIcon, title, onActionPress) :
                leftIcon}
        </TouchableOpacity>);
}

/**
 * functions
 */
const renderIconWithAction = (icon: ReactNode, actionTitle: string,
    onActionPress: () => void) => {

    return (
        <View style={styles.iconAndTitleContainer}>
            {icon}
            <TouchableOpacity
                activeOpacity={1}
                onPress={onActionPress}
            >
                <Text style={styles.titleStyle}>
                    {actionTitle}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/**
 * constants
 */
const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
const BORDER_RADIUS = 16;
export const BUTTON_HEIGHT = windowHeight * 0.075;
const ICON_SIZE = windowWidth * 0.10;
const BUTTON_PADDING = windowWidth * 0.065;

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        position: 'absolute', alignItems: 'flex-start',
        left: 8, right: 8, bottom: 0,
        backgroundColor: colors["transparent-iron"],
        borderTopLeftRadius: BORDER_RADIUS,
        borderTopRightRadius: BORDER_RADIUS,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center', height: BUTTON_HEIGHT,
        paddingLeft: BUTTON_PADDING
    },
    iconAndTitleContainer: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 24,
        color: colors["limed-spruce"]
    }
});