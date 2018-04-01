import React, { Component } from 'react';
import { View } from 'react-native';

/* Components */
import { MyGoalCard } from '../Common/MyGoalCard';

class Profile extends Component {
  render() {
    return (
      <View>
        <MyGoalCard />
      </View>
    );
  }
}

export default Profile;
