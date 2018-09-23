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
import Headline from '../../Goal/Common/Headline';
import Timestamp from '../../Goal/Common/Timestamp';

// Constants
const DEBUG_KEY = '[ UI GoalDetailCard2.GoalDetailSection ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to feed', 'Share to an event', 'Share to a tribe', 'Cancel'];
const CANCEL_INDEX = 3;

class ProfilePostCard extends Component {

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

  renderActionButtons(item) {
    // Sanity check if ref exists
    if (!item) return '';

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
          iconStyle={{ tintColor: '#a8e1a0', height: 32, width: 32 }}
          onPress={() => this.handleShareOnClick(item)}
        />
        <ActionButton
          iconSource={BulbIcon}
          count={commentCount}
          iconStyle={{ tintColor: '#f5eb6f', height: 26, width: 26 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks suggest icon`);
            this.props.onPress(item);
          }}
        />
      </ActionButtonGroup>
    );
  }

  renderHeader(item) {
    const { owner, _id, created } = item;
    const timeStamp = created || new Date();

    // TODO: TAG:
    const content = item.content.text;

    return (
      <View style={{ flexDirection: 'row' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60 }}
          imageUrl={owner && owner.profile ? owner.profile.picture : undefined}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name || ''}
            caretOnPress={() => {
              this.props.createReport(_id, 'profile', 'Post');
            }}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {content}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item)) return '';

    return (
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ ...styles.containerStyle, marginTop: 1 }}>
            <View style={{ marginTop: 20, marginBottom: 10, marginRight: 15, marginLeft: 15 }}>
              <TouchableOpacity
                onPress={() => this.handleCardOnPress(item)}
              >
                {this.renderHeader(item)}
              </TouchableOpacity>
              <ProfilePostBody item={item} />
            </View>
          </View>
          <View style={{ ...styles.containerStyle, marginTop: 1 }}>
            {this.renderActionButtons(item)}
          </View>
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
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  }
};

export default connect(
  null,
  {
    likeGoal,
    unLikeGoal,
    createCommentFromSuggestion,
    chooseShareDest,
    openPostDetail,
  }
)(ProfilePostCard);
