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

const { width } = Dimensions.get('window');

class About extends Component {

  renderMemberStatus() {
    const count = '102';
    return (
      <View style={{ marginTop: 8, marginBottom: 5 }}>
        <Text>
          <Text style={styles.boldTextStyle}>{count} </Text>
          members
        </Text>
      </View>
    );
  }

  renderCreated() {
    const date = 'January 12, 2017';

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
      <View style={{ flex: 1, margin: 25, marginTop: 15 }}>
        {this.renderMemberStatus()}
        {this.renderCreated()}
        <Divider horizontal width={0.8 * width} borderColor='gray' />
        {this.renderDescription()}
      </View>
    );
  }
}

const styles = {
  iconContainerStyle: {
    height: 30,
    width: 40,
    alignItems: 'center',
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
