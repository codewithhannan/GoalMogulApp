/**
 * /*
 * 	On load we need to:
 * 	- subscribe to messages service for new message info
 * 	- connect to live chat service for typing indicator
 * 	- fetch the full chat document with members populated
 *
 * There are two main components for GiftedChat.js
 * 1. GMGiftedMessage that includes Avatar and Message bubble
 * 2. GMGfitedChatInputToolbar that includes composer, attached
 *    image preview, and action buttons
 *
 * Most of the props that these two components and their
 * children components are using are defined as props
 * in GiftedChat props in this file
 *
 * @format
 */

import { Icon, Layout } from '@ui-kitten/components'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { MenuProvider } from 'react-native-popup-menu'

import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import {
    Alert,
    Clipboard,
    Dimensions,
    FlatList,
    Image,
    Platform,
    TextInput,
    TouchableOpacity,
    Text,
    View,
} from 'react-native'
import CameraRoll from '@react-native-community/cameraroll'
import { Video } from 'expo-av'
import { Avatar, SystemMessage } from 'react-native-gifted-chat'
import { Actions } from 'react-native-router-flux'
import { TypingAnimation } from 'react-native-typing-animation'
import { connect } from 'react-redux'
import UUID from 'uuid/v4'
import { openCamera, openCameraRoll, openProfile } from '../../../actions'
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png'
import defaultGroupChatPic from '../../../asset/icons/AccountMulti.png'
import ChatGallery from '../../../asset/background/FeedbackScreenShot.png'

import NextButton from '../../../asset/utils/next.png'
// Components
import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal'
// Actions
import {
    changeMessageMediaRef,
    changeMessageVoiceRef,
    changeMessageVideoRef,
    closeActiveChatRoom,
    deleteMessage,
    initialLoad,
    loadOlderMessages,
    refreshChatRoom,
    sendChatBotCustomResponseMessage,
    sendMessage,
    sendVoiceMessage,
    sendVideoMessage,
    updateMessageList,
    updateTypingStatus,
} from '../../../redux/modules/chat/ChatRoomActions'
import MessageStorageService from '../../../services/chat/MessageStorageService'
import LiveChatService, {
    OUTGOING_EVENT_NAMES,
} from '../../../socketio/services/LiveChatService'

// utils
import {
    getProfileImageOrDefaultFromUser,
    getProfileImageOrDefault,
} from '../../../redux/middleware/utils'
import { color } from '../../../styles/basic'
import {
    GROUP_CHAT_DEFAULT_ICON_URL,
    IMAGE_BASE_URL,
} from '../../../Utils/Constants'
import { toHashCode } from '../../../Utils/ImageUtils'
import DelayedButton from '../../Common/Button/DelayedButton'
import ModalHeader from '../../Common/Header/ModalHeader'
import ProfileImage from '../../Common/ProfileImage'
import ChatRoomLoaderOverlay from '../Modals/ChatRoomLoaderOverlay'
import { GMGiftedChat } from './GiftedChat/GMGiftedChat'
import ChatRoomConversationInputToolbar from './GiftedChat/GMGiftedChatInputToolbar'
import GMGiftedMessage from './GiftedChat/GMGiftedMessage'
import Send from './GiftedChat/GMGiftedSend'
import { IS_SMALL_PHONE, getButtonBottomSheetHeight } from '../../../styles'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
import { HEADER_STYLES } from '../../../styles/Header'
import { chat_style } from '../../../styles/Chat'
import AttachGoal from '../../Post/AttachGoal'

const DEBUG_KEY = '[ UI ChatRoomConversation ]'
const LISTENER_KEY = 'ChatRoomConversation'
const MAX_TYPING_INDICATORS_TO_DISPLAY = 3
const CHAT_ROOM_DOCUMENT_REFRESH_INTERVAL = 3000 // milliseconds

/**
 * Remove button for image preview in chat inputbox
 * @param {*} props
 */
