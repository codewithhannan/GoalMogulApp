/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import R from 'ramda'
import timeago from 'timeago.js'
import { connect } from 'react-redux'
import _ from 'lodash'

//Images

import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png'

// Component
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import ProfileImage from '../../Common/ProfileImage'
import Timestamp from '../../Goal/Common/Timestamp'
import DelayedButton from '../../Common/Button/DelayedButton'

// Actions
import {
    openNotificationDetail,
    removeNotification,
} from '../../../redux/modules/notification/NotificationActions'
import { deleteNudge, getAllNudges } from '../../../actions/NudgeActions'
import { Logger } from '../../../redux/middleware/utils/Logger'
import { Icon } from '@ui-kitten/components'
import { color, text, default_style } from '../../../styles/basic'
import { UI_SCALE } from '../../../styles'

// Constants
const DEBUG_KEY = '[ UI NudgeCard ]'

class NudgeCard extends React.PureComponent {
    handleNudgeCardOnPress = () => {}

    handleOptionsOnPress() {
        const { item, token } = this.props

        const options = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(`${DEBUG_KEY} User chooses to remove nudge`)
                    this.props.deleteNudge(item._id)
                },
            ],
        ])

        const requestOptions = ['Remove this Nudge', 'Cancel']

        const cancelIndex = 1

        const adminActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        adminActionSheet()
    }

    renderProfileImage() {
        const { item } = this.props

        return (
            <View style={{ marginBottom: 50 }}>
                {/* <View
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        height: 2,
                        width: 2,
                        left: 36,
                        top: 34,
                    }}
                >
                    <Image
                        source={ProfileIconBackground}
                        resizeMode="contain"
                    />
                </View> */}
                {/* <View
                    style={{
                        position: 'absolute',
                        zIndex: 2,
                        height: 50,
                        width: 50,
                        left: 32,
                        top: 34,
                    }}
                >
                    <Image source={ProfileIcon} resizeMode="cover" />
                </View> */}
                <ProfileImage
                    imageStyle={{ height: 50, width: 50 }}
                    imageUrl={
                        item.sender.hasOwnProperty('profile')
                            ? item.sender.profile.image
                            : defaultUserProfile
                    }
                />
            </View>
        )
    }

    renderOptions() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.handleOptionsOnPress()}
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

    renderContent() {
        const { item } = this.props
        console.log('this is item', item)
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
                    <Text
                        style={[
                            default_style.titleText_2,
                            { color: color.TEXT_COLOR.OFF_DARK },
                        ]}
                    >
                        {item.sender.name} {''}
                    </Text>
                    {!item.hasResponded && !item.isDeleted
                        ? 'has nudged to see your goals'
                        : 'has responded to your nudge'}
                </Text>

                <View style={{ marginTop: 10 }}>
                    <Text
                        style={
                            ([default_style.titleText_2],
                            { color: '#42C0F5', fontWeight: '700' })
                        }
                    >
                        {!item.hasResponded && !item.isDeleted
                            ? 'Tap here to make one of your goals visible to Friends.'
                            : 'Tap here to view his goals'}
                    </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Timestamp time={timeago().format(item.createdAt)} />
                </View>
            </View>
        )
    }

    render() {
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
                >
                    {this.renderProfileImage()}
                    {this.renderContent()}
                    {this.renderOptions()}
                </DelayedButton>
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
    const { token } = state.auth.user
    const { item } = props
    let read = true
    if (item && item._id) {
        read = !data.some((a) => a._id === item._id)
    }

    return {
        read,
        token,
    }
}

export default connect(mapStateToProps, {
    deleteNudge,
    getAllNudges,
})(NudgeCard)
