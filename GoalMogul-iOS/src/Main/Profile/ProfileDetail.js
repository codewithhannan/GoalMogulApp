import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

/* Component */
import ProfileDetailCard from './ProfileCard/ProfileDetailCard';
import ProfileInfoCard from './ProfileCard/ProfileInfoCard';
import ProfileAboutMeCard from './ProfileCard/ProfileAboutMeCard';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

// Actions
import {
  closeProfileDetail
} from '../../actions/ProfileActions';

class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.handleOnBackPress = this.handleOnBackPress.bind(this);
  }

  handleOnBackPress = () => {
    this.props.closeProfileDetail();
  }

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
        <SearchBarHeader backButton setting onBackPress={this.handleOnBackPress} />
        <ScrollView style={{ backgroundColor }}>
          <ProfileDetailCard />
          <ProfileInfoCard data={this.props.user} userId={this.props.userId} />
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

// TODO: profile reducer redesign to change here.
const mapStateToProps = (state, props) => {
  const { userId } = props;
  const { user } = state.profile;

  return {
    userId: state.profile.userId, // TODO: change to userId
    user
  };
};

export default connect(
  mapStateToProps, 
  {
    closeProfileDetail
  }
)(ProfileDetail);
