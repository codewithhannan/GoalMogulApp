/*
    On load we need to:
    - subscribe to messages service for new message info
    - connect to live chat service for typing indicator
    - fetch the full chat document with members populated
*/
import moment from 'moment';
import React from 'react';
import {
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from  '@expo/vector-icons';

// Actions
import {
    
} from '../../../redux/modules/chat/ChatRoomActions';
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
import { refreshChatMessageSearch, searchQueryUpdated, getMessageSnapshots, clearMessageSnapshots, deleteMessageFromSnapshots } from '../../../redux/modules/chat/ChatRoomMessageSearchActions';
import { StackedAvatarsV2 } from '../../Common/StackedAvatars';
import { Image, Text, Divider, SearchBar } from 'react-native-elements';
import { APP_BLUE_BRIGHT } from '../../../styles';
import ProfileImage from '../../Common/ProfileImage';
import { getUserDocument, MemberDocumentFetcher } from '../../../Utils/UserUtils';
import { SearchIcon } from '../../../Utils/Icons';
import { GiftedChat, Bubble, Message, MessageText, Time } from 'react-native-gifted-chat';

const MESSAGE_SEARCH_AUTO_SEARCH_DELAY_MS = 500;

const DEBUG_KEY = '[ UI ChatMessageSnapshotModal ]';
const LISTENER_KEY = 'ChatMessageSnapshotModal';
class ChatMessageSnapshotModal extends React.Component {
    state = {
        pageSize: 10,
    }
    constructor(props) {
		super(props);
	}
	_keyExtractor = (item) => item._id;

	componentDidMount() {
        const { mountedMessage, activeChatRoomId, chatRoomMembersMap } = this.props;
		this.props.getMessageSnapshots(mountedMessage, activeChatRoomId, chatRoomMembersMap);
    }
    componentWillUnmount() {
        this.props.clearMessageSnapshots();
    }

    closeSnapshot = () => {
        Actions.pop();
    }
    openUserProfile(user) {
        const userId = user._id;
        this.props.openProfile(userId);
    }
    deleteMessage(messageId) {
        const { mountedMessage, activeChatRoomId, chatRoomMembersMap } = this.props;
        this.props.deleteMessageFromSnapshots(messageId, mountedMessage, activeChatRoomId, chatRoomMembersMap);
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
    renderMessage(props) {
        return (
            <Message
                {...props}
                renderBubble={props => <Bubble
                    {...props}
                    wrapperStyle={{
                        left: {
                            backgroundColor: '#FCFCFC',
                            elevation: 1,
                            shadowColor: '#999',
                            shadowOffset: { width: 0, height: 1, },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            borderRadius: 9,
                            borderColor: 'rgba(0,0,0,0.1)',
                            borderWidth: 1,
                        },
                        right: {
                            backgroundColor: '#F5F9FA',
                            elevation: 1,
                            shadowColor: '#999',
                            shadowOffset: { width: 0, height: 1, },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            borderRadius: 9,
                            borderColor: 'rgba(0,0,0,0.1)',
                            borderWidth: 1,
                        }
                    }}
                    renderMessageText={props => <MessageText
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
                    />}
                    renderTime={props => <Time
                        {...props}
                        textStyle={{
                            right: {
                                color: '#aaa',
                            },
                        }}
                    />}
                />}
            />
        );
    };
	render() {
        const { chatRoom, searchResultPreviewMessages, user } = this.props;
        if (!chatRoom) {
            return null;
        };
		return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<KeyboardAvoidingView
					behavior='padding'
					style={{ flex: 1, backgroundColor: '#ffffff' }}
				>
					<ModalHeader
						title={`Message Preview`}
                        onCancel={() => this.closeSnapshot()}
                        back={true}
                        actionDisabled={true}
                        actionHidden={true}
					/>
                    <GiftedChat
                        messages={searchResultPreviewMessages}
                        user={{
                            ...user,
                            avatar: user.profile && user.profile.image,
                        }}
                        onPressAvatar={this.openUserProfile.bind(this)}
                        onLongPress={this.onMessageLongPress.bind(this)}
                        renderMessage={this.renderMessage}
                        renderInputToolbar={() => null}
                        bottomOffset={0}
                    />
                </KeyboardAvoidingView>
            </MenuProvider>
		);
	}
}

const mapStateToProps = (state, props) => {
    const { user } = state.user;
    const {
        chatRoomsMap, activeChatRoomId,
        searchResultPreviewMessages,
    } = state.chatRoom;

    const chatRoom = chatRoomsMap[activeChatRoomId];
    
    // extract details from the chat room
    let chatRoomMembersMap = {};
    if (chatRoom) {
        chatRoomMembersMap = chatRoom.members ? chatRoom.members.reduce((map, memberDoc) => {
            map[memberDoc.memberRef._id] = memberDoc.memberRef;
            return map;
        }, {}) : chatRoomMembersMap;
    };

	return {
        chatRoom,
        activeChatRoomId,
        chatRoomMembersMap,
        searchResultPreviewMessages,
        user,
	};
};

export default connect(
	mapStateToProps,
	{
        openProfile,
        getMessageSnapshots,
        clearMessageSnapshots,
        deleteMessageFromSnapshots,
	}
)(ChatMessageSnapshotModal);

const styles = {
	homeContainerStyle: {
		backgroundColor: '#f8f8f8',
		flex: 1
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
};