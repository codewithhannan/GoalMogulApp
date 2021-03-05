/** @format */

import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'

/* asset */
import dropDown from '../../../asset/utils/dropDown.png'

// Actions
import { meetChangeFilter } from '../../../actions'

const { width } = Dimensions.get('window')
const { Popover } = renderers

class FriendsFilterbar extends Component {
    handleOnMenuSelect(type, value) {
        this.props.meetChangeFilter('friends', type, value)
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
                        <View style={detailContainerStyle}>
                            <Text style={textStyle}>Sort by</Text>
                            <Image style={caretStyle} source={dropDown} />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        <MenuOption text="Alphabetical" value="alphabetical" />
                        <MenuOption text="Last added" value="lastadded" />
                    </MenuOptions>
                </Menu>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginLeft: 15,
    },
    textStyle: {
        fontSize: 9,
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

export default connect(null, {
    meetChangeFilter,
})(FriendsFilterbar)
