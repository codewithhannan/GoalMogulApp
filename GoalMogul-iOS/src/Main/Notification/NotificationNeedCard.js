import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import timeago from 'timeago.js';

// Components
import ProfileImage from '../Common/ProfileImage';
import Timestamp from '../Goal/Common/Timestamp';

// Assets
import bulb from '../../asset/utils/bulb.png';
import forward from '../../asset/utils/forward.png';

// Constants
const DEBUG_KEY = '[ UI NotificationNeedCard ]';

class NotificationCard extends React.Component {

  /**
   * When light bulb icon is clicked, it opens goal details and then
   * Opens suggestion modal
   */
  handleOnSuggestion = (item) => {

  }

  /**
   * When light bulb icon is clicked, it opens goal details
   */
  handleOnOpen = (item) => {

  }

  renderProfileImage(item) {
    return (
      <ProfileImage
        imageStyle={{ height: 50, width: 50 }}
        imageUrl={undefined}
        rounded
        imageContainerStyle={styles.imageContainerStyle}
      />
    );
  }

  renderNeed(item) {
    const { created } = item;
    // TODO: use the actual content
    const text = 'Introduction to some experts on mindfullness and meditation field.';
    const name = 'Tim Draper';

    return (
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text
          style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13, marginTop: 2 }}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          <Text style={{ fontWeight: '700' }}>{name}{': '}</Text>
          {text}
        </Text>
        <View style={{ marginBottom: 3 }}>
          <Timestamp time={timeago().format(created)} />
        </View>
      </View>
    );
  }

  renderActionIcons(item) {
    return (
      <View style={{ flexDirection: 'row', borderLeftWidth: 0.5, borderColor: '#dbdbdb' }}>
        <TouchableOpacity activeOpacity={0.85}
          style={{ ...styles.iconContainerStyle, backgroundColor: '#fdf9e5' }}
          onPress={() => this.handleOnSuggestion(item)}
        >
          <Image
            style={{ ...styles.iconStyle, tintColor: '#f6c44f' }}
            source={bulb}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85}
          style={{ ...styles.iconContainerStyle, backgroundColor: '#ebf9fe' }}
          onPress={() => this.handleOnOpen(item)}
        >
          <Image
            style={{ ...styles.iconStyle, tintColor: '#3aa5ce' }}
            source={forward}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return null;

    return (
      <View style={styles.cardContainerStyle}>
        {this.renderProfileImage(item)}
        {this.renderNeed(item)}
        {this.renderActionIcons(item)}
      </View>
    );
  }
}

const styles = {
  cardContainerStyle: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  iconContainerStyle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  iconStyle: {
    height: 16,
    width: 16,
    borderRadius: 8,
  },
};

export default NotificationCard;
