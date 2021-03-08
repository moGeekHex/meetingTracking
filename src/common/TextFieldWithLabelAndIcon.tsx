import React from 'react';
import { Item, Icon, Input, } from 'native-base';
import { Text } from './Text';
import { StyleSheet, Dimensions, TouchableOpacity, View, ViewStyle, TextStyle, ReturnKeyType } from 'react-native';
import { colors, Colors } from '../theme';

/**
 * interfaces and types
 */
type NativeBaseIconType = "AntDesign" |
    "Entypo" | "EvilIcons" |
    "Feather" | "FontAwesome" |
    "FontAwesome5" | "Foundation" |
    "Ionicons" | "MaterialCommunityIcons" |
    "MaterialIcons" | "Octicons" |
    "SimpleLineIcons" | "Zocial";
interface TextFieldWithLabelAndIconProps {
    onChangeText?: (text: string) => void;
    label: string;
    value: string;
    placeholder?: string;
    onPress?: () => void;
    disabled?: boolean;
    containerStyle?: ViewStyle;
    inputRef?: any;
    onSubmitEditing?: () => void;
    textFieldContainerStyle?: ViewStyle;
    textStyle?: TextStyle;
    labelStyle?: TextStyle;

    /**
     * icon props
     */
    iconName?: string;
    iconType?: NativeBaseIconType;
    iconColor?: Colors;
    noIcon?: boolean;
    returnKeyType?: ReturnKeyType;
}

/**
 * A stateful component 
 * user for custom textinput, or simply
 * a custom label
 */
export class TextFieldWithLabelAndIcon extends React.Component<TextFieldWithLabelAndIconProps>
{
    /**
     * render function
     */
    render() {
        return (
            <TouchableOpacity
                style={this.props.containerStyle}
                disabled={this.props.disabled}
                activeOpacity={1}
                onPress={this.props.onPress}
            >
                <View
                    pointerEvents={this.props.onPress ? 'none' : undefined}
                >
                    <Item style={[styles.itemsStyle, this.props.textFieldContainerStyle]}>

                        <Text style={[styles.label, this.props.labelStyle]}>
                            {this.props.label}
                        </Text>

                        <Input
                            returnKeyType={this.props.returnKeyType}
                            ref={this.props.inputRef}
                            disabled={this.props.disabled}
                            placeholderTextColor={colors.dark}
                            placeholder={this.props.placeholder}
                            style={[styles.textInputStyle, this.props.textStyle]}
                            value={this.props.value}
                            onChangeText={this.props.onChangeText}
                            onSubmitEditing={this.props.onSubmitEditing}
                        />
                        {this._renderIcn()}
                    </Item>
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * locale component functions
     */
    _renderIcn = () => {

        if (this.props.noIcon)
            return undefined;

        //grap props
        const { iconColor = colors["mid-gray"], iconName,
            iconType } = this.props;

        return (
            <Icon
                name={iconName}
                type={iconType}
                style={{ color: iconColor, fontSize: 18 }}
                active
            />
        );
    }

    /**
     * locale functions
     */
    _getValue = () => {
        if (typeof (this.props.value) == 'string')
            return this.props.value;
        else this.props.value.toString();
    }
}

/**
 * constants
 */
const { width: windowWidth } = Dimensions.get('window');
export const INPUT_WIDTH = windowWidth * 0.75;

/**
 * styles
 */
const styles = StyleSheet.create({
    itemsStyle: {
        height: 50, width: INPUT_WIDTH,
        alignSelf: 'center', backgroundColor: colors.light,
        borderRadius: 16, paddingLeft: 8, alignItems: 'center'
    },
    label: {
        fontSize: 18, color: colors["mid-gray"]
    },
    textInputStyle: { fontSize: 18, color: colors.dark }
});