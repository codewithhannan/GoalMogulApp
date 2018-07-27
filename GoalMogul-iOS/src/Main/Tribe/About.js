import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions
} from 'react-native';

import Divider from '../Common/Divider';

const { width } = Dimensions.get('window');

class About extends Component {

  renderMemberStatus() {
    const count = '102';
    return (
      <View>
        <Text>
          <Text>{count} </Text>
          members
        </Text>
      </View>
    );
  }

  renderCreated() {
    const date = 'January 12, 2017';

    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Text>Created</Text>
          <Text>{date}</Text>
        </View>
      </View>
    );
  }

  renderDescription() {
    return (
      <View>
        <Text>Description</Text>
        <Text>This is a group for all artists</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, margin: 30, marginTop: 15 }}>
        {this.renderMemberStatus()}
        {this.renderCreated()}
        <Divider horizontal width={0.8 * width} borderColor='gray' />
        {this.renderDescription()}
      </View>
    );
  }
}

export default About;
