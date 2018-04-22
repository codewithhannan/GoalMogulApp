import React, { Component } from 'react';
import {
  View,
  ScrollView
} from 'react-native';

/* Components */
import SettingCard from './SettingCard';
import { Actions } from 'react-native-router-flux';

class Account extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView>
          <SettingCard
            title="Email address"
            explanation="Add or remove email addresses"
            onPress={() => Actions.email()}
          />
          <SettingCard
            title="Phone numbers"
            explanation="Manage your phone numbers"
            onPress={() => console.log('Open phone number')}
          />
        </ScrollView>
      </View>
    );
  }
}

export default Account;
