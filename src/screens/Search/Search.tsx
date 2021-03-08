import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { Text } from '../../common/Text';

/**
 * interfaces and types
 */
interface SearchScreenProps {

}
interface SearchScreenState {

}

/**
 * A stateful component thar retuens search screen
 */
export class SearchScreen extends React.Component
    <SearchScreenProps, SearchScreenState>
{

    /**
     * locale state
     */
    state = {

    };

    /**
     * render function
     */
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {'welcome to search screen'}
                </Text>
            </View>
        );
    }
}

/**
 * styles
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.light },
    title: { fontSize: 40, textAlign: 'center' }
});