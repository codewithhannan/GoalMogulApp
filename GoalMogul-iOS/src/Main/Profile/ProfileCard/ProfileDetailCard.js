import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import R from 'ramda';

/* Asset to delete */
import profilePic from '../../../asset/test-profile-pic.png';
/* Assets */
import addUser from '../../../asset/utils/addUser.png';
import love from '../../../asset/utils/love.png';
import edit from '../../../asset/utils/edit.png';
import cancel from '../../../asset/utils/cancel.png';

/* Actions */
import {
  openProfileDetailEditForm,
  updateFriendship
} from '../../../actions/';

/* Components */
import Card from './Card';
import ButtonArrow from '../../Common/Button/ButtonArrow';
import ProfileActionButton from '../../Common/Button/ProfileActionButton';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';

const { width } = Dimensions.get('window');
const DEBUG_KEY = '[ Copmonent ProfileDetailCard ]';

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

const CANCEL_REQUEST_OPTIONS = ['Withdraw request', 'Cancel'];
const CANCEL_REQUEST_CANCEL_INDEX = 1;

const UNFRIEND_REQUEST_OPTIONS = ['Unfriend', 'Cancel'];
const UNFRIEND_REQUEST_CANCEL_INDEX = 1;

// TODO: use redux instead of passed in props
class ProfileDetailCard extends Component {
  componentWillMount() {
    const { image } = this.props.user.profile;
    if (image) {
      this.prefetchImage(image);
    }
  }

  prefetchImage(image) {
    const fullImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
    Image.prefetch(fullImageUrl);
  }

  handleEditOnPressed() {
    this.props.openProfileDetailEditForm();
  }

  // type: ['unfriend', 'deleteFriend', 'requestFriend']
  handleButtonOnPress = (type) => {
    if (type === 'requestFriend') {
      console.log('request friend');
    }

    if (type === 'deleteFriend') {
      const cancelRequestSwitchCases = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User withdraw request _id: `, this.props.friendship._id);
          // this.props.blockUser(this.props.profileUserId);
        }]
      ]);

      const cancelActionSheet = actionSheet(
        CANCEL_REQUEST_OPTIONS,
        CANCEL_REQUEST_CANCEL_INDEX,
        cancelRequestSwitchCases
      );
      return cancelActionSheet();
    }

    if (type === 'unfriend') {
      const unFriendRequestSwitchCases = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User unfriend _id: `, this.props.friendship._id);
          // this.props.blockUser(this.props.profileUserId);
        }]
      ]);

      const unFriendActionSheet = actionSheet(
        UNFRIEND_REQUEST_OPTIONS,
        UNFRIEND_REQUEST_CANCEL_INDEX,
        unFriendRequestSwitchCases
      );
      return unFriendActionSheet();
    }
  }

  handleMutualFriendOnPressed = () => {

  }

  renderProfileActionButton() {
    if (this.props.self) {
      return (
        <ProfileActionButton
          text='Edit profile'
          source={edit}
          onPress={() => this.handleEditOnPressed()}
        />
      );
    }

    // const status = DEBUG ? 'Accepted' : this.props.friendship.status;
    const status = this.props.friendship.status;

    switch (status) {
      case undefined:
        return (
          <ProfileActionButton
            text='Add friend'
            source={addUser}
            onPress={this.handleButtonOnPress.bind(this, 'requestFriend')}
            style={{ height: 14, width: 15 }}
          />
        );

      case 'Accepted':
        return (
          <ProfileActionButton
            text='Friend'
            source={love}
            onPress={this.handleButtonOnPress.bind(this, 'unfriend')}
          />
        );

      case 'Invited':
        return (
          <ProfileActionButton
            text='Cancel request'
            source={cancel}
            onPress={this.handleButtonOnPress.bind(this, 'deleteFriend')}
          />
        );

      default:
        return '';
    }
  }

  renderFriendInfo() {
    if (this.props.self) {
      return (
        <View style={styles.friendInfoContainerStyle}>
          <Text style={{ fontSize: 13, color: '#646464', alignSelf: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>12 </Text>
             Mutual Friends
          </Text>
          <View>
            <Icon
              name='dot-single'
              type='entypo'
              color='#818181'
              size={18}
              iconStyle={styles.dotIconStyle}
              containerStyle={styles.dotIconContainerStyle}
            />
          </View>
          <TouchableOpacity onPress={this.handleMutualFriendOnPressed}>
            <ButtonArrow text='View friends' arrow />
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderProfileImage(profile) {
    let { image } = profile;

    let profileImage = (
      <View style={styles.imageContainerStyle}>
        <Image style={styles.imageStyle} source={profilePic} />
      </View>
    );
    if (image) {
      image = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage = (
        <View
          style={styles.imageContainerStyle}
        >
          <Image style={styles.imageStyle} source={{ uri: image }} />
        </View>
      );
    }
    return profileImage;
  }

  render() {
    // const { name, headline, profile } = this.props.user;
    const { name, headline, profile } = testData;

    return (
      <Card>
        <View style={{ height: 90, backgroundColor: '#75d8fb' }} />
        <View style={styles.imageWrapperStyle}>
          {this.renderProfileImage(profile)}
          {this.renderProfileActionButton()}
        </View>
        <View style={styles.containerStyle}>
          <Text style={styles.nameTextStyle}>
            {name}
          </Text>
          <Text style={styles.headlineTextStyle}>
            {headline}
          </Text>
          <View style={styles.dividerStyle} />
          {this.renderFriendInfo()}
        </View>
      </Card>
    );
  }
}

const padding = 15;

const styles = {
  containerStyle: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5
  },
  imageWrapperStyle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 60,
    backgroundColor: 'white'
  },
  imageContainerStyle: {
    borderWidth: 1,
    borderColor: '#646464',
    alignItems: 'center',
    borderRadius: 14,
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  imageStyle: {
    width: (width * 0.9) / 3,
    height: (width * 0.9) / 3,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'white'
  },
  nameTextStyle: {
    fontSize: 25,
    marginBottom: 5
  },
  headlineTextStyle: {
    fontSize: 14,
    color: '#646464',
    marginBottom: padding
  },
  dividerStyle: {
    height: 1,
    width: (width * 5) / 7,
    borderColor: '#dcdcdc',
    borderBottomWidth: 1,
    marginBottom: padding
  },
  friendInfoContainerStyle: {
    flexDirection: 'row',
    marginBottom: padding,
    alignItems: 'center'
  },
  dotIconStyle: {


  },
  dotIconContainerStyle: {
    width: 15,
    marginRight: 2,
    alignSelf: 'center',
    justifyContent: 'center'
  }
};

const mapStateToProps = state => {
  const self = state.profile.userId.toString() === state.user.userId.toString();
  const { user, friendship } = state.profile;

  return {
    self,
    user,
    friendship
  };
};

export default connect(
  mapStateToProps,
  {
    openProfileDetailEditForm,
    updateFriendship
  }
)(ProfileDetailCard);
