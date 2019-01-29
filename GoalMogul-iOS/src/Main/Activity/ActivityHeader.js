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
  deleteGoal,
} from '../../actions';

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

const DEBUG_KEY = '[ UI ActivityHeader ]';

class ActivityHeader extends Component {
  // user basic information
  renderUserDetail({ postRef, goalRef, actedUponEntityType, actor, actedWith }) {
    const item = actedUponEntityType === 'Post' ? postRef : goalRef;

    // If no ref is passed in, then render nothing
    if (!item) return '';

    // If it's a comment, we are rendering the goal/post owner's info rather than actor's info
    const userToRender = actedWith === 'Comment' || actedWith === 'Like' ? item.owner : actor;
    // console.log(`${DEBUG_KEY}: actedUponEntityType: ${actedUponEntityType}, 
    //   userToRender: `, userToRender);

    const { _id, created, category, maybeIsSubscribed } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    // TODO: TAG: for the content
    const content = actedUponEntityType === 'Post'
      ? item.content.text // Show content if entity type is post / share
      : item.title; // Show title if entity type is goal

    const tags = actedUponEntityType === 'Post' ? item.content.tags : [];

    const onDelete = actedUponEntityType === 'Post'
      ? () => this.props.deletePost(postRef._id)
      : () => this.props.deleteGoal(goalRef._id);

    const caret = {
      self: {
        options: [{ option: 'Delete' }],
        onPress: onDelete
      },
      others: {
        options: [
          { option: 'Report' }, 
          { option: maybeIsSubscribed ? 'Unsubscribe' : 'Subscribe' }
        ],
        onPress: (key) => {
          if (key === 'Report') {
            return this.props.createReport(_id, 'post', `${actedUponEntityType}`);
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
          <Timestamp time={timeago().format(timeStamp)} />
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
            textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
            textContainerStyle={{ flexDirection: 'row', marginTop: 10 }}
            numberOfLines={3}
            ellipsizeMode='tail'
            onUserTagPressed={(user) => {
              console.log(`${DEBUG_KEY}: user tag press for user: `, user);
              this.props.openProfile(user);
            }}
          />

        </View>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item)) return '';

    const { postRef, goalRef, actedUponEntityType, actor, actedWith } = item;

    return (
      <View>
        {this.renderUserDetail({ postRef, goalRef, actedUponEntityType, actor, actedWith })}
      </View>
    );
  }
}

const styles = {
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
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
    unsubscribeEntityNotification
  }
)(ActivityHeader);
