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

// Assets

// Components
import Headline from '../Goal/Common/Headline';
import Timestamp from '../Goal/Common/Timestamp';
import ProfileImage from '../Common/ProfileImage';
import RichText from '../Common/Text/RichText';

const DEBUG_KEY = '[ UI ActivityHeader ]';

class ActivityHeader extends Component {
  // user basic information
  renderUserDetail({ postRef, goalRef, actedUponEntityType, actor }) {
    const item = actedUponEntityType === 'Post' ? postRef : goalRef;

    // If no ref is passed in, then render nothing
    if (!item) return '';

    const { _id, created, category } = item;
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

    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60, borderRadius: 5 }}
          imageUrl={actor && actor.profile ? actor.profile.image : undefined}
          imageContainerStyle={styles.imageContainerStyle}
          userId={actor._id}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={actor.name || ''}
            category={category}
            caretOnPress={() => {
              this.props.createReport(_id, 'post', `${actedUponEntityType}`);
            }}
            user={actor}
            isSelf={this.props.userId === actor._id}
            caretOnDelete={onDelete}
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

    const { postRef, goalRef, actedUponEntityType, actor } = item;

    return (
      <View>
        {this.renderUserDetail({ postRef, goalRef, actedUponEntityType, actor })}
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
  }
)(ActivityHeader);
