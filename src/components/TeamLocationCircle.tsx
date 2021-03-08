import React from 'react';
import {
    View, StyleSheet, TouchableOpacity
} from 'react-native';
import { Text } from '../common/Text';
import { Avatar } from 'react-native-elements';
import { colors } from '../theme';

/**
 * interfaces and types
 */
interface TeamLocationCircleProps {
    title: string;
    subtitle?: string;
    onPress?: () => void;
}

/**
 * A stateless component that shows a circle team location
 */
export const TeamLocationCircle = (props: TeamLocationCircleProps) => {

    //grap props
    const { title, subtitle, onPress } = props;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
            >
                <View style={styles.infoContainer}>
                    <Avatar
                        rounded
                        source={require('../images/logo.png')}
                        size='medium'
                        avatarStyle={styles.avatarStyle}
                        containerStyle={styles.containerStyle}
                    />

                    <Text
                        lineBreakMode={'tail'}
                        numberOfLines={1}
                        style={styles.infoTxt}>
                        {title}
                    </Text>

                    {subtitle ? <Text
                        lineBreakMode={'tail'}
                        numberOfLines={1}
                        style={styles.infoTxt}>
                        {subtitle}
                    </Text> : null}

                </View>
            </TouchableOpacity>
        </View>
    );
}

/**
 * contants
 */
const AVATAR_SIZE = 50;
const TEAM_LOCATION_CIRCLE_WIDTH = AVATAR_SIZE * 3;

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        width: TEAM_LOCATION_CIRCLE_WIDTH
    },
    infoContainer: {
        elevation: 5, borderWidth: 1, borderColor: colors.light,
        borderTopRightRadius: 8, borderBottomRightRadius: 8,
        paddingVertical: 8, justifyContent: 'center', backgroundColor: colors.light,
        borderRadius: AVATAR_SIZE / 2, overflow: 'hidden'
    },
    infoTxt: {
        fontWeight: 'normal', fontSize: 10,
        width: TEAM_LOCATION_CIRCLE_WIDTH * 0.95,
        color: colors.dark, paddingLeft: AVATAR_SIZE
    },
    containerStyle: {
        position: 'absolute', borderWidth: 3,
        borderColor: colors.light,
        zIndex: 9,
    },
    avatarStyle: {
        resizeMode: 'contain'
    }
});