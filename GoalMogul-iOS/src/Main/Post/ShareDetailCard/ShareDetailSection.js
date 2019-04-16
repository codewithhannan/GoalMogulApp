import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
import _ from 'lodash';
import R from 'ramda';
import { Actions } from 'react-native-router-flux';

import {
  switchCase
} from '../../../redux/middleware/utils';

// Actions
import {
  createReport
} from '../../../redux/modules/report/ReportActions';

import {
  likeGoal,
  unLikeGoal
} from '../../../redux/modules/like/LikeActions';

import {
  createCommentFromSuggestion
} from '../../../redux/modules/feed/comment/CommentActions';

import {
  chooseShareDest
} from '../../../redux/modules/feed/post/ShareActions';

import {
  openPostDetail
} from '../../../redux/modules/feed/post/PostActions';

import {
  openProfile,
  deletePost
} from '../../../actions';

import {
  openGoalDetail
} from '../../../redux/modules/home/mastermind/actions';

import {
  subscribeEntityNotification,
  unsubscribeEntityNotification
} from '../../../redux/modules/notification/NotificationActions';

// Assets
import LoveIcon from '../../../asset/utils/love.png';
// import BulbIcon from '../../../asset/utils/bulb.png';
import CommentIcon from '../../../asset/utils/comment.png';
import ShareIcon from '../../../asset/utils/forward.png';
import cancel from '../../../asset/utils/cancel_no_background.png';
import photoIcon from '../../../asset/utils/photoIcon.png';
import expand from '../../../asset/utils/expand.png';

// import TestImage from '../../../asset/TestEventImage.png';

// Components
import ActionButton from '../../Goal/Common/ActionButton';
import ActionButtonGroup from '../../Goal/Common/ActionButtonGroup';
import Headline from '../../Goal/Common/Headline';
import Timestamp from '../../Goal/Common/Timestamp';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfileImage from '../../Common/ProfileImage';
import RefPreview from '../../Common/RefPreview';
import ImageModal from '../../Common/ImageModal';
import RichText from '../../Common/Text/RichText';

// Styles
import { imagePreviewContainerStyle, APP_BLUE } from '../../../styles';

// Constants
import {
  IMAGE_BASE_URL,
  CARET_OPTION_NOTIFICATION_SUBSCRIBE,
  CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
} from '../../../Utils/Constants';

const DEBUG_KEY = '[ UI ShareDetailCard.ShareDetailSection ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;
const { width } = Dimensions.get('window');

class ShareDetailSection extends Component {
  state = {
    mediaModal: false,
    numberOfLines: undefined,
    seeMore: true
  }

