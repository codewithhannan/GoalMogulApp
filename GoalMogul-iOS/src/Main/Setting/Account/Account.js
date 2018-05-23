import React, { Component } from 'react';
import {
  View,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

/* Components */
import SettingCard from '../SettingCard';

// Actions
import { fetchProfile } from '../../../actions';

class Account extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView>
          <SettingCard
            title="Email address"
            key="emailaddress"
            explanation="Add or remove email addresses"
            onPress={() => this.props.fetchProfile(this.props.userId, Actions.email())}
          />
          <SettingCard
            title="Phone numbers"
            key="phonenumbers"
            explanation="Manage your phone numbers"
            onPress={() => Actions.phone()}
          />
          <SettingCard
            title="Password"
            key="password"
            explanation="Update your passwords"
            onPress={() => Actions.editPasswordForm()}
          />
          <SettingCard
            title="Blocked Users"
            key="blockedusers"
            explanation="Manage blocked users"
            onPress={() => Actions.friendsBlocked()}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { userId } = state.user;

  return {
    userId
  };
};

export default connect(mapStateToProps, { fetchProfile })(Account);
