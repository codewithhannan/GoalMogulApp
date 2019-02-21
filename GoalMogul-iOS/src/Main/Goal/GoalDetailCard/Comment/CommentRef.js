import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Expo, { WebBrowser } from 'expo';

// Components
import ProfileImage from '../../../Common/ProfileImage';
import RichText from '../../../Common/Text/RichText';

// Assets
import badge from '../../../../asset/utils/badge.png';
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

// Actions
import {
  openProfile,
  UserBanner
} from '../../../../actions';

import {
  myTribeDetailOpenWithId
} from '../../../../redux/modules/tribe/MyTribeActions';

import {
  myEventDetailOpenWithId
} from '../../../../redux/modules/event/MyEventActions';

const DEBUG_KEY = '[ UI CommentRef ]';

class CommentRef extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleSuggestionLinkOnPress = this.handleSuggestionLinkOnPress.bind(this);
    this.handleSuggestionLinkOnClose = this.handleSuggestionLinkOnClose.bind(this);
  }

  handleSuggestionLinkOnPress = async (url) => {
    const returnUrl = Expo.Linking.makeUrl('/');
    Expo.Linking.addEventListener('url', this.handleSuggestionLinkOnClose);
    const result = await WebBrowser.openBrowserAsync(url);
    Expo.Linking.removeEventListener('url', this.handleSuggestionLinkOnClose);
    console.log(`${DEBUG_KEY}: close suggestion link with res: `, result);
  } 

  handleSuggestionLinkOnClose = (event) => {
    WebBrowser.dismissBrowser();
    // TODO: parse url and determine verification states
    const { path, queryParams } = Expo.Linking.parse(event.url);
    console.log(`${DEBUG_KEY}: suggestion link close with path: ${path} and param: `, queryParams);
  }

  handleOnRefPress = (item) => {
    const {
      suggestionType,
      chatRoomRef,
      eventRef,
      tribeRef,
      suggestionLink,
      // suggestionText,
      // goalRef,
      userRef,
    } = item;
    if ((suggestionType === 'User' || suggestionType === 'Friend') && userRef) {
      return this.props.openProfile(userRef._id);
    }
    if (suggestionType === 'Tribe' && tribeRef) {
      return this.props.myTribeDetailOpenWithId(tribeRef._id);
    }
    if (suggestionType === 'Event' && eventRef) {
      return this.props.myEventDetailOpenWithId(eventRef._id);
    }
    if (suggestionType === 'NewNeed') {
      return;
    }
    if (suggestionType === 'NewStep') {
      return;
    }
    if (suggestionType === 'ChatConvoRoom' && chatRoomRef) {
      // TODO: update later
      console.log(`${DEBUG_KEY}: suggestion type is ChatConvoRoom, chatRoomRef is: `, chatRoomRef);
    }
    if (suggestionType === 'Custom' && suggestionLink) {
      this.handleSuggestionLinkOnPress(suggestionLink);
      return;
    }
  }

  // Render badge
  renderEndImage(item) {
    const { suggestionType, userRef } = item;
    if ((suggestionType === 'User' || suggestionType === 'Friend') && userRef !== null && userRef !== undefined) {
      return (
        <View style={styles.iconContainerStyle}>
          <UserBanner user={userRef} iconStyle={{ height: 24, width: 22 }} />
        </View>
      );
    }
    return '';
  }

  renderTextContent(item) {
    const { title, content } = getTextContent(item);
    return (
      <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
        <Text 
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {title}
        </Text>
        <RichText
          contentText={content}
          textStyle={{ 
            ...styles.headingTextStyle, flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 10 
          }}
          textContainerStyle={{ flexDirection: 'row' }}
          numberOfLines={2}
          ellipsizeMode='tail'
          handleUrlPress={this.handleSuggestionLinkOnPress}
          onUserTagPressed={() => console.log(`${DEBUG_KEY}: user tag pressed`)}
        />
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
        imageContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          height: 50,
          padding: 10
        }}
      />
    );
  }

  // Currently this is a dummy component
  render() {
    const { item } = this.props;
    if (!item) return '';
    const { suggestionType, suggestionText, suggestionLink } = item;

    // if suggestionType is Custom and no suggestionText and suggestionLink,
    // then it's a suggestionComment for a step or a need
    // If suggestionText is {} which is an empty object, it means that it's
    // a suggestion comment for a step / need
    if (suggestionType === 'Custom' &&
        (!suggestionText || _.isEmpty(suggestionText) || suggestionText === '{}') &&
        (!suggestionLink || _.isEmpty(suggestionLink))) {
      return '';
    }

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.containerStyle}
        onPress={() => this.handleOnRefPress(item)}
      >
        {this.renderImage(item)}
        {this.renderTextContent(item)}}
        {this.renderEndImage(item)}
      </TouchableOpacity>
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
  NewNeed: () => ({
    source: needIcon
  }),
  NewStep: () => ({
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
    title: 'Content deleted',
    content: ''
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
  if (suggestionType === 'NewNeed' && suggestionText) {
    ret = {
      title: 'Suggested need',
      content: suggestionText
    };
  }
  if (suggestionType === 'NewStep' && suggestionText) {
    ret = {
      title: 'Suggested step',
      content: suggestionText
    };
  }
  if (suggestionType === 'ChatConvoRoom' && chatRoomRef) {
    ret = {
      title: chatRoomRef.title,
      content: ''
    };
  }

  if (suggestionType === 'Custom') {
    ret = {
      title: suggestionText || 'Suggested Link',
      content: suggestionLink
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

export default connect(
  null,
  {
    openProfile,
    myTribeDetailOpenWithId,
    myEventDetailOpenWithId
  }
)(CommentRef);
