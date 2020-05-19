import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

import {
    SORT_BY_OPTIONS,
    CATEGORY_OPTIONS
} from '../../Utils/Constants';
import { DEFAULT_STYLE, BACKGROUND_COLOR } from '../../styles';


const { width, height } = Dimensions.get('window');
const CATEGORY_OPTION_HEIGHT = 34;

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
        const isCategorySelected = categories !== CATEGORY_OPTIONS[0].value;

        return (
            <View style={styles.containerStyle}>
                <Menu
                    rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
                    renderer={renderers.SlideInMenu}
                >
                    <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
                        <View style={[
                            styles.detailContainerStyle,
                            isCategorySelected ? styles.selectedContainerStyle : null
                        ]}>
                            <Text style={{
                                ...DEFAULT_STYLE.buttonText_1,
                                fontWeight: isCategorySelected ? '700' : '500'
                            }}>
                                Sort &amp; Filter
                            </Text>
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        {/* SortBy Header */}
                        <View style={styles.sortByHeaderWrapper}>
                            <Text style={DEFAULT_STYLE.titleText_1}>Sort By</Text>
                        </View>
                        {/* SortBy Options */}
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            padding: 10
                        }}>
                            {SORT_BY_OPTIONS.map((option) => {
                                const { value, text } = option;
                                const isSelected = sortBy === value;
                                return (
                                    <MenuOption onSelect={() => this.handleOnMenuSelect('sortBy', value)}>
                                        <View style={[
                                            styles.sortByOptionWrapper,
                                            isSelected ? styles.selectedContainerStyle : null
                                        ]}>
                                            <Text style={{
                                                ...DEFAULT_STYLE.normalText_1,
                                                color: isSelected ? '#333' : '#828282'
                                            }}>
                                                {text}
                                            </Text>
                                        </View>
                                    </MenuOption>
                                );
                            })}
                        </View>

                        {/* Catrgory header */}
                        <View style={styles.categoryHeaderWrapper}>
                            <Text style={DEFAULT_STYLE.normalText_1}>Category</Text>
                        </View>
                        {/* Category Options */}
                        <FlatList
                            data={CATEGORY_OPTIONS}
                            renderItem={({ item }) => {
                                const { value, text } = item;
                                return (
                                    <MenuOption onSelect={() => this.handleOnMenuSelect('categories', value)}>
                                        <View style={styles.categoryOptionWrapper}>
                                            <Text style={DEFAULT_STYLE.subTitleText_1}>
                                                {text}
                                            </Text>
                                            <RadioButton
                                                isSelected={categoryText === text}
                                                radius={10}
                                                borderWidth={1}
                                            />
                                        </View>
                                    </MenuOption>
                                );
                            }}
                            style={{ height: height/3, paddingTop: 5 }}
                        />
                    </MenuOptions>
                </Menu>
            </View>
        );
    }
}

const RadioButton = (props) => {
    const { isSelected, radius, borderWidth } = props
    return (
        <View style={{
            height: radius*2,
            width: radius*2,
            borderRadius: radius,
            borderWidth: borderWidth,
            borderColor: isSelected ? '#1B63DC' : '#B4BFC9',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{
                backgroundColor: isSelected ? '#1B63DC' : '',
                height: radius*0.8,
                width: radius*0.8,
                borderRadius: radius*0.4
            }}/>
        </View>
    );
}

const styles = {
    containerStyle: {
        backgroundColor: BACKGROUND_COLOR,
        padding: 16,
        paddingTop: 9
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        height: 30 * DEFAULT_STYLE.uiScale,
        borderColor: '#E0E0E0',
        borderRadius: 15 * DEFAULT_STYLE.uiScale
    },
    selectedContainerStyle: {
        borderColor: '#828282',
        backgroundColor: '#F2F2F2'
    },
    anchorStyle: {
        backgroundColor: BACKGROUND_COLOR
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
    sortByHeaderWrapper: {
        backgroundColor: BACKGROUND_COLOR,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0.1,
        padding: 16,
        paddingBottom: 14
    },
    sortByOptionWrapper: {
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        margin: 2
    },
    categoryHeaderWrapper: {
        backgroundColor: '#F2F2F2',
        padding: 8,
        paddingLeft: 16
    },
    categoryOptionWrapper: {
        height: CATEGORY_OPTION_HEIGHT,
        paddingLeft: 16,
        paddingRight: 16,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
};

export default GoalFilterBar;
