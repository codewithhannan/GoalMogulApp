/*
    On load we need to:
    - subscribe to messages service for new message info
    - connect to live chat service for typing indicator
    - fetch the full chat document with members populated
*/
import React from 'react';
import {
	View,
    Clipboard,
} from 'react-native';
import { connect } from 'react-redux';

import MessageStorageService from '../../../services/chat/MessageStorageService';
import LiveChatService from '../../../socketio/services/LiveChatService';

// Components
import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal';


import { Octicons } from '@expo/vector-icons';

import { MenuProvider } from 'react-native-popup-menu';
// Actions
import {
    initialLoad,
    updateTypingStatus,
    updateMessageList,
    loadOlderMessages,
    deleteMessage,
    sendMessage,
    messageMediaRefChanged,
    refreshChatRoom,
} from '../../../redux/modules/chat/ChatRoomActions';
import ModalHeader from '../../Common/Header/ModalHeader';
import { GiftedChat } from 'react-native-gifted-chat';

import PhotoIcon from '../../../asset/utils/photoIcon.png';
import { Actions } from 'react-native-router-flux';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import ProfileImage from '../../Common/ProfileImage';
import { openCamera, openCameraRoll, openProfile } from '../../../actions';
import profilePic from '../../../asset/utils/defaultUserProfile.png';
import { Image } from 'react-native-elements';
import { GROUP_CHAT_DEFAULT_ICON_URL, IMAGE_BASE_URL } from '../../../Utils/Constants';

const DEBUG_KEY = '[ UI ChatRoomConversation ]';
const LISTENER_KEY = 'ChatRoomConversation';
const MAX_TYPING_INDICATORS_TO_DISPLAY = 3;
const CHAT_ROOM_DOCUMENT_REFRESH_INTERVAL = 1500; // milliseconds

/**
 * @prop {String} chatRoomId: required
 */
class ChatRoomConversation extends React.Component {
    state = {
        lastAlertedChatRoomId: null,
    }

	_keyExtractor = (item) => item._id;

