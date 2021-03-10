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

// Asset
import dropDown from '../../../asset/utils/dropDown.png'

// Actions
import {
    updateSortBy,
    updateFilterForMembershipCategory,
} from '../../../redux/modules/tribe/MyTribeTabActions'

// Utils
import { capitalizeWord } from '../../../redux/middleware/utils'

const { Popover } = renderers
const { width } = Dimensions.get('window')

class MyTribeFilterBar extends Component {
    handleOnMenuSelect = (type, value) => {
        console.log('selecting value is: ', value)
        console.log('selecting type is: ', type)
        // TODO: alter reducer state
    }

    render() {
        const {
            containerStyle,
            textStyle,
            detailContainerStyle,
            standardTextStyle,
            caretStyle,
        } = styles
        const { sortBy } = this.props
        return (
            <View style={containerStyle}>
                <Menu
                    onSelect={(value) => {
                        this.props.updateSortBy(value)
                    }}
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
                                Sort By ({`${capitalizeWord(sortBy)}`})
                            </Text>
                            <Image
                                style={styles.caretStyle}
                                source={dropDown}
                            />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        <MenuOption text="Name" value="name" />
                        <MenuOption text="Created" value="created" />
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
        height: 50,
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginLeft: 12,
        paddingTop: 6,
        paddingBottom: 6,
    },
    textStyle: {
        fontSize: 9,
        // color: '#1fb6dd',
        color: '#696969',
        // fontWeight: '600',
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

const mapStateToProps = (state) => {
    const { sortBy } = state.myTribeTab

    return {
        sortBy,
    }
}

export default connect(mapStateToProps, {
    updateSortBy,
    updateFilterForMembershipCategory,
})(MyTribeFilterBar)
