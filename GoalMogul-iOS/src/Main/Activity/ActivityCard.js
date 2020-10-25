/** @format */

import * as Haptics from 'expo-haptics'
import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import {
    Dimensions,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { connect } from 'react-redux'
import {
    getProfileImageOrDefaultFromUser,
    isSharedPost,
    sharingPrivacyAlert,
    SHAREING_PRIVACY_ALERT_TYPE,
} from '../../redux/middleware/utils'
// Actions
import { openProfile } from '../../actions'
// Assets
import { ConfettiFadedBackgroundTopHalf } from '../../asset/background'
import { openPostDetail } from '../../redux/modules/feed/post/PostActions'
import { chooseShareDest } from '../../redux/modules/feed/post/ShareActions'
import { refreshActivityFeed } from '../../redux/modules/home/feed/actions'
import { openGoalDetail } from '../../redux/modules/home/mastermind/actions'
import { likeGoal, unLikeGoal } from '../../redux/modules/like/LikeActions'
// Styles
import { imagePreviewContainerStyle } from '../../styles'
import { default_style, color } from '../../styles/basic'
// Constants
import {
    IMAGE_BASE_URL,
    DEVICE_PLATFORM,
    CONTENT_PREVIEW_MAX_NUMBER_OF_LINES,
} from '../../Utils/Constants'
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory'
import DelayedButton from '../Common/Button/DelayedButton'
import FloatingHearts from '../Common/FloatingHearts/FloatingHearts'
import ImageModal from '../Common/ImageModal'
import ProfileImage from '../Common/ProfileImage'
import RichText from '../Common/Text/RichText'
// Components
import Headline from '../Goal/Common/Headline'
import CommentRef from '../Goal/GoalDetailCard/Comment/CommentRef'
import ActivityBody from './ActivityBody'
import ActivityHeader from './ActivityHeader'
import ActivitySummary from './ActivitySummary'
import ActionBar from '../Common/ContentCards/ActionBar'
import { shareGoalToMastermind } from '../../redux/modules/goal/GoalDetailActions'

const DEBUG_KEY = '[ UI ActivityCard ]'
// Share option for own goal
const SHARE_TO_MENU_OPTTIONS_GOAL = [
    'Publish to Home Feed',
    'Share to a Tribe',
    'Cancel',
]
const CANCEL_INDEX_GOAL = 2
// Share option for own update
const SHARE_TO_MENU_OPTTIONS = ['Share to a Tribe', 'Cancel']
const CANCEL_INDEX = 1
const { width } = Dimensions.get('window')
const WINDOW_WIDTH = width
const ACTION_BUTTON_GROUP_HEIGHT = 68

class ActivityCard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
            floatingHeartCount: 0,
            actionBarOffsetY: 0,
            likeButtonLeftOffset: 0,
            cardHeight: 0,
        }
        this.renderCommentRef = this.renderCommentRef.bind(this)
        this.renderMedia = this.renderMedia.bind(this)
    }

    handleCardOnPress = (item, props) => {
        const { goalRef, postRef, actedUponEntityType } = item
        const propsToPass = props || {}
        if (actedUponEntityType === 'Post' && postRef) {
            if (postRef.postType === 'ShareGoal' && postRef.goalRef) {
                return this.props.openGoalDetail(postRef.goalRef)
            } else {
                return this.props.openPostDetail(postRef, propsToPass)
            }
        }

        if (actedUponEntityType === 'Goal') {
            return this.props.openGoalDetail(goalRef, propsToPass)
        }
    }

    handleShareOnClick = (actedUponEntityType) => {
        const { item } = this.props
        const { goalRef, postRef } = item
        const shareType = `Share${actedUponEntityType}`

        const itemToShare = actedUponEntityType === 'Post' ? postRef : goalRef
        if (itemToShare === null) {
            console.warn(`${DEBUG_KEY}: invalid shared item: `, item)
            return
        }

        const callback = () => {
            this.props.refreshActivityFeed()
        }

        const shareToFeedCallback = () => {
            this.props.onShareCallback()
            this.props.refreshActivityFeed()
        }
        // Share ref is the id of the item to share
        const { _id, privacy } = itemToShare
        let options
        let cancelIndex
        let cases
        if (actedUponEntityType === 'Post') {
            options = SHARE_TO_MENU_OPTTIONS
            cancelIndex = CANCEL_INDEX
            cases = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        // User choose to share to a tribe
                        console.log(
                            `${DEBUG_KEY} User choose destination: Tribe `
                        )
                        if (privacy !== 'public') {
                            return sharingPrivacyAlert(
                                SHAREING_PRIVACY_ALERT_TYPE.update
                            )
                        }
                        this.props.chooseShareDest(
                            shareType,
                            _id,
                            'tribe',
                            itemToShare,
                            undefined,
                            callback
                        )
                    },
                ],
            ])
        } else {
            options = SHARE_TO_MENU_OPTTIONS_GOAL
            cancelIndex = CANCEL_INDEX_GOAL
            cases = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        // User choose to Publish to Home Feed
                        this.props.shareGoalToMastermind(_id)
                    },
                ],
                [
                    R.equals(1),
                    () => {
                        // User choose to share to a tribe
                        if (privacy !== 'public') {
                            return sharingPrivacyAlert(
                                SHAREING_PRIVACY_ALERT_TYPE.goal
                            )
                        }
                        this.props.chooseShareDest(
                            shareType,
                            _id,
                            'tribe',
                            itemToShare,
                            undefined,
                            callback
                        )
                    },
                ],
            ])
        }

        const shareToActionSheet = actionSheet(options, cancelIndex, cases)
        return shareToActionSheet()
    }

    incrementFloatingHeartCount = () => {
        // only iOS has a clean haptic system at the moment
        if (DEVICE_PLATFORM == 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        this.setState({
            floatingHeartCount: this.state.floatingHeartCount + 1,
        })
    }

    renderActionButtons(
        { postRef, goalRef, actedUponEntityType, actedWith },
        currentUserId
    ) {
        const isPost = actedUponEntityType === 'Post'
        const item = isPost ? postRef : goalRef
        // Sanity check if ref exists
        if (!item) return null

        const { maybeLikeRef, _id, owner } = item

        const likeCount = item.likeCount ? item.likeCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0
        const selfOwned = owner && owner._id === currentUserId
        // Disable share for certain condition
        // 1. User shouldn't share a share. When Activity on a post which is a share,
        //    We disable the share button.
        // 2. It's not self owned
        const isShare = (isPost && isSharedPost(postRef.postType)) || !selfOwned

        return (
            <ActionBar
                isContentLiked={selfLiked}
                isShareContent={isShare}
                actionSummaries={{
                    likeCount,
                    shareCount,
                    commentCount,
                }}
                onContainerLayout={({ nativeEvent }) =>
                    this.setState({
                        actionBarOffsetY: nativeEvent.layout.y,
                    })
                }
                onLikeSummaryPress={() => {
                    // TODO open liker list
                }}
                onLikeButtonPress={() => {
                    if (selfLiked) {
                        return this.props.unLikeGoal(
                            isPost ? 'post' : 'goal',
                            _id,
                            maybeLikeRef
                        )
                    }
                    this.incrementFloatingHeartCount()
                    this.props.likeGoal(isPost ? 'post' : 'goal', _id)
                }}
                onLikeButtonLayout={({ nativeEvent }) =>
                    this.setState({
                        likeButtonLeftOffset: nativeEvent.layout.x,
                    })
                }
                onShareSummaryPress={() => {
                    // TODO open sharers list
                }}
                onShareButtonPress={() =>
                    this.handleShareOnClick(actedUponEntityType, selfOwned)
                }
                onCommentSummaryPress={() =>
                    this.props.onPress(
                        item,
                        (actedWith === 'Comment' ||
                            actedWith === 'Like' ||
                            actedWith === 'Goal') &&
                            actedUponEntityType === 'Goal',
                        { shouldNotFocusCommentBox: true }
                    )
                }
                onCommentButtonPress={() =>
                    this.props.onPress(
                        item,
                        (actedWith === 'Comment' ||
                            actedWith === 'Like' ||
                            actedWith === 'Goal') &&
                            actedUponEntityType === 'Goal'
                    )
                }
            />
        )
    }

    // If this is a comment activity, render comment summary
    renderComment(item) {
        // CommentRef shouldn't be null as we already sanity check the activity card
        const { actedWith, commentRef, actor } = item
        if (actedWith !== 'Comment') return null

        // console.log(`${DEBUG_KEY}: commentRef: `, commentRef);
        const { content, mediaRef, suggestion } = commentRef
        const { text, tags, links } = content

        const { _id, name } = actor
        return (
            <View
                style={{
                    flexDirection: 'row',
                    padding: 16,
                    flex: 1,
                    backgroundColor: 'white',
                }}
            >
                <ProfileImage
                    imageStyle={{
                        height: 35 * default_style.uiScale,
                        width: 35 * default_style.uiScale,
                    }}
                    imageUrl={getProfileImageOrDefaultFromUser(actor)}
                    imageContainerStyle={styles.imageContainerStyle}
                    userId={_id}
                />
                <DelayedButton
                    style={{
                        padding: 12,
                        backgroundColor: '#F9F9F9',
                        borderRadius: 8,
                        marginLeft: 10,
                        flex: 1,
                    }}
                    activeOpacity={1}
                    onPress={() =>
                        this.handleCardOnPress(item, {
                            focusType: 'comment',
                            initialScrollToComment: true,
                            commentId: commentRef._id,
                        })
                    }
                >
                    <Headline
                        name={name || ''}
                        user={actor}
                        hasCaret={false}
                        isSelf={this.props.userId === _id}
                        textStyle={default_style.titleText_2}
                    />
                    <RichText
                        contentText={text}
                        contentTags={tags}
                        contentLinks={links}
                        textStyle={{
                            ...default_style.normalText_1,
                            flex: 1,
                            flexWrap: 'wrap',
                        }}
                        textContainerStyle={{
                            flexDirection: 'row',
                            marginTop: 5,
                        }}
                        numberOfLines={CONTENT_PREVIEW_MAX_NUMBER_OF_LINES}
                        ellipsizeMode="tail"
                        onUserTagPressed={(user) => {
                            this.props.openProfile(user)
                        }}
                    />
                    {this.renderMedia(mediaRef)}
                    {this.renderCommentRef(suggestion)}
                </DelayedButton>
            </View>
        )
    }

    /**
     * Render commentRef
     * @param {object} item
     */
    renderCommentRef(item) {
        return <CommentRef item={item} />
    }

    renderMedia(url) {
        if (!url) {
            return null
        }
        const imageUrl = `${IMAGE_BASE_URL}${url}`
        return (
            <TouchableWithoutFeedback
                onPress={() => this.setState({ mediaModal: true })}
            >
                <View style={{ marginTop: 5 }}>
                    <ImageBackground
                        style={{
                            ...styles.mediaStyle,
                            ...imagePreviewContainerStyle,
                            borderRadius: 8,
                            backgroundColor: 'black',
                        }}
                        source={{ uri: imageUrl }}
                        imageStyle={{ borderRadius: 8, resizeMode: 'cover' }}
                    ></ImageBackground>
                    {this.renderPostImageModal(imageUrl)}
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderPostImageModal(imageUrl) {
        return (
            <ImageModal
                mediaRef={imageUrl}
                mediaModal={this.state.mediaModal}
                closeModal={() => this.setState({ mediaModal: false })}
            />
        )
    }

    render() {
        const { item, userId } = this.props
        if (!item || _.isEmpty(item) || !isValidActivity(item)) return null

        return (
            <View
                style={styles.containerStyle}
                onLayout={({ nativeEvent }) =>
                    this.setState({
                        cardHeight: nativeEvent.layout.height,
                    })
                }
            >
                <FloatingHearts
                    count={this.state.floatingHeartCount}
                    color={'#EB5757'}
                    style={{
                        zIndex: 5,
                        bottom:
                            this.state.cardHeight -
                            this.state.actionBarOffsetY -
                            ACTION_BUTTON_GROUP_HEIGHT,
                    }}
                    leftOffset={this.state.likeButtonLeftOffset}
                />
                {item.goalRef && item.goalRef.isCompleted ? (
                    <Image
                        source={ConfettiFadedBackgroundTopHalf}
                        style={{
                            height: WINDOW_WIDTH * 0.6,
                            width: WINDOW_WIDTH,
                            position: 'absolute',
                            resizeMode: 'cover',
                            opacity: 0.55,
                        }}
                    />
                ) : null}
                <ActivitySummary item={item} />
                <View
                    style={{
                        marginTop: 12,
                        marginBottom: 12,
                        marginHorizontal: 16,
                    }}
                >
                    <DelayedButton
                        activeOpacity={1}
                        onPress={() => this.handleCardOnPress(item)}
                    >
                        <ActivityHeader item={item} />
                    </DelayedButton>
                    <ActivityBody
                        item={item}
                        openCardContent={() => this.handleCardOnPress(item)}
                    />
                </View>
                {!(
                    item.actedUponEntityType === 'Post' &&
                    item.postRef.postType === 'ShareGoal'
                ) && this.renderActionButtons(item, userId)}
                {this.renderComment(item)}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        marginTop: 8,
    },
    imageContainerStyle: {
        marginTop: 4,
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
    mediaStyle: {
        height: width / 3,
        width: width / 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2,
    },
}

const isValidActivity = (item) => {
    if (!item || _.isEmpty(item)) return false
    const {
        actedUponEntityType,
        goalRef,
        postRef,
        actedWith,
        commentRef,
        actor,
    } = item
    if (actedUponEntityType === 'Goal' && (!goalRef || goalRef === null)) {
        return false
    }

    if (actedUponEntityType === 'Post' && (!postRef || postRef === null)) {
        return false
    }

    if (actedWith === 'Comment' && commentRef === null) {
        return false
    }

    if (actor === null) return false
    return true
}

const mapStateToProps = (state) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    likeGoal,
    unLikeGoal,
    chooseShareDest,
    openPostDetail,
    openGoalDetail,
    refreshActivityFeed,
    openProfile,
    shareGoalToMastermind,
})(ActivityCard)
