// This component is used to show the attached suggestion for comment box
// This component is a ref on Comment / Post
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import {
  switchCaseFWithVal
} from '../../../redux/middleware/utils';

// Assets
import badge from '../../../asset/utils/badge.png';
import cancelIcon from '../../../asset/utils/cancel_no_background.png';

import stepIcon from '../../../asset/utils/steps.png'
import needIcon from '../../../asset/utils/help.png';
import eventIcon from '../../../asset/suggestion/event.png';
import tribeIcon from '../../../asset/suggestion/flag.png';
import userIcon from '../../../asset/suggestion/friend.png';
import friendIcon from '../../../asset/suggestion/group.png';
import linkIcon from '../../../asset/suggestion/link.png';
import customIcon from '../../../asset/suggestion/other.png';
import chatIcon from '../../../asset/suggestion/chat.png';
import readingIcon from '../../../asset/suggestion/book.png';

// Components
import ProfileImage from '../../Common/ProfileImage';

class SuggestionPreview extends Component {

  // Render badge
  renderEndImage(suggestionType, selectedItem) {
    if (suggestionType === 'User' || suggestionType === 'Friend') {
      return (
        <View style={styles.iconContainerStyle}>
          <Image source={badge} style={{ height: 23, width: 23 }} />
        </View>
      );
    }
    return '';
  }

  // Render suggestion preview when suggesting a Link, Reading, Custom
  renderText(item) {
    const { suggestionType, selectedItem, suggestionText, suggestionLink } = item;
    let title;
    let content;
    if (suggestionType === 'Link' || suggestionType === 'Reading' || suggestionType === 'Custom') {
      title = suggestionText;
      content = suggestionLink;
    }

    if (suggestionType === 'Tribe' || suggestionType === 'Event' ||
        suggestionType === 'Friend' || suggestionType === 'User' ||
        suggestionType === 'ChatConvoRoom') {
      const switchedItem = switchSearchItem(selectedItem, suggestionType);
      title = switchedItem.title;
      content = switchedItem.content;
    }

    if (suggestionType === 'Need' || suggestionType === 'Step') {
      title = suggestionText;
    }

    const contentView = content
      ? (
        <Text
          style={styles.headingTextStyle}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {content}
        </Text>
      ) : '';

    return (
      <View style={{ flex: 1, marginLeft: 12, marginRight: 12, justifyContent: 'center' }}>

        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {title}
        </Text>
        {contentView}
      </View>
    );
  }

  renderImage(suggestionType, selectedItem) {
    const defaultImage = switchDefaultImageType(suggestionType, selectedItem);
    const { source, style, imageUrl } = defaultImage;

    return (
      <ProfileImage
        imageStyle={{ width: 50, height: 50, ...style }}
        defaultImageSource={source}
        defaultImageStyle={{ width: 30, height: 30, ...style }}
        imageUrl={imageUrl}
        imageContainerStyle={{ alignItems: 'center', justifyContent: 'center', marginLeft: 3 }}
      />
    );
  }

  // Currently this is a dummy component
  render() {
    const { item, onPress, onRemove } = this.props;
    const { suggestionType, selectedItem } = item;
    if (!item) return '';

    return (
      <TouchableOpacity style={styles.containerStyle} onPress={onPress}>
        {this.renderImage(suggestionType, selectedItem)}
        {this.renderText(item)}
        {this.renderEndImage(suggestionType, selectedItem)}
        {RemoveComponent(onRemove)}
      </TouchableOpacity>
    );
  }
}
// <Text style={styles.titleTextStyle}>{title}</Text>
// <Text style={styles.headingTextStyle}>{content}</Text>

const RemoveComponent = (onRemove) => {
  return (
    <TouchableOpacity onPress={onRemove} style={styles.iconContainerStyle}>
      <Image source={cancelIcon} style={{ height: 15, width: 15 }} />
    </TouchableOpacity>
  );
};

// ["ChatConvoRoom", "Event", "Tribe", "Link", "Reading",
// "Step", "Need", "Friend", "User", "Custom"]
const switchSearchItem = (val, type) => switchCaseFWithVal(val)({
  ChatConvoRoom: (item) => ({
    title: 'Chatroom',
    content: 'Chatroom description',
    picture: undefined
  }),
  Event: (item) => ({
    title: item.title,
    content: item.description,
    picture: item.picture
  }),
  Tribe: (item) => ({
    title: item.name,
    content: item.description,
    picture: item.picture
  }),
  Friend: (item) => ({
    title: item.name,
    content: item.profile ? item.profile.about : undefined,
    picture: item.profile ? item.profile.picture : undefined
  }),
  User: (item) => ({
    title: item.name,
    content: item.profile ? item.profile.about : undefined,
    picture: item.profile ? item.profile.picture : undefined
  })
})('User')(type);

const switchDefaultImageType = (type, item) => switchCaseFWithVal(item)({
  ChatConvoRoom: val => ({
    source: chatIcon,
    style: undefined,
    imageUrl: undefined
  }),
  Event: val => ({
    source: eventIcon,
    imageUrl: val.picture
  }),
  Tribe: val => ({
    source: tribeIcon,
    imageUrl: val.picture
  }),
  Friend: val => ({
    source: friendIcon,
    imageUrl: val.profile ? val.profile.picture : undefined
  }),
  User: val => ({
    source: userIcon,
    imageUrl: val.profile ? val.profile.picture : undefined
  }),
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
