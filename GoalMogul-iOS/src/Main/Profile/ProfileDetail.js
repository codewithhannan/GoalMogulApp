import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

/* Component */
import ProfileDetailCard from './ProfileCard/ProfileDetailCard';
import ProfileInfoCard from './ProfileCard/ProfileInfoCard';
import ProfileAboutMeCard from './ProfileCard/ProfileAboutMeCard';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

class ProfileDetail extends Component {
  render() {
    const { user } = this.props;
    if (!user) return '';
    const { elevatorPitch, occupation } = user.profile;
    let backgroundColor = '#f8f8f8';
    if (occupation || elevatorPitch) {
      backgroundColor = 'white';
    }
    return (
      <View style={styles.containerStyle}>
        <SearchBarHeader backButton setting />
        <ScrollView style={{ backgroundColor }}>
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
