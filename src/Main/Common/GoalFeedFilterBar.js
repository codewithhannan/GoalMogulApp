/** @format */

import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'

/* asset */
import dropDown from '../../asset/utils/dropDown.png'

import { switchCase } from '../../redux/middleware/utils'

const { Popover } = renderers
const { width } = Dimensions.get('window')

/**
 * Update the filter based on parents functions
 * @param onMenuChange(type, value)
 * @param filter
 */
class GoalFeedFilterBar extends Component {
    /**
     * @param type: ['sortBy', 'sortOrder', 'categories', 'priorities']
     */
    handleOnMenuSelect = (type, value) => {
        this.props.onMenuChange(type, value)
    }

    render() {
        const {
            containerStyle,
            textStyle,
            detailContainerStyle,
            caretStyle,
        } = styles

        const { categories } = this.props.filter

        const categoryText = categories

        return (
            <View style={containerStyle}>
                <View style={{ flex: 1 }}>
                    <Menu
                        onSelect={(value) =>
                            this.handleOnMenuSelect('categories', value)
                        }
                        rendererProps={{ placement: 'bottom' }}
                        renderer={Popover}
                    >
                        <MenuTrigger
                            customStyles={{
                                TriggerTouchableComponent: TouchableOpacity,
                            }}
                        >
                            <View style={detailContainerStyle}>
                                <Text
                                    style={textStyle}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    Category ({`${categoryText}`})
                                    {/* <Text style={standardTextStyle}> (ALL)</Text> */}
                                </Text>
                                <Image style={caretStyle} source={dropDown} />
                            </View>
                        </MenuTrigger>
                        <MenuOptions customStyles={styles.menuOptionsStyles}>
                            <MenuOption text="All" value="All" />
                            <MenuOption text="General" value="General" />
                            <MenuOption
                                text="Learning/Education"
                                value="Learning/Education"
                            />
                            <MenuOption
                                text="Career/Business"
                                value="Career/Business"
                            />
                            <MenuOption text="Financial" value="Financial" />
                            <MenuOption text="Spiritual" value="Spiritual" />
                            <MenuOption
                                text="Family/Personal"
                                value="Family/Personal"
                            />
                            <MenuOption text="Physical" value="Physical" />
                            <MenuOption
                                text="Charity/Philanthropy"
                                value="Charity/Philanthropy"
                            />
                            <MenuOption text="Travel" value="Travel" />
                            <MenuOption text="Things" value="Things" />
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        )
    }
}

const touchableOpacityProps = {
    activeOpacity: 0.6,
}

const styles = {
    containerStyle: {
        marginLeft: 5,
        marginRight: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginLeft: 15,
        paddingTop: 12,
        paddingBottom: 12,
    },
    textStyle: {
        fontSize: 10,
        // color: '#1fb6dd',
        color: '#696969',
        fontWeight: '600',
    },
    standardTextStyle: {
        fontSize: 9,
        color: 'black',
    },
    caretStyle: {
        // tintColor: '#20485f',
        tintColor: '#696969',
        marginLeft: 5,
    },
    anchorStyle: {
        backgroundColor: 'white',
    },
    menuOptionsStyles: {
        optionsContainer: {
            width: width - 14,
        },
        optionsWrapper: {},
        optionWrapper: {
            flex: 1,
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        },
        optionText: {
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            color: 'black',
        },
    },
}

export default GoalFeedFilterBar
