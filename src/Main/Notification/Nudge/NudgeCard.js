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
    deleteNudge,
    getAllNudges,
    handleNudgeResponsed,
} from '../../../actions/NudgeActions'

import { createOrGetDirectMessage, openProfile } from '../../../actions'
import { Logger } from '../../../redux/middleware/utils/Logger'
import { Icon } from '@ui-kitten/components'
import { color, text, default_style } from '../../../styles/basic'
import { UI_SCALE } from '../../../styles'
import { Actions } from 'react-native-router-flux'
import { deleteSelectedNudge } from '../../../reducers/NudgesReducer'
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'

// Constants
const DEBUG_KEY = '[ UI NudgeCard ]'

class NudgeCard extends React.PureComponent {
    handleNudgeCardOnPress = () => {
        const { item, token, userId } = this.props
        const { _id, sender, receiver } = item
        if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'inviteeGoalCheck'
        ) {
            return (
                Actions.replace('no_goal_conversation', { item }),
                this.props.deleteSelectedNudge(_id),
                this.props.deleteNudge(_id)
            )
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'clarifyGoals'
        ) {
            return (
                this.props.openGoalDetail(item.goalRef),
                this.props.deleteSelectedNudge(_id),
                this.props.handleNudgeResponsed(_id),
                this.props.deleteNudge(_id)
            )
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'accountability'
        ) {
            return (
                this.props.createOrGetDirectMessage(
                    sender._id,
                    (err, chatRoom) => {
                        if (err || !chatRoom) {
                            return Alert.alert(
                                'Error',
                                'Could not start the conversation. Please try again later.'
                            )
                        }
                        Actions.push('chatRoomConversation', {
                            chatRoomId: chatRoom._id,
                        })
                    }
                ),
                this.props.handleNudgeResponsed(_id),
                setTimeout(() => {
                    this.props.deleteSelectedNudge(_id)
                }, 3000),
                this.props.deleteNudge(_id)
            )
        } else if (!item.hasResponded && !item.isDeleted) {
            return (
                this.props.openProfile(userId),
                this.props.handleNudgeResponsed(_id),
                this.props.deleteSelectedNudge(_id),
                this.props.deleteNudge(_id)
            )
        } else {
            return (
                this.props.openProfile(receiver._id),
                this.props.handleNudgeResponsed(_id),
                this.props.deleteSelectedNudge(_id),
                this.props.deleteNudge(_id)
            )
        }
    }

    handleOptionsOnPress() {
        const { item, token } = this.props
        const options = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(
                        `${DEBUG_KEY} User chooses to remove nudge`,
                        item._id
                    )
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

    renderPictureByNudgeUser = (item) => {
        if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.sender.hasOwnProperty('profile')
        ) {
            return item.sender.profile.image
        } else if (item.receiver.hasOwnProperty('profile')) {
            return item.receiver.profile.image
        } else {
            defaultUserProfile
        }
    }

    renderProfileImage() {
        const { item } = this.props

        return (
            <View style={{ marginBottom: 50, top: 10 }}>
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
                    imageUrl={this.renderPictureByNudgeUser(item)}
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

    renderNudgeBottomText = (item) => {
        if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'createFirstGoal'
        ) {
            return 'Tap here to create your first goal.'
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'makeGoalsPublic'
        ) {
            return 'Tap here to make one of your goals visible to Friends.'
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'inviteeGoalCheck'
        ) {
            return 'Tap here to see question'
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'accountability'
        ) {
            return item.goalRef.title
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'clarifyGoals'
        ) {
            return item.goalRef.title
        } else {
            return 'Tap here to view his goal.'
        }
    }

    renderNudgeContent = (item) => {
        if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'createFirstGoal'
        ) {
            return 'has nudged to create your first goal.'
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'makeGoalsPublic'
        ) {
            return 'has nudged to see your goals.'
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'inviteeGoalCheck'
        ) {
            return 'is curious about your goals!'
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'accountability'
        ) {
            return 'wants to hold you accountable for your goal:'
        } else if (
            !item.hasResponded &&
            !item.isDeleted &&
            item.type === 'clarifyGoals'
        ) {
            return 'would like you to clarify your goal:'
        } else {
            return 'has responded to your nudge.'
        }
    }

    renderContent() {
        const { item } = this.props
        console.log('time created', item.createdAt)
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
                        {!item.hasResponded && !item.isDeleted
                            ? item.sender.name
                            : item.receiver.name}{' '}
                        {''}
                    </Text>
                    {this.renderNudgeContent(item)}
                </Text>

                <View style={{ marginTop: 10 }}>
                    <Text
                        style={
                            ([default_style.titleText_2],
                            { color: '#42C0F5', fontWeight: '700' })
                        }
                    >
                        {this.renderNudgeBottomText(item)}
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
                    onPress={this.handleNudgeCardOnPress}
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
    const { userId } = state.user
    const { item } = props
    let read = true
    if (item && item._id) {
        read = !data.some((a) => a._id === item._id)
    }

    return {
        read,
        token,
        userId,
    }
}

export default connect(mapStateToProps, {
    deleteNudge,
    getAllNudges,
    handleNudgeResponsed,
    openProfile,
    deleteSelectedNudge,
    createOrGetDirectMessage,
    openGoalDetail,
})(NudgeCard)
