import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';

class ActivityFeed extends Component {
  render() {
    return (
      <View style={{ height: 50 }}>
        <Text>Hi this is test</Text>
        <ScrollView>
          <Text>Hi this is test</Text>
          <Text>Hi this is test</Text>
        </ScrollView>
      </View>
    );
  }
}

export default ActivityFeed;
