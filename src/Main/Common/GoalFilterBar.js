/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'

import { SORT_BY_OPTIONS, CATEGORY_OPTIONS } from '../../Utils/Constants'
import { default_style, color } from '../../styles/basic'

const { width, height } = Dimensions.get('window')

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
        this.props.onMenuChange(type, value)
    }

    render() {
        const {
            filter: { sortBy, categories },
            buttonText,
        } = this.props
        const {} = this.props.filter
        const categoryText = categories
        const isCategorySelected = categories !== CATEGORY_OPTIONS[0].value

        return (
            <View style={styles.containerStyle}>
                <Menu
                    rendererProps={{
                        placement: 'bottom',
                        anchorStyle: styles.anchorStyle,
                    }}
                    renderer={renderers.SlideInMenu}
                >
                    <MenuTrigger
                        customStyles={{
                            TriggerTouchableComponent: TouchableOpacity,
                        }}
                    >
                        <View
                            style={[
                                styles.detailContainerStyle,
                                isCategorySelected
                                    ? styles.selectedContainerStyle
                                    : null,
                            ]}
                        >
                            <Text
                                style={{
                                    ...default_style.buttonText_1,
                                    fontWeight: isCategorySelected
                                        ? '700'
                                        : '500',
                                }}
                            >
                                {buttonText || 'Sort & Filter'}
                            </Text>
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        {/* SortBy Header */}
                        {sortBy && (
                            <View style={styles.sortByHeaderWrapper}>
                                <Text style={default_style.titleText_1}>
                                    Sort By
                                </Text>
                            </View>
                        )}
                        {/* SortBy Options */}
                        {sortBy && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    padding: 10 * default_style.uiScale,
                                }}
                            >
                                {SORT_BY_OPTIONS.map((option, i) => {
                                    const { value, text } = option
                                    const isSelected = sortBy === value
                                    return (
                                        <MenuOption
                                            key={option.text + i}
                                            onSelect={() =>
                                                this.handleOnMenuSelect(
                                                    'sortBy',
                                                    value
                                                )
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.sortByOptionWrapper,
                                                    isSelected
                                                        ? styles.selectedContainerStyle
                                                        : null,
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        ...default_style.normalText_1,
                                                        color: isSelected
                                                            ? '#333'
                                                            : '#828282',
                                                    }}
                                                >
                                                    {text}
                                                </Text>
                                            </View>
                                        </MenuOption>
                                    )
                                })}
                            </View>
                        )}

                        {/* Catrgory header */}
                        {categories && (
                            <View style={styles.categoryHeaderWrapper}>
                                <Text style={default_style.normalText_1}>
                                    Category
                                </Text>
                            </View>
                        )}
                        {/* Category Options */}
                        {categories && (
                            <FlatList
                                data={CATEGORY_OPTIONS}
                                renderItem={({ item: { value, text } }) => {
                                    return (
                                        <MenuOption
                                            onSelect={() =>
                                                this.handleOnMenuSelect(
                                                    'categories',
                                                    value
                                                )
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.categoryOptionWrapper
                                                }
                                            >
                                                <Text
                                                    style={
                                                        default_style.subTitleText_1
                                                    }
                                                >
                                                    {text}
                                                </Text>
                                                <RadioButton
                                                    isSelected={
                                                        categoryText === text
                                                    }
                                                    size={
                                                        10 *
                                                        default_style.uiScale
                                                    }
                                                    borderWidth={1}
                                                />
                                            </View>
                                        </MenuOption>
                                    )
                                }}
                                style={{ height: height / 3, paddingTop: 5 }}
                            />
                        )}
                    </MenuOptions>
                </Menu>
            </View>
        )
    }
}

const RadioButton = (props) => {
    const { isSelected, size, borderWidth } = props
    return (
        <View
            style={{
                height: size * 2,
                width: size * 2,
                borderRadius: size,
                borderWidth: borderWidth,
                borderColor: isSelected ? '#1B63DC' : '#B4BFC9',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    backgroundColor: isSelected ? '#1B63DC' : '',
                    height: size * 0.8,
                    width: size * 0.8,
                    borderRadius: size * 0.4,
                }}
            />
        </View>
    )
}

const styles = {
    containerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        padding: 16,
        paddingTop: 9,
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        height: 30 * default_style.uiScale,
        borderColor: '#E0E0E0',
        borderRadius: 15 * default_style.uiScale,
    },
    selectedContainerStyle: {
        borderColor: '#828282',
        backgroundColor: '#F2F2F2',
    },
    anchorStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    menuOptionsStyles: {
        optionsContainer: {
            width: width,
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        },
    },
    sortByHeaderWrapper: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0.1,
        padding: 16,
        paddingBottom: 14,
    },
    sortByOptionWrapper: {
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        margin: 2,
    },
    categoryHeaderWrapper: {
        backgroundColor: '#F2F2F2',
        padding: 8,
        paddingLeft: 16,
    },
    categoryOptionWrapper: {
        height: 34 * default_style.uiScale,
        paddingLeft: 16,
        paddingRight: 16,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}

export default GoalFilterBar
