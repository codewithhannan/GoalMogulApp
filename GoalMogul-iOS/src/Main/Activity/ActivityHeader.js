import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
import _ from 'lodash';

// Actions
import {
  createReport
} from '../../redux/modules/report/ReportActions';

import {
  openProfile,
  deletePost,
  deleteGoal
} from '../../actions';

import { openPostDetail } from '../../redux/modules/feed/post/PostActions';

import { openGoalDetail } from '../../redux/modules/home/mastermind/actions';

import {
  shareGoalToMastermind
} from '../../redux/modules/goal/GoalDetailActions';

import {
  subscribeEntityNotification,
  unsubscribeEntityNotification
} from '../../redux/modules/notification/NotificationActions';

// Assets

// Components
import Headline from '../Goal/Common/Headline';
import Timestamp from '../Goal/Common/Timestamp';
import ProfileImage from '../Common/ProfileImage';
import RichText from '../Common/Text/RichText';
import DelayedButton from '../Common/Button/DelayedButton';

// Utils
import { makeCaretOptions, PAGE_TYPE_MAP } from '../../redux/middleware/utils';

// Constants
import {
  CARET_OPTION_NOTIFICATION_SUBSCRIBE,
  CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
  SHOW_SEE_MORE_TEXT_LENGTH
} from '../../Utils/Constants';

import { APP_BLUE } from '../../styles';

const DEBUG_KEY = '[ UI ActivityHeader ]';

class ActivityHeader extends Component {

  renderSeeMore(postRef, actedUponEntityType) {
    const hasLongText = postRef && postRef.content && postRef.content.text && postRef.content.text.length > SHOW_SEE_MORE_TEXT_LENGTH;
    const showSeeMore = actedUponEntityType === 'Post' && hasLongText;

    if (!showSeeMore) return null;
    return(
      <DelayedButton
        onPress={() => this.props.openPostDetail(postRef)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 2
        }}
      >
        <Text 
          style={{
            fontSize: 12,
            color: APP_BLUE
          }}
        >
          See more
        </Text>
      </DelayedButton>
    );
  }

  // user basic information
  renderUserDetail({ postRef, goalRef, actedUponEntityType, actor, actedWith, created }) {
    const item = actedUponEntityType === 'Post' ? postRef : goalRef;

    // If no ref is passed in, then render nothing
    if (!item) return null;

    const { viewCount, priority } = item;

    // If it's a comment, we are rendering the goal/post owner's info rather than actor's info
    const userToRender = actedWith === 'Comment' || actedWith === 'Like' ? item.owner : actor;
    // console.log(`${DEBUG_KEY}: actedUponEntityType: ${actedUponEntityType}, 
    //   userToRender: `, userToRender);

    const { _id, category, maybeIsSubscribed } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    // TODO: TAG: for the content
    const content = actedUponEntityType === 'Post'
      ? item.content.text // Show content if entity type is post / share
      : item.title; // Show title if entity type is goal

    const tags = actedUponEntityType === 'Post' && item.content ? item.content.tags : [];
    const links = actedUponEntityType === 'Post' && item.content ? item.content.links : [];

    const pageId = _.get(PAGE_TYPE_MAP, 'activity');
    const onDelete = actedUponEntityType === 'Post'
      ? () => this.props.deletePost(postRef._id, pageId)
      : () => this.props.deleteGoal(goalRef._id, pageId);

    // COnstruct caret options
    const selfOptions = makeCaretOptions(actedUponEntityType, goalRef, postRef);

    // Construct caret onPress functions
    const selfOnPress = (key) => {
      if (key === 'Delete') {
        return onDelete();
      }
      if (key === 'Edit Post') {
        const initial = {
          initialShowPostModal: true
        };
        return this.props.openPostDetail(postRef, initial);
      }
      
      // Goal related situations
      let initialProps = {};
      if (key === 'Edit Goal') {
        initialProps = { initialShowGoalModal: true };
        this.props.openGoalDetail(goalRef, initialProps);
        return;
      }
      if (key === 'Share to Goal Feed') {
        // It has no pageId so it won't have loading animation
        return this.props.shareGoalToMastermind(_id);
      }
      if (key === 'Mark as Complete') {
        initialProps = { 
          initialMarkGoalAsComplete: true,
          refreshGoal: false
        };
        this.props.openGoalDetail(goalRef, initialProps);
        return;
      }

      if (key === 'Unmark as Complete') {
        initialProps = { 
          initialUnMarkGoalAsComplete: true,
          refreshGoal: false
        };
        this.props.openGoalDetail(goalRef, initialProps);
        return;
      }

    };

    const caret = {
      self: {
        options: [...selfOptions],
        onPress: selfOnPress,
        shouldExtendOptionLength: actedUponEntityType === 'Goal'
      },
      others: {
        options: [
          { option: 'Report' }, 
          { option: maybeIsSubscribed ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE : CARET_OPTION_NOTIFICATION_SUBSCRIBE }
        ],
        onPress: (key) => {
          if (key === 'Report') {
            return this.props.createReport(_id, 'post', `${actedUponEntityType}`);
          }
          if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
            return this.props.unsubscribeEntityNotification(_id, 'Post');
          }
          if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
            return this.props.subscribeEntityNotification(_id, 'Post');
          }
        },
      }
    }; 

    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60, borderRadius: 5 }}
          imageUrl={userToRender && userToRender.profile ? userToRender.profile.image : undefined}
          imageContainerStyle={styles.imageContainerStyle}
          userId={userToRender._id}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={userToRender.name || ''}
            category={category}
            caret={caret}
            user={userToRender}
            isSelf={this.props.userId === userToRender._id}
          />
          <Timestamp time={timeago().format(timeStamp)} viewCount={viewCount} priority={priority} />
          {/*
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text
                style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
                numberOfLines={3}
                ellipsizeMode='tail'
              >
                {content}
              </Text>
            </View>
          */}
          <RichText
            contentText={content}
            contentTags={tags}
            contentLinks={links || []}
            textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
            textContainerStyle={{ flexDirection: 'row', marginTop: 10 }}
            numberOfLines={3}
            ellipsizeMode='tail'
            onUserTagPressed={(user) => {
              console.log(`${DEBUG_KEY}: user tag press for user: `, user);
              this.props.openProfile(user);
            }}
          />
          {this.renderSeeMore(postRef, actedUponEntityType)}
        </View>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item)) return null;

    const { postRef, goalRef, actedUponEntityType, actor, actedWith, created } = item;

    return (
      <View>
        {this.renderUserDetail({ postRef, goalRef, actedUponEntityType, actor, actedWith, created })}
      </View>
    );
  }
}

const styles = {
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  }
};

const mapStateToProps = (state) => {
  const { userId } = state.user;
  return {
    userId
  };
};

export default connect(
  mapStateToProps,
  {
    createReport,
    openProfile,
    deletePost,
    deleteGoal,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    openPostDetail,
    openGoalDetail,
    shareGoalToMastermind
  }
)(ActivityHeader);
