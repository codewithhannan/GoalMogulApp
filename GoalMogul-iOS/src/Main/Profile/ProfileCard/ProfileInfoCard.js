import React, { Component } from 'react';
import {
  View,
  Text,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import ProfileActionButton from '../../Common/Button/ProfileActionButton';
import DelayedButton from '../../Common/Button/DelayedButton';
import { DotIcon } from '../../../Utils/Icons';

/* Actions */
import { openProfileDetailEditForm } from '../../../actions/';

/* Asset */
import brief_case from '../../../asset/utils/briefcase.png';
import icon_meet from '../../../asset/footer/navigation/meet.png';
import profileStyles from './Styles';

/* Select */
import {
  getUserData
} from '../../../redux/modules/User/Selector';

const DEBUG_KEY = '[ UI ProfileInfoCard ]';
// TODO: use redux instead of passed in props
// TODO: profile reducer redesign to change here. Evaluate all the components used
class ProfileInfoCard extends Component {

  handleEditOnPressed() {
    const { userId, pageId } = this.props;
    this.props.openProfileDetailEditForm(userId, pageId);
  }

  handleMutualFriendOnPressed = () => {
    const { pageId, userId } = this.props;
    // canEdit means self
    if (this.props.canEdit) {
      // Jump to meetTab
      Actions.jump('meetTab');
      Actions.push('friendTabView');
      return;  
    }
    Actions.push('mutualFriends', { userId, pageId });
  }

  renderFriendInfo() {
    const title = this.props.canEdit ? 'Friends' : 'Mutual Friends';
    const data = this.props.canEdit ? this.props.friendsCount : this.props.mutualFriends.count;
    return (
      <View style={{ flexDirection: 'row', paddingBottom: 25 }}>
        <Image source={icon_meet} style={styles.iconStyle} />
        <View style={{ marginRight: 10, marginLeft: 10, flexDirection: 'row' }}>
          <Text style={{ fontSize: 13, color: '#646464', alignSelf: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>{data === undefined ? 0 : data} </Text>
            {title}
          </Text>
          <DotIcon 
            iconContainerStyle={{ ...styles.dotIconContainerStyle }}
            iconStyle={{ tintColor: '#818181', ...styles.dotIconStyle, height: 5, width: 5 }}
          />
          <DelayedButton activeOpacity={0.6} onPress={this.handleMutualFriendOnPressed} style={{ justifyContent: 'center' }}>
            <Text style={{ color: '#17B3EC', fontWeight: '600', fontSize: 13 }}>View friends</Text>
          </DelayedButton>
        </View>
      </View>
    );
  }

  renderOccupation(occupation) {
    if (occupation) {
      return (
        <View style={{ flexDirection: 'row', paddingBottom: 25 }}>
          <Image source={brief_case} style={styles.iconStyle} />
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
    return null;
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
    return null;
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
    return null;
  }

  renderProfileActionButton() {
    if (this.props.canEdit) {
      return <ProfileActionButton onPress={() => this.handleEditOnPressed()} />;
    }
  }

  render() {
    // TODO: profile reducer redesign to change here.
    // Refactor to use userId to fetch the corresponding profile from the source of truth reducer
    const { user } = this.props;
    if (!user || !user.profile) {
      console.log(`${DEBUG_KEY}: [ render ]: invalid user:`, user);
      return null;
    }
    const { elevatorPitch, occupation, about } = user.profile;
    if (!occupation && !elevatorPitch) {
      return null;
    }
    const divider = elevatorPitch || about 
      ? (<View style={profileStyles.dividerStyle} />)
      : null;
    return (
      <View style={styles.cardContainerStyle}>
        <View style={styles.containerStyle}>
          {this.renderFriendInfo()}
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
  },
  dotIconStyle: {


  },
  dotIconContainerStyle: {
    width: 4,
    marginLeft: 4,
    marginRight: 5,
    alignSelf: 'center',
    justifyContent: 'center'
  }
};

const mapStateToProps = (state, props) => {
  const { userId } = props;
  const canEdit = userId === state.user.userId;

  const userObject = getUserData(state, userId, '');
  const { user, mutualFriends, friendship } = userObject;
  const friendsCount = state.meet.friends.count;

  return {
    canEdit,
    user,
    mutualFriends,
    friendsCount
  };
};

export default connect(
  mapStateToProps,
  {
    openProfileDetailEditForm
  }
)(ProfileInfoCard);
