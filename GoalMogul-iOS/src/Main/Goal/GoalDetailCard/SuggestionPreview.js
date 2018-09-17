// This component is used to show the attached suggestion for comment box// This component is a ref on Comment / Post
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import { switchCaseFWithVal } from '../../../redux/middleware/utils';

// Assets
import badge from '../../../asset/utils/badge.png';
import profilePic from '../../../asset/test-profile-pic.png';
import cancelIcon from '../../../asset/utils/cancel_no_background.png';

// Components
import ProfileImage from '../../Common/ProfileImage';

class SuggestionPreview extends Component {

  // Currently this is a dummy component
  render() {
    const { item, suggestionType, onPress, onRemove } = this.props;
    if (!item) return '';

    const title = 'test title';
    const content = 'test content';
    return (
      <TouchableOpacity style={styles.containerStyle} onPress={onPress}>
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
        <View style={styles.iconContainerStyle}>
          <Image source={badge} style={{ height: 23, width: 23 }} />
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.iconContainerStyle}>
          <Image source={cancelIcon} style={{ height: 15, width: 15 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}
// <Text style={styles.titleTextStyle}>{title}</Text>
// <Text style={styles.headingTextStyle}>{content}</Text>

// type: ["General", "ShareUser", "SharePost", "ShareGoal", "ShareNeed"]
const switchCaseItem = (val, type) => switchCaseFWithVal(val)({
  General: () => ({
    title: undefined
  }),
  ShareUser: (item) => ({
    title: item.name,
    content: item.profile ? item.profile.about : undefined
  }),
  SharePost: (item) => ({
    title: item.owner ? item.owner.name : undefined,
    // TODO: TAG: convert this to string later on
    content: item.content ? item.content.text : undefined
  }),
  ShareGoal: (item) => ({
    title: item.title,
    // TODO: TAG: convert this to string later on
    content: item.details.text
  }),
  ShareNeed: (item) => ({
      title: undefined,
      content: item.description
  })
})('General')(type);

const styles = {
  containerStyle: {
    flexDirection: 'row',
    height: 50,
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
  },
  iconContainerStyle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default SuggestionPreview;
