// This component is a ref on Comment / Post
import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';

import { switchCaseFWithVal } from '../../redux/middleware/utils';

// Assets
import badge from '../../asset/utils/badge.png';
import helpIcon from '../../asset/utils/help.png';
import lightBulb from '../../asset/utils/lightBulb.png';
import profilePic from '../../asset/test-profile-pic.png';

// Components
import ProfileImage from './ProfileImage';

class RefPreview extends Component {

  // Currently this is a dummy component
  render() {
    const { item, postType } = this.props;
    if (!item) return '';

    const { title, content, defaultPicture, picture } = switchCaseItem(item, postType);
    return (
      <View style={styles.containerStyle}>
        <ProfileImage
          imageStyle={{ width: 50, height: 50 }}
          defaultImageSource={defaultPicture}
          imageUrl={picture}
        />
        <View style={{ flex: 1, marginLeft: 12, marginRight: 12, justifyContent: 'center' }}>

            <Text
              style={styles.titleTextStyle}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {postType === 'ShareNeed' ? 'Need' : title}
            </Text>


            <Text
              style={styles.headingTextStyle}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {content}
            </Text>

        </View>
        <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={badge} style={{ height: 23, width: 23 }} />
        </View>
      </View>
    );
  }
}
// <Text style={styles.titleTextStyle}>{title}</Text>
// <Text style={styles.headingTextStyle}>{content}</Text>

// type: ["General", "ShareUser", "SharePost", "ShareGoal", "ShareNeed"]
const switchCaseItem = (val, type) => switchCaseFWithVal(val)({
  General: () => ({
    title: undefined // This case will never happen since it's creating a post
  }),
  ShareUser: (item) => ({
    title: item.name,
    content: item.profile ? item.profile.about : undefined,
    picture: item.profile ? item.profile.image : undefined,
    defaultPicture: profilePic
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
    defaultPicture: profilePic
  }),
  ShareNeed: (item) => ({
    title: undefined,
    content: item.description,
    // picture: item.profile ? item.profile.image : undefined,
    defaultPicture: helpIcon
  })
})('General')(type);

const styles = {
  containerStyle: {
    flexDirection: 'row',
    height: 50,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1
  },
  titleTextStyle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    flexWrap: 'wrap',
    flex: 1,
  },
  headingTextStyle: {
    fontSize: 10,
    flexWrap: 'wrap',
    flex: 1,
  }
};

export default RefPreview;
