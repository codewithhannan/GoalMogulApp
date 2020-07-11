import React, { Component } from 'react';
import {
    View,
    Image,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';

// Assets
import defaultProfilePic from '../../../../asset/utils/defaultUserProfile.png';
import LoveOutlineIcon from '../../../../asset/utils/love-outline.png';
import LoveIcon from '../../../../asset/utils/love.png';
import CommentIcon from '../../../../asset/utils/comment.png';
import expand from '../../../../asset/utils/expand.png';

// Components
import ActionButton from '../../Common/ActionButton';
import ActionButtonGroup from '../../Common/ActionButtonGroup';
import CommentHeadline from './CommentHeadline';
import ProfileImage from '../../../Common/ProfileImage';
import RichText from '../../../Common/Text/RichText';
import ImageModal from '../../../Common/ImageModal';

// Actions
import {
    likeGoal,
    unLikeGoal
} from '../../../../redux/modules/like/LikeActions';

import {
    createComment,
    deleteComment
} from '../../../../redux/modules/feed/comment/CommentActions';

import {
    createReport
} from '../../../../redux/modules/report/ReportActions';

import {
    openProfile
} from '../../../../actions';

import {
    subscribeEntityNotification,
    unsubscribeEntityNotification
} from '../../../../redux/modules/notification/NotificationActions';

// Styles
import {
    imagePreviewContainerStyle, DEFAULT_STYLE
} from '../../../../styles';

// Constants
// Constants
import {
    IMAGE_BASE_URL,
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
} from '../../../../Utils/Constants';

const DEBUG_KEY = '[ UI CommentCard.ChildCommentCard ]';
const { width } = Dimensions.get('window');

class ChildCommentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mediaModal: false
        };
    }

    onLayout = (e) => {
        this.setState({
            layout: {
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
                x: e.nativeEvent.layout.x,
                y: e.nativeEvent.layout.y,
            }
        });
    }

    getLayout = () => this.state.layout;

    /*
     * Render card content based on scenario
     * 1. If Suggestion, render suggestion.suggestionText
     * 2. If Comment / Reply, render content
     */
    renderCardContent() {
        const { item } = this.props;
        let text;
        let tags = [];
        let links = [];
        if (item.commentType === 'Suggestion') {
            text = item.suggestion.suggestionText;
        } else {
            text = item.content.text;
            tags = item.content.tags;
            links = item.content.links;
        }
        return (
            <RichText
                contentText={text}
                contentTags={tags}
                contentLinks={links}
                textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 14, lineHeight: 16, marginTop: 3 }}
                multiline
                onUserTagPressed={(user) => {
                    console.log(`${DEBUG_KEY}: user tag press for user: `, user);
                    let userId = user;
                    if (typeof user !== 'string') {
                        userId = user._id;
                    }
                    this.props.openProfile(userId);
                }}
            />
        );
    }

    /**
     * Render Image user attached to the comment.
     * Comment type should be "commentType": "Comment"
     * @param {commentObject} item 
     */
    renderCommentMedia(item) {
        const { mediaRef } = item;
        if (!mediaRef) return null;

        const url = mediaRef;
        const imageUrl = `${IMAGE_BASE_URL}${url}`;
        return (
            <TouchableWithoutFeedback
                onPress={() => this.setState({ mediaModal: true })}
            >
                <View style={{ marginTop: 10 }}>
                    <ImageBackground
                        style={{ ...styles.mediaStyle, ...imagePreviewContainerStyle, borderRadius: 8, backgroundColor: 'black' }}
                        source={{ uri: imageUrl }}
                        imageStyle={{ borderRadius: 8, opacity: 0.8, resizeMode: 'cover' }}
                    >
                        {/* <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
            <Image
              source={photoIcon}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                height: 40,
                width: 50,
                tintColor: '#fafafa'
              }}
            />
          </View> */}

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
                                justifyContent: 'center'
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
        );
    }

    // user basic information
    renderUserDetail() {
        const { item, reportType, goalRef, userId } = this.props;
        const { _id, owner, parentRef, parentType } = item;

        const isCommentOwner = userId === owner._id || (goalRef && goalRef.owner._id === userId);

        return (
            <View style={{ marginLeft: 15, flex: 1 }}>
                <CommentHeadline
                    reportType={reportType}
                    isCommentOwner={isCommentOwner}
                    item={item}
                    onNamePress={() => {
                        if (item && item.owner && item.owner._id) {
                            this.props.openProfile(item.owner._id);
                        }
                    }}
                    goalRef={goalRef}
                    caretOnPress={(type) => {
                        console.log('Comment options type is: ', type);
                        if (type === 'Report') {
                            return this.props.createReport(_id, reportType || 'detail', 'Comment');
                        }
                        if (type === 'Delete') {
                            return this.props.deleteComment(_id, this.props.pageId, parentRef, parentType);
                        }
                        if (type === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                            return this.props.subscribeEntityNotification(_id, 'Comment');
                        }
                        if (type === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                            return this.props.unsubscribeEntityNotification(_id, 'Comment');
                        }
                    }}
                />
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    {this.renderCardContent()}
                </View>
                {this.renderCommentMedia(item)}
            </View>
        );
    }

    renderUserProfileImage(item) {
        let imageUrl;
        if (item.owner && item.owner.profile && item.owner.profile.image) {
            imageUrl = item.owner.profile.image;
        }
        return (
            <ProfileImage
                imageUrl={imageUrl}
                userId={item.owner._id}
            />
        );
    }

    renderActionButtons() {
        const {
            item,
            index,
            scrollToIndex,
            onCommentClicked,
            viewOffset,
            parentCommentId,
            commentDetail
        } = this.props;
        const { childComments, maybeLikeRef, _id, parentRef } = item;
        const commentCounts = childComments && childComments.length > 0
            ? childComments.length
            : undefined;

        const likeCount = item.likeCount ? item.likeCount : 0;
        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0;

        return (
            <ActionButtonGroup containerStyle={{ height: 40 }}>
                <ActionButton
                    iconSource={selfLiked ? LoveIcon : LoveOutlineIcon}
                    count={likeCount}
                    unitText={'Like'}
                    onTextPress={() => this.props.openCommentLikeList('Comment', _id)}
                    textStyle={{ ...styles.actionText, color: selfLiked ? '#000' : '#828282' }}
                    iconStyle={{ ...styles.actionIcon, tintColor: selfLiked ? '#EB5757' : '#828282' }}
                    onPress={() => {
                        console.log(`${DEBUG_KEY}: user clicks like icon.`);
                        if (selfLiked) {
                            return this.props.unLikeGoal('comment', _id, maybeLikeRef, this.props.pageId, parentRef);
                        }
                        this.props.likeGoal('comment', _id, this.props.pageId, parentRef);
                    }}
                />
                <ActionButton
                    iconSource={CommentIcon}
                    unitText={'Reply'}
                    textStyle={styles.actionText}
                    iconStyle={styles.actionIcon}
                    onPress={() => {
                        console.log(`${DEBUG_KEY}: user replies to comment`);
                        scrollToIndex(index, viewOffset);
                        onCommentClicked('Reply');
                        this.props.createComment({
                            ...commentDetail,
                            commentType: 'Reply',
                            replyToRef: parentCommentId
                        }, this.props.pageId);
                    }}
                />
            </ActionButtonGroup>
        );
    }

    render() {
        const { item } = this.props;
        if (!item) return null;

        return (
            <View onLayout={this.onLayout}>
                <View style={{ ...styles.containerStyle }}>
                    <View
                        style={{
                            marginTop: 16,
                            marginBottom: 16,
                            marginRight: 15,
                            marginLeft: 15,
                            flexDirection: 'row'
                        }}
                    >
                        {this.renderUserProfileImage(item)}
                        {this.renderUserDetail()}
                    </View>
                </View>

                <View style={{ ...styles.containerStyle, marginTop: 0.5 }}>
                    {this.renderActionButtons()}
                </View>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        marginTop: 0.5
    },
    actionIcon: {
        ...DEFAULT_STYLE.normalIcon_1,
        tintColor: '#828282'
    },
    actionText: {
        ...DEFAULT_STYLE.smallText_1,
        color: '#828282'
    },
    mediaStyle: {
        height: width / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
};

export default connect(
    null,
    {
        likeGoal,
        unLikeGoal,
        createComment,
        deleteComment,
        createReport,
        openProfile,
        subscribeEntityNotification,
        unsubscribeEntityNotification
    }
)(ChildCommentCard);
