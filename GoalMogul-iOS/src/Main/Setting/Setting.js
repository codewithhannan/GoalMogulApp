import React, { Component } from 'react';
import {
  View
} from 'react-native';
import { connect } from 'react-redux';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';
import Button from './Button';
import Account from './Account';
import Privacy from './Privacy/Privacy';

class Setting extends Component {

  // TODO: refactor to use flatList and share flatList with different data
  renderContent() {
    console.log('tab isL ', this.props.selectedTab);
    switch (this.props.selectedTab) {
      case 'privacy':
        return <Privacy />;

      case 'account':
        return <Account />;

      default:
        return <Account />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SearchBarHeader backButton rightIcon="empty" title="Settings" />
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

const mapStateToProps = state => {
  const { selectedTab } = state.setting;

  return {
    selectedTab
  };
};

export default connect(mapStateToProps, null)(Setting);
