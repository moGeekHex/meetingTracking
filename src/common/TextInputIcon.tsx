import React from 'react';
import { Item, Input } from 'native-base';
import { Icon } from 'react-native-elements';
import { Colors, colors } from '../theme';
import { TextStyle, ViewStyle, KeyboardType, ReturnKeyType } from 'react-native';

/**
 * interfaces and types
 */
interface TextInputProps {

    /**
     * icon props
     */
    iconName: string,
    iconType:
    'material'
    | 'material-community'
    | 'simple-line-icon'
    | 'zocial'
    | 'font-awesome'
    | 'octicon'
    | 'ionicon'
    | 'foundation'
    | 'evilicon'
    | 'entypo'
    | 'antdesign',
    iconColor: Colors,
    iconSize?: number,

    /**
     * other props
     */
    value: string,
    textStyle: TextStyle,
    placeholderTextColor: Colors,
    containerStyle?: ViewStyle,
    placeholder: string,
    secureTextEntry?: boolean,
    keyboardType?: KeyboardType,
    inputRef?: any,
    returnKeyType: ReturnKeyType,

    /**
     * callbacks
     */
    onChangeText: (text: string) => void,
    onSubmitEditing?: () => void
}

/**
 * A stateless component that
 * returns a text input with icon
 */
export const TextInput = (props: TextInputProps) => {

    //grap props
    const { iconName, iconColor, iconType,
        value, textStyle, placeholderTextColor,
        iconSize = 24, containerStyle, placeholder,
        secureTextEntry = false, keyboardType = 'default',
        onChangeText, inputRef, onSubmitEditing,
        returnKeyType } = props;

    return (
        <Item style={containerStyle}>
            <Icon
                color={colors[iconColor]}
                name={iconName}
                type={iconType}
                size={iconSize}
            />
            <Input
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                onChangeText={onChangeText}
                ref={inputRef}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={textStyle}
                placeholderTextColor={colors[placeholderTextColor]}
                placeholder={placeholder}
                value={value}
            />
        </Item>
    );
}
