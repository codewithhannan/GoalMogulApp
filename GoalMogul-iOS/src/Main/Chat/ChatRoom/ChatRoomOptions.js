/*
    On load we need to:
    - subscribe to messages service for new message info
    - connect to live chat service for typing indicator
    - fetch the full chat document with members populated
*/
import React from 'react';
import {
	View,
    Dimensions,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';

const { windowWidth } = Dimensions.get('window');

import ModalHeader from '../../Common/Header/ModalHeader';
import Dot from '../../Common/Dot';
import { Actions } from 'react-native-router-flux';
import check from '../../../asset/utils/check.png';
import profilePic from '../../../asset/utils/defaultUserProfile.png';
import membersIcon from '../../../asset/utils/profile_people_black.png';
import plusIcon from '../../../asset/utils/plus.png';
import muteIcon from '../../../asset/utils/mute.png';
import editIcon from '../../../asset/utils/edit.png';
import searchIcon from '../../../asset/utils/search.png';
import { MenuProvider } from 'react-native-popup-menu';
import SettingCard from '../../Setting/SettingCard';
import { GROUP_CHAT_DEFAULT_ICON_URL, IMAGE_BASE_URL } from '../../../Utils/Constants';
import { openProfile } from '../../../actions';
import { changeChatRoomMute, addMemberToChatRoom } from '../../../redux/modules/chat/ChatRoomOptionsActions';
import { StackedAvatarsV2 } from '../../Common/StackedAvatars';
import { Image, Text, Divider } from 'react-native-elements';
import { APP_BLUE_BRIGHT } from '../../../styles';

const DEBUG_KEY = '[ UI ChatRoomOptions ]';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LISTENER_KEY = 'ChatRoomOptions';
class ChatRoomOptions extends React.Component {

	_keyExtractor = (item) => item._id;

    closeOptions() {
        Actions.pop();
    }
    openUserProfile(user) {
        const userId = user._id;
        this.props.openProfile(userId);
    }
    openChatRoomEdit() {
        Actions.push('createChatRoomStack', {
            initializeFromState: true,
            chat: this.props.chatRoom,
        });
    }
    openMembers() {
        Actions.push('chatRoomMembers');
    }
    openAddMember() {
        const { chatRoom } = this.props;
        if (!chatRoom) return;
        const searchFor = {
            type: 'addChatMember',
        };
        const cardIconStyle = { tintColor: APP_BLUE_BRIGHT };
        const cardIconSource = plusIcon;
        const callback = (selectedUserId) => {
            this.props.addMemberToChatRoom(chatRoom._id, selectedUserId);
        };
        Actions.push('searchPeopleLightBox', { searchFor, cardIconSource, cardIconStyle, callback });
    }
    openMessageSearch() {

    }

    toggleMute() {
        const { chatRoom, isMuted } = this.props;
        this.props.changeChatRoomMute(chatRoom._id, !isMuted);
    }

    renderChatRoomStatus() {
        const {chatRoom, user} = this.props;
        const memberDoc = chatRoom.members && chatRoom.members.find(memberDoc => memberDoc.memberRef._id == user._id);
        const memberStatus = memberDoc && memberDoc.status;
        const tintColor = '#2dca4a';
        if (!memberStatus) return;
        return (
            <View
              activeOpacity={0.6}
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8, height: 23 }}
            >
              <Image
                source={check}
                style={{
                  height: 10,
                  width: 13,
                  tintColor
                }}
              />
              <Text
                style={{
                  ...styles.tribeStatusTextStyle,
                  color: tintColor
                }}
              >
                {memberStatus}
              </Text>
            </View>
          );
    }

    renderChatRoomDetails() {
        const { chatRoom, chatRoomName, chatRoomImage } = this.props;
        if (!chatRoom) return;
        const newDate = chatRoom.created ? new Date(chatRoom.created) : new Date();
        const date = `${months[newDate.getMonth() - 1]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
        return (
            <View>
                <View style={styles.imagePaddingContainerStyle} />
                <View style={styles.imageWrapperStyle}>
                    <View style={styles.imageContainerStyle}>
                        <Image
                        onLoadStart={() => this.setState({ imageLoading: true })}
                        onLoadEnd={() => this.setState({ imageLoading: false })}
                        style={styles.imageStyle}
                        source={chatRoomImage}
                        />
                    </View>
                </View>
                <View style={styles.generalInfoContainerStyle}>
                    <Text
                        style={{ fontSize: 22, fontWeight: '300' }}
                    >
                        {chatRoomName}
                    </Text>
                    {chatRoom.roomType == 'Direct' ? null : (
                        <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, alignItems: 'center' }}>
                            <Text style={styles.tribeStatusTextStyle}>{chatRoom.isPublic ? 'Public' : 'Private'}</Text>
                            <Divider orthogonal height={12} borderColor='gray' />
                            {this.renderChatRoomStatus()}
                        </View>
                    )}
                    <View
                        style={{
                            width: windowWidth * 0.75,
                            borderColor: '#dcdcdc',
                            borderWidth: 0.5
                        }}
                    />
                    <View style={styles.eventContainerStyle}>
                        <StackedAvatarsV2 chatMembers={chatRoom.members} />
                        <Text style={{ ...styles.eventInfoBasicTextStyle }}>
                            {chatRoom.members.length} members
                        </Text>
                        <Dot
                            iconStyle={{ tintColor: '#616161', width: 4, height: 4, marginLeft: 4, marginRight: 4 }}
                        />
                        <Text style={{ ...styles.eventInfoBasicTextStyle }}>Created: {date} </Text>
                    </View>
                </View>
            </View>
        );
    }

	render() {
        const { otherUser, chatRoom, chatRoomName, chatRoomImage, isMuted, isAdmin } = this.props;
        if (!chatRoom) {
            return null;
        };
		return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<View style={styles.homeContainerStyle}>
					<ModalHeader
                        title={'Details'}
                        actionHidden={true}
                        back={true}
                        onCancel={this.closeOptions}
                    />
                    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>}
                        <ScrollView>
                            {/* insert chat room details preview card here */}
                            {this.renderChatRoomDetails()}
                            {chatRoom.roomType == 'Direct' ? (
                                <SettingCard
                                    title="View profile"
                                    key="openuserprofile"
                                    icon={chatRoomImage}
                                    iconStyle={styles.chatIconStyle}
                                    explanation={`Open ${otherUser.name.trim()}'s profile`}
                                    onPress={() => {
                                        this.openUserProfile(otherUser);
                                    }}
                                />
                            ): (isAdmin &&
                                <SettingCard
                                    title={`Edit Conversation`}
                                    key="editchatroom"
                                    icon={editIcon}
                                    iconStyle={styles.chatIconStyle}
                                    explanation="Edit the conversation's details"
                                    onPress={this.openChatRoomEdit.bind(this)}
                                />
                            )}
                            <SettingCard
                                title={isMuted ? 'Unmute Conversation' : 'Mute Conversation'}
                                icon={muteIcon}
                                explanation={isMuted ? 'Conversation is currently muted' : 'Mute push notifications from this conversation'}
                                onPress={this.toggleMute.bind(this)}
                            />
                            {chatRoom.roomType != 'Direct' && (isAdmin || chatRoom.membersCanAdd) && (
                                <SettingCard
                                    title="Add Member"
                                    icon={plusIcon}
                                    explanation={`${isAdmin ? 'Manage' : 'View'} Conversation Members`}
                                    onPress={this.openAddMember.bind(this)}
                                />
                            )}
                            {chatRoom.roomType != 'Direct' && (
                                <SettingCard
                                    title={`${isAdmin ? 'Manage' : 'View'} Members`}
                                    icon={membersIcon}
                                    explanation={`${isAdmin ? 'Manage' : 'View'} this conversation's members`}
                                    onPress={this.openMembers.bind(this)}
                                />
                            )}
                            <SettingCard
                                title="Search Messages"
                                icon={searchIcon}
                                explanation="Search messages in thes conversation"
                                onPress={this.openMessageSearch.bind(this)}
                            />
                        </ScrollView>
                    </View>
				</View>
			</MenuProvider>
		);
	}
}

