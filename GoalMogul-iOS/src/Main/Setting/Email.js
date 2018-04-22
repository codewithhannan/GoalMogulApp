import React, { Component } from 'react';
import { Text, View } from 'react-native';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';


class Email extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SearchBarHeader backButton menu={false} title="Email Addresses" />
        
      </View>
    );
  }
}

export default Email;
