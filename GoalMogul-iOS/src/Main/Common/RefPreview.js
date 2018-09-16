// This component is a ref on Comment / Post
import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';

import { switchCaseF } from '../../redux/middleware/utils';

// Assets
import badge from '../../asset/utils/badge.png';
import profilePic from '../../asset/test-profile-pic.png';

// Components
import ProfileImage from './ProfileImage';

class RefPreview extends Component {

  // Currently this is a dummy component
  render() {
    const { item, postType } = this.props;
    if (!item) return '';

    const { title, content } = switchCaseItem(item, postType);
    console.log('item and postType are: ', item, postType);
    console.log('title and contents are: ', title, content);
    return (
      <View style={styles.containerStyle}>
        <ProfileImage
          imageStyle={{ width: 50, height: 50 }}
          defaultImageSource={profilePic}
        />
        <View style={{ flex: 1, marginLeft: 12, marginRight: 12, justifyContent: 'center' }}>

            <Text
              style={styles.titleTextStyle}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {title}
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
const switchCaseItem = (item, type) => switchCaseF({
  General: {
    title: undefined
  },
  ShareUser: {
    title: item.name,
    content: item.profile ? item.profile.about : undefined
  },
  SharePost: {
    title: item.owner ? item.owner.name : undefined,
    // TODO: TAG: convert this to string later on
    content: item.content ? item.content.text : undefined
  },
  ShareGoal: {
    title: item.title,
    // TODO: TAG: convert this to string later on
    content: item.details.text
  },
  ShareNeed: {
    title: item.description,
    content: undefined
  }
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
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 2,
    flexWrap: 'wrap',
    flex: 1,
  },
  headingTextStyle: {
    fontSize: 9,
    flexWrap: 'wrap',
    flex: 1,

  }
};

export default RefPreview;
