import React from 'react';
import { Dialog } from 'react-native-simple-dialogs';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { Text } from '../common/Text';

/**
 * interfaces and types
 */
interface DialogInputProps {
    isDialogVisible: boolean;
    title: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    onSubmit: () => void;

    closeDialog?: () => void;
}

/**
 * A stateless component that show a dialog input
 */
export const DialogInput = (props: DialogInputProps) => {

    //grap props
    const { isDialogVisible, onChangeText, closeDialog,
        title, value, placeholder, onSubmit } = props;

    return (
        <Dialog
            visible={isDialogVisible}
            title={title}
            onTouchOutside={() => closeDialog ? closeDialog() : {}}
        >
            <View style={styles.container}>

                <TextInput
                    inlineImagePadding={0}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    value={value}
                    style={styles.textInput}
                />

                <View style={styles.buttons}>
                    <TouchableOpacity
                        disabled={value.length == 0}
                        activeOpacity={1}
                        style={styles.button}
                        onPress={() => onSubmit()}
                    >
                        <Text style={[styles.btnTxt,
                        { color: value.length == 0 ? colors.disabled : colors.orange }]}>
                            {'Submit'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.button}
                        onPress={closeDialog ? () => closeDialog() : undefined}
                    >
                        <Text style={styles.btnTxt}>
                            {'Cancel'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Dialog>
    );
}

/**
 * styles
 */
const styles = StyleSheet.create({
    textInput: {
        borderBottomWidth: 0.5, width: '85%'
    },
    container: {
        backgroundColor: colors.light, alignItems: 'center'
    },
    btnTxt: {
        color: colors.orange, fontSize: 14,
        width: '100%', height: '100%'
    },
    button: {
        marginTop: 16, height: 50
    },
    buttons: {
        width: '100%', justifyContent: 'space-between',
        flexDirection: 'row', alignItems: 'center'
    }
});