const RemoveAttachedImageButton = (props) => {
    const { onRemove, uploading } = props
    return (
        <DelayedButton
            activeOpacity={0.6}
            onPress={onRemove}
            style={{
                position: 'absolute',
                top: -8,
                right: -8,
                zIndex: 2,
                height: 22,
                width: 22,
                backgroundColor: 'white',
                borderRadius: 11,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            disabled={uploading}
        >
            <Icon
                name="cancel"
                pack="material"
                style={{
                    height: 22,
                    width: 22,
                    borderRadius: 11,
                    tintColor: 'gray',
                }}
            />
        </DelayedButton>
    )
}

/**
 * @prop {String} chatRoomId: required
 */
class ChatRoomConversation extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            lastAlertedChatRoomId: null,
            lastEmittedTypingIndicatorStatus: false,

            messageDoc: {},
            showCameraRoll: false,
            status: {},
            video: '',
        }
    }

    _keyExtractor = (item) => item._id

    componentDidMount() {
        // initialize
        const { chatRoomId, limit } = this.props

        this._pollChatRoomDocument()
        MessageStorageService.markConversationMessagesAsRead(chatRoomId)
        MessageStorageService.setActiveChatRoom(chatRoomId)
        MessageStorageService.onIncomingMessageStored(
            LISTENER_KEY,
            this._handleIncomingMessage.bind(this)
        )
        MessageStorageService.onPulledMessageStored(
            LISTENER_KEY,
            this._handlePulledMessages.bind(this)
        )
        LiveChatService.addListenerToEvent(
            'typingindicator',
            LISTENER_KEY,
            this._handleIncomingTypingStatusUpdate.bind(this)
        )
        if (chatRoomId) {
            this.props.initialLoad(chatRoomId, limit)
            LiveChatService.emitEvent(
                OUTGOING_EVENT_NAMES.joinRoom,
                { chatRoomId },
                (resp) => {
                    if (resp.error) {
                        console.log(
                            `${DEBUG_KEY} Error running joinroom socket event`,
                            resp.message
                        )
                    }
                }
            )
            LiveChatService.emitOnConnect(
                LISTENER_KEY,
                OUTGOING_EVENT_NAMES.joinRoom,
                { chatRoomId },
                (resp) => {
                    if (resp.error) {
                        console.log(
                            `${DEBUG_KEY} Error running joinroom socket event`,
                            resp.message
                        )
                    }
                }
            )
        }
    }

    componentDidUpdate(prevProps) {
        const { userId } = this.props

        // if we change chat rooms, switch rooms accordingly and re-initialize the component
        const newChatRoomId = this.props.chatRoomId
        const oldChatRoomId = prevProps.chatRoomId
        if (newChatRoomId != oldChatRoomId) {
            this.props.initialLoad(newChatRoomId, this.props.limit)
            MessageStorageService.markConversationMessagesAsRead(newChatRoomId)
            MessageStorageService.setActiveChatRoom(newChatRoomId)
            // leave old chat room
            LiveChatService.emitEvent(
                OUTGOING_EVENT_NAMES.leaveRoom,
                { chatRoomId: oldChatRoomId },
                (resp) => {
                    /* nothing to do */
                }
            )
            LiveChatService.cancelEmitOnConnect(LISTENER_KEY)
            LiveChatService.emitEvent(
                OUTGOING_EVENT_NAMES.updateTypingStatus,
                {
                    userId,
                    chatRoomId: oldChatRoomId,
                    typingStatus: false,
                },
                (resp) => {}
            )
            // join new chat room
            LiveChatService.emitEvent(
                OUTGOING_EVENT_NAMES.joinRoom,
                { chatRoomId: newChatRoomId },
                (resp) => {
                    if (resp.error) {
                        console.log(
                            `${DEBUG_KEY} Error running joinroom socket event`,
                            resp.message
                        )
                    }
                }
            )
            LiveChatService.emitOnConnect(
                LISTENER_KEY,
                OUTGOING_EVENT_NAMES.joinRoom,
                { chatRoomId: newChatRoomId },
                (resp) => {
                    if (resp.error) {
                        console.log(
                            `${DEBUG_KEY} Error running joinroom socket event`,
                            resp.message
                        )
                    }
                }
            )
        }
    }

    componentWillUnmount() {
        const { chatRoomId, userId } = this.props
        if (!chatRoomId) return

        this.props.closeActiveChatRoom()
        this._unpollChatRoomDocument()
        MessageStorageService.markConversationMessagesAsRead(chatRoomId)
        MessageStorageService.unsetActiveChatRoom(chatRoomId)
        MessageStorageService.offIncomingMessageStored(LISTENER_KEY)
        LiveChatService.removeListenerFromEvent('typingindicator', LISTENER_KEY)
        LiveChatService.emitEvent(
            OUTGOING_EVENT_NAMES.updateTypingStatus,
            {
                userId,
                chatRoomId,
                typingStatus: false,
            },
            (resp) => {}
        )
        LiveChatService.emitEvent(
            OUTGOING_EVENT_NAMES.leaveRoom,
            {
                chatRoomId,
            },
            (resp) => {
                /* nothing to do */
            }
        )
        LiveChatService.cancelEmitOnConnect(LISTENER_KEY)
    }

    /**
     * TODO: nextProps.messages sometimes diffs than this.props.messages although
     * there is actually no changes but the minor field changes in the messages,
     * e.g.
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(nextProps.initializing, this.props.initializing) ||
            !_.isEqual(nextProps.userId, this.props.userId) ||
            !_.isEqual(nextProps.token, this.props.token) ||
            !_.isEqual(nextProps.chatRoom, this.props.chatRoom) ||
            !_.isEqual(nextProps.messages, this.props.messages) ||
            !_.isEqual(
                nextProps.currentlyTypingUserIds,
                this.props.currentlyTypingUserIds
            ) ||
            !_.isEqual(nextProps.messageMediaRef, this.props.messageMediaRef) ||
            !_.isEqual(nextProps.ghostMessages, this.props.ghostMessages) ||
            !_.isEqual(
                nextState.lastAlertedChatRoomId,
                this.state.lastAlertedChatRoomId
            ) ||
            !_.isEqual(
                nextState.lastEmittedTypingIndicatorStatus,
                this.state.lastEmittedTypingIndicatorStatus
            )
        )
    }

    _pollChatRoomDocument() {
        this.chatRoomDocumentPoll = setInterval(
            this._refreshChatRoom.bind(this),
            CHAT_ROOM_DOCUMENT_REFRESH_INTERVAL
        )
    }
    _unpollChatRoomDocument() {
        clearInterval(this.chatRoomDocumentPoll)
    }
    _refreshChatRoom() {
        const { chatRoom, messages } = this.props
        if (chatRoom) {
            this.props.refreshChatRoom(chatRoom._id)
            this.props.updateMessageList(chatRoom, messages || [])
        }
    }
    _handleIncomingTypingStatusUpdate(data) {
        const updateInfo = data.data
        const { userId, typingStatus } = updateInfo
        const { currentlyTypingUserIds } = this.props
        this.props.updateTypingStatus(
            userId,
            typingStatus,
            currentlyTypingUserIds
        )
    }
    _handlePulledMessages(pulledMessages) {
        if (!pulledMessages) return
        const { chatRoom, messages } = this.props
        for (let messageDoc of pulledMessages) {
            if (messageDoc.chatRoomRef == chatRoom._id) {
                this.props.updateMessageList(chatRoom, messages)
                return
            }
        }
    }
    _handleIncomingMessage(messageInfo) {
        const { chatRoom, messages } = this.props
        const { messageDoc, chatRoomName, chatRoomPicture } = messageInfo

        this.setState({ ...this.state, messageDoc })

        if (messageDoc.chatRoomRef == chatRoom._id) {
            this.props.updateMessageList(chatRoom, messages)
            return
        }
        // do not show alert if we already displayed it
        if (this.state.lastAlertedChatRoomId == messageDoc.chatRoomRef) {
            return
        }
        // show toast
        const titleToDisplay = chatRoomName
        const messageToDisplay =
            messageDoc.content && messageDoc.content.message
        DropDownHolder.setDropDownImage(chatRoomPicture)
        DropDownHolder.setDropDownImageStyle(TOAST_IMAGE_STYLE)
        DropDownHolder.setDropDownImageContainerStyle(
            TOAST_IMAGE_CONTAINER_STYLE
        )

        // action: Enum['automatic', 'programmatic', 'tap', 'pan', 'cancel']
        DropDownHolder.setOnClose(({ action }) => {
            this.setState({
                lastAlertedChatRoomId: null,
            })
            if (action == 'tap') {
                Actions.refresh({
                    chatRoomId: messageDoc.chatRoomRef,
                })
            }
        })
        DropDownHolder.alert('custom', titleToDisplay, messageToDisplay)
        this.setState({
            lastAlertedChatRoomId: messageDoc.chatRoomRef,
        })
        clearInterval(this.clearLastAlertedChatRoomIdInterval)
        this.clearLastAlertedChatRoomIdInterval = setInterval(() => {
            this.setState({
                lastAlertedChatRoomId: null,
            })
        }, 1000)
    }

    openOptions() {
        Actions.push('chatRoomOptions')
    }
    closeConversation() {
        Actions.pop()
    }
    loadEarlierMessages = () => {
        const { chatRoom, hasNextPage, limit, skip } = this.props
        if (hasNextPage) {
            this.props.loadOlderMessages(chatRoom, limit, skip)
        }
    }
    openUserProfile = (user) => {
        const userId = user._id
        this.props.openProfile(userId)
    }
    deleteMessage = (messageId) => {
        const { chatRoom, messages } = this.props
        if (!chatRoom) return
        this.props.deleteMessage(messageId, chatRoom, messages)
    }
    dismissGoalSuggestion = (messageId) => {
        this.deleteMessage(messageId)
        this.props.sendChatBotCustomResponseMessage(
            'action:dismiss-goal',
            this.props.chatRoom
        )
    }
    sendMessage = (messagesToSend) => {
        const {
            chatRoom,
            messages,
            messageMediaRef,
            messageVoiceRef,
        } = this.props

        const messageText = _.get(messagesToSend, '[0].text', '')
        if (!messageText.trim().length && !messageMediaRef) return
        if (messageMediaRef) {
            this._textInput.blur()
        }

        this.props.sendMessage(
            messagesToSend,
            messageMediaRef,
            chatRoom,
            messages
        )
    }
    sendVoiceMessage = (messagesToSend) => {
        const { chatRoom, messages, messageVoiceRef } = this.props

        this.props.sendVoiceMessage(
            messagesToSend,
            messageVoiceRef,
            chatRoom,
            messages
        )
    }
    sendVideoMessage = (messagesToSend) => {
        const { chatRoom, messages, messageVideoRef } = this.props

        this.props.sendVideoMessage(
            messagesToSend,
            messageVideoRef,
            chatRoom,
            messages
        )
    }

    openAddMediaBottomSheet = () => this.mediaRefBottomSheetRef.open()

    closeAddMediaBottomSheet = () => this.mediaRefBottomSheetRef.close()

    makeMediaRefOptions = () => {
        return [
            {
                // text: 'Take Photo',
                // icon: { name: 'camera', pack: 'material-community' },
                // iconStyle: { height: 24, color: 'black' },
                // onPress: () => {
                //     this.closeAddMediaBottomSheet()
                //     this._textInput.blur()
                //     setTimeout(() => {
                //         this.handleOpenCamera()
                //     }, 500)
                // },
            },
            // {
            //     text: 'Open Camera Roll',
            //     textStyle: { color: 'black' },
            //     icon: { name: 'image-outline', pack: 'material-community' },
            //     iconStyle: { height: 24, color: 'black' },
            //     imageStyle: { tintColor: 'black' },
            //     onPress: () => {
            //         this.closeAddMediaBottomSheet()
            //         this._textInput.blur()
            //         setTimeout(() => {
            //             this.handleOpenCameraRoll()
            //         }, 500)
            //     },
            // },
        ]
    }

    renderAddMediaRefBottomSheet = () => {
        const options = this.makeMediaRefOptions()

        const sheetHeight = getButtonBottomSheetHeight(3)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.mediaRefBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
                chatGallary
                chatGallaryPress={this.handleOpenCameraRoll}
            />
        )
    }

    handleOpenCamera = () => {
        this.props.openCamera(
            (result) => {
                if (result.type === 'video') {
                    this.props.changeMessageVideoRef(result.uri)
                    this._textInput.focus()
                } else {
                    this.props.changeMessageMediaRef(result.uri)
                }
            },
            null,
            null,
            true
        )
    }
    handleOpenCameraRoll = () => {
        const callback = R.curry((result) => {
            if (result.type === 'video') {
                this.props.changeMessageVideoRef(result.uri)
                this._textInput.focus()
            } else {
                this.props.changeMessageMediaRef(result.uri)
            }
        })
        this.props.openCameraRoll(callback, { disableEditing: true })
    }
    onMessageLongPress = (context, message) => {
        const options = ['Copy Text', 'Delete', 'Cancel']
        const cancelButtonIndex = options.length - 1
        context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        Clipboard.setString(message.text)
                        break
                    case 1:
                        this.deleteMessage(message._id)
                        break
                }
            }
        )
    }

    /** Bottom Sheet related section */
    openOptionModal = () => this.bottomSheetRef.open()

    closeOptionModal = () => this.bottomSheetRef.close()

    handleCamraIcon = () => {
        const { user, chatRoom, messages } = this.props
        // const shareGoalOption = {
        //     text: 'Share a Goal',
        //     textStyle: { color: 'black' },
        //     icon: { name: 'bullseye-arrow', pack: 'material-community' },
        //     onPress: () => {
        //         this.closeOptionModal()
        //         // Wait for bottom sheet to  close
        //         // before showing unfriend alert confirmation
        //         setTimeout(() => {
        //             if (this.attachGoalModal) {
        //                 this.attachGoalModal.open()
        //             }
        //         }, 500)
        //     },
        // }

        // Current version we don't support share an update
        // const shareUpdateOption = {
        //     text: 'Share an Update',
        //     textStyle: { color: 'black' },
        //     icon: { name: 'feather', pack: 'material-community' },
        //     onPress: () => {},
        // }

        const shareUserOption = {
            // text: 'Share a Friend',
            // textStyle: { color: 'black' },
            // icon: { name: 'account', pack: 'material-community' },
            // onPress: () => {
            //     this.closeOptionModal()
            //     // Wait for bottom sheet to close
            //     // before showing unfriend alert confirmation
            //     const searchFor = {
            //         type: 'directChat',
            //     }
            //     const cardIconStyle = { tintColor: color.GM_BLUE_LIGHT }
            //     const cardIconSource = NextButton
            //     const callback = (selectedUserId) =>
            //         this.props.sendMessage(
            //             [
            //                 {
            //                     sharedEntity: {
            //                         userRef: selectedUserId,
            //                     },
            //                     text: '',
            //                     user,
            //                     createdAt: new Date(),
            //                     _id: UUID(),
            //                 },
            //             ],
            //             null,
            //             chatRoom,
            //             messages
            //         )
            //     Actions.push('searchPeopleLightBox', {
            //         searchFor,
            //         cardIconSource,
            //         cardIconStyle,
            //         callback,
            //     })
            // },
        }

        // Current version we don't support share a tribe
        // const shareTribeOption = {
        //     text: 'Share a Tribe',
        //     textStyle: { color: 'black' },
        //     icon: { name: 'flag', pack: 'material-community' },
        //     onPress: () => {
        //         this.closeOptionModal()
        //         // Wait for bottom sheet to close
        //         // before showing unfriend alert confirmation
        //         setTimeout(() => {
        //             const onItemSelect = (selectedTribeId) => {
        //                 Actions.pop()
        //                 this.props.sendMessage(
        //                     [
        //                         {
        //                             sharedEntity: {
        //                                 tribeRef: selectedTribeId,
        //                             },
        //                             text: '',
        //                             user,
        //                             createdAt: new Date(),
        //                             _id: UUID(),
        //                         },
        //                     ],
        //                     null,
        //                     chatRoom,
        //                     messages
        //                 )
        //             }
        //             Actions.push('searchTribeLightBox', { onItemSelect })
        //         }, 500)
        //     },
        // }

        return [
            // shareGoalOption,
            // shareUpdateOption,
            shareUserOption,
            // shareTribeOption,
        ]
    }

    /** Bottom Sheet related section ends */

    onChatTextInputChanged = (text) => {
        const { userId, chatRoomId } = this.props
        const typingStatus = text.length > 0
        if (this.state.lastEmittedTypingIndicatorStatus != typingStatus) {
            LiveChatService.emitEvent(
                OUTGOING_EVENT_NAMES.updateTypingStatus,
                { userId, chatRoomId, typingStatus },
                (resp) => {
                    if (resp.error) {
                        console.log(
                            `${DEBUG_KEY} error setting user's typing status.`,
                            resp.message
                        )
                    }
                }
            )
            this.setState({
                lastEmittedTypingIndicatorStatus: typingStatus,
            })
        }
    }
    renderTypingIndicatorFooter = () => {
        const { currentlyTypingUserIds, chatRoomMembersMap } = this.props
        const numUsersTyping = currentlyTypingUserIds.length
        if (numUsersTyping) {
            return (
                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={currentlyTypingUserIds
                        .slice(0, MAX_TYPING_INDICATORS_TO_DISPLAY)
                        .map((userId) => chatRoomMembersMap[userId])
                        .filter((docExists) => docExists)}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                width: '100%',
                                minHeight: 42,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 6,
                            }}
                        >
                            <ProfileImage
                                imageStyle={{
                                    height: 40,
                                    width: 40,
                                    flex: 1,
                                }}
                                imageUrl={item.profile && item.profile.image}
                                imageContainerStyle={{
                                    ...styles.imageContainerStyle,
                                    height: 40,
                                    width: 40,
                                }}
                            />
                            <TypingAnimation
                                dotColor="#595b5e"
                                dotMargin={9}
                                dotAmplitude={3}
                                dotSpeed={0.15}
                                dotRadius={2.5}
                                dotX={24}
                                dotY={0}
                            />
                        </View>
                    )}
                />
            )
        }
        return null
    }
    renderSendImageButton() {
        const { messageMediaRef, messageVideoRef } = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={{
                    // use padding instead of margin to space buttons so it increases tapable area
                    paddingRight: 12,
                    ...styles.iconContainerStyle,
                }}
                onPress={this.openAddMediaBottomSheet}
            >
                {/* <Icon
                    name="image-outline"
                    pack="material-community"
                    style={[styles.iconStyle, { tintColor: '#4F4F4F' }]}
                /> */}
                <Image
                    source={require('../../../asset/icons/ChatGallary.png')}
                    style={{
                        height: 25,
                        width: 25,
                        marginBottom: 2,
                        tintColor:
                            messageMediaRef || messageVideoRef
                                ? '#42C0F5'
                                : 'gray',
                    }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )
    }

    openRecordingModal = () => this.bottomRecodingSheet.open()

    closeRecordingnModal = () => this.bottomRecodingSheet.close()

    renderRecordButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={{
                    // use padding instead of margin to space buttons so it increases tapable area
                    paddingLeft: 10,
                    paddingRight: 6,
                    ...styles.iconContainerStyle,
                }}
                onPress={this.openRecordingModal}
            >
                {/* <Icon
                    name="zmdi-mic"
                    pack="material-community"
                    style={[
                        styles.iconStyle,
                        {
                            position: 'relative',
                            bottom: 2,
                            tintColor: '#F2C94C',
                        },
                    ]}
                /> */}
                <Image
                    source={require('../../../asset/icons/Audio.png')}
                    style={{ height: 22, width: 22, marginBottom: 4 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )
    }

    renderCameraButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={{
                    // use padding instead of margin to space buttons so it increases tapable area
                    paddingLeft: 7,
                    paddingRight: 6,
                    ...styles.iconContainerStyle,
                }}
                onPress={this.openOptionModal}
            >
                {/* <Icon
                    name="zmdi-mic"
                    pack="material-community"
                    style={[
                        styles.iconStyle,
                        {
                            position: 'relative',
                            bottom: 2,
                            tintColor: '#F2C94C',
                        },
                    ]}
                /> */}
                <Image
                    source={require('../../../asset/icons/ChatCamera.png')}
                    style={{ height: 22, width: 22, marginBottom: 4 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )
    }

    renderAttachedImage = () => {
        const { messageMediaRef, messageVideoRef } = this.props

        if (!messageMediaRef && !messageVideoRef) return null
        const onPress = () => {}
        const onRemoveImage = () => {
            this.props.changeMessageMediaRef(undefined)
            this._textInput.blur()
        }
        const onRemoveVideo = () => {
            this.props.changeMessageVideoRef(undefined)
            this._textInput.blur()
        }

        return (
            <>
                {messageMediaRef ? (
                    <View
                        style={{
                            width: 65,
                            height: 75,
                            marginVertical: 10,
                            marginLeft: 16,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                flexDirection: 'row',
                                borderRadius: 5,
                            }}
                            onPress={onPress}
                        >
                            <Image
                                source={{ uri: messageMediaRef }}
                                style={{
                                    height: 75,
                                    width: 65,
                                    borderRadius: 5,
                                }}
                                resizeMode="cover"
                            />
                            <RemoveAttachedImageButton
                                onRemove={onRemoveImage}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View
                        style={{
                            width: '90%',
                            alignSelf: 'center',

                            paddingBottom: 10,
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                flexDirection: 'row',
                                borderRadius: 5,
                            }}
                            onPress={onPress}
                        >
                            <Video
                                ref={this.state.video}
                                source={{ uri: messageVideoRef }}
                                style={{
                                    height: 135,
                                    width: '100%',
                                    borderRadius: 5,
                                }}
                                shouldPlay
                                resizeMode="cover"
                                isLooping
                                onPlaybackStatusUpdate={(status) =>
                                    this.setState({ status })
                                }
                            />

                            <RemoveAttachedImageButton
                                onRemove={onRemoveVideo}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </>
        )
    }

    renderAccessory = (props, accessoryLocation) => {
        const { messageMediaRef, messageVoiceRef } = this.props
        const onRemove = () => {
            this.props.changeMessageVoiceRef(undefined)
            this._textInput.blur()
        }
        if (accessoryLocation == 'bottom') {
            return (
                <View>
                    {messageVoiceRef ? (
                        <View
                            style={{
                                height: 62,
                                marginLeft: 16,
                                paddingVertical: 6,
                                flexDirection: 'row',
                            }}
                        >
                            <Text>Attached Voice</Text>
                            <TouchableOpacity
                                onPress={onRemove}
                                // style={{ justifyContent: 'flex-end' }}
                            >
                                <Icon
                                    name="cancel"
                                    pack="material"
                                    style={{
                                        height: 22,
                                        width: 22,
                                        borderRadius: 11,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <View
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingLeft: 12,
                            paddingRight: 12,
                            paddingBottom: 15,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                flexGrow: 2,
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                            }}
                        >
                            {this.renderSendImageButton()}
                            {this.renderCameraButton()}
                            {this.renderRecordButton()}
                        </View>
                        <View
                            style={{
                                justifyContent: 'flex-end',
                            }}
                        >
                            {this.renderSendButton(props)}
                        </View>
                    </View>
                    {this.renderAttachedImage()}
                </View>
            )
        }
    }

    renderSendButton = (props) => {
        const {
            messageMediaRef,
            messageVoiceRef,
            messageVideoRef,
            initializing,
        } = this.props
        return (
            <Send
                {...props}
                containerStyle={{
                    height: 30,
                }}
                messageMediaRef={messageMediaRef}
                messageVideoRef={messageVideoRef}
                messageVoiceRef={messageVoiceRef}
                disabled={initializing}
            />
        )
    }

    renderComposer = (props) => {
        return (
            <View
                style={{
                    flexGrow: 2,
                    paddingLeft: 6,
                    paddingRight: 12,
                    paddingBottom: 9,
                    width: Dimensions.get('window').width - 108, // icons and padding
                }}
            >
                <TextInput
                    ref={(inputComponent) => (this._textInput = inputComponent)}
                    onChangeText={(text) => {
                        props.onTextChanged(text)
                        props.onInputTextChanged(text)
                    }}
                    value={props.text}
                    multiline={true}
                    placeholder={`${props.placeholder.slice(0, 42)}...`}
                    autoFocus={false}
                    style={{
                        fontSize: 15,
                        padding: 9,
                        paddingTop: 12,
                        paddingBottom: 4,
                        minHeight: 15 + 18,
                        maxHeight: 18 * 5 + 23,
                    }}
                />
            </View>
        )
    }
    renderInputToolbar = (props) => {
        return <ChatRoomConversationInputToolbar {...props} />
    }
    async saveToCameraRoll(imageSource) {
        // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        const {
            status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            return Alert.alert(
                'Denied',
                "Enable sharing photos in your phone's settings to continue..."
            )
        }
        let urlToRender = imageSource
        if (!urlToRender.includes(IMAGE_BASE_URL)) {
            urlToRender = `${IMAGE_BASE_URL}${urlToRender}`
        }
        if (Platform.OS === 'android') {
            FileSystem.downloadAsync(
                urlToRender,
                `${FileSystem.cacheDirectory}saveChatImage/${toHashCode(
                    urlToRender
                )}`
            ).then((res) => {
                CameraRoll.save(res.uri).then(
                    Alert.alert('Saved', 'Photo saved to camera roll')
                )
            })
        } else {
            CameraRoll.save(urlToRender).then(
                Alert.alert('Saved', 'Photo saved to camera roll')
            )
        }
    }

    renderMessage = (props) => {
        const { messageDoc } = this.state
        return <GMGiftedMessage {...props} messageDoc={messageDoc} />
    }

    renderSystemMessage = (props) => {
        return (
            <SystemMessage
                {...props}
                textStyle={{
                    color: '#666',
                    fontSize: 14,
                    fontWeight: '500',
                }}
            />
        )
    }

    // Render user image for the message
    renderAvatar = (props) => {
        return (
            <Avatar
                {...props}
                containerStyle={{
                    left: {
                        marginRight: 0,
                    },
                }}
            />
        )
    }

    renderBottomButtonSheet = () => {
        const options = this.handleCamraIcon()
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(3)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
                chatCameraPress
                chatCameraPress={this.handleOpenCamera}
            />
        )
    }

    renderBottomVoiceRecording = () => {
        const options = this.handleCamraIcon()
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(5.35)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomRecodingSheet = r)}
                buttons={[{}]}
                height={sheetHeight}
                chatRecordingPress
                chatRoom={this.props.chatRoom}
                user={this.props.user}
                messages={this.props.messages}
            />
        )
    }

    renderAttachGoal = () => {
        const { user, chatRoom, messages } = this.props
        return (
            <AttachGoal
                topOffSet={IS_SMALL_PHONE ? 48 : 82}
                onRef={(r) => (this.attachGoalModal = r)}
                onSelect={(goalDoc) => {
                    this.attachGoalModal.close()
                    if (goalDoc && goalDoc._id) {
                        this.props.sendMessage(
                            [
                                {
                                    sharedEntity: {
                                        goalRef: goalDoc,
                                    },
                                    text: '',
                                    user,
                                    createdAt: new Date(),
                                    _id: UUID(),
                                },
                            ],
                            null,
                            chatRoom,
                            messages
                        )
                    }
                }}
            />
        )
    }

    render() {
        const { useDefaultChatRoomImage } = this.props
        const { _id, name, profile } = this.props.user
        const { messageMediaRef } = this.props
        // console.log('this is the props', this.props)
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <Layout style={styles.homeContainerStyle}>
                    {this.props.showInitialLoader ? (
                        <ChatRoomLoaderOverlay />
                    ) : null}
                    <ModalHeader
                        title={this.props.chatRoomName}
                        titleIcon={this.props.chatRoomImage}
                        titleIconContainerStyle={
                            useDefaultChatRoomImage
                                ? chat_style.headerDefaultIconContainer
                                : undefined
                        }
                        titleIconStyle={
                            useDefaultChatRoomImage
                                ? chat_style.headerDefaultIcon
                                : undefined
                        }
                        actionIcon={
                            <Icon
                                name="dots-horizontal"
                                pack="material-community"
                                style={HEADER_STYLES.nakedButton}
                            />
                        }
                        onAction={this.openOptions}
                        back={true}
                        onCancel={this.closeConversation}
                        containerStyles={{
                            elevation: 3,
                            shadowColor: '#666',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.15,
                            shadowRadius: 3,
                        }}
                        backButtonStyle={{
                            tintColor: '#21364C',
                        }}
                        actionTextStyle={{
                            color: '#fff',
                        }}
                        titleTextStyle={{
                            color: '#fff',
                        }}
                    />
                    <GMGiftedChat
                        ref={(chatRef) => (this._giftedChat = chatRef)}
                        messages={(this.props.ghostMessages || []).concat(
                            (this.props.messages || []).sort(
                                (doc1, doc2) => doc2.createdAt - doc1.createdAt
                            )
                        )}
                        user={{
                            _id,
                            name,
                            avatar: getProfileImageOrDefault(profile.image),
                        }}
                        placeholder={`Send a message to '${this.props.chatRoomName}'`}
                        isAnimated={true}
                        alwaysShowSend={true}
                        renderAvatarOnTop={true}
                        loadEarlier={this.props.hasNextPage}
                        isLoadingEarlier={this.props.loading}
                        onLoadEarlier={this.loadEarlierMessages}
                        onPressAvatar={this.openUserProfile}
                        onLongPress={this.onMessageLongPress}
                        renderFooter={this.renderTypingIndicatorFooter}
                        onSend={
                            this.props.messageVoiceRef
                                ? this.sendVoiceMessage
                                : this.props.messageMediaRef
                                ? this.sendMessage
                                : this.sendVideoMessage
                        }
                        onInputTextChanged={this.onChatTextInputChanged}
                        renderAccessory={this.renderAccessory}
                        renderSend={null /*this.renderSendButton*/}
                        renderComposer={this.renderComposer}
                        // maxComposerHeight={120 - 18} // padding
                        maxComposerHeight={196}
                        minComposerHeight={108}
                        renderMessage={this.renderMessage}
                        renderSystemMessage={this.renderSystemMessage}
                        renderInputToolbar={this.renderInputToolbar}
                        renderAvatar={this.renderAvatar}
                        minInputToolbarHeight={
                            this.props.messageMediaRef ? 96 : 60
                        }
                        deleteMessage={this.deleteMessage}
                        dismissGoalSuggestion={this.dismissGoalSuggestion}
                    />

                    {this.renderBottomButtonSheet()}
                    {/* {this.renderAttachGoal()} */}
                    {this.renderBottomVoiceRecording()}
                    {this.renderAddMediaRefBottomSheet()}
                </Layout>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { userId, user, token } = state.user
    const {
        initializing,
        chatRoomsMap,
        activeChatRoomId,
        messages,
        limit,
        skip,
        hasNextPage,
        loading,
        currentlyTypingUserIds,
        messageMediaRef,
        messageVoiceRef,
        messageVideoRef,
        ghostMessages,
    } = state.chatRoom

    const chatRoom = activeChatRoomId && chatRoomsMap[activeChatRoomId]

    let chatRoomName = 'Loading'
    let chatRoomImage = null
    let chatRoomMembersMap = {}
    let useDefaultChatRoomImage = false
    if (chatRoom) {
        if (chatRoom.roomType == 'Direct') {
            let otherUser =
                chatRoom.members &&
                chatRoom.members.find(
                    (memberDoc) => memberDoc.memberRef._id != userId
                )
            if (otherUser) {
                otherUser = otherUser.memberRef
                chatRoomName = otherUser.name
                useDefaultChatRoomImage = !_.has(otherUser, 'profile.image')
                chatRoomImage = getProfileImageOrDefaultFromUser(
                    otherUser,
                    defaultProfilePic
                )
            }
        } else {
            chatRoomName = chatRoom.name
            useDefaultChatRoomImage = chatRoom.picture == undefined
            chatRoomImage = chatRoom.picture
                ? {
                      uri: `${IMAGE_BASE_URL}${chatRoom.picture}`,
                  }
                : defaultGroupChatPic
        }
        chatRoomMembersMap = chatRoom.members
            ? chatRoom.members.reduce((map, memberDoc) => {
                  map[memberDoc.memberRef._id] = memberDoc.memberRef
                  return map
              }, {})
            : chatRoomMembersMap
    }

    return {
        initializing,
        userId,
        user,
        token,
        chatRoom,
        chatRoomName,
        chatRoomImage,
        useDefaultChatRoomImage,
        chatRoomMembersMap,
        messages,
        limit,
        skip,
        hasNextPage,
        loading,
        currentlyTypingUserIds,
        messageMediaRef,
        messageVoiceRef,
        messageVideoRef,
        ghostMessages,
    }
}

export default connect(mapStateToProps, {
    initialLoad,
    updateTypingStatus,
    updateMessageList,
    loadOlderMessages,
    deleteMessage,
    sendMessage,
    sendVoiceMessage,
    sendVideoMessage,
    changeMessageMediaRef,
    changeMessageVoiceRef,
    changeMessageVideoRef,
    refreshChatRoom,
    closeActiveChatRoom,
    openProfile,
    openCamera,
    openCameraRoll,
    sendChatBotCustomResponseMessage,
})(ChatRoomConversation)

const styles = {
    homeContainerStyle: {
        flex: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
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
        marginBottom: 9,
        marginLeft: 9,
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
        width: 30,
    },
    iconStyle: {
        height: 28,
        width: 28,
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
        elevation: 1,
    },
    attachedImageTextStyle: {
        fontSize: 15,
        color: '#999',
        flex: 1,
        marginTop: 12,
        marginLeft: 9,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
}

const TOAST_IMAGE_STYLE = {
    height: 36,
    width: 36,
    borderRadius: 4,
}
const TOAST_IMAGE_CONTAINER_STYLE = {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: 'transparent',
}
