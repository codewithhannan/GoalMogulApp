import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

/* Component */
import ProfileDetailCard from './ProfileCard/ProfileDetailCard';
import ProfileInfoCard from './ProfileCard/ProfileInfoCard';
import ProfileAboutMeCard from './ProfileCard/ProfileAboutMeCard';
import SearchBarHeader from '../Common/SearchBarHeader';

const testData = {
  name: 'Jia Zeng',
  email: 'jz145@duke.edu',
  phone: '9194912504',
  headline: 'I predict market with mathematical models',
  privacy: {
    friends: 'Public'
  },
  profile: {
    pointsEarned: 10,
    about: 'This is a test page.',
    elevatorPitch: 'This is a profile elevator pitch',
    image: '',
    occupation: 'Quantative Analyst at Jane Street'
  }
};

class ProfileDetail extends Component {

  render() {
    return (
      <View style={styles.containerStyle}>
        <SearchBarHeader backButton setting />
        <ScrollView>
          <ProfileDetailCard />
          <ProfileInfoCard data={this.props.user} />
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
