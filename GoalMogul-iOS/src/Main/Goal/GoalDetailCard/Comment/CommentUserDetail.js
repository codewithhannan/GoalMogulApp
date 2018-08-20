import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';

// Assets
import defaultProfilePic from '../../../../asset/utils/defaultUserProfile.png';
import LikeIcon from '../../../../asset/utils/like.png';
import CommentIcon from '../../../../asset/utils/comment.png';

// Components
import ActionButton from '../../Common/ActionButton';
import ActionButtonGroup from '../../Common/ActionButtonGroup';
import CommentHeadline from './CommentHeadline';

class CommentUserDetail extends Component {

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
    return (
        <View style={{ marginLeft: 15, flex: 1 }}>
          <CommentHeadline item={this.props.item} />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            {this.renderCardContent()}
          </View>

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

  renderActionButtons() {
    const { childComments } = this.props.item;
    const commentCounts = childComments && childComments.length > 0
      ? childComments.length
      : undefined;

    return (
      <ActionButtonGroup containerStyle={{ height: 40 }}>
        <ActionButton
          iconSource={LikeIcon}
          count={22}
          iconStyle={{ tintColor: '#cbd6d8', height: 27, width: 27 }}
          onPress={() => console.log('like')}
        />
        <ActionButton
          iconSource={CommentIcon}
          count={commentCounts}
          iconStyle={{ tintColor: '#cbd6d8', height: 25, width: 25 }}
          onPress={() => console.log('share')}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    return (
      <View>
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

export default CommentUserDetail;
