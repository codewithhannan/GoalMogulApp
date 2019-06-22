/*
	On load we need to:
	- subscribe to messages service for new message info
	- connect to live chat service for typing indicator
	- fetch the full chat document with members populated
*/
import { Octicons } from '@expo/vector-icons';
import { Constants, FileSystem, Permissions } from 'expo';
import R from 'ramda';
import React from 'react';
import { ActionSheetIOS, Alert, Animated, CameraRoll, Clipboard, Dimensions, FlatList, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import { Image, Text } from 'react-native-elements';
import EmojiSelector from 'react-native-emoji-selector';
import { Avatar, GiftedChat, Message, Send } from 'react-native-gifted-chat';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import UUID from 'uuid/v4';
import { openCamera, openCameraRoll, openProfile } from '../../../actions';
import PhotoIcon from '../../../asset/utils/cameraRoll.png';
import profilePic from '../../../asset/utils/defaultUserProfile.png';
import EmojiIcon from '../../../asset/utils/emoji.png';
import LightBulb from '../../../asset/utils/lightBulb.png';
import NextButton from '../../../asset/utils/next.png';
import SendButton from '../../../asset/utils/sendButton.png';
// Components
import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal';
// Actions
import { changeMessageMediaRef, closeActiveChatRoom, deleteMessage, initialLoad, loadOlderMessages, refreshChatRoom, sendChatBotCustomResponseMessage, sendMessage, updateMessageList, updateTypingStatus } from '../../../redux/modules/chat/ChatRoomActions';
import MessageStorageService from '../../../services/chat/MessageStorageService';
import LiveChatService, { OUTGOING_EVENT_NAMES } from '../../../socketio/services/LiveChatService';
import { APP_BLUE_BRIGHT } from '../../../styles';
import { GROUP_CHAT_DEFAULT_ICON_URL, IMAGE_BASE_URL, IPHONE_MODELS_2 } from '../../../Utils/Constants';
import { toHashCode } from '../../../Utils/ImageUtils';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ModalHeader from '../../Common/Header/ModalHeader';
import ProfileImage from '../../Common/ProfileImage';
import { RemoveComponent } from '../../Goal/GoalDetailCard/SuggestionPreview';
import ChatRoomLoaderOverlay from '../Modals/ChatRoomLoaderOverlay';
import GMGiftedChatBubble from './GiftedChat/GMGiftedChatBubble';
import ChatRoomConversationInputToolbar from './GiftedChat/GMGiftedChatInputToolbar';





const DEBUG_KEY = '[ UI ChatRoomConversation ]';
const LISTENER_KEY = 'ChatRoomConversation';
const MAX_TYPING_INDICATORS_TO_DISPLAY = 3;
const CHAT_ROOM_DOCUMENT_REFRESH_INTERVAL = 3000; // milliseconds

const GIFTED_CHAT_BOTTOM_OFFSET = IPHONE_MODELS_2.includes(Constants.platform.ios.model.toLowerCase()) ? 102 : 66;

/**
 * @prop {String} chatRoomId: required
 */
class ChatRoomConversation extends React.Component {
	state = {
		lastAlertedChatRoomId: null,
		composerHeight: 'auto'
	}

	_keyExtractor = (item) => item._id;

	componentDidMount() {
		// initialize
		const { chatRoomId, limit } = this.props;
		this._pollChatRoomDocument();
		MessageStorageService.markConversationMessagesAsRead(chatRoomId);
		MessageStorageService.setActiveChatRoom(chatRoomId);
		MessageStorageService.onIncomingMessageStored(LISTENER_KEY, this._handleIncomingMessage.bind(this));
		MessageStorageService.onPulledMessageStored(LISTENER_KEY, this._handlePulledMessages.bind(this));
		LiveChatService.addListenerToEvent('typingindicator', LISTENER_KEY, this._handleIncomingTypingStatusUpdate.bind(this));
		if (chatRoomId) {
			this.props.initialLoad(chatRoomId, limit);
			LiveChatService.emitEvent(OUTGOING_EVENT_NAMES.joinRoom, { chatRoomId, }, (resp) => {
				if (resp.error) {
					console.log(`${DEBUG_KEY} Error running joinroom socket event`, resp.message);
				};
			});
			LiveChatService.emitOnConnect(LISTENER_KEY, OUTGOING_EVENT_NAMES.joinRoom, { chatRoomId, }, (resp) => {
				if (resp.error) {
					console.log(`${DEBUG_KEY} Error running joinroom socket event`, resp.message);
				};
			});
		};

		this.animations = {
			emojiSelectorSlideAnim: new Animated.Value(Dimensions.get('window').height),
		};
	}
	componentDidUpdate(prevPros) {
		const { userId } = this.props;
		// if we change chat rooms, switch rooms accordingly and re-initialize the component
		const newChatRoomId = this.props.chatRoomId;
		const oldChatRoomId = prevPros.chatRoomId;
		if (newChatRoomId != oldChatRoomId) {
			this.props.initialLoad(newChatRoomId, this.props.limit);
			MessageStorageService.markConversationMessagesAsRead(newChatRoomId);
			MessageStorageService.setActiveChatRoom(newChatRoomId);
			// leave old chat room
			LiveChatService.emitEvent(OUTGOING_EVENT_NAMES.leaveRoom, { chatRoomId: oldChatRoomId, }, (resp) => {/* nothing to do */});
			LiveChatService.cancelEmitOnConnect(LISTENER_KEY);
			LiveChatService.emitEvent(OUTGOING_EVENT_NAMES.updateTypingStatus, {
				userId,
				chatRoomId: oldChatRoomId,
				typingStatus: false,
			}, resp => {});
			// join new chat room
			LiveChatService.emitEvent(OUTGOING_EVENT_NAMES.joinRoom, { chatRoomId: newChatRoomId, }, (resp) => {
				if (resp.error) {
					console.log(`${DEBUG_KEY} Error running joinroom socket event`, resp.message);
				};
			});
			LiveChatService.emitOnConnect(LISTENER_KEY, OUTGOING_EVENT_NAMES.joinRoom, { chatRoomId: newChatRoomId, }, (resp) => {
				if (resp.error) {
					console.log(`${DEBUG_KEY} Error running joinroom socket event`, resp.message);
				};
			});
		};
	}
	componentWillUnmount() {
		const { chatRoomId, userId } = this.props;
		if (!chatRoomId) return;

		this.props.closeActiveChatRoom();
		this._unpollChatRoomDocument();
		MessageStorageService.markConversationMessagesAsRead(chatRoomId);
		MessageStorageService.unsetActiveChatRoom(chatRoomId);
		MessageStorageService.offIncomingMessageStored(LISTENER_KEY);
		LiveChatService.removeListenerFromEvent('typingindicator', LISTENER_KEY);
		LiveChatService.emitEvent(OUTGOING_EVENT_NAMES.updateTypingStatus, {
			userId, chatRoomId,
			typingStatus: false,
		}, (resp) => { });
		LiveChatService.emitEvent(OUTGOING_EVENT_NAMES.leaveRoom, {
			chatRoomId,
		}, (resp) => {/* nothing to do */});
		LiveChatService.cancelEmitOnConnect(LISTENER_KEY);
	}
	_pollChatRoomDocument() {
		this.chatRoomDocumentPoll = setInterval(this._refreshChatRoom.bind(this), CHAT_ROOM_DOCUMENT_REFRESH_INTERVAL);
	}
	_unpollChatRoomDocument() {
		clearInterval(this.chatRoomDocumentPoll);
	}
	_refreshChatRoom() {
		const { chatRoom, messages } = this.props;
		if (chatRoom) {
			this.props.refreshChatRoom(chatRoom._id);
			this.props.updateMessageList(chatRoom, messages || []);
		};
	}
	_handleIncomingTypingStatusUpdate(data) {
		const updateInfo = data.data;
		const { userId, typingStatus } = updateInfo;
		const { currentlyTypingUserIds } = this.props;
		this.props.updateTypingStatus(userId, typingStatus, currentlyTypingUserIds);
	}
	_handlePulledMessages(pulledMessages) {
		if (!pulledMessages) return;
		const { chatRoom, messages } = this.props;
		for (let messageDoc of pulledMessages) {
			if (messageDoc.chatRoomRef == chatRoom._id) {
				this.props.updateMessageList(chatRoom, messages);
				return;
			};
		};
	}
	_handleIncomingMessage(messageInfo) {
		const { chatRoom, messages } = this.props;
		const { messageDoc, chatRoomName, chatRoomPicture } = messageInfo;
		if (messageDoc.chatRoomRef == chatRoom._id) {
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
		DropDownHolder.setOnClose(({action}) => {
			this.setState({
				lastAlertedChatRoomId: null,
			});
			if (action == 'tap') {
				Actions.refresh({
					chatRoomId: messageDoc.chatRoomRef,
				});
			};
		});
		DropDownHolder.alert('custom', titleToDisplay, messageToDisplay);
		this.setState({
			lastAlertedChatRoomId: messageDoc.chatRoomRef,
		});
		clearInterval(this.clearLastAlertedChatRoomIdInterval);
		this.clearLastAlertedChatRoomIdInterval = setInterval(() => {
			this.setState({
				lastAlertedChatRoomId: null,
			}); 
		}, 1000);
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
	deleteMessage(messageId) {
		const { chatRoom, messages } = this.props;
		if (!chatRoom) return;
		this.props.deleteMessage(messageId, chatRoom, messages);
	}
	dismissGoalSuggestion(messageId) {
		this.deleteMessage(messageId);
		this.props.sendChatBotCustomResponseMessage('action:dismiss-goal', this.props.chatRoom);
	}
	sendMessage(messagesToSend) {
		const { messageMediaRef, chatRoom, messages } = this.props;
		if (!messagesToSend[0].text.trim().length && !messageMediaRef) return;
		if (messageMediaRef) {
			this._textInput.blur();
		};
		this.props.sendMessage(messagesToSend, messageMediaRef, chatRoom, messages);
	}

	onSendImageButtonPress = () => {
		const mediaRefCases = switchByButtonIndex([
		  [R.equals(0), () => {
			this.handleOpenCameraRoll();
			this._textInput.blur();
		  }],
		  [R.equals(1), () => {
			this.handleOpenCamera();
			this._textInput.blur();
		  }]
		]);
	
		const addMediaRefActionSheet = actionSheet(
		  ['Open Camera Roll', 'Take Photo', 'Cancel'],
		  2,
		  mediaRefCases
		);
		return addMediaRefActionSheet();
	}
	onOpenEmojiKeyboard() {
		const showEmojiSelector = !this.state.showEmojiSelector;
		if (showEmojiSelector) {
			this._textInput.blur();
			this.setState({ showEmojiSelector }, () => {
				Animated.timing(this.animations.emojiSelectorSlideAnim, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}).start();
			});
		} else {
			Animated.timing(this.animations.emojiSelectorSlideAnim, {
				toValue: Dimensions.get('window').height,
				duration: 400,
				useNativeDriver: true,
			}).start(() => {
				this._textInput.focus();
				this.setState({ showEmojiSelector });
			});
		};
	}
	onEmojiSelected(emoji) {
		this._giftedChat.onInputTextChanged(this._giftedChat.state.text + emoji);
		Animated.timing(this.animations.emojiSelectorSlideAnim, {
			toValue: Dimensions.get('window').height,
			duration: 400,
			useNativeDriver: true,
		}).start(() => {
			this._textInput.focus();
			this.setState({ showEmojiSelector: false });
		});
	}
	handleOpenCamera = () => {
		this.props.openCamera((result) => {
			this.props.changeMessageMediaRef(result.uri);
		});
	}
	handleOpenCameraRoll = () => {
		const callback = R.curry((result) => {
			this.props.changeMessageMediaRef(result.uri);
		});
		this.props.openCameraRoll(callback, { disableEditing: true });
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
					Clipboard.setString(message.text);
					break;
				case 1:
					this.deleteMessage(message._id);
					break;
			};
		});
	}
	onShareContentButtonPress() {
		const { user, chatRoom, messages } = this.props;
		const options = [
			'Share a Friend',
			'Share a Tribe',
			'Share an Event',
			'Cancel',
		];
		const cancelButtonIndex = options.length - 1;
		ActionSheetIOS.showActionSheetWithOptions({
			options,
			cancelButtonIndex,
		}, (buttonIndex) => {
			let onItemSelect
			switch (buttonIndex) {
				case 0:
					const searchFor = {
						type: 'directChat',
					};
					const cardIconStyle = { tintColor: APP_BLUE_BRIGHT };
					const cardIconSource = NextButton;
					const callback = (selectedUserId) => this.props.sendMessage([{
						sharedEntity: { userRef: selectedUserId, },
						text: '',
						user,
						createdAt: new Date(),
						_id: UUID(),
					}], null, chatRoom, messages);
					Actions.push('searchPeopleLightBox', { searchFor, cardIconSource, cardIconStyle, callback });
					break;
				case 1:
					onItemSelect = (selectedTribeId) => {
						Actions.pop();
						this.props.sendMessage([{
							sharedEntity: { tribeRef: selectedTribeId, },
							text: '',
							user,
							createdAt: new Date(),
							_id: UUID(),
						}], null, chatRoom, messages);
					};
					Actions.push('searchTribeLightBox', { onItemSelect });
					break;
				case 2:
					onItemSelect = (selectedEventId) => {
						Actions.pop();
						this.props.sendMessage([{
							sharedEntity: { eventRef: selectedEventId, },
							text: '',
							user,
							createdAt: new Date(),
							_id: UUID(),
						}], null, chatRoom, messages);
						Actions.pop();
					};
					Actions.push('searchEventLightBox', { onItemSelect });
					break;
			}
		});
	}
	onChatTextInputChanged(text) {
		const { userId, chatRoomId } = this.props;
		LiveChatService.emitEvent(OUTGOING_EVENT_NAMES.updateTypingStatus, {
			userId, chatRoomId,
			typingStatus: text.length != 0,
		}, (resp) => {
			if (resp.error) {
				console.log(`${DEBUG_KEY} error setting user's typing status.`, resp.message);
			};
		});
	}
	renderTypingIndicatorFooter() {
		const { currentlyTypingUserIds, chatRoomMembersMap } = this.props;
		const numUsersTyping = currentlyTypingUserIds.length;
		if (numUsersTyping) {
			return (
				<FlatList
					keyExtractor={this._keyExtractor}
					data={currentlyTypingUserIds.slice(0, MAX_TYPING_INDICATORS_TO_DISPLAY)
							.map(userId => chatRoomMembersMap[userId])
							.filter(docExists => docExists)}
					renderItem={({item}) => (<View style={{width: '100%', minHeight: 42, flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
						<ProfileImage
							imageStyle={{ height: 39, width: 39, borderRadius: 4, flex: 1 }}
							imageUrl={item.profile && item.profile.image}
							imageContainerStyle={{ ...styles.imageContainerStyle, height: 42, width: 42, marginLeft: 3 }}
						/>
						<Octicons
							name='ellipsis'
							size={48}
							style={{color: '#CCC', flex: 2, marginLeft: 12}}
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
			  onPress={this.onSendImageButtonPress.bind(this)}
			>
			  <Image
				source={PhotoIcon}
				style={{
				  ...styles.iconStyle,
				  tintColor: '#cbd6d8'
				}}
				resizeMode='contain'
			  />
			</TouchableOpacity>
		  );
	}
	renderShareContentButton() {
		return (
			<TouchableOpacity
			  activeOpacity={0.6}
			  style={styles.iconContainerStyle}
			  onPress={this.onShareContentButtonPress.bind(this)}
			>
			  <Image
				source={LightBulb}
				style={{
				  ...styles.iconStyle,
				  tintColor: '#cbd6d8'
				}}
				resizeMode='contain'
			  />
			</TouchableOpacity>
		  );
	}
	renderEmojiSelector() {
		return (<View>
			<TouchableOpacity
			  activeOpacity={0.6}
			  style={styles.iconContainerStyle}
			  onPress={this.onOpenEmojiKeyboard.bind(this)}
			>
			  <Image
				source={EmojiIcon}
				style={{
				  ...styles.iconStyle,
				  tintColor: '#cbd6d8'
				}}
				resizeMode='contain'
			  />
			</TouchableOpacity>
		  </View>);
	}
	renderExtraActions() {
		return null;
		// we're moving this below
		return (<View
			style={{
				flexDirection: 'row',
				alignItems: 'center'
			}}
		>
			{this.renderSendImageButton()}
			{this.renderEmojiSelector()}
		</View>);
	}
	renderAccessory(props, accessoryLocation) {
		const { messageMediaRef } = this.props;
		if (accessoryLocation == 'bottom') {
			return (
				<View
					style={{
						alignItems: 'center',
						flexDirection: 'row',
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							flexGrow: 2,
							alignItems: 'center',
							paddingLeft: 15,
						}}
					>
						{messageMediaRef ? null : this.renderSendImageButton()}
						{this.renderEmojiSelector()}
						{this.renderShareContentButton()}
					</View>
					<View
						style={{
							alignItems: 'center',
						}}
					>
						{this.renderSendButton(props)}
					</View>
				</View>
			);
		};

		if (!messageMediaRef) return null;
		const onPress = () => {};
		const onRemove = () => {
			this.props.changeMessageMediaRef(undefined);
			this._textInput.blur();
		};
		return (
			<TouchableOpacity activeOpacity={0.6} style={styles.mediaContainerStyle} onPress={onPress}>
				<ProfileImage
					imageStyle={{ width: 50, height: 50 }}
					defaultImageSource={{ uri: messageMediaRef }}
					imageContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
				/>
				<View style={{ flex: 1, marginLeft: 12, marginRight: 12, height: 50, flexGrow: 1 }}>
					<Text
						style={styles.attachedImageTextStyle}
					>
						Attached image
					</Text>
				</View>
				<RemoveComponent onRemove={onRemove} />
			</TouchableOpacity>
		);
	}
	renderSendButton(props) {
		return (
			<Send
				{...props}
			>
				<View style={{paddingRight: 15, paddingBottom: 15, position: 'relative' }}>
					<Image
						style={{height: 27, width: 27, tintColor: APP_BLUE_BRIGHT}}
						source={SendButton}
						resizeMode="contain"
					/>
				</View>
			</Send>
		);
	}
	onComposerHeightChanged = (contentSize) => {
		this.setState({
			composerHeight: Math.min(120, Math.max(42, contentSize.height + 18)),
		})
	}
	renderComposer(props) {
		return(
			<View
				style={{
					flexGrow: 2,
					paddingLeft: 6,
					paddingRight: 12,
					paddingTop: 9,
					paddingBottom: 9,
					width: Dimensions.get('window').width - 108, // icons and padding
				}}
			>
				<TextInput
					ref={inputComponent => this._textInput = inputComponent}
					onChangeText={(text) => {
						props.onTextChanged(text);
						props.onInputTextChanged(text);
					}}
					onContentSizeChange={(e) => {
						// RN bug where e.nativeEvent.contentSize is 36 when input is empty, so we reset it to 18
						this.onComposerHeightChanged((props.text && props.text.length) ? e.nativeEvent.contentSize : 18);
						props.onInputSizeChanged({
							...e.nativeEvent.contentSize,
							height: e.nativeEvent.contentSize.height + 9, // account for padding
						});
					}}
					value={props.text}
					multiline={true}
					numberOfLines={6}
					placeholder={`${props.placeholder.slice(0, 42)}...`}
					style={{
						fontSize: 15,
						padding: 9,
						paddingTop: 12,
						borderColor: '#F1F1F1',
						borderRadius: 6,
						borderWidth: 1,
						height: this.state.composerHeight,
					}}
				/>
			</View>
		);
	}
	renderInputToolbar(props) {
		return (<ChatRoomConversationInputToolbar {...props} />);
	}
	async saveToCameraRoll(imageSource) {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status !== 'granted') {
			return Alert.alert('Denied', 'Enable sharing photos in your phone\'s settings to continue...');
		};
		let urlToRender = imageSource;
		if (!urlToRender.includes(IMAGE_BASE_URL)) {
			urlToRender = `${IMAGE_BASE_URL}${urlToRender}`;
		};
	  if (Platform.OS === 'android') {
		FileSystem.downloadAsync(urlToRender, `${FileSystem.cacheDirectory}saveChatImage/${toHashCode(urlToRender)}`)
		  .then((res) => {
			CameraRoll.saveToCameraRoll(res.uri)
			  .then(Alert.alert('Saved', 'Photo saved to camera roll'))
		  });
	  } else {
		  CameraRoll.saveToCameraRoll(urlToRender)
			.then(Alert.alert('Saved', 'Photo saved to camera roll'))
	  };
	}
	renderMessage = (props) => {
		return (
			<Message
				{...props}
				renderBubble={props => <GMGiftedChatBubble
					{...props}
				/>}
			/>
		);
	}
	renderAvatar(props) {
		return (<Avatar
			{...props}
			containerStyle={{
				left: {
					marginRight: 0,
				},
			}}
			imageStyle={{
				left: {
					borderRadius: 6,
				},
				right: {
					borderRadius: 6,
				},
			}}
		/>);
	}

	render() {
		const { _id, name, profile } = this.props.user;
		return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<View style={styles.homeContainerStyle}>
					{this.props.showInitialLoader ? <ChatRoomLoaderOverlay /> : null}
					<ModalHeader
						title={this.props.chatRoomName}
						titleIcon={this.props.chatRoomImage}
						actionText={`\u2026` /* ellipsis */}
						onAction={this.openOptions}
						back={true}
						onCancel={this.closeConversation}
						containerStyles={{
							elevation: 3,
							shadowColor: '#666',
							shadowOffset: { width: 0, height: 1, },
							shadowOpacity: 0.15,
							shadowRadius: 3,
						}}
						backButtonStyle={{
							tintColor: '#21364C',
						}}
						actionTextStyle={{
							color: '#21364C'
						}}
						titleTextStyle={{
							color: '#21364C',
						}}
					/>
					<GiftedChat
						ref={chatRef => this._giftedChat = chatRef}
						messages={(this.props.ghostMessages || []).concat((this.props.messages || []).sort((doc1, doc2) => doc2.createdAt - doc1.createdAt))}
						user={{
							_id, name,
							avatar: profile && profile.image && `${IMAGE_BASE_URL}${profile.image}`,
						}}
						placeholder={`Send a message to '${this.props.chatRoomName}'`}
						isAnimated={true}
						alwaysShowSend={true}
						renderAvatarOnTop={true}
						loadEarlier={this.props.hasNextPage}
						isLoadingEarlier={this.props.loading}
						onLoadEarlier={this.loadEarlierMessages.bind(this)}
						onPressAvatar={this.openUserProfile.bind(this)}
						onLongPress={this.onMessageLongPress.bind(this)}
						renderFooter={this.renderTypingIndicatorFooter.bind(this)}
						renderActions={this.renderExtraActions.bind(this)}
						onSend={this.sendMessage.bind(this)}
						onInputTextChanged={this.onChatTextInputChanged.bind(this)}
						renderAccessory={this.renderAccessory.bind(this)}
						renderSend={null /*this.renderSendButton*/}
						renderComposer={this.renderComposer.bind(this)}
						maxComposerHeight={120 - 18} // padding
						renderMessage={this.renderMessage}
						renderInputToolbar={this.renderInputToolbar}
						renderAvatar={this.renderAvatar}
						bottomOffset={GIFTED_CHAT_BOTTOM_OFFSET}
						minInputToolbarHeight={this.props.messageMediaRef ? 90 : 60}
						deleteMessage={this.deleteMessage.bind(this)}
						dismissGoalSuggestion={this.dismissGoalSuggestion.bind(this)}
					/>
					{this.state.showEmojiSelector &&
						<Animated.View
							style={{
								position: 'absolute',
								width: Dimensions.get('window').width,
								height: Dimensions.get('window').height,
								backgroundColor: '#fff',
								zIndex: 5,
								transform: [{
									translateY: this.animations.emojiSelectorSlideAnim
								}]
							}}
						>
							<ModalHeader
								actionDisabled={true}
								actionHidden={true}
								title={'Select an Emoji'}
								cancelText={'Close'}
								onCancel={this.onOpenEmojiKeyboard.bind(this)}
								containerStyles={{
									elevation: 1,
									shadowColor: '#666',
									shadowOffset: { width: 0, height: -3, },
									shadowOpacity: 0.3,
									shadowRadius: 1,
								}}
							/>
							<View
								style={{
									paddingTop: 18,
									paddingBottom: 24,
									flexGrow: 1,
								}}
							>
								<EmojiSelector
									onEmojiSelected={this.onEmojiSelected.bind(this)}
								/>
							</View>
						</Animated.View>
					}
				</View>
			</MenuProvider>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { userId, user, token } = state.user;
	const {
		initializing,
		chatRoomsMap, activeChatRoomId,
		messages, limit, skip, hasNextPage, loading,
		currentlyTypingUserIds, messageMediaRef,
		ghostMessages
	} = state.chatRoom;
	const chatRoom = activeChatRoomId && chatRoomsMap[activeChatRoomId];
	
	let chatRoomName = 'Loading';
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
		chatRoomMembersMap = chatRoom.members ? chatRoom.members.reduce((map, memberDoc) => {
			map[memberDoc.memberRef._id] = memberDoc.memberRef;
			return map;
		}, {}) : chatRoomMembersMap;
	};

	return {
		initializing,
		userId,
		user,
		token,
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
		ghostMessages,
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
		changeMessageMediaRef,
		refreshChatRoom,
		closeActiveChatRoom,
		openProfile,
		openCamera,
		openCameraRoll,
		sendChatBotCustomResponseMessage,
	}
)(ChatRoomConversation);

const styles = {
	homeContainerStyle: {
		backgroundColor: '#f8f8f8',
		flex: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
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
	messageImage: {
		height: 100,
		margin: 3,
		resizeMode: 'cover',
		borderRadius: 9,
		width: 'auto',
		minWidth: 150,
	},
	iconContainerStyle: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 33,
		paddingBottom: 15,
	},
	iconStyle: {
		height: 27,
		width: 27,
	},
	mediaContainerStyle: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		height: 50,
		marginBottom: 9,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#EEE',
		borderBottomWidth: 0,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.15,
		shadowRadius: 1,
		elevation: 1
	  },
	  attachedImageTextStyle: {
		fontSize: 15,
		color: '#999',
		flex: 1,
		marginTop: 12,
		marginLeft: 9,
	  },
};

const TOAST_IMAGE_STYLE = {
	height: 36, 
	width: 36, 
	borderRadius: 4
};
const TOAST_IMAGE_CONTAINER_STYLE = {
	borderWidth: 0.5,
	padding: 0.5,
	borderColor: 'lightgray',
	alignItems: 'center',
	borderRadius: 5,
	alignSelf: 'center',
	backgroundColor: 'transparent'
};