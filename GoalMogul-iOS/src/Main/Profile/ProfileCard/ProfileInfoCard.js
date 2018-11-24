import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Card from './Card';
import ProfileActionButton from '../../Common/Button/ProfileActionButton';

/* Actions */
import { openProfileDetailEditForm } from '../../../actions/';

/* Asset */
import briefcase from '../../../asset/utils/briefcase.png';
import profileStyles from './Styles';

// TODO: use redux instead of passed in props
class ProfileInfoCard extends Component {

  handleEditOnPressed() {
    this.props.openProfileDetailEditForm();
  }

  renderOccupation(occupation) {
    if (occupation) {
      return (
        <View style={{ flexDirection: 'row', paddingBottom: 30 }}>
          <Image source={briefcase} style={styles.iconStyle} />
          <Text
            style={profileStyles.headerTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {occupation}
          </Text>
        </View>
      );
    }
    return '';
  }

  renderElevatorPitch(elevatorPitch) {
    if (elevatorPitch) {
      return (
        <View style={{ alignSelf: 'flex-start', marginTop: 20 }}>
          <Text style={profileStyles.subHeaderTextStyle}>Elevator Pitch</Text>
          <Text style={profileStyles.detailTextStyle}>{elevatorPitch}</Text>
        </View>
      );
    }
    return '';
  }

  renderAbout(about) {
    if (about) {
      return (
        <View style={{ alignSelf: 'flex-start', marginTop: 20 }}>
          <Text style={profileStyles.subHeaderTextStyle}>About</Text>
          <Text style={profileStyles.detailTextStyle}>{about}</Text>
        </View>
      );
    }
    return '';
  }

  renderProfileActionButton() {
    if (this.props.canEdit) {
      return <ProfileActionButton onPress={() => this.handleEditOnPressed()} />;
    }
  }

  render() {
    const { elevatorPitch, occupation, about } = this.props.data.profile;
    if (!occupation && !elevatorPitch) {
      return '';
    }
    const divider = elevatorPitch || about ?
      (<View style={profileStyles.dividerStyle} />)
      :
      '';
    return (
      <View style={styles.cardContainerStyle}>
        <View style={styles.containerStyle}>
          {this.renderOccupation(occupation)}
          {divider}
          {this.renderElevatorPitch(elevatorPitch)}
          {this.renderAbout(about)}
        </View>
      </View>
    );
  }
}

const styles = {
  cardContainerStyle: {
    display: 'flex',
    // borderColor: '#eaeaea',
    // borderBottomWidth: 0.5,
    // backgroundColor: 'transparent'
    // backgroundColor: 'white',
    flex: 1,
    borderTopWidth: 1.5,
    borderColor: '#f2f2f2'
  },
  containerStyle: {
    display: 'flex',
    padding: 30,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: 'white',
    flex: 1
  },
  headerContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20
  },
  titleTextStyle: {
    fontSize: 23,
    marginRight: 10
  },
  occupationTextStyle: {
    fontSize: 15
  },
  detailContainerStyle: {
    display: 'flex',
    minHeight: 60
  },
  detailTextStyle: {
    fontSize: 20
  },
  editButtonStyle: {
    height: 23,
    width: 23,
    padding: 3,
    alignSelf: 'flex-end',
  },
  iconStyle: {
    height: 20,
    width: 20
  }
};

const mapStateToProps = state => {
  const canEdit = state.profile.userId.toString() === state.user.userId.toString();

  return {
    canEdit
  };
};

export default connect(
  mapStateToProps,
  {
    openProfileDetailEditForm
  }
)(ProfileInfoCard);
