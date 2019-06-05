import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';

/* Assets */
import profilePic from '../../../asset/utils/defaultUserProfile.png';
import addUser from '../../../asset/utils/addUser.png';
import love from '../../../asset/utils/love.png';
import edit from '../../../asset/utils/edit.png';
import cancel from '../../../asset/utils/cancel.png';
import message_icon from '../../../asset/utils/message_icon.png';

/* Actions */
import {
  openProfileDetailEditForm,
  updateFriendship,
  UserBanner,
  createOrGetDirectMessage,
} from '../../../actions/';

// Selector
import {
  getUserDataByPageId,
  getUserData
} from '../../../redux/modules/User/Selector';

/* Components */
import Card from './Card';
import ButtonArrow from '../../Common/Button/ButtonArrow';
import ProfileActionButton from '../../Common/Button/ProfileActionButton';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import {
  DotIcon
} from '../../../Utils/Icons';
import DelayedButton from '../../Common/Button/DelayedButton';


import { IMAGE_BASE_URL } from '../../../Utils/Constants';
import { APP_BLUE_BRIGHT } from '../../../styles';
import { Actions } from 'react-native-router-flux';

const { width } = Dimensions.get('window');
const DEBUG_KEY = '[ Copmonent ProfileDetailCard ]';

const CANCEL_REQUEST_OPTIONS = ['Withdraw request', 'Cancel'];
const CANCEL_REQUEST_CANCEL_INDEX = 1;

const UNFRIEND_REQUEST_OPTIONS = ['Unfriend', 'Cancel'];
const UNFRIEND_REQUEST_CANCEL_INDEX = 1;

const RESPOND_REQUEST_OPTIONS = ['Accept friend request', 'Dismiss', 'Cancel'];
const RESPOND_REQUEST_CANCEL_INDEX = 2;

