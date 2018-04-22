import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text
} from 'react-native';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';


class Account extends Component {
  render() {
    return (
      <View>
        <SearchBarHeader backButton menu={false} title="Settings" />
      </View>
    );
  }
}

export default Account;
