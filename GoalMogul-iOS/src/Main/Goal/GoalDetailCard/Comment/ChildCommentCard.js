import React, { Component } from 'react';
import {
  View,
  Text
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
import ProfileImage from '../../../Common/ProfileImage';

// Actions
import {
  likeGoal,
  unLikeGoal
} from '../../../../redux/modules/like/LikeActions';

import {
  createComment
} from '../../../../redux/modules/feed/comment/CommentActions';

import {
  createReport
} from '../../../../redux/modules/report/ReportActions';

// Constants
const DEBUG_KEY = '[ UI CommentCard.ChildCommentCard ]';

class ChildCommentCard extends Component {

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
    if (item.commentType === 'Suggestion') {
      text = item.suggestion.suggestionText;
    } else {
      text = item.content.text;
    }
    return (
      <Text
        style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 11 }}
        numberOfLines={3}
        ellipsizeMode='tail'
      >
        {text}
      </Text>
    );
  }

  // user basic information
  renderUserDetail() {
    const { item, reportType, goalRef, userId } = this.props;
    const { _id } = item;

    const isCommentOwner = userId === _id || (goalRef && goalRef.owner._id === userId);
    return (
        <View style={{ marginLeft: 15, flex: 1 }}>
          <CommentHeadline
            reportType={reportType}
            isCommentOwner={isCommentOwner}
            item={item}
            goalRef={goalRef}
            caretOnPress={() => {
              this.props.createReport(_id, reportType, 'Comment');
            }}
          />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            {this.renderCardContent()}
          </View>
        </View>
    );
  }

  renderUserProfileImage() {
    const { item } = this.props;
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
      />
    );
  }

  renderActionButtons() {
    const { item, index, scrollToIndex, onCommentClicked, viewOffset } = this.props;
    const { childComments, maybeLikeRef, _id } = item;
    const commentCounts = childComments && childComments.length > 0
      ? childComments.length
      : undefined;

    const likeCount = item.likeCount ? item.likeCount : 0;

    // If comment is like, like icon is tinted with red
    const tintColor = maybeLikeRef && maybeLikeRef.length > 0
      ? '#f15860'
      : '#cbd6d8';

    return (
      <ActionButtonGroup containerStyle={{ height: 40 }}>
        <ActionButton
          iconSource={LikeIcon}
          count={likeCount}
          iconStyle={{ tintColor, height: 27, width: 27 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks like icon.`);
            if (maybeLikeRef && maybeLikeRef.length > 0) {
              return this.props.unLikeGoal('comment', _id, maybeLikeRef);
            }
            this.props.likeGoal('comment', _id);
          }}
        />
        <ActionButton
          iconSource={CommentIcon}
          count={commentCounts}
          iconStyle={{ tintColor: '#cbd6d8', height: 25, width: 25 }}
          onPress={() => {
            console.log('share');
            scrollToIndex(index, viewOffset);
            onCommentClicked();
            createComment({
              commentType: 'Reply',
              replyToRef: _id
            }, this.props.pageId);
          }}
        />
      </ActionButtonGroup>
    );
  }

  render() {
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
            {this.renderUserProfileImage()}
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

const ImageHeight = 38;

const styles = {
  containerStyle: {
    backgroundColor: 'white',
    marginTop: 0.5
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
    createReport
  }
)(ChildCommentCard);
