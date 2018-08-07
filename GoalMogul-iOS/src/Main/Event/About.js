import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image
} from 'react-native';

// Component
import Divider from '../Common/Divider';

// Asset
import Calendar from '../../asset/utils/calendar.png';
import LocationIcon from '../../asset/utils/location.png';
import DefaultUserProfile from '../../asset/test-profile-pic.png';

const { width } = Dimensions.get('window');

class About extends Component {

  renderLocation() {
    const location = 'The Mirage -- Brooklyn, New York';
    const {
      rowContainerStyle,
      iconContainerStyle,
      iconStyle,
      contentTextStyle
    } = styles;
    return (
      <View style={rowContainerStyle}>
        <View style={iconContainerStyle}>
          <Image source={LocationIcon} style={iconStyle} />
        </View>

        <Text style={contentTextStyle}>{location}</Text>
      </View>
    );
  }

  renderCreated() {
    const date = 'August 12, 2017';
    const startTime = '5pm';
    const endTime = '9pm';
    const {
      rowContainerStyle,
      iconContainerStyle,
      iconStyle,
      contentTextStyle,
      boldTextStyle
    } = styles;
    return (
      <View style={rowContainerStyle}>
        <View style={iconContainerStyle}>
          <Image source={Calendar} style={iconStyle} />
        </View>

        <Text style={contentTextStyle}>
          {date}
          <Text style={{ fontWeight: '700' }}>  {startTime} - {endTime}</Text>
        </Text>
      </View>
    );
  }

  renderDescription() {
    return (
      <View style={{ padding: 10 }}>
        <Text
          style={{ ...styles.subtitleTextStyle, marginTop: 5 }}
        >
          Description
        </Text>
        <Text style={styles.descriptionTextStyle}>
          This is a group for all artists currently living in or working out
          of SOHo, NY. We exchange ideas, get feedback from each other and
          help each other organize exhibits for our work.
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, margin: 25, marginTop: 15, paddingTop: 10 }}>
        {this.renderLocation()}
        {this.renderCreated()}
        <Divider horizontal width={0.8 * width} borderColor='gray' />
        {this.renderDescription()}
      </View>
    );
  }
}

const PictureDimension = 24;
const styles = {
  iconContainerStyle: {
    height: 30,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconStyle: {
    height: 26,
    width: 26
  },
  subtitleTextStyle: {
    fontStyle: 'italic',
    fontSize: 10,
    color: '#696969'
  },
  // text style for row content
  contentTextStyle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#696969',
    marginLeft: 8
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
  },
  rowContainerStyle: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center'
  }
};

export default About;
