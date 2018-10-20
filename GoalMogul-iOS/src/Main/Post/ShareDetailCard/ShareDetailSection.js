import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
import _ from 'lodash';
import R from 'ramda';

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

// Assets
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';
import cancel from '../../../asset/utils/cancel_no_background.png';
import photoIcon from '../../../asset/utils/photoIcon.png';
import expand from '../../../asset/utils/expand.png';

import TestImage from '../../../asset/TestEventImage.png';

// Components
import ProgressBar from '../../Goal/Common/ProgressBar';
import ActionButton from '../../Goal/Common/ActionButton';
import ActionButtonGroup from '../../Goal/Common/ActionButtonGroup';
import Headline from '../../Goal/Common/Headline';
import Timestamp from '../../Goal/Common/Timestamp';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfileImage from '../../Common/ProfileImage';
import RefPreview from '../../Common/RefPreview';

// Constants
const DEBUG_KEY = '[ UI ShareDetailCard.ShareDetailSection ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to feed', 'Share to an event', 'Share to a tribe', 'Cancel'];
const CANCEL_INDEX = 3;
const { width } = Dimensions.get('window');

class ShareDetailSection extends Component {
  state = {
    mediaModal: false
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

  // user basic information
  renderUserDetail(item) {
    // TODO: TAG: for content
    const { _id, created, content, owner, category } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;
    // console.log('item is: ', item);
    return (
      <View style={{ flexDirection: 'row' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60 }}
          imageUrl={owner && owner.profile ? owner.profile.picture : undefined}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name || ''}
            category={category}
            isSelf={this.props.userId === owner._id}
            caretOnDelete={() => this.props.deletePost(_id)}
            caretOnPress={() => {
              console.log('I am pressed on PostDetailSEction');
              this.props.createReport(_id, 'postDetail', 'Post');
            }}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {content.text}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  // Current media type is only picture
  renderPostImage(url) {
    // TODO: update this to be able to load image
    if (!url) {
      return '';
    }
    const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${url}`;
      return (
        <View style={{ marginTop: 10 }}>
          <ImageBackground
            style={styles.mediaStyle}
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
              onPress={() => this.setState({ mediaModal: true })}
              style={{ position: 'absolute', top: 10, right: 15 }}
            >
              <Image
                source={expand}
                style={{ width: 15, height: 15, tintColor: '#fafafa' }}
              />
            </TouchableOpacity>
          </ImageBackground>
          {this.renderPostImageModal(imageUrl)}
        </View>
      );
  }


  renderPostImageModal(imageUrl) {
    if (!imageUrl) {
      return '';
    }
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.mediaModal}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black'
          }}
        >
          <TouchableOpacity
            onPress={() => { this.setState({ mediaModal: false }); }}
            style={{ position: 'absolute', top: 30, left: 15, padding: 10 }}
          >
            <Image
              source={cancel}
              style={{
                ...styles.cancelIconStyle,
                tintColor: 'white'
              }}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: imageUrl }}
            style={{ width, height: 200 }}
            resizeMode='cover'
          />
        </View>
      </Modal>
    );
  }

  // TODO: Switch to decide amoung renderImage, RefPreview and etc.
  renderCardContent(item) {
    const { postType, mediaRef } = item;
    if (postType === 'General') {
      return this.renderPostImage(mediaRef);
    }
    const refPreview = switchItem(item, postType);
    const onPress = switchCase({
      SharePost: () => this.props.openPostDetail(refPreview),
      ShareUser: () => this.props.openProfile(refPreview._id),
      ShareGoal: () => this.props.openGoalDetail(refPreview),
      ShareNeed: () => this.props.openGoalDetail(refPreview)
    })('SharePost')(postType);

    return (
      <View style={{ marginTop: 20 }}>
        <RefPreview
          item={refPreview}
          postType={postType}
          onPress={onPress}
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
      ? { backgroundColor: '#f9d6c9' }
      : { backgroundColor: 'white' };

    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={likeCount}
          iconContainerStyle={likeButtonContainerStyle}
          iconStyle={{ tintColor: '#f15860' }}
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
          iconStyle={{ tintColor: '#a8e1a0', height: 32, width: 32 }}
          onPress={() => this.handleShareOnClick()}
        />
        <ActionButton
          iconSource={BulbIcon}
          count={commentCount}
          iconStyle={{ tintColor: '#f5eb6f', height: 26, width: 26 }}
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
    if (!item || _.isEmpty(item) || !item.created) return '';

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
  ShareNeed: item.needRef
})('SharePost')(postType);

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
    deletePost
  }
)(ShareDetailSection);
