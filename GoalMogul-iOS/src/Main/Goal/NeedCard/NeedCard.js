import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import timeago from 'timeago.js';
import R from 'ramda';

// Component
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import SectionCard from '../Common/SectionCard';
import NextButton from '../Common/NextButton';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfileImage from '../../Common/ProfileImage';

// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';

// Actions
import {
  likeGoal,
  unLikeGoal
} from '../../../redux/modules/like/LikeActions';

import {
  createReport
} from '../../../redux/modules/report/ReportActions';

import {
  openGoalDetail
} from '../../../redux/modules/home/mastermind/actions';

const DEBUG_KEY = '[ UI NeedCard ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to feed', 'Share to an event', 'Share to a tribe', 'Cancel'];
const CANCEL_INDEX = 3;

class NeedCard extends Component {

  handleShareOnClick = () => {
    const { item } = this.props;
    const { _id } = item;

    const shareToSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose to share to feed
        console.log(`${DEBUG_KEY} User choose destination: Feed `);
        this.props.chooseShareDest('ShareNeed', _id, 'feed', item);
        // TODO: update reducer state
      }],
      [R.equals(1), () => {
        // User choose to share to an event
        console.log(`${DEBUG_KEY} User choose destination: Event `);
        this.props.chooseShareDest('ShareNeed', _id, 'event', item);
      }],
      [R.equals(2), () => {
        // User choose to share to a tribe
        console.log(`${DEBUG_KEY} User choose destination: Tribe `);
        this.props.chooseShareDest('ShareNeed', _id, 'tribe', item);
      }],
    ]);

    const shareToActionSheet = actionSheet(
      SHARE_TO_MENU_OPTTIONS,
      CANCEL_INDEX,
      shareToSwitchCases
    );
    return shareToActionSheet();
  };

  // card central content
  renderCardContent(item) {
    const { description } = item;
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: '#505050' }}>
          {description}
        </Text>
      </View>
    );
  }

  // user basic information
  renderUserDetail(item) {
    const { created, needRequest, category, owner, _id } = item;
    const { description } = needRequest;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    return (
      <View style={{ flexDirection: 'row' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60 }}
          imageUrl={owner && owner.profile ? owner.profile.image : undefined}
          userId={owner._id}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            caretOnPress={() => this.props.createReport(_id, 'goal', 'Goal')}
            user={owner}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: '#818181', fontSize: 11 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {description}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  /**
   * Might need to change in the future since it should render the need that
   * user shared. Currently it's rendering all the needs.
   */
  renderNeed(item) {
    const { needs } = item;
    return needs.map((need, index) => {
      return (
        <SectionCard
          goalRef={item}
          key={index}
          item={need}
          onPress={() => this.props.openGoalDetail(item)}
          type='need'
        />
      );
    });
  }

  renderViewGoal(item) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10
        }}
        onPress={() => this.props.onPress(item)}
      >
        <Text style={styles.viewGoalTextStyle}>View Goal</Text>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#46C8F5'
            iconStyle={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>
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
        />
        <ActionButton
          iconSource={BulbIcon}
          count={commentCount}
          textStyle={{ color: '#FBDD0D' }}
          iconStyle={{ tintColor: '#FBDD0D', height: 26, width: 26 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks suggest icon`);
            this.props.onPress(this.props.item);
          }}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    const { item } = this.props;
    const { owner } = item;
    const { name } = owner;
    return (
      <View>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <View style={{ marginBottom: 0.5, backgroundColor: 'white', padding: 5 }}>
              <Text style={{ fontSize: 11 }}>
                <Text style={{ fontWeight: '800' }}>{name} </Text>
                  share a need
              </Text>
            </View>
            <View style={styles.containerStyle}>
              <View style={{ marginTop: 20, marginBottom: 20, marginRight: 15, marginLeft: 15 }}>
                {this.renderUserDetail(item)}
                {this.renderCardContent(item)}
              </View>
            </View>

            {this.renderNeed(item)}

            <View style={{ ...styles.containerStyle }}>
              {this.renderViewGoal(item)}
              {this.renderActionButtons()}
            </View>
          </View>
        </View>

        <NextButton onPress={() => console.log('press for next item')} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'white'
  },
  viewGoalTextStyle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#46C8F5',
    alignSelf: 'center'
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
    createReport,
    unLikeGoal,
    openGoalDetail
  }
)(NeedCard);
