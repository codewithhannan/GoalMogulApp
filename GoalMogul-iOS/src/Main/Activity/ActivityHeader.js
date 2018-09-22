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

// Assets

// Components
import Headline from '../Goal/Common/Headline';
import Timestamp from '../Goal/Common/Timestamp';
import ProfileImage from '../Common/ProfileImage';

class ActivityHeader extends Component {
  // user basic information
  renderUserDetail({ postRef, goalRef, actedUponEntityType }) {
    const item = actedUponEntityType === 'Post' ? postRef : goalRef;

    // If no ref is passed in, then render nothing
    if (!item) return '';

    const { _id, created, owner, category } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    // TODO: TAG: for the content
    const content = actedUponEntityType === 'Post'
      ? item.content.text // Show content if entity type is post / share
      : item.title; // Show title if entity type is goal

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
            caretOnPress={() => {
              this.props.createReport(_id, 'post', `${actedUponEntityType}`);
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

    const { postRef, goalRef, actedUponEntityType } = item;

    return (
      <View>
        {this.renderUserDetail({ postRef, goalRef, actedUponEntityType })}
      </View>
    );
  }
}

export default connect(
  null,
  {
    createReport
  }
)(ActivityHeader);
