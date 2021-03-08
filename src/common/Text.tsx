import React, { ReactChildren } from 'react';
import {
    Text as ReactNativeText, TextStyle,
    StyleSheet
} from 'react-native';
import { colors, fontFamilies } from '../theme';

/**
 * interfaces and types
 */
interface TextProps {
    style?: TextStyle | TextStyle[] | any;
    children: any;
    numberOfLines?: number;
    lineBreakMode?: 'clip' | 'head' | 'middle' | 'tail';
}

/**
 * The text component
 */
export const Text = (props: TextProps) => {

    //grap props
    const { style: overrideStyle, numberOfLines, lineBreakMode } = props;

    //form style
    const style = [styles.textStyle, overrideStyle];

    return (<ReactNativeText
        lineBreakMode={lineBreakMode}
        numberOfLines={numberOfLines}
        style={style}>
        {props.children}
    </ReactNativeText>);

}

/**
 * styles
 */
const styles = StyleSheet.create({
    textStyle: {
        fontSize: 14,
        color: colors.thunder,
        fontFamily: fontFamilies.primary
    }
});