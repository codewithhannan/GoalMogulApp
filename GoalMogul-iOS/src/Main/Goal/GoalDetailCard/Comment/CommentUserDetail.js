import React, { Component } from 'react';
import {
  View
} from 'react-native';
import { connect } from 'react-redux';

// Assets
import defaultProfilePic from '../../../../asset/utils/defaultUserProfile.png';
import LikeIcon from '../../../../asset/utils/like.png';
import CommentIcon from '../../../../asset/utils/comment.png';

// Components
import ActionButton from '../../Common/ActionButton';
import ActionButtonGroup from '../../Common/ActionButtonGroup';
import CommentHeadline from './CommentHeadline';
import CommentRef from './CommentRef';
import ProfileImage from '../../../Common/ProfileImage';
import RichText from '../../../Common/Text/RichText';

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

// Constants
const DEBUG_KEY = '[ UI CommentCard.CommentUserDetail ]';

class CommentUserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: {}
    };
  }

  onLayout = (e) => {
    const layout = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
      x: e.nativeEvent.layout.x,
      y: e.nativeEvent.layout.y,
    };
    this.setState({ layout });
    this.props.onLayout(layout);
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
    if (item.commentType === 'Suggestion' &&
        item.suggestion &&
        item.suggestion.suggestionType === 'Link') {
      text = (item.suggestion && item.suggestion.suggestionText)
        ? item.suggestion.suggestionText
        : '';
    } else {
      text = item.content.text;
      tags = item.content.tags;
    }
    // return (
    //   <Text
    //     style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 12, marginTop: 3 }}
    //     multiline
    //   >
    //     {text}
    //   </Text>
    // );

    return (
      <RichText
        contentText={text}
        contentTags={tags}
        textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 12, marginTop: 3 }}
        multiline
        onUserTagPressed={(user) => {
          console.log(`${DEBUG_KEY}: user tag press for user: `, user);
          this.props.openProfile(user);
        }}
      />
    );
  }

  // user basic information
  renderUserDetail() {
    const { item, reportType, goalRef, userId } = this.props;
    const { _id, suggestion, owner, parentRef, parentType } = item;

    // User is comment owner if user is the creator of the goal or
    // user is the creator of the comment
    const isCommentOwner = userId === owner._id ||
      (goalRef && goalRef.owner._id === userId);

    return (
        <View style={{ marginLeft: 15, flex: 1 }}>
          <CommentHeadline
            item={item}
            isCommentOwner={isCommentOwner}
            goalRef={goalRef}
            onNamePress={() => {
              if (item && item.owner && item.owner._id) {
                this.props.openProfile(item.owner._id);
              }
            }}
            caretOnPress={(type) => {
              console.log('Comment options type is: ', type);
              if (type === 'Report') {
                return this.props.createReport(_id, reportType || 'detail', 'Comment');
              }
              if (type === 'Delete') {
                return this.props.deleteComment(_id, this.props.pageId, parentRef, parentType);
              }
              if (type === 'Subscribe') {
                return this.props.subscribeEntityNotification(_id, 'Comment');
              }
              if (type === 'Unsubscribe') {
                return this.props.unsubscribeEntityNotification(_id, 'Comment');
              }
            }}
          />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            {this.renderCardContent()}
          </View>
          {this.renderCommentRef(suggestion)}
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
        imageContainerStyle={{ ...styles.profileImageContianerStyle }}
        defaultImageSource={defaultProfilePic}
        imageUrl={imageUrl}
        imageStyle={{ ...styles.profileImageStyle }}
        userId={item.owner._id}
      />
    );
  }

  renderCommentRef(item) {
    return (
      <CommentRef item={item} />
    );
  }

  renderActionButtons() {
    const { item, index, scrollToIndex, onCommentClicked, viewOffset, commentDetail } = this.props;
    const { childComments, _id, maybeLikeRef, parentRef } = item;
    const commentCounts = childComments && childComments.length > 0
      ? childComments.length
      : undefined;

    const likeCount = item.likeCount || 0;

    // If comment is like, like icon is tinted with red
    const tintColor = maybeLikeRef && maybeLikeRef.length > 0
      ? '#f15860'
      : '#cbd6d8';

    return (
      <ActionButtonGroup containerStyle={{ height: 40 }}>
        <ActionButton
          iconSource={LikeIcon}
          count={likeCount}
          textStyle={{ color: tintColor }}
          iconStyle={{ tintColor, borderRadius: 5, height: 20, width: 22 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks like icon.`);
            if (maybeLikeRef && maybeLikeRef.length > 0) {
              return this.props.unLikeGoal('comment', _id, maybeLikeRef, this.props.pageId, parentRef);
            }
            this.props.likeGoal('comment', _id, this.props.pageId, parentRef);
          }}
        />
        <ActionButton
          iconSource={CommentIcon}
          count={commentCounts}
          textStyle={{ color: '#cbd6d8' }}
          iconStyle={{ tintColor: '#cbd6d8', height: 25, width: 25 }}
          onPress={() => {
            // Update the position for FlatList
            scrollToIndex(index, viewOffset);
            // Focus the comment box
            onCommentClicked('Reply');
            // Update new comment reducer
            this.props.createComment({
              ...commentDetail,
              commentType: 'Reply',
              replyToRef: _id
            }, this.props.pageId);
          }}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View onLayout={this.onLayout}>
        <View style={{ ...styles.containerStyle }}>
          <View
            style={{
              marginTop: 16,
              marginBottom: 10,
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
          {this.renderActionButtons(item)}
        </View>
      </View>
    );
  }
}

const ImageHeight = 46;

const styles = {
  containerStyle: {
    backgroundColor: 'white',
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  profileImageStyle: {
    height: ImageHeight,
    width: ImageHeight,
    borderRadius: ImageHeight / 2
  },
  profileImageContianerStyle: {
    height: ImageHeight + 6,
    width: ImageHeight + 6,
    borderWidth: 0.5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (ImageHeight + 4) / 2,
    alignSelf: 'flex-start'
  }
};

export default connect(
  null,
  {
    likeGoal,
    unLikeGoal,
    createComment,
    createReport,
    deleteComment,
    openProfile,
    subscribeEntityNotification,
    unsubscribeEntityNotification
  }
)(CommentUserDetail);
