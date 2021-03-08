import React from 'react';
import {
    View, StyleSheet, FlatList, Modal,
    TouchableOpacity
} from 'react-native';
import { Text } from '../common/Text';
import { colors } from '../theme';
import { ListItem, Left, Icon, Body, Right } from 'native-base';
import { NoData } from '../common/NoData';

/**
 * interfaces and types
 */
interface SingleSelectListModalProps {
    visible: boolean,
    title: string,
    noDataTxt: string,
    items: Array<any>,
    closeModal: () => void,
    getSelectedItem: (selectedItem: any) => void,
    id: string,
    name: string
}
interface SingleSelectListModalState {
    items: Array<any>,
    selectedItemId: string | null
}

/**
 * A stateful component that returns a multi select list
 */
export class SingleSelectListModal extends React.Component
    <SingleSelectListModalProps, SingleSelectListModalState>{

    /**
     * locale state
     */
    state: SingleSelectListModalState = {
        items: [],
        selectedItemId: null
    };

    /**
     * render function
     */
    render() {
        return (
            <Modal
                visible={this.props.visible}
                transparent
                onRequestClose={this.props.closeModal}
            >
                <View style={styles.container}>
                    <View style={styles.internalContainer}>
                        {this._renderTitle()}
                        {this._renderList()}
                    </View>
                </View>
            </Modal>
        );
    }

    /**
     * life cycle
     */
    componentDidMount() {
        this.setState({ items: this.props.items });
    }

    /**
     * locale component functions
     */
    _renderTitle = () => {
        return (
            <View style={styles.titleView}>
                <Left style={styles.flex}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.closeIcnContainer}
                        onPress={this.props.closeModal}
                    >
                        <Icon
                            type='FontAwesome'
                            name='close'
                            style={styles.closeIcn}
                        />
                    </TouchableOpacity>
                </Left>

                <Body style={styles.titleBody}>
                    <Text style={styles.titleTxt}>
                        {this.props.title}
                    </Text>
                </Body>

                <Right style={styles.flex}>
                </Right>
            </View>
        );
    }

    _renderList = () => {
        return (
            this.state.items.length == 0 ?
                <NoData noDataText={this.props.noDataTxt} />
                :
                <FlatList
                    data={this.state.items}
                    keyExtractor={(item) => `${item[this.props.id]}-key`}
                    renderItem={this._renderItem}
                />
        );
    }

    _renderItem = ({ item, index }: { item: any, index: number }) => {

        //grap data
        const { selectedItemId } = this.state;

        //constants
        const itemId = item[this.props.id];
        const isItemSelected = item.isSelected && itemId === selectedItemId;

        return (
            <ListItem
                onPress={() => this._selectItem(index, item)}
                iconRight={true}
                icon>
                <Left>
                    <Icon
                        type='Ionicons'
                        name='md-person'
                        style={styles.iconPerson}
                    />
                </Left>

                <Body>
                    <Text style={styles.textBodyStyle}>
                        {item[this.props.name]}
                    </Text>
                </Body>

                {isItemSelected && <Right>
                    <Icon
                        type='MaterialCommunityIcons'
                        name='checkbox-marked-circle'
                        style={styles.checkIconStyle}
                    />
                </Right>}
            </ListItem>
        );
    }

    /**
     * locale functions
     */
    _selectItem = (itemIndex: number, item: any) => {
        this.setState(state => {
            const clonedItems = [...state.items];

            //constants
            const isItemSelected = clonedItems[itemIndex].isSelected;
            const itemId = clonedItems[itemIndex][this.props.id];
            clonedItems[itemIndex] = {
                ...clonedItems[itemIndex],
                isSelected: !isItemSelected
            };

            return {
                items: clonedItems,
                selectedItemId: itemId
            };
        }, () => {
            this.props.closeModal();
            this.props.getSelectedItem(item);
        });
    }

}

/**
 * constants
 */
const INTERNAL_CONTAINER_HEIGHT = '75%';
const INTERNAL_CONTAINER_WIDTH = '90%';

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors['cloud-transparent'],
        justifyContent: 'center'
    },
    titleView: {
        flexDirection: 'row',
        height: 50, alignItems: 'center',
        borderBottomWidth: 1, borderColor: colors["mid-gray"]
    },
    titleTxt: {
        fontSize: 16, color: colors.dark,
        fontWeight: 'bold', textAlign: 'center'
    },
    internalContainer: {
        backgroundColor: colors.light,
        height: INTERNAL_CONTAINER_HEIGHT, width: INTERNAL_CONTAINER_WIDTH,
        alignSelf: 'center', borderRadius: 8
    },
    iconPerson: {
        color: colors.orange,
        fontSize: 20
    },
    textBodyStyle: {
        color: colors["mid-gray"], fontSize: 18,
        fontWeight: 'normal', textAlign: 'left',
    },
    checkIconStyle: {
        color: colors.orange, fontSize: 20
    },
    flex: { flex: 1 },
    closeIcn: {
        fontSize: 20, color: colors.dark
    },
    closeIcnContainer: {
        paddingLeft: 16,
        justifyContent: 'center',
    },
    titleBody: { flex: 2 }
});