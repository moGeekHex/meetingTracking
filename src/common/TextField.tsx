import React from 'react';
import {
    TextInput, TextStyle, ViewStyle,
    StyleSheet,
    KeyboardType,
    ReturnKeyType
} from 'react-native';
import { colors } from '../theme';
import { View } from 'native-base';
import { Text } from './Text';

/**
 * interfaces and types
 */

/**
 * The TextFieldModes that conatins
 *  1- withLabel: without place holder and have a fixed label above it
 *  2- normal: just a normal text field with placeholder
 */
type TextFieldModes = 'withLabel' | 'normal' | 'withLabelAndIcon'
interface TextFieldProps {
    mode?: TextFieldModes,

    /**
     * label, label style, and textFieldWithLabelContainer
     * useful only if 'withLabel' or 'withLabelAndIcon' mode activiated
     */
    label?: string
    labelStyle?: TextStyle
    textFieldWithLabelContainer?: ViewStyle

    textStyle?: TextStyle,
    textFieldContainerStyle?: ViewStyle,

    /**
     * placeholder is useless if 'withLabel'|'withLabelAndIcon'
     *  mode activiated
     */
    placeholder?: string,

    onChangeText?: (text: string) => void,
    value: string,
    onSubmitEditing?: () => void,
    inputRef?: any,
    keyboardType?: KeyboardType,
    returnKeyType?: ReturnKeyType,
    secureTextEntry?: boolean,
    numberOfLines?: number,
    multiline?: boolean,
    editable?: boolean,
    placeholderTextColor?: string
}

/**
 * The text field component
 */
export class TextField extends React.Component<TextFieldProps>
{

    /**
     * render function
     */
    render() {
        const { mode = 'normal' } = this.props;

        if (mode == 'normal') { return this._renderTextField(); }
        else if (mode == 'withLabel') {
            return this._renderTextFieldWithLabel();
        }
        else if (mode == 'withLabelAndIcon') {
            return this._renderTextFieldWithLabelAndIcon();
        }
    }

    /**
     * locale component functions
     */
    _renderTextFieldWithLabelAndIcon = () => {
        //grap props
        const { label, labelStyle,
            textFieldWithLabelContainer: overrideStyle } = this.props;

        //form styles
        const labelTextStyle = [styles.textFieldWithLabelTxt, labelStyle];
        const containerStyle = [styles.textFieldWithLabelContainer, overrideStyle];

        return (
            <View style={containerStyle}>
                <Text style={labelTextStyle}>
                    {label}
                </Text>
                {this._renderTextField()}
            </View>
        );
    }

    _renderTextFieldWithLabel = () => {

        //grap props
        const { label, labelStyle,
            textFieldWithLabelContainer: overrideStyle } = this.props;

        //form styles
        const labelTextStyle = [styles.textFieldWithLabelTxt, labelStyle];
        const containerStyle = [styles.textFieldWithLabelContainer, overrideStyle];

        return (
            <View style={containerStyle}>
                <Text style={labelTextStyle}>
                    {label}
                </Text>
                {this._renderTextField()}
            </View>
        );
    }

    _renderTextField = () => {
        //grap props
        const { textFieldContainerStyle, textStyle,
            value, onChangeText, placeholder, onSubmitEditing,
            inputRef, keyboardType, returnKeyType, secureTextEntry,
            numberOfLines, multiline, editable, placeholderTextColor } = this.props;

        //form styles
        const containerStyle = [styles.containerStyle, textFieldContainerStyle];
        const textStyleArray = [textStyle];

        return (
            <View style={containerStyle}>
                <TextInput
                    placeholderTextColor={placeholderTextColor}
                    style={textStyleArray}
                    multiline={multiline}
                    secureTextEntry={secureTextEntry}
                    returnKeyType={returnKeyType}
                    keyboardType={keyboardType}
                    ref={inputRef}
                    numberOfLines={numberOfLines}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmitEditing}
                    editable={editable}
                />
            </View>
        );
    }

}

/**
 * constnats
 */
export const TEXTFIELD_HEIGHT = 50;

/**
 * styles
 */
const styles = StyleSheet.create({
    containerStyle: {
        height: TEXTFIELD_HEIGHT,
        backgroundColor: colors.light,
        justifyContent: 'center',
        paddingLeft: 16
    },
    textFieldWithLabelContainer: {
        height: TEXTFIELD_HEIGHT + (TEXTFIELD_HEIGHT * 0.75)
    },
    textFieldWithLabelTxt: {
        fontSize: 16, marginBottom: 8,
        color: colors.iron
    }
});