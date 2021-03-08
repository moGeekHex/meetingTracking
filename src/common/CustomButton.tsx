import React, { ReactNode } from 'react';
import {
    StyleSheet, TouchableOpacity, Dimensions,
    ViewStyle, Image, View
} from 'react-native';
import { colors, Colors } from '../theme';
import { Icon } from 'react-native-elements';
import { Text } from './Text';

/**
 * interfaces and types
 */
export type IconType = | 'material'
    | 'material-community'
    | 'simple-line-icon'
    | 'zocial'
    | 'font-awesome'
    | 'octicon'
    | 'ionicon'
    | 'foundation'
    | 'evilicon'
    | 'entypo'
    | 'antdesign';

interface ButtonProps {
    title: string,
    onPress: () => void,
    disabled?: boolean,
    iconType: IconType
    iconName: string,
    iconColor?: Colors,
    iconSize?: number,
    style?: ViewStyle,

    /**
     * if image source provided,
     * icon props is useless
     */
    image: any,
    imageSize?: number
}

/**
 * The custom button that
 * contains touchable section and icon or image
 */
export const CustomButton = (props: ButtonProps) => {

    //grap props
    const { title, onPress, disabled,
        iconType, iconName, style: overrideStyle,
        iconColor, iconSize, imageSize, image } = props;

    //form style
    const backgroundColor: ViewStyle = {
        backgroundColor: disabled ?
            colors.disabled : colors.light
    };
    const containerStyle = [styles.btnContainer, backgroundColor, overrideStyle];

    return (
        <TouchableOpacity
            activeOpacity={1}
            disabled={disabled}
            onPress={onPress}
            style={containerStyle}
        >
            {image ? leftImage(image, imageSize)
                : leftBtnIcon(iconType, iconName, iconColor, iconSize)}
            <Text style={styles.btnTxt}>{title}</Text>
        </TouchableOpacity>
    )
}

/**
 * functions
 */
const leftImage = (imageSource: any,
    size: number | undefined) => {

    //get image size
    const imageSize = size || 24;

    return (
        <Image
            source={imageSource}
            resizeMode='contain'
            style={{ height: imageSize, width: imageSize }}
        />
    );
}

const leftBtnIcon = (iconType: IconType, iconName: string, iconColor: Colors | any, iconSize: number | any): ReactNode => {

    //get icon color
    const leftIconColor = iconColor ?
        colors[iconColor as Colors] : colors.orange;

    return (
        <View style={styles.iconContainer}>
            <Icon
                type={iconType}
                size={iconSize || 24}
                color={leftIconColor}
                name={iconName}
            />
        </View>
    );
}

/**
 * constnats
 */
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const BUTTON_HEIGHT = windowHeight * 0.09;

/**
 * styles
 */
const styles = StyleSheet.create({
    btnContainer: {
        zIndex: 9999,
        elevation: 5, flexDirection: "row",
        borderWidth: 1, width: windowWidth * 0.75,
        height: BUTTON_HEIGHT, borderColor: colors.iron,
        alignItems: 'center',
        borderRadius: 8, paddingLeft: 16, justifyContent: 'flex-start',
    },
    btnTxt: {
        fontSize: 16, paddingLeft: 16,
        color: colors["mid-gray"]
    },
    iconContainer: {
        flex: 0, alignItems: 'flex-start'
    }
});