import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

/* Component */
import ProfileDetailCard from './ProfileCard/ProfileDetailCard';
import ProfileOccupationCard from './ProfileCard/ProfileOccupationCard';
import ProfileAboutMeCard from './ProfileCard/ProfileAboutMeCard';
import SearchBarHeader from '../Common/SearchBarHeader';

const testData = {
  name: 'Jia Zeng',
  email: 'jz145@duke.edu',
  phone: '9194912504',
  headline: 'I am a student at Duke.',
  privacy: {
    friends: 'Public'
  },
  profile: {
    pointsEarned: 10,
    about: 'This is a test page.',
    elevatorPitch: 'This is a profile elevator pitch',
    image: '',
    occupation: 'Student a;ljsdl;fajls;dkfjal;sdkjfl;sajkdl;f'
  }
};

class ProfileDetail extends Component {

  render() {
    const user = this.props.user;
    return (
      <View style={styles.containerStyle}>
        <SearchBarHeader backButton setting />
        <ScrollView>
          <ProfileDetailCard data={user} />
          <ProfileOccupationCard data={user} />
          <ProfileAboutMeCard data={user} />
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1
  }
};

const mapStateToProps = state => {
  const { userId, user } = state.profile;

  return {
    userId,
    user
  };
};

export default connect(mapStateToProps, null)(ProfileDetail);
