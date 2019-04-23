import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image
} from 'react-native';

// Component
import Divider from '../Common/Divider';
import { StackedAvatarsV2 } from '../Common/StackedAvatars';

// Asset
import Calendar from '../../asset/utils/calendar.png';

const { width } = Dimensions.get('window');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEBUG_KEY = '[ UI Tribe.About ]';

class About extends Component {

  renderMemberStatus(item) {
    const { members, memberCount } = item;
    const count = memberCount || 0;
    return (
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 5 }}>
        <StackedAvatarsV2 tribeMembers={members} />
        <Text style={{ alignSelf: 'center' }}>
          <Text style={styles.boldTextStyle}>{count} </Text>
          members
        </Text>
      </View>
    );
    
  }

  renderCreated(item) {
    const newDate = item.created ? new Date(item.created) : new Date();
    const date = `${months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;

    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          marginBottom: 10,
          alignItems: 'center'
        }}
      >
        <View style={styles.iconContainerStyle}>
          <Image source={Calendar} style={styles.iconStyle} />
        </View>

        <View style={{ padding: 5 }}>
          <Text style={styles.subtitleTextStyle}>Created</Text>
          <Text style={styles.boldTextStyle}>{date}</Text>
        </View>
      </View>
    );
  }

  renderDescription(item) {
    const description = item.description
      ? item.description
      : 'Currently this event has no decription.';

    return (
      <View style={{ padding: 10 }}>
        <Text
          style={{ ...styles.subtitleTextStyle, marginTop: 5 }}
        >
          Description
        </Text>
        <Text style={styles.descriptionTextStyle}>
          {description}
        </Text>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return <View />;

    return (
      <View style={{ flex: 1, margin: 25, marginTop: 15 }}>
        {this.renderMemberStatus(item)}
        {this.renderCreated(item)}
        <Divider horizontal width={0.8 * width} borderColor='gray' />
        {this.renderDescription(item)}
      </View>
    );
  }
}

const PictureDimension = 24;
const styles = {
  iconContainerStyle: {
    height: 30,
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  iconStyle: {
    height: 28,
    width: 28
  },
  subtitleTextStyle: {
    fontStyle: 'italic',
    fontSize: 10,
    color: '#696969'
  },
  boldTextStyle: {
    fontSize: 13,
    fontWeight: '700'
  },
  descriptionTextStyle: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 8,
    color: '#696969'
  }
};

export default About;