const mapStateToProps = (state, props) => {
    const { userId, user } = state.user;
    const {
        initializing,
        chatRoomsMap, activeChatRoomId,
        messages, limit, skip, hasNextPage, loading,
        currentlyTypingUserIds, messageMediaRef,
    } = state.chatRoom;

    const chatRoom = chatRoomsMap[activeChatRoomId];
    
    // extract details from the chat room
    let chatRoomName = 'Loading...';
    let chatRoomImage = null;
    let otherUser = null;
    let isAdmin = false;
    if (chatRoom) {
        if (chatRoom.roomType == 'Direct') {
            otherUser = chatRoom.members && chatRoom.members.find(memberDoc => memberDoc.memberRef._id != userId);
            if (otherUser) {
                otherUser = otherUser.memberRef;
                chatRoomName = otherUser.name;
                chatRoomImage = (otherUser.profile && otherUser.profile.image) ?
                    {uri: `${IMAGE_BASE_URL}${otherUser.profile.image}` }
                    : profilePic;
            };
        } else {
            chatRoomName = chatRoom.name;
            chatRoomImage = {uri: chatRoom.picture ? `${IMAGE_BASE_URL}${chatRoom.picture}` : GROUP_CHAT_DEFAULT_ICON_URL };
            isAdmin = chatRoom.members && chatRoom.members.find(memberDoc => memberDoc.memberRef._id == userId && memberDoc.status == 'Admin');
        };
    };

    // extract details from the user object
    const notificationPrefs = user.chatNotificationPreferences;
    const mutedChatRooms = notificationPrefs && notificationPrefs.mutedChatRoomRefs;
    const isMuted = mutedChatRooms && mutedChatRooms.find(id => id.toString() == chatRoom._id.toString());

	return {
        chatRoom,
        chatRoomName,
        chatRoomImage,
        otherUser,
        user,
        isMuted,
        isAdmin,
	};
};

export default connect(
	mapStateToProps,
	{
        openProfile,
        changeChatRoomMute,
        addMemberToChatRoom,
	}
)(ChatRoomOptions);

const styles = {
	homeContainerStyle: {
		backgroundColor: '#f8f8f8',
		flex: 1
    },
    chatIconStyle: {
        height: 21,
        width: 21,
        marginRight: 5,
        borderRadius: 3,
        overflow: 'hidden',
        padding: 1,
        border: '1px solid #F1F1F1',
    },

    // Event info related styles
    tribeStatusTextStyle: {
        fontSize: 11,
        marginLeft: 4,
        marginRight: 4
    },
    generalInfoContainerStyle: {
        backgroundColor: 'white',
        alignItems: 'center'
    },
    eventContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    eventInfoBasicTextStyle: {
        fontSize: 11,
        fontWeight: '300'
    },
    imagePaddingContainerStyle: {
      height: ((windowWidth * 0.95) / 3 + 30 - 10) / 2,
      backgroundColor: '#1998c9'
    },
    imageWrapperStyle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        height: ((windowWidth * 0.95) / 3 + 30 + 10) / 2,
        // height: 80,
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
    width: (windowWidth * 1.1) / 3,
    height: (windowWidth * 0.95) / 3,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'white'
  },
};