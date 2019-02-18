import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

// Components
import SettingCard from '../SettingCard';

// Actions
import { fetchProfile, logout } from '../../../actions';

// Utils
import { componentKeyByTab } from '../../../redux/middleware/utils';

class Account extends Component {
  render() {
    const { tab } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView>
          <SettingCard
            title="Email address"
            key="emailaddress"
            explanation="Add or remove email addresses"
            onPress={() => {
              const componentKeyToOpen = componentKeyByTab(tab, 'email');
              this.props.fetchProfile(this.props.userId, Actions.push(`${componentKeyToOpen}`));
            }}
          />
          <SettingCard
            title="Phone numbers"
            key="phonenumbers"
            explanation="Manage your phone numbers"
            onPress={() => {
              const componentKeyToOpen = componentKeyByTab(tab, 'phone');
              Actions.push(`${componentKeyToOpen}`);
            }}
          />
          <SettingCard
            title="Password"
            key="password"
            explanation="Update your passwords"
            onPress={() => {
              const componentKeyToOpen = componentKeyByTab(tab, 'editPasswordForm');
              Actions.push(`${componentKeyToOpen}`);
            }}
          />
          <SettingCard
            title="Blocked Users"
            key="blockedusers"
            explanation="Manage blocked users"
            onPress={() => {
              const componentKeyToOpen = componentKeyByTab(tab, 'friendsBlocked');
              Actions.push(`${componentKeyToOpen}`);
            }}
          />
          <SettingCard
            title="Log out"
            key="logout"
            explanation="Log out current account"
            onPress={() => {
              Alert.alert('Log out', 'Are you sure to log out?', [
                  { text: 'Cancel', onPress: () => console.log('user cancel logout') },
                  { text: 'Confirm', onPress: () => this.props.logout() }
                ]
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { userId } = state.user;
  const { tab } = state.navigation;

  return {
    userId,
    tab
  };
};

export default connect(
  mapStateToProps,
  {
    fetchProfile,
    logout
  }
)(Account);
