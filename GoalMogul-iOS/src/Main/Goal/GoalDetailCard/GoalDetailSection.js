import React, { Component } from 'react';
import {
  View,
  Text,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
import _ from 'lodash';
import R from 'ramda';

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
  editGoal,
  shareGoalToMastermind,
  markGoalAsComplete
} from '../../../redux/modules/goal/GoalDetailActions';

import { deleteGoal } from '../../../actions';

// Assets
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';
import EditIcon from '../../../asset/utils/edit.png';
import CheckIcon from '../../../asset/utils/check.png';

// Components
import ProgressBar from '../Common/ProgressBar';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfileImage from '../../Common/ProfileImage';
import IndividualActionButton from '../Common/IndividualActionButton';

// Constants
const DEBUG_KEY = '[ UI GoalDetailCard2.GoalDetailSection ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;

class GoalDetailSection extends Component {

  handleShareOnClick = () => {
    const { item } = this.props;
    const { _id } = item;
    const shareType = 'ShareGoal';

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

  // user basic information
  renderUserDetail(item) {
    const { _id, created, title, owner, category } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;
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
            caretOnDelete={() => this.props.deleteGoal(_id)}
            caretOnPress={() => {
              console.log('I am pressed');
              this.props.createReport(_id, 'detail', 'Goal');
            }}
            user={owner}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {title}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  renderCardContent(item) {
    const { start, end, steps, needs } = item;
    return (
      <View style={{ marginTop: 20 }}>
        <ProgressBar
          startTime={start}
          endTime={end}
          steps={steps}
          needs={needs}
          goalRef={item}
        />
      </View>
    );
  }

  // If this goal belongs to current user, display Edit goal, Share to Mastermind, Mark complete
  renderSelfActionButtons(item) {
    const { _id, isCompleted, feedInfo } = item;
    const hasShareToMastermind = feedInfo && !_.isEmpty(feedInfo);
    const markCompleteStyle = isCompleted
      ? {
          containerStyle: { backgroundColor: '#ecf9e9' },
          textStyle: { color: '#9fcd8d' }
        }
      : {
          // containerStyle: { backgroundColor: '#eafcee' }
        };

    const markCompleteOnPress = isCompleted
      ? () => {
        Alert.alert(
          'Confirmation',
          'Are you sure to mark this goal as incomplete?', [
          { text: 'Cancel', onPress: () => console.log('user cancel unmark') },
          { text: 'Confirm', onPress: () => this.props.markGoalAsComplete(_id, false) }]
        );
      }
      : () => this.props.markGoalAsComplete(_id, true);

    return (
      <View style={styles.selfActionButtonsContainerStyle}>
        <IndividualActionButton
          buttonName='Edit goal'
          iconSource={EditIcon}
          iconStyle={{ tintColor: '#3f3f3f' }}
          onPress={() => this.props.editGoal(item)}
        />
        <IndividualActionButton
          buttonName='Mastermind'
          iconSource={ShareIcon}
          iconStyle={{ tintColor: '#3f3f3f' }}
          onPress={() => this.props.shareGoalToMastermind(_id)}
        />
        <IndividualActionButton
          buttonName='Mark Complete'
          iconSource={CheckIcon}
          iconStyle={{ tintColor: '#3f3f3f', height: 13 }}
          textStyle={markCompleteStyle.textStyle}
          containerStyle={markCompleteStyle.containerStyle}
          onPress={markCompleteOnPress}
        />
      </View>
    );
  }

  renderActionButtons(item) {
    const { maybeLikeRef, _id } = item;

    if (this.props.isSelf) {
      return this.renderSelfActionButtons(item);
    }

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
              return this.props.unLikeGoal('goal', _id, maybeLikeRef);
            }
            this.props.likeGoal('goal', _id);
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
          iconStyle={{ tintColor: '#FBDD0D', height: 26, width: 26 }}
          textStyle={{ color: '#FBDD0D' }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks suggestion icon.`);
            this.props.createCommentFromSuggestion({
              commentDetail: {
                parentType: 'Goal',
                parentRef: _id,
                commentType: 'Suggestion',
                replyToRef: undefined
              },
              suggestionForRef: _id,
              suggestionFor: 'Goal'
            });
            this.props.onSuggestion();
          }}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item)) return '';

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
  selfActionButtonsContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    margin: 20
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
    createReport,
    likeGoal,
    unLikeGoal,
    createCommentFromSuggestion,
    chooseShareDest,
    editGoal,
    shareGoalToMastermind,
    markGoalAsComplete,
    deleteGoal
  }
)(GoalDetailSection);
