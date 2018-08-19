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
import ProgressBar from '../../Common/ProgressBar';
import ActionButton from '../../Common/ActionButton';
import ActionButtonGroup from '../../Common/ActionButtonGroup';
import Headline from '../../Common/Headline';
import Timestamp from '../../Common/Timestamp';
import CommentHeadline from './CommentHeadline';

class CommentUserDetail extends Component {

  // user basic information
  renderUserDetail() {
    return (
        <View style={{ marginLeft: 15, flex: 1 }}>
          <CommentHeadline item={testComment} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              Establish a LMFBR near Westport, Connecticut by the year 2020
            </Text>
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

  // Render any suggestions
  renderCardContent() {
    return (
      <View style={{ marginTop: 20 }}>
        <ProgressBar startTime='Mar 2013' endTime='Nov 2011' />
      </View>
    );
  }

  renderActionButtons() {
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
          count={5}
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

const testComment = {
  owner: {
    name: 'Jia Zeng'
  },
  parentType: 'Goal',
  commentType: 'Suggestion',
  suggestion: {
    suggestionType: 'User',
    suggestionFor: 'Step',
    suggestionForRef: {
      order: 2,
      description: 'Find good books tes testset adfasdf'
    },
    suggestionText:
      'You should connect with Sharon! She\'s an avid reader and an incredible writer.',
    userRef: {

    }
  },
  parentRef: {

  }
};

export default CommentUserDetail;
