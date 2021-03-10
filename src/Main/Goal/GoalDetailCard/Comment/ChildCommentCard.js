/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'

// Assets
import LoveOutlineIcon from '../../../../asset/utils/love-outline.png'
import LoveIcon from '../../../../asset/utils/love.png'
import expand from '../../../../asset/utils/expand.png'

// Components
import ActionButton from '../../Common/ActionButton'
import CommentHeadline from './CommentHeadline'
import ProfileImage from '../../../Common/ProfileImage'
import RichText from '../../../Common/Text/RichText'
import ImageModal from '../../../Common/ImageModal'

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
import {
    imagePreviewContainerStyle,
    default_style,
} from '../../../../styles/basic'

// Constants
// Constants
import {
    IMAGE_BASE_URL,
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
} from '../../../../Utils/Constants'
import { getProfileImageOrDefaultFromUser } from '../../../../redux/middleware/utils'

const DEBUG_KEY = '[ UI CommentCard.ChildCommentCard ]'
const { width } = Dimensions.get('window')

class ChildCommentCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mediaModal: false,
        }
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
        if (item.commentType === 'Suggestion') {
            text = item.suggestion.suggestionText
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

    /**
     * Render Image user attached to the comment.
     * Comment type should be "commentType": "Comment"
     * @param {commentObject} item
     */
    renderCommentMedia(item) {
        const { mediaRef } = item
        if (!mediaRef) return null

        const url = mediaRef
        const imageUrl = `${IMAGE_BASE_URL}${url}`
        return (
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
                            onPress={() => this.setState({ mediaModal: true })}
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
                        closeModal={() => this.setState({ mediaModal: false })}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    rederBody() {
        const { item, reportType, goalRef, userId } = this.props
        const { _id, owner, parentRef, parentType } = item

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
                    reportType={reportType}
                    isCommentOwner={isCommentOwner}
                    item={item}
                    onNamePress={() => {
                        if (item && item.owner && item.owner._id) {
                            this.props.openProfile(item.owner._id)
                        }
                    }}
                    goalRef={goalRef}
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
            </View>
        )
    }

    renderUserProfileImage(item) {
        return (
            <ProfileImage
                imageUrl={getProfileImageOrDefaultFromUser(item.owner)}
                userId={item.owner._id}
            />
        )
    }

    renderActionButtons() {
        const { item } = this.props
        const { maybeLikeRef, _id, parentRef } = item

        const likeCount = item.likeCount ? item.likeCount : 0
        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0
        const buttonContainerStyle = { flex: 0 }

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
                    unitText={'Like'}
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
                        console.log(`${DEBUG_KEY}: user clicks like icon.`)
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
                    containerStyle={buttonContainerStyle}
                />
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        return (
            <View onLayout={this.props.onLayout} style={styles.containerStyle}>
                {this.renderUserProfileImage(item)}
                <View style={{ flex: 1, marginLeft: 6 }}>
                    {this.rederBody()}
                    {this.renderActionButtons()}
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 10,
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

export default connect(null, {
    likeGoal,
    unLikeGoal,
    createComment,
    deleteComment,
    createReport,
    openProfile,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
})(ChildCommentCard)
