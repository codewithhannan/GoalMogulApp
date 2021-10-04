/** @format */

import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
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
import CHECK_BOX from '../../asset/icons/checkbox.png'

// Components
import Headline from '../Goal/Common/Headline'
import Timestamp from '../Goal/Common/Timestamp'
import ProfileImage from '../Common/ProfileImage'
import RichText from '../Common/Text/RichText'
import DelayedButton from '../Common/Button/DelayedButton'

// Utils
import {
    makeCaretOptions,
    PAGE_TYPE_MAP,
    getProfileImageOrDefaultFromUser,
    countWords,
} from '../../redux/middleware/utils'

// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
} from '../../Utils/Constants'

import { default_style, color } from '../../styles/basic'

const DEBUG_KEY = '[ UI ActivityHeader ]'

class ActivityHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasLongText: false,
        }
        this.onTextLayout = this.onTextLayout.bind(this)
    }

    onTextLayout(e) {
        const firstLine = e.nativeEvent.lines[0]
        const lastLine = e.nativeEvent.lines[e.nativeEvent.lines.length - 1]
        const { actedUponEntityType, postRef, goalRef } = this.props.item
        const isPost = actedUponEntityType === 'Post'
        const item = isPost ? postRef : goalRef
        const content = isPost ? item.content.text : item.title
        this.setState({
            hasLongText:
                lastLine.text.length > firstLine.text.length ||
                countWords(e.nativeEvent.lines) < countWords(content),
        })
    }

    renderPostSteps = (item) => {
        const steps = item.belongsToGoalStoryline.goalRef.steps

        const completedStep = steps.filter((step) => {
            if (step.isCompleted) {
                return step
            }
        })

        return (
            <>
                {completedStep.map((step) => {
                    return (
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: 15,
                                }}
                            >
                                <Image
                                    source={CHECK_BOX}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        resizeMode: 'contain',
                                    }}
                                />
                                <Text
                                    style={{
                                        marginHorizontal: 10,
                                        fontSize: 16,
                                        fontWeight: '900',
                                        fontFamily: 'SFProDisplay-Regular',
                                    }}
                                >
                                    {step.description}
                                </Text>
                            </View>
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: 'lightgrey',
                                    width: '100%',
                                }}
                            />
                        </>
                    )
                })}
            </>
        )
    }

    renderSeeMore(postRef, actedUponEntityType) {
        const hasLongText = this.state.hasLongText
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
                        ...default_style.normalText_1,
                        color: color.GM_MID_GREY,
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
        const isPost = actedUponEntityType === 'Post'
        const item = isPost ? postRef : goalRef

        // If no ref is passed in, then render nothing
        if (!item) return null

        const { privacy, priority, isCompleted } = item

        // If it's a comment, we are rendering the goal/post owner's info rather than actor's info
        const userToRender =
            actedWith === 'Comment' || actedWith === 'Like' ? item.owner : actor
        // console.log(`${DEBUG_KEY}: actedUponEntityType: ${actedUponEntityType},
        //   userToRender: `, userToRender);

        const { _id, category, maybeIsSubscribed } = item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        // TODO: TAG: for the content
        const content = isPost
            ? item.content.text // Show content if entity type is post / share
            : item.title // Show title if entity type is goal

        const tags = isPost && item.content ? item.content.tags : []
        const links = isPost && item.content ? item.content.links : []

        const pageId = _.get(PAGE_TYPE_MAP, 'activity')
        const onDelete = isPost
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
            if (key === 'Edit Update') {
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
                options: selfOptions,
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
                            isPost ? 'post' : 'goal',
                            `${actedUponEntityType}`
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                        return this.props.unsubscribeEntityNotification(
                            _id,
                            isPost ? 'Post' : 'Goal'
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                        return this.props.subscribeEntityNotification(
                            _id,
                            isPost ? 'Post' : 'Goal'
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
                        imageUrl={getProfileImageOrDefaultFromUser(
                            userToRender
                        )}
                        userId={userToRender._id}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Headline
                            name={userToRender.name || ''}
                            category={category}
                            caret={caret}
                            user={userToRender}
                            isSelf={this.props.userId === userToRender._id}
                            textStyle={default_style.titleText_2}
                            belongsToTribe={belongsToTribe}
                        />
                        <Timestamp
                            time={timeago().format(timeStamp)}
                            privacy={privacy}
                            priority={priority}
                            isCompleted={isCompleted}
                        />
                    </View>
                </View>
                {this.props.item.actedWith === 'Step' ? (
                    this.renderPostSteps(item)
                ) : (
                    <RichText
                        contentText={content}
                        contentTags={tags}
                        contentLinks={links || []}
                        textStyle={{
                            ...(isPost
                                ? default_style.normalText_1
                                : default_style.goalTitleText_1),
                            marginTop: 10,
                            flex: 1,
                            flexWrap: 'wrap',
                            color: 'black',
                        }}
                        textContainerStyle={{
                            flexDirection: 'row',
                            marginTop: 5,
                        }}
                        numberOfLines={CONTENT_PREVIEW_MAX_NUMBER_OF_LINES}
                        ellipsizeMode="tail"
                        onTextLayout={this.onTextLayout}
                        onUserTagPressed={(user) => {
                            console.log(
                                `${DEBUG_KEY}: user tag press for user: `,
                                user
                            )
                            this.props.openProfile(user)
                        }}
                    />
                )}

                {this.renderSeeMore(postRef, actedUponEntityType)}
            </View>
        )
    }

    render() {
        const { item } = this.props

        // console.log('THIS IS ITEM', item)
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
