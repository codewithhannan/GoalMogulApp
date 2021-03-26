/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import R from 'ramda'
import timeago from 'timeago.js'
import { connect } from 'react-redux'
import _ from 'lodash'

//Images

import ProfileIconBackground from '../../../asset/icons/Ellipse.png'
import ProfileIcon from '../../../asset/icons/Vector.png'

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
import { Logger } from '../../../redux/middleware/utils/Logger'
import { Icon } from '@ui-kitten/components'
import { color, text, default_style } from '../../../styles/basic'
import { UI_SCALE } from '../../../styles'

// Constants
const DEBUG_KEY = '[ UI NudgeCard ]'

class NudgeCard extends React.PureComponent {
    handleNudgeCardOnPress = (item) => {}

    handleOptionsOnPress() {
        const options = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(
                        `${DEBUG_KEY} User chooses to remove notification`
                    )
                    return this.props.removeNotification(_id)
                },
            ],
        ])

        const requestOptions = ['Remove this nudge', 'Cancel']

        const cancelIndex = 1

        const adminActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        adminActionSheet()
    }

    renderProfileImage(item) {
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
                <ProfileImage imageStyle={{ height: 50, width: 50 }} />
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
        console.log('This is nudge data', this.props.nudgesData)
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
                        {this.props.nudgesData.map((item) => {
                            if (!item.hasResponded && !item.isDeleted) {
                                return item.sender.name
                            } else return ''
                        })}{' '}
                        {''}
                    </Text>
                    has nudged you to see your goals.
                </Text>

                <View style={{ marginTop: 10 }}>
                    <Text
                        style={
                            ([default_style.titleText_2],
                            { color: '#42C0F5', fontWeight: '700' })
                        }
                    >
                        Tap here to make one of your goals visible to Friends.
                    </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Timestamp time={timeago().format()} />
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
                    onPress={() => this.handleNudgeCardOnPress()}
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
    const { nudgesData, loading } = state.nudges

    const { data } = state.notification.unread
    const { item } = props
    let read = true
    if (item && item._id) {
        read = !data.some((a) => a._id === item._id)
    }

    return {
        read,
        nudgesData,
        loading,
    }
}

export default connect(mapStateToProps, {
    removeNotification,
    openNotificationDetail,
})(NudgeCard)
