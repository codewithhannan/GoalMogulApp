/** @format */

import React, { Component } from 'react'
import {
    View,
    TouchableWithoutFeedback,
    ImageBackground,
    Image,
    TouchableOpacity,
    Dimensions,
    Text,
} from 'react-native'
import { connect } from 'react-redux'
import { Audio } from 'expo-av'

// Assets
import LoveOutlineIcon from '../../../../asset/utils/love-outline.png'
import LoveIcon from '../../../../asset/utils/love.png'
import CommentIcon from '../../../../asset/utils/comment.png'
import expand from '../../../../asset/utils/expand.png'

// Components
import ActionButton from '../../Common/ActionButton'
import CommentHeadline from './CommentHeadline'
import CommentRef from './CommentRef'
import ProfileImage from '../../../Common/ProfileImage'
import ImageModal from '../../../Common/ImageModal'
import RichText from '../../../Common/Text/RichText'
import AudioPlayer from '../../../../components/AudioPlayer'
import VideoPlayer from '../../../../components/VideoPlayer'

// Actions
import {
    likeGoal,
    unLikeGoal,
} from '../../../../redux/modules/like/LikeActions'

import {
    createComment,
    deleteComment,
} from '../../../../redux/modules/feed/comment/CommentActions'

import { createReport } from '../../../../redux/modules/report/ReportActions'

import { openProfile } from '../../../../actions'

import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../../redux/modules/notification/NotificationActions'

// Styles
import { default_style } from '../../../../styles/basic'
import { imagePreviewContainerStyle } from '../../../../styles'

// Constants
import {
    IMAGE_BASE_URL,
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
} from '../../../../Utils/Constants'
import DelayedButton from '../../../Common/Button/DelayedButton'
import { Actions } from 'react-native-router-flux'
import {
    componentKeyByTab,
    getProfileImageOrDefaultFromUser,
} from '../../../../redux/middleware/utils'

// Constants
const DEBUG_KEY = '[ UI CommentCard.CommentUserDetail ]'
const { width } = Dimensions.get('window')

class CommentUserDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            layout: {},
            mediaModal: false,
            soundObj: {},
        }
        this.openReplyThread = this.openReplyThread.bind(this)
    }

    // componentWillUnmount() {
    //     const unMoundSound = async () => {
    //         this.state.soundObj && (await this.state.soundObj.unloadAsync())
    //     }
    //     unMoundSound()
    // }

    onLayout = (e) => {
        const layout = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            x: e.nativeEvent.layout.x,
            y: e.nativeEvent.layout.y,
        }
        this.setState({ layout })
        this.props.onLayout(layout)
    }

    getLayout = () => this.state.layout

    openReplyThread(itemId, focusCommentBox) {
        const { pageId, entityId, goalId } = this.props

        Actions.push(
            componentKeyByTab(this.props.navigationTab, 'replyThread'),
            { itemId, pageId, entityId, goalId, focusCommentBox }
        )
    }

    playSound = async (uri) => {
        try {
            const { sound } = await Audio.Sound.createAsync({
                uri: uri,
            })
            this.setState({ soundObj: sound })
            if (sound) {
                // await sound.loadAsync()
                await sound.playAsync()
            }
        } catch (error) {
            console.log('Comment Audio Play Failed : ', error)
        }
    }

    /**
     * Render Image user attached to the comment.
     * Comment type should be "commentType": "Comment"
     * @param {commentObject} item
     */
    renderCommentMedia(item) {
        const { mediaRef } = item
        if (!mediaRef) return null
        const type = mediaRef.split('/')[0]
        const uri = mediaRef.split('/')[1]
        const BASE_URL = 'https://goalmogul-v1.s3.us-west-2.amazonaws.com'

        const mediaUrl = `${BASE_URL}/${type}/${uri}`
        const imageUrl = `${IMAGE_BASE_URL}${mediaRef}`
        console.log('imageUrl', mediaUrl)
        return (
            <>
                {type === 'CommentAudio' ? (
                    <AudioPlayer audio={{ uri: mediaUrl }} />
                ) : type === 'CommentVideo' ? (
                    <VideoPlayer source={mediaUrl} />
                ) : (
                    <TouchableWithoutFeedback
                        onPress={() => this.setState({ mediaModal: true })}
                    >
                        <View style={{ marginTop: 10 }}>
                            <ImageBackground
                                style={{
                                    ...styles.mediaStyle,
                                    ...imagePreviewContainerStyle,
                                    borderRadius: 8,
                                    backgroundColor: 'black',
                                }}
                                source={{ uri: imageUrl }}
                                imageStyle={{
                                    borderRadius: 8,
                                    opacity: 0.8,
                                    resizeMode: 'cover',
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() =>
                                        this.setState({ mediaModal: true })
                                    }
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 15,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 12,
                                        padding: 2,
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        source={expand}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            tintColor: '#fafafa',
                                            borderRadius: 4,
                                        }}
                                    />
                                </TouchableOpacity>
                            </ImageBackground>
                            <ImageModal
                                mediaRef={imageUrl}
                                mediaModal={this.state.mediaModal}
                                closeModal={() =>
                                    this.setState({ mediaModal: false })
                                }
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </>
        )
    }

    /*
     * Render card content based on scenario
     * 1. If Suggestion, render suggestion.suggestionText
     * 2. If Comment / Reply, render content
     */
    renderCardContent() {
        const { item } = this.props
        let text
        let tags = []
        let links = []
        if (
            item.commentType === 'Suggestion' &&
            item.suggestion &&
            item.suggestion.suggestionType === 'Link'
        ) {
            text =
                item.suggestion && item.suggestion.suggestionText
                    ? item.suggestion.suggestionText
                    : ''
        } else {
            text = item.content.text
            tags = item.content.tags
            links = item.content.links
        }

        return (
            <RichText
                contentText={text}
                contentTags={tags}
                contentLinks={links}
                textStyle={{
                    flex: 1,
                    flexWrap: 'wrap',
                    ...default_style.normalText_1,
                    marginTop: 3,
                }}
                multiline
                onUserTagPressed={(user) => {
                    console.log(`${DEBUG_KEY}: user tag press for user: `, user)
                    let userId = user
                    if (typeof user !== 'string') {
                        userId = user._id
                    }
                    this.props.openProfile(userId)
                }}
            />
        )
    }

    renderCommentRef({ suggestion, owner }, index) {
        return (
            <CommentRef
                item={suggestion}
                owner={owner}
                pageId={this.props.pageId}
            />
        )
    }

    // user basic information
    renderBody() {
        const { item, reportType, goalRef, userId } = this.props
        const { _id, owner, parentRef, parentType } = item

        // User is comment owner if user is the creator of the goal or
        // user is the creator of the comment
        const isCommentOwner =
            userId === owner._id || (goalRef && goalRef.owner._id === userId)

        return (
            <View
                style={{
                    padding: 10,
                    backgroundColor: '#F9F9F9',
                    borderRadius: 8,
                }}
            >
                <CommentHeadline
                    item={item}
                    isCommentOwner={isCommentOwner}
                    goalRef={goalRef}
                    onNamePress={() => {
                        if (item && item.owner && item.owner._id) {
                            this.props.openProfile(item.owner._id)
                        }
                    }}
                    onHeadlinePressed={this.props.onHeadlinePressed}
                    caretOnPress={(type) => {
                        console.log('Comment options type is: ', type)
                        if (type === 'Report') {
                            return this.props.createReport(
                                _id,
                                reportType || 'detail',
                                'Comment'
                            )
                        }
                        if (type === 'Delete') {
                            return this.props.deleteComment(
                                _id,
                                this.props.pageId,
                                parentRef,
                                parentType
                            )
                        }
                        if (type === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                            return this.props.subscribeEntityNotification(
                                _id,
                                'Comment'
                            )
                        }
                        if (type === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                            return this.props.unsubscribeEntityNotification(
                                _id,
                                'Comment'
                            )
                        }
                    }}
                />
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    {this.renderCardContent()}
                </View>
                {this.renderCommentMedia(item)}
                {this.renderCommentRef(item)}
            </View>
        )
    }

    renderUserProfileImage(item) {
        return (
            <ProfileImage
                imageUrl={getProfileImageOrDefaultFromUser(item.owner)}
                userId={item?.owner?._id}
            />
        )
    }

    renderActionButtons() {
        const { item } = this.props
        const { _id, maybeLikeRef, parentRef } = item

        const likeCount = item.likeCount || 0
        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 8,
                }}
            >
                <ActionButton
                    iconSource={selfLiked ? LoveIcon : LoveOutlineIcon}
                    count={likeCount}
                    unitText="Like"
                    onTextPress={() =>
                        this.props.openCommentLikeList('Comment', _id)
                    }
                    textStyle={{
                        ...styles.actionText,
                        color: selfLiked ? '#000' : '#828282',
                    }}
                    iconStyle={{
                        ...styles.actionIcon,
                        tintColor: selfLiked ? '#EB5757' : '#828282',
                    }}
                    onPress={() => {
                        // console.log(`${DEBUG_KEY}: user clicks like icon.`)
                        if (selfLiked) {
                            this.props.unLikeGoal(
                                'comment',
                                _id,
                                maybeLikeRef,
                                this.props.pageId,
                                parentRef
                            )
                        } else {
                            this.props.likeGoal(
                                'comment',
                                _id,
                                this.props.pageId,
                                parentRef
                            )
                        }
                    }}
                />
                <ActionButton
                    iconSource={CommentIcon}
                    unitText={'Reply'}
                    textStyle={styles.actionText}
                    iconStyle={styles.actionIcon}
                    onPress={() => {
                        this.openReplyThread(_id, true)
                    }}
                    containerStyle={{ marginLeft: 16 }}
                />
            </View>
        )
    }

    renderRepliesButton() {
        const { item } = this.props
        const { childComments, _id } = item
        if (!childComments || childComments.length === 0) return null

        const comment = childComments[childComments.length - 1]
        const { owner } = comment
        return (
            <DelayedButton
                activeOpacity={0.6}
                key={Math.random().toString(36).substr(2, 9)}
                onPress={() => this.openReplyThread(_id)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 12,
                }}
            >
                <ProfileImage
                    imageStyle={default_style.profileImage_2}
                    imageContainerStyle={{
                        margin: -10,
                        marginTop: -12,
                        marginRight: -2,
                    }}
                    imageUrl={getProfileImageOrDefaultFromUser(owner)}
                    disabled
                />
                <Text style={default_style.smallTitle_1}>{owner.name} </Text>
                <Text
                    style={{
                        ...default_style.smallText_1,
                        color: '#6D6D6D',
                    }}
                >
                    Replied | {childComments.length} Repl
                    {childComments.length > 1 ? 'ies' : 'y'}
                </Text>
            </DelayedButton>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        return (
            <View onLayout={this.onLayout} style={styles.containerStyle}>
                {this.renderUserProfileImage(item)}
                <View style={{ flex: 1, marginLeft: 6 }}>
                    {this.renderBody()}
                    {this.renderActionButtons()}
                    {this.renderRepliesButton()}
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        margin: 16,
        marginBottom: 0,
        flexDirection: 'row',
    },
    actionIcon: {
        ...default_style.normalIcon_1,
        tintColor: '#828282',
    },
    actionText: {
        ...default_style.smallText_1,
        color: '#828282',
    },
    mediaStyle: {
        height: width / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

const mapStateToProps = (state) => {
    const navigationTab = state.navigation.tab
    return {
        navigationTab,
    }
}

export default connect(mapStateToProps, {
    likeGoal,
    unLikeGoal,
    createComment,
    createReport,
    deleteComment,
    openProfile,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
})(CommentUserDetail)
