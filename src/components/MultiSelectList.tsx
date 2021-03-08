import React from 'react';
import {
    View, StyleSheet, FlatList,
    Modal, TouchableOpacity, ViewStyle
} from 'react-native';
import { Text } from '../common/Text';
import { colors } from '../theme';
import { ListItem, Left, Icon, Body, Right } from 'native-base';
import { NoData } from '../common/NoData';
import filter from 'lodash/filter';

/**
 * interfaces and types
 */
interface MultiSelectListModalProps {
    visible: boolean;
    title: string;
    noDataTxt: string;
    data: Array<any>;
    selectedData: Array<any>;
    closeModal: () => void;
    getSelectedIds: (arrayOfIds: string[]) => void;
    id: string;
    name: string;

    addAllOption?: boolean;
}
interface MultiSelectListModalState {
    data: Array<any>;
    isAllSelected: boolean;
}

/**
 * A stateful component that returns a multi select list
 */
export class MultiSelectListModal extends React.Component
    <MultiSelectListModalProps, MultiSelectListModalState>{

    /**
     * locale state
     */
    state: MultiSelectListModalState = {
        data: [],
        isAllSelected: false
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
                        {this._renderFooter()}
                    </View>
                </View>
            </Modal>
        );
    }

    /**
     * life cycle
     */
    componentDidMount() {

        let data = this.props.data;

        if (this.props.addAllOption != undefined) {
            if (this.props.data.length != 0 && this.props.data[0][this.props.id] != ALL_OPTION) {
                data.unshift({
                    [this.props.id]: ALL_OPTION,
                    [this.props.name]: ALL_OPTION
                });
            }
        }

        const finalData: any = [];
        this.props.data.forEach((it: any) => {
            const foundIndex = this.props.selectedData.findIndex(selectedItId => selectedItId == it[this.props.id]);

            //if exist in selected items
            let obj = { ...it };
            if (foundIndex !== -1) {
                obj = {
                    ...obj, isSelected: true
                };
            }
            finalData.push(obj);
        });

        this.setState({ data: finalData });
    }

    /**
     * locale component functions
     */
    _renderFooter = () => {
        return (
            <View style={styles.footerStyle}>
                <View style={styles.internalFooter}>
                    <TouchableOpacity
                        onPress={this.props.closeModal}
                    >
                        <Text style={styles.footerTxt}>
                            {'Cancel'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._handleSubmitPress}
                    >
                        <Text style={styles.footerTxt}>
                            {'Submit'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _renderTitle = () => {
        return (
            <View style={styles.titleView}>
                <Text style={styles.titleTxt}>
                    {this.props.title}
                </Text>
            </View>
        );
    }

    _renderList = () => {
        return (
            this.state.data.length == 0 ?
                <NoData noDataText={this.props.noDataTxt} />
                :
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item) => `${item[this.props.id]}-key`}
                    renderItem={this._renderItem}
                />
        );
    }

    _renderItem = ({ item, index }: { item: any, index: number }) => {

        //constants
        /**
         * 0 means All
         */
        const isItemDisbaled = this.state.isAllSelected == true && item[this.props.id] != ALL_OPTION;
        const listItemBackgroundColor: ViewStyle = {
            backgroundColor: isItemDisbaled ? colors['light-disabled'] : undefined
        };

        return (
            <ListItem
                noIndent
                disabled={isItemDisbaled}
                style={{ ...listItemBackgroundColor }}
                onPress={() => this._selectItem(index)}
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

                {this._isItemSelected(item) && <Right>
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
    // _isAllItemSelected=()=>{

    // }

    _isItemSelected = (item: any) => {
        if (item.isSelected || this.state.isAllSelected)
            return true;

        return false;
    }

    _selectItem = (itemIndex: number) => {
        this.setState(state => {
            const clonedItems = [...state.data];

            const isItemSelected = clonedItems[itemIndex].isSelected;
            clonedItems[itemIndex] = {
                ...clonedItems[itemIndex],
                isSelected: !isItemSelected
            };

            //for All option
            if (itemIndex == 0) {
                const isAllOptionSelected = clonedItems[itemIndex].isSelected;
                return { data: clonedItems, isAllSelected: isAllOptionSelected == true };
            }
            return { data: clonedItems };
        });
    }

    _handleSubmitPress = () => {

        //all data with 'all' option;
        let arrayOfSelectedIds: any = filter(this.state.data, { isSelected: true });

        if (this.state.isAllSelected) {

            /**
             * if 'All' option sele cted should return all data in array
             * without 'All' option.
             * 
             * props not state to ensure data is not changed
             */
            arrayOfSelectedIds = this.props.data.slice(1);


        }

        //return only ids
        this.props.getSelectedIds(arrayOfSelectedIds.map((it: any) => it[this.props.id]));
        this.props.closeModal();

    }

}

/**
 * constants
 */
const INTERNAL_CONTAINER_HEIGHT = '75%';
const INTERNAL_CONTAINER_WIDTH = '90%';
const ALL_OPTION = 'ALL';

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors['cloud-transparent'],
        justifyContent: 'center'
    },
    titleView: {
        height: 50, justifyContent: 'center', paddingLeft: 16,
        alignItems: 'center',
        borderBottomWidth: 1, borderColor: colors["mid-gray"]
    },
    titleTxt: {
        fontSize: 16, color: colors.dark,
        fontWeight: 'bold'
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
    footerStyle: {
        height: 50, justifyContent: 'center',
        alignItems: 'flex-end', paddingRight: 16,
        borderTopWidth: 1, borderColor: colors["mid-gray"]
    },
    internalFooter: {
        width: '50%', flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footerTxt: {
        fontSize: 14, color: colors.dark
    },
    checkIconStyle: {
        color: colors.orange, fontSize: 20
    }
});