import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import R from 'ramda';

// Actions
import {
  openProfile
} from '../../actions';

import {
  likeGoal,
  unLikeGoal
} from '../../redux/modules/like/LikeActions';

import {

} from '../../redux/modules/feed/comment/CommentActions';

import {
  chooseShareDest
} from '../../redux/modules/feed/post/ShareActions';

import {
  openPostDetail
} from '../../redux/modules/feed/post/PostActions';

import {
  openGoalDetail
} from '../../redux/modules/home/mastermind/actions';

import {
  refreshFeed
} from '../../redux/modules/home/feed/actions';

// Assets
import LoveIcon from '../../asset/utils/love.png';
import BulbIcon from '../../asset/utils/bulb.png';
import ShareIcon from '../../asset/utils/forward.png';
import CommentIcon from '../../asset/utils/comment.png';

// Components
import ActionButton from '../Goal/Common/ActionButton';
import ActionButtonGroup from '../Goal/Common/ActionButtonGroup';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';
import ActivityHeader from './ActivityHeader';
import ActivityBody from './ActivityBody';
import ActivitySummary from './ActivitySummary';
import ProfileImage from '../Common/ProfileImage';
import Headline from '../Goal/Common/Headline';
import ImageModal from '../Common/ImageModal';
import RichText from '../Common/Text/RichText';
import CommentRef from '../Goal/GoalDetailCard/Comment/CommentRef';

// Styles
import { imagePreviewContainerStyle } from '../../styles';

// Constants
import {
  IMAGE_BASE_URL
} from '../../Utils/Constants';


const DEBUG_KEY = '[ UI ActivityCard ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;
const { width } = Dimensions.get('window');

class ActivityCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mediaModal: false
    };
    this.renderCommentRef = this.renderCommentRef.bind(this);
    this.renderMedia = this.renderMedia.bind(this);
  }

  handleCardOnPress = (item, props) => {
    const { goalRef, postRef, actedUponEntityType } = item;
    const propsToPass = props ? props : {};
    if (actedUponEntityType === 'Post') {
      return this.props.openPostDetail({ ...postRef });
    }

    if (actedUponEntityType === 'Goal') {
      return this.props.openGoalDetail({ ...goalRef }, propsToPass);
    }
  }

  handleShareOnClick = (actedUponEntityType) => {
    const { item } = this.props;
    const { goalRef, postRef } = item;
    const shareType = `Share${actedUponEntityType}`;

    const itemToShare = actedUponEntityType === 'Post' ? postRef : goalRef;
    if (itemToShare === null) {
      console.warn(`${DEBUG_KEY}: invalid shared item: `, item);
      return;
    }

    const callback = () => {
      this.props.refreshFeed();
    };

    const shareToFeedCallback = () => {
      this.props.onShareCallback();
      this.props.refreshFeed();
    };
    // Share ref is the id of the item to share
    const { _id } = itemToShare;
    const shareToSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose to share to feed
        console.log(`${DEBUG_KEY} User choose destination: Feed `);
        this.props.chooseShareDest(shareType, _id, 'feed', itemToShare, undefined, shareToFeedCallback);
        // TODO: update reducer state
      }],
      [R.equals(1), () => {
        // User choose to share to an event
        console.log(`${DEBUG_KEY} User choose destination: Event `);
        this.props.chooseShareDest(shareType, _id, 'event', itemToShare, undefined, callback);
      }],
      [R.equals(2), () => {
        // User choose to share to a tribe
        console.log(`${DEBUG_KEY} User choose destination: Tribe `);
        this.props.chooseShareDest(shareType, _id, 'tribe', itemToShare, undefined, callback);
      }],
    ]);

    const shareToActionSheet = actionSheet(
      SHARE_TO_MENU_OPTTIONS,
      CANCEL_INDEX,
      shareToSwitchCases
    );
    return shareToActionSheet();
  };

  renderActionButtons({ postRef, goalRef, actedUponEntityType, actedWith }) {
    const item = actedUponEntityType === 'Post' ? postRef : goalRef;
    // Sanity check if ref exists
    if (!item) return null;

    const { maybeLikeRef, _id } = item;

    const likeCount = item.likeCount ? item.likeCount : 0;
    const commentCount = item.commentCount ? item.commentCount : 0;
    const shareCount = item.shareCount ? item.shareCount : 0;

    const likeButtonContainerStyle = maybeLikeRef && maybeLikeRef.length > 0
      ? { backgroundColor: '#FAD6C8' }
      : { backgroundColor: 'white' };

    // User shouldn't share a share. When Activity on a post which is a share,
    // We disable the share button.
    const isShare = actedUponEntityType === 'Post' && postRef.postType !== 'General';

    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={likeCount}
          iconContainerStyle={likeButtonContainerStyle}
          textStyle={{ color: '#f15860' }}
          iconStyle={{ tintColor: '#f15860', borderRadius: 5, height: 20, width: 22 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks Like Icon.`);
            if (maybeLikeRef && maybeLikeRef.length > 0) {
              return this.props.unLikeGoal('post', _id, maybeLikeRef);
            }
            this.props.likeGoal('post', _id);
          }}
        />
        <ActionButton
          iconSource={ShareIcon}
          count={shareCount}
          textStyle={{ color: '#a8e1a0' }}
          iconStyle={{ tintColor: '#a8e1a0', height: 32, width: 32 }}
          onPress={() => this.handleShareOnClick(actedUponEntityType)}
          disabled={isShare}
        />
        <ActionButton
          iconSource={CommentIcon}
          count={commentCount}
          textStyle={{ color: '#FCB110' }}
          iconStyle={{ tintColor: '#FCB110', height: 26, width: 26 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks suggest icon`);
            this.props.onPress(
              item, 
              (actedWith === 'Comment' || actedWith === 'Like') && actedUponEntityType === 'Goal'
            );
          }}
        />
      </ActionButtonGroup>
    );
  }

  // If this is a comment activity, render comment summary
  renderComment(item) {
    // CommentRef shouldn't be null as we already sanity check the activity card
    const { actedWith, commentRef, actor } = item;
    if (actedWith !== 'Comment') return null;

    // console.log(`${DEBUG_KEY}: commentRef: `, commentRef);
    const { content, mediaRef, suggestion } = commentRef;
    const {
      text,
      tags
    } = content;

    const { profile, _id, name } = actor;
    return (
      <View style={{ flexDirection: 'row', padding: 15 }}>
        <ProfileImage 
          imageStyle={{ height: 35, width: 35, borderRadius: 4 }}
          imageUrl={profile ? profile.image : undefined}
          imageContainerStyle={{ ...styles.imageContainerStyle, marginTop: 2 }}
          userId={_id}
        />
        <TouchableOpacity
          activeOpacity={0.6} 
          style={{ 
            backgroundColor: 'white', 
            padding: 8, 
            borderRadius: 10, 
            borderWidth: 0.5,
            borderColor: '#f2f2f2',
            marginLeft: 10, flex: 1
          }}
          onPress={() => this.handleCardOnPress(item, { focusType: 'comment' })}
        >
          <Headline
            name={name || ''}
            user={actor}
            hasCaret={false}
            isSelf={this.props.userId === _id}
            textStyle={{ fontSize: 12 }}
          />
          <RichText
            contentText={text}
            contentTags={tags}
            textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 12 }}
            textContainerStyle={{ flexDirection: 'row', marginTop: 5, }}
            numberOfLines={2}
            ellipsizeMode='tail'
            onUserTagPressed={(user) => {
              console.log(`${DEBUG_KEY}: user tag press for user: `, user);
              this.props.openProfile(user);
            }}
          />
          {this.renderMedia(mediaRef)}
          {this.renderCommentRef(suggestion)}
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Render commentRef
   * @param {object} item 
   */
  renderCommentRef(item) {
    return (
      <CommentRef item={item} />
    );
  }

  renderMedia(url) {
    if (!url) {
      return null;
    }
    const imageUrl = `${IMAGE_BASE_URL}${url}`;
      return (
        <TouchableWithoutFeedback
          onPress={() => this.setState({ mediaModal: true })}
        >
          <View style={{ marginTop: 5 }}>
            <ImageBackground
              style={{ ...styles.mediaStyle, ...imagePreviewContainerStyle }}
              source={{ uri: imageUrl }}
              imageStyle={{ borderRadius: 8, resizeMode: 'cover' }}
            >
            </ImageBackground>
            {this.renderPostImageModal(imageUrl)}
          </View>
        </TouchableWithoutFeedback>
      );
  }

  renderPostImageModal(imageUrl) {
    return (
      <ImageModal
        mediaRef={imageUrl}
        mediaModal={this.state.mediaModal}
        closeModal={() => this.setState({ mediaModal: false })}
      />
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item) || !isValidActivity(item)) return null;

    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <ActivitySummary item={item} />
            <View style={{ ...styles.containerStyle, marginTop: 1 }}>
              <View style={{ marginTop: 12, marginBottom: 10, marginRight: 15, marginLeft: 15 }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.handleCardOnPress(item)}
                >
                  <ActivityHeader item={item} />
                </TouchableOpacity>
                <ActivityBody item={item} />
              </View>
            </View>
          <View style={{ ...styles.containerStyle, marginTop: 1 }}>
            {this.renderActionButtons(item)}
          </View>
          {this.renderComment(item)}
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'white',

  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  },
  mediaStyle: {
    height: width / 3,
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  borderShadow: {
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  }
};

const isValidActivity = (item) => {
  if (!item || _.isEmpty(item)) return false;
  const { actedUponEntityType, goalRef, postRef, actedWith, commentRef, actor } = item;
  if (actedUponEntityType === 'Goal' && (!goalRef || goalRef === null)) {
    return false;
  }

  if (actedUponEntityType === 'Post' && (!postRef || postRef === null)) {
    return false;
  }

  if (actedWith === 'Comment' && commentRef === null) {
    return false;
  }

  if (actor === null) return false;
  return true;
};

const mapStateToProps = state => {
  const { userId } = state.user;

  return {
    userId
  };
};

export default connect(
  mapStateToProps,
  {
    likeGoal,
    unLikeGoal,
    chooseShareDest,
    openPostDetail,
    openGoalDetail,
    refreshFeed,
    openProfile
  }
)(ActivityCard);
