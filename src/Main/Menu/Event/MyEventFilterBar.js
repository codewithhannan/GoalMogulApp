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
    updateFilterOptions,
} from '../../../redux/modules/event/MyEventTabActions'

// Utils
import { capitalizeWord } from '../../../redux/middleware/utils'

const { Popover } = renderers
const { width } = Dimensions.get('window')

class MyEventFilterBar extends Component {
    render() {
        const {
            containerStyle,
            textStyle,
            detailContainerStyle,
            standardTextStyle,
            caretStyle,
        } = styles
        const { sortBy, filterOptions } = this.props
        const { rsvp, isCreator } = filterOptions

        const isCreatorText = isCreator ? 'My Events' : 'All Events'
        const rsvpText = rsvp === 'NotGoing' ? 'Not Going' : rsvp

        return (
            <View style={containerStyle}>
                <Menu
                    onSelect={(value) => this.props.updateSortBy(value)}
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
                                Sort By {`(${capitalizeWord(sortBy)})`}
                            </Text>
                            <Image
                                style={styles.caretStyle}
                                source={dropDown}
                            />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        <MenuOption text="Start" value="start" />
                        <MenuOption text="Created" value="created" />
                        <MenuOption text="Title" value="title" />
                    </MenuOptions>
                </Menu>

                <Menu
                    onSelect={(value) =>
                        this.props.updateFilterOptions({ value, type: 'rsvp' })
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
                            <Text style={textStyle}>
                                RSVP {`(${rsvpText})`}
                            </Text>
                            <Image style={caretStyle} source={dropDown} />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        <MenuOption text="All" value="All" />
                        <MenuOption text="Invited" value="Invited" />
                        <MenuOption text="Interested" value="Interested" />
                        <MenuOption text="Going" value="Going" />
                        <MenuOption text="Maybe" value="Maybe" />
                        <MenuOption text="Not Going" value="NotGoing" />
                    </MenuOptions>
                </Menu>

                <Menu
                    onSelect={(value) =>
                        this.props.updateFilterOptions({
                            value: value === 'true',
                            type: 'isCreator',
                        })
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
                            <Text style={textStyle}>
                                Filter By {`(${isCreatorText})`}
                            </Text>
                            <Image style={caretStyle} source={dropDown} />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        <MenuOption text="My Events" value="true" />
                        <MenuOption text="All Events" value="false" />
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
    const { sortBy, filterOptions } = state.myEventTab
    return {
        sortBy,
        filterOptions,
    }
}

export default connect(mapStateToProps, {
    updateSortBy,
    updateFilterOptions,
})(MyEventFilterBar)