  handleShareOnClick = () => {
    const { item } = this.props;
    const { _id } = item;
    const shareType = 'SharePost';

    const shareToSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose to share to feed
        console.log(`${DEBUG_KEY} User choose destination: Feed `);
        this.props.chooseShareDest(shareType, _id, 'feed', item);
      }],
      [R.equals(1), () => {
        // User choose to share to an event
        console.log(`${DEBUG_KEY} User choose destination: Event `);
        this.props.chooseShareDest(shareType, _id, 'event', item);
      }],
      [R.equals(2), () => {
        // User choose to share to a tribe
        console.log(`${DEBUG_KEY} User choose destination: Tribe `);
        this.props.chooseShareDest(shareType, _id, 'tribe', item);
      }],
    ]);

    const shareToActionSheet = actionSheet(
      SHARE_TO_MENU_OPTTIONS,
      CANCEL_INDEX,
      shareToSwitchCases
    );
    return shareToActionSheet();
  };

  handleSeeMore = () => {
    if (this.state.seeMore) {
      // See less
      this.setState({
        ...this.state,
        numberOfLines: 2,
        seeMore: false
      });
      return;
    }
    // See more
    this.setState({
      ...this.state,
      numberOfLines: undefined,
      seeMore: true
    });
  }

  renderSeeMore(text) {
    if (text && text.length > 60) {
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.seeMoreTextContainerStyle}
          onPress={this.handleSeeMore}
        >
          <Text style={styles.seeMoreTextStyle}>
            {this.state.seeMore && text.length > 100 ? 'See less' : 'See more'}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  // user basic information
  renderUserDetail(item) {
    // TODO: TAG: for content
    const { _id, created, content, owner, category, maybeIsSubscribed } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    const caret = {
      self: {
        options: [{ option: 'Delete' }],
        onPress: () => {
          this.props.deletePost(_id);
          Actions.pop();
        },
        shouldExtendOptionLength: false
      },
      others: {
        options: [
          { option: 'Report' }, 
          { option: maybeIsSubscribed ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE : CARET_OPTION_NOTIFICATION_SUBSCRIBE }
        ],
        onPress: (key) => {
          if (key === 'Report') {
            return this.props.createReport(_id, 'postDetail', 'Post');
          }
          if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
            return this.props.unsubscribeEntityNotification(_id, 'Post');
          }
          if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
            return this.props.subscribeEntityNotification(_id, 'Post');
          }
        },
        shouldExtendOptionLength: false
      }
    };
    // console.log('item is: ', item);
    return (
      <View style={{ flexDirection: 'row' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60, borderRadius: 5 }}
          imageUrl={owner && owner.profile ? owner.profile.image : undefined}
          imageContainerStyle={styles.imageContainerStyle}
          userId={owner._id}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name || ''}
            category={category}
            isSelf={this.props.userId === owner._id}
            caret={caret}
            user={owner}
            pageId={this.props.pageId}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          {/*
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text
                style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
                numberOfLines={3}
                ellipsizeMode='tail'
              >
                {content.text}
              </Text>
            </View>
          */}
          <RichText
            contentText={content.text}
            contentTags={content.tags}
            textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
            textContainerStyle={{ flexDirection: 'row', marginTop: 10 }}
            numberOfLines={this.state.numberOfLines}
            ellipsizeMode='tail'
            onUserTagPressed={(user) => {
              console.log(`${DEBUG_KEY}: user tag press for user: `, user);
              this.props.openProfile(user);
            }}
          />
          {this.renderSeeMore(content.text)}
        </View>
      </View>
    );
  }

  // Current media type is only picture
  renderPostImage(url) {
    // TODO: update this to be able to load image
    if (!url) {
      return null;
    }
    const imageUrl = `${IMAGE_BASE_URL}${url}`;
      return (
        <View style={{ marginTop: 10 }}>
          <ImageBackground
            style={{ ...styles.mediaStyle, ...imagePreviewContainerStyle }}
            source={{ uri: imageUrl }}
            imageStyle={{ borderRadius: 8, opacity: 0.7, resizeMode: 'cover' }}
          >
            <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
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
            </View>

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
          {this.renderPostImageModal(imageUrl)}
        </View>
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

  // TODO: Switch to decide amoung renderImage, RefPreview and etc.
  renderCardContent(item) {
    const { postType, mediaRef, goalRef } = item;
    if (postType === 'General') {
      return this.renderPostImage(mediaRef);
    }
    const refPreview = switchItem(item, postType);
    let onPress;
    if (refPreview !== null && !_.isEmpty(refPreview)) {
      onPress = switchCase({
        SharePost: () => this.props.openPostDetail(refPreview),
        ShareUser: () => this.props.openProfile(refPreview._id),
        ShareGoal: () => this.props.openGoalDetail(goalRef),
        ShareNeed: () => this.props.openGoalDetail(goalRef),
        ShareStep: () => this.props.openGoalDetail(goalRef)
      })(() => console.warn(`${DEBUG_KEY}: invalid item:`, item))(postType);
    }
    
    return (
      <View style={{ marginTop: 20 }}>
        <RefPreview
          item={refPreview}
          postType={postType}
          onPress={onPress}
          goalRef={goalRef}
        />
      </View>
    );
  }

  renderActionButtons() {
    const { item } = this.props;
    const { maybeLikeRef, _id } = item;

    const likeCount = item.likeCount ? item.likeCount : 0;
    const commentCount = item.commentCount ? item.commentCount : 0;
    const shareCount = item.shareCount ? item.shareCount : 0;

    const likeButtonContainerStyle = maybeLikeRef && maybeLikeRef.length > 0
      ? { backgroundColor: '#FAD6C8' }
      : { backgroundColor: 'white' };

    // User shouldn't share a share. When Activity on a post which is a share,
    // We disable the share button.
    const isShare = item.postType !== 'General';

    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={likeCount}
          textStyle={{ color: '#f15860' }}
          iconContainerStyle={likeButtonContainerStyle}
          iconStyle={{ tintColor: '#f15860', borderRadius: 5, height: 20, width: 22 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks like icon.`);
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
          onPress={() => this.handleShareOnClick()}
          disabled={isShare}
        />
        <ActionButton
          iconSource={CommentIcon}
          count={commentCount}
          textStyle={{ color: '#FBDD0D' }}
          iconStyle={{ tintColor: '#FBDD0D', height: 26, width: 26 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks suggestion icon.`);
            this.props.createCommentFromSuggestion({
              commentDetail: {
                parentType: 'Post',
                parentRef: _id,
                commentType: 'Suggestion',
                replyToRef: undefined
              },
              suggestionForRef: _id,
              suggestionFor: 'Post'
            }, this.props.pageId);
            this.props.onSuggestion();
          }}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item) || !item.created) return null;

    return (
      <View>
        <View style={{ ...styles.containerStyle }}>
          <View style={{ marginTop: 20, marginBottom: 10, marginRight: 15, marginLeft: 15 }}>
            {this.renderUserDetail(item)}
            {this.renderCardContent(item)}
          </View>
        </View>

        <View style={styles.containerStyle}>
          {this.renderActionButtons(item)}
        </View>
      </View>
    );
  }
}

const switchItem = (item, postType) => switchCase({
  SharePost: item.postRef,
  ShareUser: item.userRef,
  ShareGoal: item.goalRef,
  ShareNeed: getNeedFromRef(item.goalRef, item.needRef),
  ShareStep: getStepFromGoal(item.goalRef, item.stepRef)
})({})(postType);

const getStepFromGoal = (goal, stepRef) => getItemFromGoal(goal, 'steps', stepRef);

const getNeedFromRef = (goal, needRef) => getItemFromGoal(goal, 'needs', needRef);

const getItemFromGoal = (goal, type, ref) => {
  let ret;
  if (goal && typeof goal === 'object') {
    _.get(goal, `${type}`).forEach((item) => {
      if (item._id === ref) {
        ret = item;
      }
    });
  }
  return ret;
};

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
  mediaStyle: {
    height: width / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelIconStyle: {
    height: 20,
    width: 20,
    justifyContent: 'flex-end'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  },
  seeMoreTextContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2
  },
  seeMoreTextStyle: {
    fontSize: 12,
    color: APP_BLUE
  }
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
    createReport,
    likeGoal,
    unLikeGoal,
    createCommentFromSuggestion,
    chooseShareDest,
    openPostDetail,
    openProfile,
    openGoalDetail,
    deletePost,
    subscribeEntityNotification,
    unsubscribeEntityNotification
  }
)(ShareDetailSection);
