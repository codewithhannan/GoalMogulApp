/** @format */

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import _ from 'lodash'

// Actions
import { createReport } from '../../redux/modules/report/ReportActions'

import { openProfile, deletePost, deleteGoal } from '../../actions'

import { openPostDetail } from '../../redux/modules/feed/post/PostActions'

import { openGoalDetail } from '../../redux/modules/home/mastermind/actions'

import { shareGoalToMastermind } from '../../redux/modules/goal/GoalDetailActions'

import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../redux/modules/notification/NotificationActions'

// Assets

// Components
import Headline from '../Goal/Common/Headline'
import Timestamp from '../Goal/Common/Timestamp'
import ProfileImage from '../Common/ProfileImage'
import RichText from '../Common/Text/RichText'
import DelayedButton from '../Common/Button/DelayedButton'

// Utils
import { makeCaretOptions, PAGE_TYPE_MAP } from '../../redux/middleware/utils'

// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    SHOW_SEE_MORE_TEXT_LENGTH,
} from '../../Utils/Constants'

import { APP_BLUE, DEFAULT_STYLE, GM_BLUE } from '../../styles'

const DEBUG_KEY = '[ UI ActivityHeader ]'

class ActivityHeader extends Component {
    renderSeeMore(postRef, actedUponEntityType) {
        const hasLongText =
            postRef &&
            postRef.content &&
            postRef.content.text &&
            postRef.content.text.length > SHOW_SEE_MORE_TEXT_LENGTH
        const showSeeMore = actedUponEntityType === 'Post' && hasLongText

        if (!showSeeMore) return null
        return (
            <DelayedButton
                onPress={() => this.props.openPostDetail(postRef)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: 2,
                }}
            >
                <Text
                    style={{
                        ...DEFAULT_STYLE.smallText_1,
                        color: GM_BLUE,
                    }}
                >
                    See more
                </Text>
            </DelayedButton>
        )
    }

    // user basic information
    renderUserDetail({
        postRef,
        goalRef,
        actedUponEntityType,
        actor,
        actedWith,
        created,
        belongsToTribe,
    }) {
        const item = actedUponEntityType === 'Post' ? postRef : goalRef

        // If no ref is passed in, then render nothing
        if (!item) return null

        const { viewCount, priority, isCompleted } = item

        // If it's a comment, we are rendering the goal/post owner's info rather than actor's info
        const userToRender =
            actedWith === 'Comment' || actedWith === 'Like' ? item.owner : actor
        // console.log(`${DEBUG_KEY}: actedUponEntityType: ${actedUponEntityType},
        //   userToRender: `, userToRender);

        const { _id, category, maybeIsSubscribed } = item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        // TODO: TAG: for the content
        const content =
            actedUponEntityType === 'Post'
                ? item.content.text // Show content if entity type is post / share
                : item.title // Show title if entity type is goal

        const tags =
            actedUponEntityType === 'Post' && item.content
                ? item.content.tags
                : []
        const links =
            actedUponEntityType === 'Post' && item.content
                ? item.content.links
                : []

        const pageId = _.get(PAGE_TYPE_MAP, 'activity')
        const onDelete =
            actedUponEntityType === 'Post'
                ? () => this.props.deletePost(postRef._id, pageId)
                : () => this.props.deleteGoal(goalRef._id, pageId)

        // COnstruct caret options
        const selfOptions = makeCaretOptions(
            actedUponEntityType,
            goalRef,
            postRef
        )

        // Construct caret onPress functions
        const selfOnPress = (key) => {
            if (key === 'Delete') {
                return onDelete()
            }
            if (key === 'Edit Post') {
                const initial = {
                    initialShowPostModal: true,
                }
                return this.props.openPostDetail(postRef, initial)
            }

            // Goal related situations
            let initialProps = {}
            if (key === 'Edit Goal') {
                initialProps = { initialShowGoalModal: true }
                this.props.openGoalDetail(goalRef, initialProps)
                return
            }
            if (key === 'Share to Goal Feed') {
                // It has no pageId so it won't have loading animation
                return this.props.shareGoalToMastermind(_id)
            }
            if (key === 'Mark as Complete') {
                initialProps = {
                    initialMarkGoalAsComplete: true,
                    refreshGoal: false,
                }
                this.props.openGoalDetail(goalRef, initialProps)
                return
            }

            if (key === 'Unmark as Complete') {
                initialProps = {
                    initialUnMarkGoalAsComplete: true,
                    refreshGoal: false,
                }
                this.props.openGoalDetail(goalRef, initialProps)
                return
            }
        }

        const caret = {
            self: {
                options: [...selfOptions],
                onPress: selfOnPress,
                shouldExtendOptionLength: actedUponEntityType === 'Goal',
            },
            others: {
                options: [
                    { option: 'Report' },
                    {
                        option: maybeIsSubscribed
                            ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                            : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
                    },
                ],
                onPress: (key) => {
                    if (key === 'Report') {
                        return this.props.createReport(
                            _id,
                            'post',
                            `${actedUponEntityType}`
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                        return this.props.unsubscribeEntityNotification(
                            _id,
                            'Post'
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                        return this.props.subscribeEntityNotification(
                            _id,
                            'Post'
                        )
                    }
                },
            },
        }

        return (
            <View>
                <View
                    style={{ flexDirection: 'row', alignItems: 'flex-start' }}
                >
                    <ProfileImage
                        imageUrl={
                            userToRender && userToRender.profile
                                ? userToRender.profile.image
                                : undefined
                        }
                        userId={userToRender._id}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2, flex: 1 }}>
                        <Headline
                            name={userToRender.name || ''}
                            category={category}
                            caret={caret}
                            user={userToRender}
                            isSelf={this.props.userId === userToRender._id}
                            textStyle={DEFAULT_STYLE.titleText_2}
                            belongsToTribe={belongsToTribe}
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp
                            time={timeago().format(timeStamp)}
                            viewCount={viewCount}
                            priority={priority}
                            isCompleted={isCompleted}
                        />
                    </View>
                </View>
                <RichText
                    contentText={content}
                    contentTags={tags}
                    contentLinks={links || []}
                    textStyle={{
                        ...(actedUponEntityType === 'Post'
                            ? DEFAULT_STYLE.normalText_1
                            : DEFAULT_STYLE.goalTitleText_1),
                        marginTop: 12,
                        flex: 1,
                        flexWrap: 'wrap',
                        color: 'black',
                    }}
                    textContainerStyle={{ flexDirection: 'row', marginTop: 5 }}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    onUserTagPressed={(user) => {
                        console.log(
                            `${DEBUG_KEY}: user tag press for user: `,
                            user
                        )
                        this.props.openProfile(user)
                    }}
                />
                {this.renderSeeMore(postRef, actedUponEntityType)}
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item || _.isEmpty(item)) return null

        return <View>{this.renderUserDetail(item)}</View>
    }
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    createReport,
    openProfile,
    deletePost,
    deleteGoal,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    openPostDetail,
    openGoalDetail,
    shareGoalToMastermind,
})(ActivityHeader)
