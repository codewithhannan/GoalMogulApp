/**
 * /*
 *     On load we need to:
 *     - subscribe to messages service for new message info
 *     - connect to live chat service for typing indicator
 *     - fetch the full chat document with members populated
 *
 * @format
 */

import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import {
    Bubble,
    GiftedChat,
    Message,
    MessageText,
    Time,
} from 'react-native-gifted-chat'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { openProfile } from '../../../actions'
// Actions
import {} from '../../../redux/modules/chat/ChatRoomActions'
import {
    clearMessageSnapshots,
    deleteMessageFromSnapshots,
    getMessageSnapshots,
} from '../../../redux/modules/chat/ChatRoomMessageSearchActions'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import ModalHeader from '../../Common/Header/ModalHeader'

const MESSAGE_SEARCH_AUTO_SEARCH_DELAY_MS = 500

const DEBUG_KEY = '[ UI ChatMessageSnapshotModal ]'
const LISTENER_KEY = 'ChatMessageSnapshotModal'
class ChatMessageSnapshotModal extends React.Component {
    state = {
        pageSize: 10,
    }
    constructor(props) {
        super(props)
    }
    _keyExtractor = (item) => item._id

    componentDidMount() {
        const { mountedMessage, chatRoom } = this.props
        this.props.getMessageSnapshots(mountedMessage, chatRoom)
    }
    componentWillUnmount() {
        this.props.clearMessageSnapshots()
    }

    closeSnapshot = () => {
        Actions.pop()
    }
    openUserProfile(user) {
        const userId = user._id
        this.props.openProfile(userId)
    }
    deleteMessage(messageId) {
        const { mountedMessage, chatRoom } = this.props
        this.props.deleteMessageFromSnapshots(
            messageId,
            mountedMessage,
            chatRoom
        )
    }
    onMessageLongPress(context, message) {
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
                        Clipboard.setString(this.props.currentMessage.text)
                        break
                    case 1:
                        this.deleteMessage(message._id)
                        break
                }
            }
        )
    }
    renderMessage = (props) => {
        return (
            <Message
                {...props}
                renderBubble={(props) => (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor:
                                    props.currentMessage._id ==
                                    this.props.mountedMessage._id
                                        ? '#F1C91F'
                                        : '#FCFCFC',
                                elevation: 1,
                                shadowColor: '#999',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                borderRadius: 9,
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: 1,
                            },
                            right: {
                                backgroundColor:
                                    props.currentMessage._id ==
                                    this.props.mountedMessage._id
                                        ? '#F1C91F'
                                        : '#F5F9FA',
                                elevation: 1,
                                shadowColor: '#999',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                borderRadius: 9,
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: 1,
                            },
                        }}
                        renderMessageText={(props) => (
                            <MessageText
                                {...props}
                                linkStyle={{
                                    right: {
                                        color: '#46C8F5',
                                    },
                                    left: {
                                        color: '#46C8F5',
                                    },
                                }}
                                textStyle={{
                                    right: {
                                        color: '#262626',
                                    },
                                    left: {
                                        color: '#262626',
                                    },
                                }}
                            />
                        )}
                        renderTime={(props) => (
                            <Time
                                {...props}
                                textStyle={{
                                    right: {
                                        color:
                                            props.currentMessage._id ==
                                            this.props.mountedMessage._id
                                                ? '#BF860B'
                                                : '#aaa',
                                    },
                                    left: {
                                        color:
                                            props.currentMessage._id ==
                                            this.props.mountedMessage._id
                                                ? '#BF860B'
                                                : '#aaa',
                                    },
                                }}
                            />
                        )}
                    />
                )}
            />
        )
    }
    render() {
        const { chatRoom, searchResultPreviewMessages, user } = this.props
        if (!chatRoom) {
            return null
        }
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{
                        ...styles.homeContainerStyle,
                        flex: 1,
                        backgroundColor: '#ffffff',
                    }}
                >
                    <ModalHeader
                        title={`Message Preview`}
                        onCancel={() => this.closeSnapshot()}
                        back={true}
                        actionDisabled={true}
                        actionHidden={true}
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
                        titleTextStyle={{
                            color: '#21364C',
                        }}
                    />
                    <GiftedChat
                        messages={searchResultPreviewMessages}
                        user={{
                            ...user,
                            avatar:
                                user.profile &&
                                user.profile.image &&
                                `${IMAGE_BASE_URL}${user.profile.image}`,
                        }}
                        onPressAvatar={this.openUserProfile.bind(this)}
                        onLongPress={this.onMessageLongPress.bind(this)}
                        renderMessage={this.renderMessage}
                        renderInputToolbar={() => null}
                        bottomOffset={0}
                    />
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { user } = state.user
    const {
        chatRoomsMap,
        activeChatRoomId,
        searchResultPreviewMessages,
    } = state.chatRoom

    const chatRoom = chatRoomsMap[activeChatRoomId]

    return {
        chatRoom,
        searchResultPreviewMessages,
        user,
    }
}

export default connect(mapStateToProps, {
    openProfile,
    getMessageSnapshots,
    clearMessageSnapshots,
    deleteMessageFromSnapshots,
})(ChatMessageSnapshotModal)

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
    },
    imageContainerStyle: {
        height: 35,
        width: 35,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f4f4f4',
        padding: 2,
        marginRight: 12,
        marginLeft: 12,
    },
}
