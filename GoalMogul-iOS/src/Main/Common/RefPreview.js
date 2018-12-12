// This component is a ref on Comment / Post
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

import { switchCaseFWithVal } from '../../redux/middleware/utils';

// Actions
import {
  openPostDetail
} from '../../redux/modules/feed/post/PostActions';

import {
  openGoalDetail
} from '../../redux/modules/home/mastermind/actions';

// Assets
import badge from '../../asset/utils/badge.png';
import helpIcon from '../../asset/utils/help.png';
import lightBulb from '../../asset/utils/lightBulb.png';
import profilePic from '../../asset/utils/defaultUserProfile.png';
import stepIcon from '../../asset/utils/steps.png';

// Components
import ProfileImage from './ProfileImage';

class RefPreview extends Component {
  handleOnPress(item, postType, goalRef) {
    // console.log('goalref is : ', goalRef);
    if (postType === 'ShareGoal' || postType === 'ShareNeed' || postType === 'ShareStep') {
      return this.props.openGoalDetail(goalRef);
    }

    if (postType === 'ShareUser') {
      return;
    }

    if (postType === 'SharePost') {
      return this.props.openPostDetail(item);
    }
  }

  renderBadge = (item, postType) => {
    if (postType === 'ShareUser') {
      // TODO: render badge accordingly based on the user points
      return (
        <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={badge} style={{ height: 23, width: 23 }} />
        </View>
      );
    }
    return '';
  }

  // Currently this is a dummy component
  render() {
    const { item, postType, goalRef } = this.props;
    if (!item) return '';

    // TODO: add a postType ShareStep
    const { title, content, defaultPicture, picture } = switchCaseItem(item, postType);
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.containerStyle}
        onPress={() => this.handleOnPress(item, postType, goalRef)}
      >
        <ProfileImage
          imageStyle={{ width: 50, height: 50 }}
          imageContainerStyle={{ justifyContent: 'center', padding: 10 }}
          defaultImageStyle={{ width: 32, height: 32, opacity: 0.6 }}
          defaultImageSource={defaultPicture}
          imageUrl={picture}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 0,
            paddingTop: 7,
            paddingBottom: 7,
            paddingRight: 12,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={styles.titleTextStyle}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {postType === 'ShareNeed' ? 'Need' : title}
            </Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text
              style={styles.headingTextStyle}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {content}
            </Text>
          </View>

        </View>
        {this.renderBadge(item, postType)}
      </TouchableOpacity>
    );
  }
}
// <Text style={styles.titleTextStyle}>{title}</Text>
// <Text style={styles.headingTextStyle}>{content}</Text>

// type: ["General", "ShareUser", "SharePost", "ShareGoal", "ShareNeed"]
const switchCaseItem = (val, type) => switchCaseFWithVal(val)({
  General: () => ({
    title: undefined, // This case will never happen since it's creating a post
  }),
  ShareUser: (item) => ({
    title: item.name,
    content: item.profile ? item.profile.about : undefined,
    picture: item.profile ? item.profile.image : undefined,
    defaultPicture: profilePic,
  }),
  SharePost: (item) => ({
    title: item.owner ? item.owner.name : undefined,
    // TODO: TAG: convert this to string later on
    content: item.content ? item.content.text : undefined,
    picture: item.media ? item.media : undefined,
    defaultPicture: lightBulb,
  }),
  ShareGoal: (item) => ({
    title: item.title,
    // TODO: TAG: convert this to string later on
    content: item.details.text,
    picture: item.profile ? item.profile.image : undefined,
    defaultPicture: profilePic,
  }),
  ShareNeed: (item) => ({
    title: undefined,
    content: item.description,
    // picture: item.profile ? item.profile.image : undefined,
    defaultPicture: helpIcon
  }),
  ShareStep: (item) => ({
    title: 'Step',
    content: item.description,
    defaultPicture: stepIcon
  })
})('General')(type);

const styles = {
  containerStyle: {
    flexDirection: 'row',
    height: 50,
    marginTop: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#f2f2f2',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1
  },
  titleTextStyle: {
    fontSize: 11,
    fontWeight: '600',
    flexWrap: 'wrap',
    flex: 1
  },
  headingTextStyle: {
    fontSize: 12,
    flexWrap: 'wrap',
    flex: 1,
  }
};

export default connect(
  null,
  {
    openPostDetail,
    openGoalDetail
  }
)(RefPreview);