	componentDidMount() {
        const { chatRoomId, limit } = this.props;
        this._pollChatRoomDocument();
        MessageStorageService.markConversationMessagesAsRead(chatRoomId);
        MessageStorageService.setActiveChatRoom(chatRoomId);
        MessageStorageService.onIncomingMessageStored(LISTENER_KEY, this._handleIncomingMessage.bind(this));
        LiveChatService.addListenerToEvent('typingindicator', LISTENER_KEY, this._handleIncomingTypingStatusUpdate.bind(this));
        if (chatRoomId) {
            this.props.initialLoad(chatRoomId, limit);
            LiveChatService.emitEvent('joinroom', { chatRoomId, }, (resp) => {
                if (resp.error) {
                    console.log(`${DEBUG_KEY} Error running joinroom socket event`, resp.message);
                };
            });
        };
    }
    componentDidUpdate(prevPros) {
        // if we change chat rooms, switch rooms accordingly and re-initialize the component
        const newChatRoomId = this.props.chatRoomId;
        const oldChatRoomId = prevPros.chatRoomId;
        if (newChatRoomId != oldChatRoomId) {
            this.props.initialLoad(newChatRoomId, this.props.limit);
            MessageStorageService.markConversationMessagesAsRead(newChatRoomId);
            MessageStorageService.setActiveChatRoom(newChatRoomId);
            // leave old chat room
            LiveChatService.emitEvent('leaveroom', { chatRoomId: oldChatRoomId, }, (resp) => {/* nothing to do */});
            // join new chat room
            LiveChatService.emitEvent('joinroom', { chatRoomId: newChatRoomId, }, (resp) => {
                if (resp.error) {
                    console.log(`${DEBUG_KEY} Error running joinroom socket event`, resp.message);
                };
            });
        };
    }
	componentWillUnmount() {
        const { chatRoom } = this.props;
        const chatRoomId = chatRoom && chatRoom._id;
        if (!chatRoomId) return;

        this._unpollChatRoomDocument();
        MessageStorageService.markConversationMessagesAsRead(chatRoomId);
        MessageStorageService.unsetActiveChatRoom(chatRoomId);
        MessageStorageService.offIncomingMessageStored(LISTENER_KEY);
        LiveChatService.removeListenerFromEvent('typingindicator', LISTENER_KEY);
        LiveChatService.emitEvent('leaveroom', {
            chatRoomId,
        }, (resp) => {/* nothing to do */});
    }
    _pollChatRoomDocument() {
        this.chatRoomDocumentPoll = setInterval(this._refreshChatRoom.bind(this), CHAT_ROOM_DOCUMENT_REFRESH_INTERVAL);
    }
    _unpollChatRoomDocument() {
        clearInterval(this.chatRoomDocumentPoll);
    }
    _refreshChatRoom() {
        const { chatRoom } = this.props;
        if (chatRoom) {
            this.props.refreshChatRoom(chatRoom._id);
        };
    }
    _handleIncomingTypingStatusUpdate(data) {
        const updateInfo = data.data;
        const { userId, typingStatus } = updateInfo;
        const { currentlyTypingUserIds } = this.props;
        this.props.updateTypingStatus(userId, typingStatus, currentlyTypingUserIds);
    }
    _handleIncomingMessage(messageInfo) {
        const { chatRoom, messages } = this.props;
        const { messageDoc, chatRoomName, chatRoomPicture } = messageInfo;
        if (messageDoc.chatRoomRef == chatRoomId) {
            this.props.updateMessageList(chatRoom, messages);
            return;
        };
        // do not show alert if we already displayed it
        if (this.state.lastAlertedChatRoomId == messageDoc.chatRoomRef) {
            return;
        };
        // show toast
        const titleToDisplay = chatRoomName;
        const messageToDisplay = messageDoc.content && messageDoc.content.message;
        DropDownHolder.setDropDownImage(chatRoomPicture);
        DropDownHolder.setDropDownImageStyle(TOAST_IMAGE_STYLE);
        DropDownHolder.setDropDownImageContainerStyle(TOAST_IMAGE_CONTAINER_STYLE);

        // action: Enum['automatic', 'programmatic', 'tap', 'pan', 'cancel']
        DropDownHolder.setOnClose(({type, title, message, action, payload}) => {
            const { chatRoomId } = payload;
            this.setState({
                lastAlertedChatRoomId: null,
            });
            if (action == 'tap') {
                Actions.refresh({
                    chatRoomId,
                });
            };
        });
        DropDownHolder.alert('custom', titleToDisplay, messageToDisplay, {
            chatRoomId: messageDoc.chatRoomRef,
        });
        this.setState({
            lastAlertedChatRoomId: messageDoc.chatRoomRef,
        });
    }

    openOptions() {
        Actions.push('chatRoomOptions');
    }
    closeConversation() {
        Actions.pop();
    }
    loadEarlierMessages() {
        const { chatRoom, hasNextPage, limit, skip } = this.props;
        if (hasNextPage) {
            this.props.loadOlderMessages(chatRoom, limit, skip);
        };
    }
    openUserProfile(user) {
        const userId = user._id;
        this.props.openProfile(userId);
    }
    deleteMessage(message) {
        const { chatRoom, messages } = this.props;
        if (!chatRoom) return;
        this.props.deleteMessage(message._id, chatRoom, messages);
    }
    sendMessage(messagesToSend) {
        const { messageMediaRef, chatRoom, messages } = this.props;
        this.props.sendMessage(messagesToSend, messageMediaRef, chatRoom, messages);
    }

