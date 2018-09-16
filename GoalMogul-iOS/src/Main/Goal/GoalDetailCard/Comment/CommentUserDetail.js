import React, { Component } from 'react';
import {
  View,
  Image,
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
import CommentRef from './CommentRef';

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
    if (item.commentType === 'Suggestion') {
      text = item.suggestion.suggestionText;
    } else {
      text = item.content.text;
    }
    return (
      <Text
        style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 12 }}
        numberOfLines={3}
        ellipsizeMode='tail'
      >
        {text}
      </Text>
    );
  }

  // user basic information
  renderUserDetail() {
    const { item } = this.props;
    const { _id } = item;
    return (
        <View style={{ marginLeft: 15, flex: 1 }}>
          <CommentHeadline
            item={item}
            caretOnPress={() => {
              this.props.createReport(_id, 'detail', 'Comment');
            }}
          />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            {this.renderCardContent()}
          </View>
          {this.renderCommentRef(item)}
        </View>
    );
  }

  renderUserProfileImage() {
    return (
      <View style={styles.profileImageContianerStyle}>
        <Image source={defaultProfilePic} resizeMode='contain' style={styles.profileImageStyle} />
      </View>
    );
  }

  renderCommentRef(item) {
    return (
      <CommentRef item={item} />
    );
  }

  renderActionButtons() {
    const { item, index, scrollToIndex, onCommentClicked, viewOffset } = this.props;
    const { childComments, _id, maybeLikeRef } = item;
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
            // Update the position for FlatList
            scrollToIndex(index, viewOffset);
            // Focus the comment box
            onCommentClicked();
            // Update new comment reducer
            createComment({
              commentType: 'Reply',
              replyToRef: _id
            });
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
              marginBottom: 10,
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
    createReport
  }
)(CommentUserDetail);
