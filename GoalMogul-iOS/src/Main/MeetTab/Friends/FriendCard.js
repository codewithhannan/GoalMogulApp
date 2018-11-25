import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// Components
import Name from '../../Common/Name';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
// import meetSetting from '../../../asset/utils/meetSetting.png';

// Actions
import {
  updateFriendship,
  blockUser,
  openProfile
} from '../../../actions';

const FRIENDSHIP_BUTTONS = ['Block', 'Unfriend', 'Cancel'];
const BLOCK_INDEX = 0;
const UNFRIEND_INDEX = 1;
const CANCEL_INDEX = 2;
const TAB_KEY = 'friends';

class FriendCard extends Component {
  state = {
    requested: false,
    accpeted: false
  }

  componentWillReceiveProps(props) {
    // console.log('new props for meet card are: ', props);
  }

  // onButtonClicked = (friendshipId) => {
  //   ActionSheetIOS.showActionSheetWithOptions({
  //     options: FRIENDSHIP_BUTTONS,
  //     cancelButtonIndex: CANCEL_INDEX,
  //   },
  //   (buttonIndex) => {
  //     console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
  //     switch (buttonIndex) {
  //       case BLOCK_INDEX:
  //         // User chose to block user with id: _id
  //         console.log('User blocks _id: ', friendshipId);
  //         this.props.blockUser(friendshipId);
  //         break;
  //
  //       case UNFRIEND_INDEX:
  //         // User chose to unfriend
  //         this.props.updateFriendship('', friendshipId, 'deleteFriend', TAB_KEY, () => {
  //           console.log('Successfully delete friend with friendshipId: ', friendshipId);
  //           this.setState({ requested: false });
  //         });
  //         break;
  //       default:
  //         return;
  //     }
  //   });
  // }

  handleOnOpenProfile = () => {
    const { _id } = this.props.item;
    if (_id) {
      return this.props.openProfile(_id);
    }
    // TODO: showToast
  }

  renderProfileImage() {
    const { image } = this.props.item.profile;
    let profileImage = (
      <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />
    );
    if (image) {
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    return profileImage;
  }

  /*
  NOTE: friends card doesn't have any button. only on profile page
  */
  renderButton(_id) {
    return '';
    // return (
    //   <TouchableOpacity activeOpacity={0.85} onPress={this.onButtonClicked.bind(this, _id)}>
    //     <Image source={meetSetting} style={styles.settingIconStyle} />
    //   </TouchableOpacity>
    // );
  }

  renderInfo() {
    const { name } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', marginRight: 6, alignItems: 'center' }}>
          <Name text={name} />
        </View>

        <View style={styles.buttonContainerStyle}>
          {this.renderButton()}
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

  renderOccupation() {
    const { profile } = this.props.item;
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

  render() {
    const { item } = this.props;
    if (!item) return '';

    const { headline } = item;
    return (
      <TouchableOpacity activeOpacity={0.85} style={styles.containerStyle} onPress={this.handleOnOpenProfile}>
        {this.renderProfileImage()}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo()}
          {this.renderOccupation()}
          <Text
            style={styles.jobTitleTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {headline}
          </Text>
          {this.renderAdditionalInfo()}
        </View>
      </TouchableOpacity>
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
  buttonStyle: {
    width: 70,
    height: 26,
    borderWidth: 1,
    borderColor: '#46C8F5',
    borderRadius: 13,
  },
  buttonTextStyle: {
    color: '#46C8F5',
    fontSize: 11,
    fontWeight: '700',
    paddingLeft: 1,
    padding: 0,
    alignSelf: 'center'
  },
  settingIconStyle: {
    height: 20,
    width: 20
  },
  buttonIconStyle: {
    marginTop: 1
  },
  needContainerStyle: {

  },
  titleTextStyle: {
    color: '#46C8F5',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#46C8F5',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  },
  friendTextStyle: {
    paddingLeft: 10,
    color: '#46C8F5',
    fontSize: 9,
    fontWeight: '800',
    maxWidth: 120
  }
};

export default connect(null, {
  updateFriendship,
  blockUser,
  openProfile
})(FriendCard);
