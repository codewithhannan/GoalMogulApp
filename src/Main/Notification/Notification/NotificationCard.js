/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import R from 'ramda'
import timeago from 'timeago.js'
import { connect } from 'react-redux'
import _ from 'lodash'

// Component
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import ProfileImage from '../../Common/ProfileImage'
import Timestamp from '../../Goal/Common/Timestamp'
import DelayedButton from '../../Common/Button/DelayedButton'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../../styles'

// Actions
import {
    openNotificationDetail,
    removeNotification,
} from '../../../redux/modules/notification/NotificationActions'
import { Logger } from '../../../redux/middleware/utils/Logger'
import { Icon } from '@ui-kitten/components'
import { color, text, default_style } from '../../../styles/basic'
import { UI_SCALE } from '../../../styles'

// Constants
const DEBUG_KEY = '[ UI NotificationCard ]'

class NotificationCard extends React.PureComponent {
    handleNotificationCardOnPress = (item) => {
        const { parsedNoti, _id } = item
        if (!parsedNoti || !parsedNoti.path) {
            console.warn(
                `${DEBUG_KEY}: no parsedNoti or path is in notification:`,
                item
            )
            return
        }

        if (!_id) {
            console.warn(
                `${DEBUG_KEY}: missing notification id for item:`,
                item
            )
            return
        }

        // TODO: open detail based on the path;
        Logger.log(`${DEBUG_KEY}: open notification detail for item: `, item, 2)
        this.props.openNotificationDetail(item)
    }

    handleDotPress() {}

    handleOptionsOnPress() {
        // const { item } = this.props
        // const { _id } = item
        // const options = switchByButtonIndex([
        //     [
        //         R.equals(0),
        //         () => {
        //             console.log(
        //                 `${DEBUG_KEY} User chooses to remove notification`
        //             )
        //             return this.props.removeNotification(_id)
        //         },
        //     ],
        // ])
        // const requestOptions = ['Remove this notification', 'Cancel']
        // const cancelIndex = 1
        // const adminActionSheet = actionSheet(
        //     requestOptions,
        //     cancelIndex,
        //     options
        // )
        // adminActionSheet()
    }

    renderProfileImage(item) {
        const { parsedNoti } = item
        const imageUrl =
            parsedNoti && parsedNoti.icon ? parsedNoti.icon : undefined
        return (
            <ProfileImage
                imageStyle={{ height: 50, width: 50 }}
                imageUrl={imageUrl}
            />
        )
    }

    renderOptions() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.openNotificationBottomSheet()}
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    padding: 5,
                    paddingTop: 10,
                    paddingBottom: 10,
                }}
            >
                <Icon
                    name="dots-horizontal"
                    pack="material-community"
                    style={[
                        {
                            tintColor: '#828282',
                            width: 18,
                            height: 18,
                        },
                    ]}
                />
            </TouchableOpacity>
        )
    }

    openNotificationBottomSheet = () =>
        this.notificationRefBottomSheetRef.open()
    closeNotificationBottomSheet = () =>
        this.notificationRefBottomSheetRef.close()

    makeNotificationRefOptions = () => {
        return [
            {
                text: 'Remove Notification',
                onPress: () => {
                    this.closeNotificationBottomSheet()
                    setTimeout(() => {
                        const { item } = this.props
                        const { _id } = item
                        this.props.removeNotification(_id)
                    }, 500)
                },
            },
            {
                text: 'Cancel',
                onPress: () => this.closeNotificationBottomSheet(),
            },
        ]
    }

    renderNotificationRefBottomSheet = () => {
        const options = this.makeNotificationRefOptions()

        const sheetHeight = getButtonBottomSheetHeight(options.length)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.notificationRefBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    renderContent(item, isInvalidCommentNotif) {
        const { created, parsedNoti } = item
        let textToDisplay =
            parsedNoti && parsedNoti.notificationMessage
                ? parsedNoti.notificationMessage
                : ''

        let actorName = _.get(item, 'parsedNoti.actorName', undefined)
        let startWithName = textToDisplay.startsWith(actorName)
        if (actorName && startWithName) {
            textToDisplay = textToDisplay.replace(`${actorName}`, '')
        }

        if (textToDisplay === '' && isInvalidCommentNotif) {
            textToDisplay = 'Comment was removed by the owner'
            actorName = undefined
        }

        return (
            <View style={{ flex: 1, marginLeft: 10, marginRight: 18 }}>
                <Text
                    style={{
                        flexWrap: 'wrap',
                        color: color.TEXT_COLOR.OFF_DARK,
                        fontSize: 14 * UI_SCALE,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                        marginBottom: 4,
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {actorName && startWithName ? (
                        <Text
                            style={[
                                default_style.titleText_2,
                                { color: color.TEXT_COLOR.OFF_DARK },
                            ]}
                        >
                            {actorName}
                        </Text>
                    ) : null}
                    {textToDisplay}
                </Text>
                <View>
                    <Timestamp time={timeago().format(created)} />
                </View>
            </View>
        )
    }

    render() {
        const { item } = this.props

        // console.log('THIS IS NOTIFICATION ITEM', item)

        if (!item) return null
        if (!item.parsedNoti) return null

        // Right now we do a hack to go around invalid commentRef
        const isInvalidCommentNotif = item.commentRef === null

        if (item.parsedNoti.error && !isInvalidCommentNotif) {
            // console.warn(
            //     `${DEBUG_KEY}: invalid notification with error: `,
            //     item.parsedNoti.error
            // )
            return null
        }
        // If read, backgroundColor is: '#eef8fb'
        const read = this.props.read
        const cardContainerStyle = read
            ? { ...styles.cardContainerStyle }
            : { ...styles.cardContainerStyle, backgroundColor: '#eef8fb' }
        return (
            <>
                <DelayedButton
                    delay={600}
                    activeOpacity={0.6}
                    style={cardContainerStyle}
                    onPress={() => this.handleNotificationCardOnPress(item)}
                >
                    {this.renderProfileImage(item)}
                    {this.renderContent(item, isInvalidCommentNotif)}
                    {this.renderOptions(item)}
                </DelayedButton>
                {this.renderNotificationRefBottomSheet()}
            </>
        )
    }
}

const styles = {
    cardContainerStyle: {
        flexDirection: 'row',
        padding: 12,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        marginBottom: 1,
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
}

const mapStateToProps = (state, props) => {
    const { data } = state.notification.unread
    const { item } = props

    console.log()
    let read = true
    if (item && item._id) {
        read = !data.some((a) => a._id === item._id)
    }

    return {
        read,
    }
}

export default connect(mapStateToProps, {
    removeNotification,
    openNotificationDetail,
})(NotificationCard)
