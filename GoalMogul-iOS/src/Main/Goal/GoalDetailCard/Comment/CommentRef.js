import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';

// Components
import ProfileImage from '../../../Common/ProfileImage';

// Assets
import badge from '../../../../asset/utils/badge.png';
import profilePic from '../../../../asset/test-profile-pic.png';
import stepIcon from '../../../../asset/utils/steps.png'
import needIcon from '../../../../asset/utils/help.png';
import eventIcon from '../../../../asset/suggestion/event.png';
import tribeIcon from '../../../../asset/suggestion/flag.png';
import userIcon from '../../../../asset/suggestion/friend.png';
import friendIcon from '../../../../asset/suggestion/group.png';
import linkIcon from '../../../../asset/suggestion/link.png';
import customIcon from '../../../../asset/suggestion/other.png';
import chatIcon from '../../../../asset/suggestion/chat.png';
import readingIcon from '../../../../asset/suggestion/book.png';

// Utils
import {
  switchCaseFWithVal
} from '../../../../redux/middleware/utils';

class CommentRef extends React.PureComponent {

  handleOnRefPress = () => {

  }

  // Render badge
  renderEndImage(item) {
    const { suggestionType } = item;
    if (suggestionType === 'User' || suggestionType === 'Friend') {
      return (
        <View style={styles.iconContainerStyle}>
          <Image source={badge} style={{ height: 23, width: 23 }} />
        </View>
      );
    }
    return '';
  }

  renderTextContent(item) {
    const { title, content } = getTextContent(item);
    return (
      <View style={{ flex: 1, marginLeft: 12, marginRight: 12, justifyContent: 'center' }}>
        <Text style={styles.titleTextStyle}>{title}</Text>
        <Text style={styles.headingTextStyle}>{content}</Text>
      </View>
    );
  }

  /**
   * Render corresponding image. If no image in the suggestion item,
   * show default icon.
   */
  renderImage(item) {
    const { suggestionType } = item;
    const defaultImage = switchDefaultImageType(suggestionType, item);
    const { source, style, imageUrl } = defaultImage;

    return (
      <ProfileImage
        imageStyle={{ width: 50, height: 50, ...style }}
        defaultImageSource={source}
        defaultImageStyle={{ width: 30, height: 30, ...style }}
        imageUrl={imageUrl}
        imageContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
      />
    );
  }

  // Currently this is a dummy component
  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View style={styles.containerStyle}>
        {this.renderImage(item)}
        {this.renderTextContent(item)}}
        {this.renderEndImage(item)}
      </View>
    );
  }
}

const switchDefaultImageType = (type, item) => switchCaseFWithVal(item)({
  ChatConvoRoom: val => ({
    source: chatIcon,
    style: undefined,
    imageUrl: undefined
  }),
  Event: val => {
    const { eventRef } = val;
    return ({
      source: eventIcon,
      imageUrl: eventRef.picture
    });
  },
  Tribe: val => {
    const { tribeRef } = val;
    return ({
      source: tribeIcon,
      imageUrl: tribeRef.picture
    });
  },
  Friend: val => {
    const { userRef } = val;
    return ({
      source: friendIcon,
      imageUrl: userRef.profile ? userRef.profile.image : undefined
    });
  },
  User: val => {
    const { userRef } = val;
    return ({
      source: userIcon,
      imageUrl: userRef.profile ? userRef.profile.image : undefined
    });
  },
  Reading: () => ({
    source: readingIcon
  }),
  Link: () => ({
    source: linkIcon
  }),
  Custom: () => ({
    source: customIcon
  }),
  Need: () => ({
    source: needIcon
  }),
  Step: () => ({
    source: stepIcon
  })
})('User')(type);

const getTextContent = (item) => {
  const {
    suggestionType,
    chatRoomRef,
    eventRef,
    tribeRef,
    suggestionLink,
    suggestionText,
    goalRef,
    userRef,
  } = item;

  let ret = {
    title: 'Sharon Warren',
    content: 'Editor at The Atlantic'
  };
  if ((suggestionType === 'User' || suggestionType === 'Friend') && userRef) {
    ret = {
      title: userRef.name,
      content: userRef.headline
    };
  }
  if (suggestionType === 'Tribe' && tribeRef) {
    ret = {
      title: tribeRef.name,
      content: tribeRef.description
    };
  }
  if (suggestionType === 'Event' && eventRef) {
    ret = {
      title: eventRef.title,
      content: eventRef.description
    };
  }
  if (suggestionType === 'Need' && suggestionText) {
    ret = {
      title: 'Need',
      content: suggestionText
    };
  }
  if (suggestionType === 'Step' && suggestionText) {
    ret = {
      title: 'Step',
      content: suggestionText
    };
  }
  if (suggestionType === 'ChatConvoRoom' && chatRoomRef) {
    ret = {
      title: chatRoomRef.title,
      content: ''
    };
  }
  return ret;
};

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
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1
  },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2
  },
  headingTextStyle: {
    fontSize: 9
  },
  iconContainerStyle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default CommentRef;
