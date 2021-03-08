import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spinner } from 'native-base';
import { Colors, colors } from '../theme';

/**
 * interfaces and types 
 */
interface LoadingProps {
    color?: Colors,
    overlay?: boolean,
    style?: ViewStyle,
    transparent?: boolean
}

/**
 * The loading screen
 * @param props 
 */
export const Loading = (props: LoadingProps) => {
    //grap props
    const { color = colors.dark, overlay, style, transparent } = props;

    //form styles
    const transparentBackground = transparent ? styles.transparentBackground : {};
    const loadingStyle = overlay ?
        [styles.overlay, style, transparentBackground] :
        [styles.conatiner, style, transparentBackground];
    return (
        <View style={loadingStyle}>
            <Spinner size='large' color={color} />
        </View>
    );
}

/**
 * styles
 */
const styles = StyleSheet.create({
    conatiner: {
        flex: 1, alignItems: "center",
        justifyContent: "center"
    },
    overlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors['transparent-iron'],
        zIndex: 1, justifyContent: 'center',
        alignItems: 'center',
    },
    transparentBackground: { backgroundColor: colors.transparent }
});