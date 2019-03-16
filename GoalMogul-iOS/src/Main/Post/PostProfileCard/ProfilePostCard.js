// This component is used to display post on a user's profile page
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import R from 'ramda';
import timeago from 'timeago.js';

// Actions
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

} from '../../../redux/modules/home/mastermind/actions';

import { deletePost, openProfile } from '../../../actions';

import {
  subscribeEntityNotification,
  unsubscribeEntityNotification
} from '../../../redux/modules/notification/NotificationActions';

// Assets
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';

// Components
import ActionButton from '../../Goal/Common/ActionButton';
import ActionButtonGroup from '../../Goal/Common/ActionButtonGroup';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfilePostBody from './ProfilePostBody';
import ProfileImage from '../../Common/ProfileImage';
import RichText from '../../Common/Text/RichText';
import Headline from '../../Goal/Common/Headline';
import Timestamp from '../../Goal/Common/Timestamp';

// Constants
const DEBUG_KEY = '[ UI GoalDetailCard2.GoalDetailSection ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;

class ProfilePostCard extends React.PureComponent {

  handleCardOnPress = (item) => {
    if (item) {
      return this.props.openPostDetail({ ...item });
    }
  }

  handleShareOnClick = (item) => {
    const { _id } = item;
    const shareType = 'SharePost';

    const shareToSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose to share to feed
        console.log(`${DEBUG_KEY} User choose destination: Feed `);
        this.props.chooseShareDest(shareType, _id, 'feed', item);
        // TODO: update reducer state
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

  renderActionButtons(item, hasActionButton) {
    // Sanity check if ref exists
    if (!item || !hasActionButton) return null;

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
      <View style={{ ...styles.containerStyle, marginTop: 1 }}>
        <ActionButtonGroup>
          <ActionButton
            iconSource={LoveIcon}
            count={likeCount}
            textStyle={{ color: '#f15860' }}
            iconContainerStyle={likeButtonContainerStyle}
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
            onPress={() => this.handleShareOnClick(item)}
            disabled={isShare}
          />
          <ActionButton
            iconSource={BulbIcon}
            count={commentCount}
            textStyle={{ color: '#FBDD0D' }}
            iconStyle={{ tintColor: '#FBDD0D', height: 26, width: 26 }}
            onPress={() => {
              console.log(`${DEBUG_KEY}: user clicks suggest icon`);
              this.props.onPress(item);
            }}
          />
        </ActionButtonGroup>
      </View>
    );
  }

  renderHeader(item) {
    const { owner, _id, created, maybeIsSubscribed } = item;
    const timeStamp = created || new Date();

    const caret = {
      self: {
        options: [
          { option: 'Delete' },
          { option: 'Edit Post' }
        ],
        onPress: (key) => {
          if (key === 'Delete') {
            return this.props.deletePost(_id);
          }
          if (key === 'Edit Post') {
            // Open post detail with a callback to open post edition
            const initial = {
              initialShowPostModal: true
            };
            return this.props.openPostDetail(item, initial)
          }
        },
        shouldExtendOptionLength: false
      },
      others: {
        options: [
          { option: 'Report' }, 
          { option: maybeIsSubscribed ? 'Unsubscribe' : 'Subscribe' }
        ],
        onPress: (key) => {
          if (key === 'Report') {
            return this.props.createReport(_id, 'profile', 'Post');
          }
          if (key === 'Unsubscribe') {
            return this.props.unsubscribeEntityNotification(_id, 'Post');
          }
          if (key === 'Subscribe') {
            return this.props.subscribeEntityNotification(_id, 'Post');
          }
        },
      }
    };

    // TODO: TAG:
    const { text, tags } = item.content;

    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60, borderRadius: 5 }}
          imageUrl={owner && owner.profile ? owner.profile.image : undefined}
          imageContainerStyle={styles.imageContainerStyle}
          userId={owner._id}
        />

        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name || ''}
            isSelf={this.props.userId === owner._id}
            caret={caret}
            user={owner}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <RichText
            contentText={text}
            contentTags={tags}
            textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
            textContainerStyle={{ flexDirection: 'row', marginTop: 10 }}
            numberOfLines={3}
            ellipsizeMode='tail'
            onUserTagPressed={(user) => {
              console.log(`${DEBUG_KEY}: user tag press for user: `, user);
              this.props.openProfile(user);
            }}
          />
          {/*
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text
                style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              >
                {content}
              </Text>
            </View>
          */}
        </View>
      </View>
    );
  }

  render() {
    const { item, hasActionButton } = this.props;
    if (!item || _.isEmpty(item)) return null;

    return (
      <View style={{ marginTop: 3, marginBottom: 3 }}>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ ...styles.containerStyle, marginTop: 1 }}>
            <View
              style={{
                marginTop: 12,
                marginBottom: 10,
                marginRight: 12,
                marginLeft: 12 }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => this.handleCardOnPress(item)}
              >
                {this.renderHeader(item)}
              </TouchableOpacity>
              <ProfilePostBody item={item} />
            </View>
          </View>
          {this.renderActionButtons(item, hasActionButton)}
          {/*
            Temperoraily remove action icons from ProfilePostCard. It was at line 194.
            <View style={{ ...styles.containerStyle, marginTop: 1 }}>
              {this.renderActionButtons(item)}
            </View>
            */}
          </View>
      </View>
    );
  }
}

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
  borderShadow: {
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
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
    createCommentFromSuggestion,
    chooseShareDest,
    openPostDetail,
    deletePost,
    openProfile,
    subscribeEntityNotification,
    unsubscribeEntityNotification
  }
)(ProfilePostCard);
