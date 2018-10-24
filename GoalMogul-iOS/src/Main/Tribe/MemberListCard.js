import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import R from 'ramda';

// Components
import Name from '../Common/Name';
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';

// Assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';
import FriendsSettingIcon from '../../asset/utils/friendsSettingIcon.png';
// import meetSetting from '../../../asset/utils/meetSetting.png';

// Actions

// Constants
const DEBUG_KEY = '[ UI MemberListCard ]';

class MemberListCard extends Component {
  handleAdminUpdateUserStatus() {
    const { onRemoveUser, onPromoteUser, onDemoteUser, item, category } = this.props;
    const { _id } = item;
    let options;
    if (category === 'Admin') {
      options = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User chooses to remove user from current tribe`);
          return onRemoveUser(_id) || console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`);
        }],
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User chooses to demote current user to become member`);
          return onDemoteUser(_id) || console.log(`${DEBUG_KEY}:
             No demote user function is supplied.`);
        }],
      ]);
    } else {
      options = switchByButtonIndex([
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
    }


    const requestOptions = category === 'Admin'
      ? ['Remove User', 'Demote User', 'Cancel']
      : ['Remove User', 'Promote User', 'Cancel'];

    const cancelIndex = 2;

    const adminActionSheet = actionSheet(
      requestOptions,
      cancelIndex,
      options
    );
    adminActionSheet();
  }

  renderProfileImage(item) {
    const { image } = item.profile;
    let profileImage = (
      <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />
    );
    if (image) {
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    return profileImage;
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
    return '';
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
    if (profile.occupation) {
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
    return '';
  }

  // If user is admin, then he can click to remove / promote a user
  renderSettingIcon() {
    const { isAdmin, onRemoveUser, onPromoteUser } = this.props;
    if (isAdmin) {
      return (
        <TouchableOpacity
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
    return '';
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View style={styles.containerStyle}>
        {this.renderProfileImage(item)}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo(item)}
          {this.renderOccupation(item)}
          <Text
            style={styles.jobTitleTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            380 MUTUAL FRIENDS
          </Text>
          {this.renderAdditionalInfo(item)}
        </View>
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
  buttonContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  titleTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  },
};

export default MemberListCard;
