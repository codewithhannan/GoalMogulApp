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
import { connect } from 'react-redux'

/* asset */
import dropDown from '../../asset/utils/dropDown.png'

// actions
import { searchChangeFilter } from '../../actions'

const { width } = Dimensions.get('window')
const { Popover } = renderers

const DEBUG_KEY = '[ Component SearchFilterBar ]'

class SearchFilterBar extends Component {
    handleOnMenuSelect = (type, value) => {
        console.log(`${DEBUG_KEY} filter by type: ${type} with value: ${value}`)
        this.props.searchChangeFilter(type, value)
    }

    render() {
        const {
            containerStyle,
            textStyle,
            detailContainerStyle,
            standardTextStyle,
            caretStyle,
        } = styles
        return (
            <View style={containerStyle}>
                <Menu
                    onSelect={(value) =>
                        this.handleOnMenuSelect('sortBy', value)
                    }
                    rendererProps={{
                        placement: 'bottom',
                        anchorStyle: styles.anchorStyle,
                    }}
                    renderer={Popover}
                >
                    <MenuTrigger
                        customStyles={{
                            TriggerTouchableComponent: TouchableOpacity,
                        }}
                    >
                        <View style={styles.detailContainerStyle}>
                            <Text style={styles.textStyle}>Sort by</Text>
                            <Image
                                style={styles.caretStyle}
                                source={dropDown}
                            />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        <MenuOption text="Important" value="important" />
                        <MenuOption text="Recent" value="recent" />
                        <MenuOption text="Popular" value="popular" />
                    </MenuOptions>
                </Menu>

                <Menu
                    onSelect={(value) =>
                        this.handleOnMenuSelect('category', value)
                    }
                    rendererProps={{
                        placement: 'bottom',
                        anchorStyle: styles.anchorStyle,
                    }}
                    renderer={Popover}
                >
                    <MenuTrigger
                        customStyles={{
                            TriggerTouchableComponent: TouchableOpacity,
                        }}
                    >
                        <View style={detailContainerStyle}>
                            <Text style={textStyle}>
                                Category
                                {/* <Text style={standardTextStyle}> (ALL)</Text> */}
                            </Text>
                            <Image style={caretStyle} source={dropDown} />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        <MenuOption text="People" value="people" />
                        <MenuOption text="Tribe" value="tribe" />
                        <MenuOption text="Event" value="event" />
                    </MenuOptions>
                </Menu>
            </View>
        )
    }
}

const touchableOpacityProps = {
    activeOpacity: 0.6,
}

const styles = {
    containerStyle: {
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
        color: '#1fb6dd',
        fontWeight: '600',
    },
    standardTextStyle: {
        fontSize: 9,
        color: 'black',
    },
    caretStyle: {
        tintColor: '#20485f',
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
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 10,
            paddingRight: 10,
            color: 'black',
        },
    },
}

export default connect(null, { searchChangeFilter })(SearchFilterBar)
