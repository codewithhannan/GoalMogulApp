import React, { Component } from 'react';
import {
  View,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';

/* Components */
import SettingCard from '../SettingCard';

class Privacy extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView>
          <SettingCard
            title="Who can see your friends"
            onPress={() => Actions.friendsSetting()}
          />
        </ScrollView>
      </View>
    );
  }
}

export default Privacy;