// TODO: use redux instead of passed in props
class ProfileDetailCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: ''
    };
    this.handleEditOnPressed = this.handleEditOnPressed.bind(this);
  }

  componentDidMount() {
    const { image } = this.props.user.profile;
    // console.log(`${DEBUG_KEY}: prefetch image: ${image}`);
    if (image) {
      this.prefetchImage(image);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let prevImageUrl = '';
    if (prevProps.user && prevProps.user.profile && prevProps.user.profile.image) {
      prevImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${prevProps.user.profile.image}`;
    }

    if (this.props.user && this.props.user.profile && this.props.user.profile.image) {
      const { image } = this.props.user.profile;
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      if (imageUrl !== this.state.imageUrl || imageUrl !== prevImageUrl) {
        this.prefetchImage(image);
        // console.log(`prefetching image, imageUrl: ${imageUrl}, prevImageUrl: ${prevImageUrl}`);
      }
    }
  }

  onLayout = (e) => {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
  }

  prefetchImage(image) {
    const fullImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
    this.setState({
      imageUrl: fullImageUrl
    });
    Image.prefetch(fullImageUrl);
  }

  handleEditOnPressed() {
    const { userId, pageId } = this.props;
    this.props.openProfileDetailEditForm(userId, pageId);
  }

  // type: ['unfriend', 'deleteFriend', 'requestFriend']
  handleButtonOnPress = (type) => {
    if (type === 'requestFriend') {
      this.props.updateFriendship(
        this.props.userId,
        '',
        'requestFriend',
        'requests.outgoing',
        undefined
      );
      return;
    }

    if (type === 'deleteFriend') {
      const cancelRequestSwitchCases = switchByButtonIndex([
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User withdraw request _id: `, this.props.friendship._id);
          // this.props.blockUser(this.props.profileUserId);
          this.props.updateFriendship(
            this.props.userId,
            this.props.friendship._id,
            'deleteFriend',
            'requests.outgoing',
            undefined
          );
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
          this.props.updateFriendship(
            this.props.userId,
            this.props.friendship._id,
            'deleteFriend',
            'friends',
            undefined
          );
        }]
      ]);

      const unFriendActionSheet = actionSheet(
        UNFRIEND_REQUEST_OPTIONS,
        UNFRIEND_REQUEST_CANCEL_INDEX,
        unFriendRequestSwitchCases
      );
      return unFriendActionSheet();
    }

    if (type === 'respond') {
      const respondRequestSwitchCases = switchByButtonIndex([
        [R.equals(1), () => {
          console.log(`${DEBUG_KEY} User refuse _id: `, this.props.friendship._id);
          this.props.updateFriendship(
            this.props.userId,
            this.props.friendship._id,
            'deleteFriend',
            'requests.incoming',
            undefined
          );
        }],
        [R.equals(0), () => {
          console.log(`${DEBUG_KEY} User accept _id: `, this.props.friendship._id);
          this.props.updateFriendship(
            this.props.userId,
            this.props.friendship._id,
            'acceptFriend',
            'requests.incoming',
            undefined
          );
        }],
      ]);

      const respondActionSheet = actionSheet(
        RESPOND_REQUEST_OPTIONS,
        RESPOND_REQUEST_CANCEL_INDEX,
        respondRequestSwitchCases
      );
      return respondActionSheet();
    }
  }

  renderMessageButton() {
    if (this.props.self) return null;
    return (
      <View style={{ marginLeft: 5 }}>
        <ProfileActionButton
          text='Message'
          source={message_icon}
          style={{ marginTop: 1 }}
          onPress={() => this.handleMessageButtonOnPress()}
        />
      </View>

    );
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

    if (this.props.needRespond) {
      return (
        <ProfileActionButton
          source={addUser}
          text='Respond'
          onPress={this.handleButtonOnPress.bind(this, 'respond')}
          style={{ height: 16, width: 17 }}
        />
      );
    }

    switch (status) {
      case undefined:
        return (
          <ProfileActionButton
            text='Add friend'
            source={addUser}
            onPress={this.handleButtonOnPress.bind(this, 'requestFriend')}
            style={{ height: 16, width: 17 }}
            containerStyle={{ backgroundColor: '#E3F3FA' }}
          />
        );

      case 'Accepted':
        return (
          <ProfileActionButton
            text='Friend'
            source={love}
            onPress={this.handleButtonOnPress.bind(this, 'unfriend')}
            style={{ width: 17, height: 16 }}
            containerStyle={{ backgroundColor: '#E3F3FA' }}
          />
        );

      case 'Invited':
        return (
          <ProfileActionButton
            text='Cancel request'
            source={cancel}
            onPress={this.handleButtonOnPress.bind(this, 'deleteFriend')}
            containerStyle={{ backgroundColor: '#E3F3FA' }}
          />
        );

      default:
        return null;
    }
  }

  // handleMutualFriendOnPressed = () => {
  //   const { pageId, userId } = this.props;
  //   if (this.props.self) {
  //     // Jump to meetTab
  //     Actions.jump('meetTab');
  //     Actions.push('friendTabView');
  //     return;  
  //   }
  //   Actions.push('mutualFriends', { userId, pageId });
  // }

  // This is moved to ProfileInfoCard --> About section
  // renderFriendInfo() {
  //   const title = this.props.self ? 'Friends' : 'Mutual Friends';
  //   const data = this.props.self ? this.props.friendsCount : this.props.mutualFriends.count;
  //   return (
  //     <View style={styles.friendInfoContainerStyle}>
  //       <Text style={{ fontSize: 13, color: '#646464', alignSelf: 'center' }}>
  //         <Text style={{ fontWeight: 'bold' }}>{data === undefined ? 0 : data} </Text>
  //         {title}
  //       </Text>
  //       <DotIcon 
  //         iconContainerStyle={{ ...styles.dotIconContainerStyle }}
  //         iconStyle={{ tintColor: '#818181', ...styles.dotIconStyle, height: 5, width: 5 }}
  //       />
  //       <TouchableOpacity activeOpacity={0.6} onPress={this.handleMutualFriendOnPressed}>
  //         <ButtonArrow text='View friends' arrow />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  // Open iOS menu with two options
  handleMoreButtonOnPress = () => {
    const moreButtonOptions = switchByButtonIndex([
      [R.equals(0), () => { // share to Direct Chat
        // TODO: @Jay Share to direct message
        const userToShare = this.props.user;
        const chatRoomType = 'Direct';
        Actions.push('shareToChatLightBox', { userToShare, chatRoomType });
      }],
      [R.equals(1), () => {
        // TODO: @Jay Share to group conversation
        const userToShare = this.props.user;
        const chatRoomType = 'Group';
        Actions.push('shareToChatLightBox', { userToShare, chatRoomType });
      }]
    ]);

    const moreButtonActionSheet = actionSheet(
      ['Share as Direct Message', 'Share to Group Chat', 'Cancel'],
      2,
      moreButtonOptions
    );
    return moreButtonActionSheet();
  }

  // Open direct message with this person
  handleMessageButtonOnPress = () => {
    this.props.createOrGetDirectMessage(this.props.userId, (err, chatRoom) => {
      // TODO: @Jia re-enable the 'Message' button
      if (err || !chatRoom) {
        return Alert.alert('Error', 'Could not start the conversation. Please try again later.');
      };
      Actions.push('chatRoomConversation', { chatRoomId: chatRoom._id });
    });
  }

  /**
   * Starting version 0.3.10 or 0.4.0, we move the chat buttons to top right corner
   * Two buttons are rendered
   * 1. Message
   * 2. More --> open iOS menu with two options ['Share as Direct Message', 'Share to Group Chat', 'Cancel']
   */
  renderChatButtons() {
    if (this.props.self) {
      return <View style={{ height: 55.5 }}/>
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: padding, marginTop: 5 }}>
        <DelayedButton 
          activeOpacity={0.6}
          style={{
            borderRadius: 5,
            backgroundColor: '#1998c9',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}
          onPress={this.handleMessageButtonOnPress}
        >
          <Text style={{ fontSize: 12, color: 'white', fontWeight: '600' }}>Message</Text>
        </DelayedButton>

        <DelayedButton 
          activeOpacity={0.6}
          style={{
            borderRadius: 5,
            backgroundColor: 'white',
            borderWidth: 0.5,
            borderColor: 'gray',
            padding: 10,
            marginLeft: 10
          }}
          onPress={this.handleMoreButtonOnPress}
        >
          <Text style={{ fontSize: 12, color: '#646464', fontWeight: '600' }}>More...</Text>
        </DelayedButton>
      </View>
    );
  }

  renderProfileImage(profile) {
    const { image } = profile;
    let imageUrl;

    let profileImage = (
      <View style={styles.imageContainerStyle}>
        <Image style={styles.imageStyle} resizeMode='contain' source={profilePic} />
      </View>
    );
    if (image) {
      imageUrl = `${IMAGE_BASE_URL}${image}`;
      // if (imageUrl !== this.state.imageUrl) {
      //   this.prefetchImage(image);
      // }
      // console.log(`${DEBUG_KEY}: image url is: `, imageUrl);
      profileImage = (
        <View
          style={styles.imageContainerStyle}
        >
          <Image style={styles.imageStyle} source={{ uri: imageUrl }} />
        </View>
      );
    }
    return profileImage;
  }

  render() {
    const { user } = this.props;
    if (!user) return null;
    const { name, headline, profile } = user;

    return (
      <View style={styles.cardContainerStyle} onLayout={this.onLayout}>
        <View style={{ height: 90, backgroundColor: '#1998c9' }} />
        <View style={styles.imageWrapperStyle}>
          {this.renderProfileImage(profile)}
          <View style={{ flexDirection: 'row', flex: 1, margin: 8 }}>
            <View style={{ width: ((width * 0.9) / 3) + 30 + 10 }} />
            {this.renderProfileActionButton()}
            {this.renderMessageButton()}
          </View>
        </View>
        <View style={styles.containerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.nameTextStyle}>
              {name}
            </Text>
            <UserBanner user={this.props.user} iconStyle={{ height: 20, width: 17 }} />
          </View>
          <Text style={styles.headlineTextStyle}>
            {headline}
          </Text>
          {/* <View style={styles.dividerStyle} /> */}
          {/* {this.renderFriendInfo()} */}
          {/* {this.renderChatButtons()} */}
        </View>
      </View>
    );
  }
}

const padding = 15;

const styles = {
  cardContainerStyle: {
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1.2 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },
  containerStyle: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 15
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
    left: 30,
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
    width: 4,
    marginLeft: 4,
    marginRight: 5,
    alignSelf: 'center',
    justifyContent: 'center'
  }
};

const mapStateToProps = (state, props) => {
  const { userId, pageId } = props;

  const self = userId === state.user.userId;

  const userObject = getUserData(state, userId, '');
  const { user, mutualFriends, friendship } = userObject;

  // console.log(`${DEBUG_KEY}: userObject is: `, userObject);
  // console.log(`${DEBUG_KEY}: friendship is: `, friendship);
  const friendsCount = state.meet.friends.count;
  const needRespond = friendship && friendship.initiator_id
    && (friendship.initiator_id !== state.user.userId)
    && (friendship.status === 'Invited');

  return {
    self,
    user,
    friendship,
    userId,
    friendsCount,
    mutualFriends,
    needRespond
  };
};

export default connect(
  mapStateToProps,
  {
    openProfileDetailEditForm,
    updateFriendship,
    createOrGetDirectMessage,
  }
)(ProfileDetailCard);