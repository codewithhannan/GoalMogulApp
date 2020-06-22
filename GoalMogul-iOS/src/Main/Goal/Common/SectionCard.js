/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import R from 'ramda'
import { connect } from 'react-redux'
// import Decode from 'unescape'; TODO: removed once new decode is good to go

// Asset
import bulb from '../../../asset/utils/bulb.png'
import forward from '../../../asset/utils/forward.png'
import Icons from '../../../asset/base64/Icons'

// Components
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'

// Actions
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions'

import {
    markStepAsComplete,
    markNeedAsComplete,
} from '../../../redux/modules/goal/GoalDetailActions'
import { decode } from '../../../redux/middleware/utils'
import { DEFAULT_STYLE } from '../../../styles'

// Constants
const { CheckIcon: checkIcon } = Icons
const DEBUG_KEY = '[ UI GoalCard.Need/Step SectionCard ]'
const SHARE_TO_MENU_OPTTIONS = [
    'Share to Feed',
    'Share to an Event',
    'Share to a Tribe',
    'Cancel',
]
const CANCEL_INDEX = 3

class SectionCard extends Component {
    handleShareOnClick = () => {
        const { item, goalRef, type } = this.props
        const { _id } = item
        const shareType =
            type === 'need' || type === 'Need' ? 'ShareNeed' : 'ShareStep'

        const shareToSwitchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    // User choose to share to feed
                    console.log(`${DEBUG_KEY} User choose destination: Feed `)
                    this.props.chooseShareDest(
                        shareType,
                        _id,
                        'feed',
                        item,
                        goalRef._id
                    )
                    // TODO: update reducer state
                },
            ],
            [
                R.equals(1),
                () => {
                    // User choose to share to an event
                    console.log(`${DEBUG_KEY} User choose destination: Event `)
                    this.props.chooseShareDest(
                        shareType,
                        _id,
                        'event',
                        item,
                        goalRef._id
                    )
                },
            ],
            [
                R.equals(2),
                () => {
                    // User choose to share to a tribe
                    console.log(`${DEBUG_KEY} User choose destination: Tribe `)
                    this.props.chooseShareDest(
                        shareType,
                        _id,
                        'tribe',
                        item,
                        goalRef._id
                    )
                },
            ],
        ])

        const shareToActionSheet = actionSheet(
            SHARE_TO_MENU_OPTTIONS,
            CANCEL_INDEX,
            shareToSwitchCases
        )
        return shareToActionSheet()
    }

    renderActionIcons(item, type) {
        const suggestionButton = this.props.isSelf ? null : (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
                onPress={() => this.props.onPress({ ...item, type })}
            >
                <Image style={styles.iconStyle} source={bulb} />
            </TouchableOpacity>
        )
        const flexSize = this.props.isSelf ? 4 : 9

        return (
            <View style={{ flex: flexSize, flexDirection: 'row' }}>
                {suggestionButton}
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.iconContainerStyle}
                    onPress={() => this.handleShareOnClick()}
                >
                    <Image style={styles.iconStyle} source={forward} />
                </TouchableOpacity>
            </View>
        )
    }

    // If owner is self, user can click to mark a step / need as complete
    renderSelfCheckBox(isCompleted) {
        const { type, item, goalRef, pageId } = this.props
        const { _id } = item
        const onPress =
            type === 'need' || type === 'Need'
                ? () => this.props.markNeedAsComplete(_id, goalRef, pageId)
                : () => this.props.markStepAsComplete(_id, goalRef, pageId)

        const iconContainerStyle = isCompleted
            ? { ...styles.checkIconContainerStyle }
            : { ...styles.checkIconContainerStyle, backgroundColor: '#efefef' }

        const checkIconStyle = isCompleted
            ? { ...styles.checkIconStyle, tintColor: '#4e966d' }
            : { ...styles.checkIconStyle, tintColor: '#999' }

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={iconContainerStyle}
                onPress={onPress}
            >
                <Image style={checkIconStyle} source={checkIcon} />
            </TouchableOpacity>
        )
    }

    renderCheckBox(isCompleted) {
        if (this.props.isSelf) {
            return this.renderSelfCheckBox(isCompleted)
        }

        if (!isCompleted) return null
        return (
            <View style={styles.checkIconContainerStyle}>
                <Image
                    source={checkIcon}
                    style={{ ...styles.checkIconStyle, tintColor: '#4e966d' }}
                />
            </View>
        )
    }

    render() {
        // console.log('item for props is: ', this.props.item);
        const { type, item } = this.props
        let itemToRender = item

        // Render empty state
        if (!item) {
            const emptyText =
                type === 'need' || type === 'Need' ? 'No needs' : 'No steps'
            itemToRender = { description: `${emptyText}`, isCompleted: false }
            return renderEmptyState(emptyText)
        }

        const { description, isCompleted } = itemToRender
        const sectionText =
            description === undefined ? 'No content' : description

        const onCardPress = this.props.onCardPress
            ? (i) => this.props.onCardPress({ ...i, type })
            : () =>
                  console.log(
                      '[ UI SectionCard ]: card on press without function'
                  )

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onCardPress(item)}
                style={{
                    ...styles.sectionContainerStyle,
                    backgroundColor: isCompleted ? '#fcfcfc' : 'white',
                    opacity: isCompleted ? 0.8 : 1,
                }}
            >
                <View
                    style={{
                        marginRight: 12,
                        marginLeft: this.props.isSelf ? 12 : 30,
                        marginTop: 15,
                        marginBottom: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {this.renderCheckBox(isCompleted)}
                    <View
                        style={{
                            ...styles.textContainerStyle,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Text
                            style={{ ...styles.sectionTextStyle }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {decode(sectionText)}
                        </Text>
                    </View>
                    {this.renderActionIcons(item, type)}
                </View>
            </TouchableOpacity>
        )
    }
}

const renderEmptyState = (text) => {
    return (
        <View
            style={{
                ...styles.sectionContainerStyle,
                height: 66,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    justifyContent: 'center',
                    fontWeight: '700',
                    color: '#909090',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {text}
            </Text>
        </View>
    )
}

const styles = {
    sectionContainerStyle: {
        marginTop: 0.5,
        marginBottom: 0.5,
        backgroundColor: 'white',
    },
    sectionTextStyle: {
        ...DEFAULT_STYLE.normalText_1,
        color: '#909090',
    },
    textContainerStyle: {
        flexDirection: 'row',
        borderRightWidth: 0.5,
        borderColor: '#e5e5e5',
        paddingRight: 10,
        flexShrink: 1,
        flex: 20,
    },
    iconContainerStyle: {
        height: 36 * DEFAULT_STYLE.uiScale,
        width: 36 * DEFAULT_STYLE.uiScale,
        borderRadius: 18 * DEFAULT_STYLE.uiScale,
        backgroundColor: '#efefef',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
    },
    iconStyle: {
        ...DEFAULT_STYLE.normalIcon_1,
        tintColor: '#a4a7a7',
    },
    checkIconContainerStyle: {
        height: 28 * DEFAULT_STYLE.uiScale,
        width: 28 * DEFAULT_STYLE.uiScale,
        borderRadius: 14 * DEFAULT_STYLE.uiScale,
        backgroundColor: '#a5e5c0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkIconStyle: {
        ...DEFAULT_STYLE.normalIcon_1,
        tintColor: 'black',
    },
}

export default connect(null, {
    chooseShareDest,
    markStepAsComplete,
    markNeedAsComplete,
})(SectionCard)
