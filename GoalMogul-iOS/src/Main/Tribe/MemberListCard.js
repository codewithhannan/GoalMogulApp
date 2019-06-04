import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';

// Components
import Name from '../Common/Name';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';
import ProfileImage from '../Common/ProfileImage';

// Assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';
import FriendsSettingIcon from '../../asset/utils/friendsSettingIcon.png';
// import meetSetting from '../../../asset/utils/meetSetting.png';

// Utils
import {
  switchCase
} from '../../redux/middleware/utils';

// Actions
import {
  openProfile
} from '../../actions';

// Constants
const DEBUG_KEY = '[ UI MemberListCard ]';

class MemberListCard extends Component {
  handleAdminUpdateUserStatus() {
    const { onAcceptUser, onRemoveUser, onPromoteUser, onDemoteUser, item, category } = this.props;
    const { _id } = item;
    let requestOptions;
    if (category === 'Admin') {
      requestOptions = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove user from current tribe`);
          return onDemoteUser(_id) || console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`);
        }],
        // [R.equals(1), () => {
        //   console.log(`${DEBUG_KEY} User chooses to demote current user to become member`);
        //   return onDemoteUser(_id) || console.log(`${DEBUG_KEY}:
        //      No demote user function is supplied.`);
        // }],
      ]);
    } else if (category === 'Member') {
      requestOptions = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove user from current tribe`);
          return onRemoveUser(_id) || console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`);
        }],
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User chooses to promote current user to become admin`);
          return onPromoteUser(_id) || console.log(`${DEBUG_KEY}:
             No promote user function is supplied.`);
        }],
      ]);
    } else if (category === 'Invitee') {
      requestOptions = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to withdraw invitiation for user`);
          return onRemoveUser(_id) || console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`);
        }]
      ]);
    } else {
      requestOptions = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to promote current user to become admin`);
          return onAcceptUser(_id) || console.log(`${DEBUG_KEY}:
             No accept user function is supplied.`);
        }],
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User chooses to remove requester from current tribe`);
          return onRemoveUser(_id) || console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`);
        }]
      ]);
    }

    const { options, cancelIndex } = switchSettingOptions(category);
    const adminActionSheet = actionSheet(
      options,
      cancelIndex,
      requestOptions
    );
    adminActionSheet();
  }

  renderProfileImage(item) {
    const { _id } = item;
    return (
      <ProfileImage 
        imageStyle={styles.imageStyle}
        imageUrl={item && item.profile ? item.profile.image : undefined}
        imageContainerStyle={styles.imageContainerStyle}
        userId={_id}
      />
    );
  }

  renderInfo(item) {
    const { name } = item;
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', marginRight: 6, alignItems: 'center' }}>
          <Name text={name} />
        </View>
      </View>
    );
  }

  // TODO: decide the final UI for additional info
  renderAdditionalInfo() {
    return null;
    // const { profile } = this.props.item;
    // let content = '';
    // if (profile.elevatorPitch) {
    //   content = profile.elevatorPitch;
    // } else if (profile.about) {
    //   content = profile.about;
    // }
    // return (
    //   <View style={{ flex: 1 }}>
    //     <Text
    //       style={styles.titleTextStyle}
    //       numberOfLines={1}
    //       ellipsizeMode='tail'
    //     >
    //       <Text style={styles.detailTextStyle}>
    //         {content}
    //       </Text>
    //     </Text>
    //   </View>
    // );
  }

  renderOccupation(item) {
    const { profile } = item;
    if (profile && profile.occupation) {
      return (
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          <Text style={styles.detailTextStyle}>{profile.occupation}</Text>
        </Text>
      );
    }
    return null;
  }

  // If user is admin, then he can click to remove / promote a user
  renderSettingIcon() {
    const { isAdmin, onRemoveUser, onPromoteUser } = this.props;
    if (isAdmin) {
      return (
        <TouchableOpacity activeOpacity={0.6}
          onPress={() => this.handleAdminUpdateUserStatus()}
          style={{ alignSelf: 'center', justifyContent: 'center' }}
        >
          <Image
            style={{ width: 23, height: 19, tintColor: '#33485e' }}
            source={FriendsSettingIcon}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const { item } = this.props;
    if (!item) return null;

    const { headline, _id } = item;
    return (
      <View style={styles.containerStyle}>
        {this.renderProfileImage(item)}

        <TouchableOpacity 
          style={styles.bodyContainerStyle}
          activeOpacity={0.6}
          onPress={() => this.props.openProfile(_id)}
        >
          {this.renderInfo(item)}
          {this.renderOccupation(item)}
          <Text
            style={styles.jobTitleTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {headline}
          </Text>
          {this.renderAdditionalInfo(item)}
        </TouchableOpacity>
        {this.renderSettingIcon()}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  bodyContainerStyle: {
    marginLeft: 8,
    flex: 1,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    flex: 1
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  },
  buttonContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  titleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  },
};

const switchSettingOptions = (category) => switchCase({
  Admin: {
    options: ['Demote Admin', 'Cancel'],
    cancelIndex: 1
  },
  Member: {
    options: ['Remove User', 'Promote to Admin', 'Cancel'],
    cancelIndex: 2
  },
  Invitee: {
    options: ['Withdraw Invitation', 'Cancel'],
    cancelIndex: 1
  },
  JoinRequester: {
    options: ['Accept Request', 'Reject Request', 'Cancel'],
    cancelIndex: 2
  }
})('Admin')(category);

export default connect(
  null,
  {
    openProfile
  }
)(MemberListCard);
