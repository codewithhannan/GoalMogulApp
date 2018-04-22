import React, { Component } from 'react';
import {
  View
} from 'react-native';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';
import Button from './Button';
import Account from './Account';


class Setting extends Component {

  // TODO: refactor to use flatList and share flatList with different data
  renderContent() {
    return (
      <Account />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SearchBarHeader backButton menu={false} title="Settings" />
        <View style={styles.buttonGroupContainerStyle}>
          <Button title="Account" tabId="account" />
          <Button title="Privacy" tabId="privacy" />
        </View>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = {
  buttonGroupContainerStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#6b788e'
  }
};

export default Setting;
