import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

import { switchCase } from '../../redux/middleware/utils';

import {
    SORT_BY_OPTIONS,
    CATEGORY_OPTIONS
} from '../../Utils/Constants';
import { GM_FONT_FAMILY_2, GM_FONT_2, GM_FONT_FAMILY_1, GM_FONT_1 } from '../../styles';

const { SlideInMenu } = renderers;
const { width, height } = Dimensions.get('window');

/**
 * Update the filter based on parents functions
 * @param onMenuChange(type, value)
 * @param filter
 */
class GoalFilterBar extends Component {

    /**
     * @param type: ['sortBy', 'sortOrder', 'categories', 'priorities']
     */
    handleOnMenuSelect = (type, value) => {
        this.props.onMenuChange(type, value);
    }

    render() {
        const {
            sortBy,
            categories
        } = this.props.filter;
        const categoryText = categories;
        return (
            <View style={styles.containerStyle}>
                <Menu
                    rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
                    renderer={SlideInMenu}
                >
                    <MenuTrigger
                        customStyles={{
                            TriggerTouchableComponent: TouchableOpacity,
                        }}
                    >
                        <View style={styles.detailContainerStyle}>
                            <Text style={styles.textStyle}>Sort By</Text>
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        {/* SortBy Header */}
                        <View
                            style={{
                                backgroundColor: 'white',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 0.1,
                                padding: 16,
                                paddingBottom: 14
                            }}
                        >
                            <Text style={{
                                fontSize: GM_FONT_2,
                                fontFamily: GM_FONT_FAMILY_1,
                                color: '#3B414B'
                            }}>
                                Sort By
                            </Text>
                        </View>
                        {/* SortBy Options */}
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            padding: 10
                        }}>
                            {SORT_BY_OPTIONS.map((option) => {
                                const { value, text } = option;
                                return (
                                    <MenuOption onSelect={() => this.handleOnMenuSelect('sortBy', value)}>
                                        <View style={styles.sortByOptionWrapper}>
                                            <Text style={styles.optionText}>
                                                {text}
                                            </Text>
                                        </View>
                                    </MenuOption>
                                );
                            })}
                        </View>

                        {/* Catrgory header */}
                        <View
                            style={{
                                backgroundColor: '#F2F2F2',
                                padding: 8,
                                paddingLeft: 16
                            }}
                        >
                            <Text style={{
                                fontSize: GM_FONT_1,
                                fontFamily: GM_FONT_FAMILY_2,
                                fontWeight: 'bold',
                                color: '#3B414B'
                            }}>
                                Category
                            </Text>
                        </View>
                        {/* Category Options */}
                        <FlatList
                            data={CATEGORY_OPTIONS}
                            renderItem={({ item }) => {
                                const { value, text } = item;
                                return (
                                    <MenuOption onSelect={() => this.handleOnMenuSelect('categories', value)}>
                                        <View style={styles.categoryOptionWrapper}>
                                            <Text style={styles.categoryOptionText}>
                                                {text}
                                            </Text>
                                            <View style={{
                                                height: 20,
                                                width: 20,
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                borderColor: categoryText == text ? '#1B63DC' : '#B4BFC9',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <View style={{
                                                    backgroundColor: categoryText == text ? '#1B63DC' : '',
                                                    height: 8,
                                                    width: 8,
                                                    borderRadius: 4
                                                }}/>
                                            </View>
                                        </View>
                                    </MenuOption>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ height: height/3, paddingTop: 5 }}
                        />
                    </MenuOptions>
                </Menu>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        padding: 16,
        paddingTop: 9
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 100
    },
    textStyle: {
        fontSize: 15,
        fontFamily: GM_FONT_FAMILY_2,
        color: '#828282',
        fontWeight: '500',
    },
    standardTextStyle: {
        fontSize: 9,
        color: 'black'
    },
    caretStyle: {
        tintColor: '#696969',
        marginLeft: 5
    },
    anchorStyle: {
        backgroundColor: 'white'
    },
    menuOptionsStyles: {
        optionsContainer: {
            width: width
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        }
    },
    sortByOptionWrapper: {
        backgroundColor: '#F2F2F2',
        padding: 8,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 100,
        margin: 2
    },
    sortByOptionText: {
        color: '#828282',
        fontSize: GM_FONT_1,
        fontFamily: GM_FONT_FAMILY_2,
        fontWeight: '500'
    },
    categoryOptionWrapper: {
        height: 34,
        paddingLeft: 16,
        paddingRight: 16,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    categoryOptionText: {
        color: '#000',
        fontSize: GM_FONT_2,
        fontFamily: GM_FONT_FAMILY_2
    }
};

const switchSortByText = (sortBy) => switchCase({
    created: 'Date',
    updated: 'Updated',
    shared: 'Last Shared',
    priority: 'Priority'
})('created')(sortBy);

export default GoalFilterBar;