    onSendImageButtonPress() {
        const mediaRefCases = switchByButtonIndex([
          [R.equals(0), () => {
            this.handleOpenCameraRoll();
          }],
          [R.equals(1), () => {
            this.handleOpenCamera();
          }],
        ]);
    
        const addMediaRefActionSheet = actionSheet(
          ['Open Camera Roll', 'Take Photo', 'Cancel'],
          2,
          mediaRefCases
        );
        return addMediaRefActionSheet();
    }
    handleOpenCamera = () => {
        this.props.openCamera((result) => {
            this.props.messageMediaRefChanged(result.uri);
        });
    }
    handleOpenCameraRoll = () => {
        const callback = R.curry((result) => {
            this.props.messageMediaRefChanged(result.uri);
        });
        this.props.openCameraRoll(callback);
    }
    onMessageLongPress(context, message) {
        const options = [
            'Copy Text',
            'Delete',
            'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        },
        (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    Clipboard.setString(this.props.currentMessage.text);
                    break;
                case 1:
                    this.deleteMessage(message._id);
                    break;
            };
        });
    }
    onChatTextInputChanged() {
        const { userId, chatRoom } = this.props;
        LiveChatService.emitEvent('updatetypingstatus', {
            userId,
            chatRoomId: chatRoom && chatRoom._id,
            typingStatus: true,
        }, (resp) => {
            if (resp.error) {
                console.log(`${DEBUG_KEY} error setting user's typing status.`, resp.message);
            };
        });
        clearTimeout(this.clearTypingStatusTimeout);
        this.clearTypingStatusTimeout = setTimeout(() => {
            LiveChatService.emitEvent('updatetypingstatus', {
                userId,
                chatRoomId: chatRoom && chatRoom._id,
                typingStatus: false,
            }, (resp) => {
                if (resp.error) {
                    console.log(`${DEBUG_KEY} error clearing user's typing status.`, resp.message);
                };
            });
        }, 1000);
    }
    renderTypingIndicatorFooter() {
        const { currentlyTypingUserIds, chatRoomMembersMap } = this.props;
        const numUsersTyping = currentlyTypingUserIds.length;
        if (numUsersTyping) {
            return (
                <FlatList
                    data={currentlyTypingUserIds.slice(0, MAX_TYPING_INDICATORS_TO_DISPLAY)
                            .map(userId => chatRoomMembersMap[userId])
                            .filter(docExists => docExists)}
                    renderItem={({item}) => (<View>
                        <ProfileImage
                            imageStyle={{ height: 35, width: 35, borderRadius: 4 }}
                            imageUrl={item.profile && item.profile.image}
                            imageContainerStyle={{ ...styles.imageContainerStyle, marginTop: 2 }}
                        />
                        <Octicons
                            name='ellipsis'
                            style={{color: '#CCC'}}
                        />
                    </View>)}
                />
            );
        };
        return null;
    }
    renderSendImageButton() {
        return (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.iconContainerStyle}
              onPress={this.onSendImageButtonPress}
            >
              <Image
                source={PhotoIcon}
                style={{
                  ...styles.iconStyle,
                  tintColor: '#cbd6d8'
                }}
              />
            </TouchableOpacity>
          );
    }
    renderMedia() {
        const { messageMediaRef } = this.props;
        if (!messageMediaRef) return null;
        const onPress = () => console.log('Media pressed.');
        const onRemove = () => this.props.messageMediaRefChanged(undefined);

        return (
            <TouchableOpacity activeOpacity={0.6} style={styles.mediaContainerStyle} onPress={onPress}>
            <ProfileImage
                imageStyle={{ width: 50, height: 50 }}
                defaultImageSource={{ uri: messageMediaRef }}
                imageContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
            />
            <View style={{ flex: 1, marginLeft: 12, marginRight: 12, justifyContent: 'center' }}>
                <Text
                style={styles.headingTextStyle}
                numberOfLines={2}
                ellipsizeMode='tail'
                >
                Attached image
                </Text>
            </View>
            <RemoveComponent onRemove={onRemove} />
            </TouchableOpacity>
        );
    }

	render() {
        const { _id, name, profile } = this.props.user;
		return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<View style={styles.homeContainerStyle}>
					<ModalHeader
                        title={this.props.chatRoomName}
                        titleIcon={this.props.chatRoomImage}
                        actionText={`\u2026` /* ellipsis */}
                        onAction={this.openOptions}
                        back={true}
                        onCancel={this.closeConversation}
                    />
                    <GiftedChat
                        messages={this.props.messages}
                        user={{
                            _id, name,
                            avatar: profile && profile.image,
                        }}
                        placeholder={`Send a message to ${this.props.chatRoomName}...`}
                        isAnimated={true}
                        loadEarlier={this.props.hasNextPage}
                        isLoadingEarlier={this.props.loading}
                        onLoadEarlier={this.loadEarlierMessages.bind(this)}
                        onPressAvatar={this.openUserProfile.bind(this)}
                        onLongPress={this.onMessageLongPress.bind(this)}
                        renderFooter={this.renderTypingIndicatorFooter.bind(this)}
                        renderActions={this.renderSendImageButton.bind(this)}
                        onSend={this.sendMessage.bind(this)}
                        onInputTextChanged={this.onChatTextInputChanged.bind(this)}
                        renderAccessory={this.renderMedia.bind(this)}
                    />
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
    const chatRoom = activeChatRoomId && chatRoomsMap[activeChatRoomId];
    
    let chatRoomName = 'Loading...';
    let chatRoomImage = null;
    let chatRoomMembersMap = {};
    if (chatRoom) {
        if (chatRoom.roomType == 'Direct') {
            let otherUser = chatRoom.members && chatRoom.members.find(memberDoc => memberDoc.memberRef._id != userId);
            if (otherUser) {
                otherUser = otherUser.memberRef;
                chatRoomName = otherUser.name;
                chatRoomImage = (otherUser.profile && otherUser.profile.image) ? {
                    uri: `${IMAGE_BASE_URL}${otherUser.profile.image}`
                } : profilePic;
            };
        } else {
            chatRoomName = chatRoom.name;
            chatRoomImage = { uri: chatRoom.picture ? `${IMAGE_BASE_URL}${chatRoom.picture}` : GROUP_CHAT_DEFAULT_ICON_URL };
        };
        chatRoomMembersMap = chatRoom.members && chatRoom.members.reduce((map, memberDoc) => {
            map[memberDoc.memberRef._id] = memberDoc.memberRef;
            return map;
        }, {})
    };

	return {
        initializing,
        userId,
        user,
        chatRoom,
        chatRoomName,
        chatRoomImage,
        chatRoomMembersMap,
        messages,
        limit,
        skip,
        hasNextPage,
        loading,
        currentlyTypingUserIds,
        messageMediaRef,
	};
};

export default connect(
	mapStateToProps,
	{
        initialLoad,
        updateTypingStatus,
        updateMessageList,
        loadOlderMessages,
        deleteMessage,
        sendMessage,
        messageMediaRefChanged,
        refreshChatRoom,
        openProfile,
        openCamera,
        openCameraRoll,
	}
)(ChatRoomConversation);

const styles = {
	homeContainerStyle: {
		backgroundColor: '#f8f8f8',
		flex: 1
	},
	textStyle: {
		fontSize: 12,
		fontWeight: '600',
		color: '#696969',

	},
	onSelectTextStyle: {
		fontSize: 12,
		fontWeight: '600',
		color: 'white',
	},
	backdrop: {
		backgroundColor: 'gray',
		opacity: 0.5,
    },
    imageContainerStyle: {
        height: 60,
        width: 60,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f4f4f4',
        padding: 2
    },

    iconContainerStyle: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    iconStyle: {
        height: 24,
        width: 24,
        margin: 5
    },
    mediaContainerStyle: {
        flexDirection: 'row',
        height: 50,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
        elevation: 1
      },
      headingTextStyle: {
        fontSize: 10,
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 3
      },
};