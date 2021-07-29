/**
 * ********************************************************
 * FILENAME: GroupInfo.js    TYPE: Component
 *
 * DESCRIPTION:
 *      Info page for group chat.
 *
 * AUTHER: Yanxiang Lan     START DATE: 26 June 20
 * UTILIZES: UI Kitten
 * *********************************************************
 *
 * @format
 * @see https://akveo.github.io/react-native-ui-kitten/docs/
 */

import {
    Icon,
    Layout,
    Menu,
    MenuItem,
    Text,
    withStyles,
} from '@ui-kitten/components'
import _ from 'lodash'
import moment from 'moment'
import R from 'ramda'
import React from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { loadFriends, openProfile, openProfileDetail } from '../../../actions'
import {
    deleteConversationMessages,
    refreshChatRoom,
} from '../../../redux/modules/chat/ChatRoomActions'
import { removeChatMember } from '../../../redux/modules/chat/ChatRoomMembersActions'
import {
    addMemberToChatRoom,
    changeChatRoomMute,
    muteChatRoom,
} from '../../../redux/modules/chat/ChatRoomOptionsActions'
import {
    openMultiUserInviteModal,
    searchFriend,
} from '../../../redux/modules/search/SearchActions'
import {
    GROUP_CHAT_DEFAULT_ICON_URL,
    IMAGE_BASE_URL,
} from '../../../Utils/Constants'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import ModalHeader from '../../Common/Header/ModalHeader'
import ToggleField from '../../Common/ToggleField'

// Icons
const makeAccessoryIcon = (props, name, accessoryStyle = {}) => {
    const { style, ...iconProps } = props
    return (
        <Icon
            name={name}
            style={[style, accessoryStyle]}
            {...iconProps}
            pack="material"
        />
    )
}

function ForwardIcon(props) {
    return makeAccessoryIcon(props, 'chevron-right')
}

class ChatRoomOptions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            muteDurationPicker: false,
            isMuted: undefined,
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            isMuted:
                this.props.isMuted !== undefined ? this.props.isMuted : false,
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.isMuted !== undefined &&
            prevState.isMuted !== this.state.isMuted &&
            this.props.chatRoom
        ) {
            this.props.changeChatRoomMute(
                this.props.chatRoom._id,
                this.state.isMuted
            )
        }
    }

    /**
     * Only update the component when chatRoom is updated or muted state is updated
     * @param {*} nextProps
     * @param {*} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.chatRoom, nextProps.chatRoom) ||
            this.state.isMuted != nextState.isMuted
        )
    }

    /**
     * close current page
     */
    close() {
        Actions.pop()
    }

    /**
     * Handle mute duration
     */
    handleMuteDuration = () => {
        const { chatRoom } = this.props
        if (!chatRoom) return

        const muteDurationSwitch = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    // Add 24 hours to current time
                    const muteDuration = moment(new Date())
                        .add(24, 'hours')
                        .toDate()
                    this.props.muteChatRoom(muteDuration, chatRoom)
                },
            ],
            [
                R.equals(1),
                () => {
                    // Add 7 days to current time
                    const muteDuration = moment(new Date())
                        .add(1, 'weeks')
                        .toDate()
                    this.props.muteChatRoom(muteDuration, chatRoom)
                },
            ],
            [
                R.equals(2),
                () => {
                    this.props.changeChatRoomMute(chatRoom._id, true)
                },
            ],
            [
                R.equals(3),
                () => {
                    // Show customized time picker
                    this.setState({
                        ...this.state,
                        muteDurationPicker: true,
                    })
                },
            ],
        ])

        const muteActionSheet = actionSheet(
            ['1 Day', '1 Week', 'Forever', 'Custom', 'Cancel'],
            4,
            muteDurationSwitch
        )
        return muteActionSheet()
    }

    // Action to leave this group chat
    leaveConversation = () => {
        const { isAdmin, user, chatRoom } = this.props
        if (
            isAdmin &&
            chatRoom.members.length > 1 &&
            chatRoom.members.filter((memberDoc) => memberDoc.status == 'Admin')
                .length == 1
        ) {
            return Alert.alert(
                'Forbidden.',
                "You're the only admin in this conversation."
            )
        }
        Alert.alert(
            'Are you sure?',
            'You will not be able to send or recieve messages from this conversation after you leave...',
            [
                {
                    text: 'Leave conversation',
                    onPress: () =>
                        this.props.removeChatMember(
                            user._id,
                            chatRoom._id,
                            (err, isSuccess) => {
                                if (!isSuccess) {
                                    Alert.alert(
                                        'Error',
                                        'Could not leave chat room. Please try again later.'
                                    )
                                } else {
                                    Actions.popTo('chat')
                                }
                            }
                        ),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            {
                cancelable: false,
            }
        )
    }

    openMessageSearch = () => Actions.push('chatRoomMessageSearch')

    deleteConversationMessages = () => {
        const { chatRoom, messages } = this.props

        if (!chatRoom) return
        if (messages.length === 0) {
            Alert.alert('No message found to delete')
        } else {
            Alert.alert(
                'Are you sure?',
                "This will delete all your copies of this conversation's messages",
                [
                    {
                        text: 'Delete all',
                        onPress: () =>
                            this.props.deleteConversationMessages(chatRoom, []),
                    },
                    {
                        text: 'Cancel',
                        onPress: () => {
                            /* let it close */
                        },
                        style: 'cancel',
                    },
                ],
                { cancelable: false }
            )
        }
    }

    /**
     * Open user page to add member
     */
    openAddMember = () => {
        const { chatRoom } = this.props
        if (!chatRoom) return

        const { name, _id } = chatRoom

        this.props.openMultiUserInviteModal({
            searchFor: this.props.searchFriend,
            onSubmitSelection: (users, inviteToEntity, actionToExecute) => {
                // inviteToEntity here is the same as _id for the chatRoom
                this.props.addMemberToChatRoom(inviteToEntity, users)
                // actionToExecute is to close the modal
                actionToExecute()
            },
            onCloseCallback: (actionToExecute) => {
                // actionToExecute is to close the modal
                actionToExecute()
            },
            inviteToEntityType: 'Chat',
            inviteToEntityName: name,
            inviteToEntity: _id,
            preload: this.props.loadFriends,
            /**
             * TODO: tags should be coming from API in item rather than from the props.
             * Refactor this function once https://app.asana.com/0/1179217829906634/1183132912958225/f
             * is completed
             */
            tags: {
                member: chatRoom.members
                    .filter((doc) => doc.status === 'Member')
                    .map((i) => i.memberRef._id),
                requested: chatRoom.members
                    .filter((doc) => doc.status === 'JoinRequester')
                    .map((i) => i.memberRef._id), // chat has no requested
                invited: [], // chat has no invitee
                admin: chatRoom.members
                    .filter((doc) => doc.status === 'Admin')
                    .map((i) => i.memberRef._id),
            },
        })
    }

    renderMuteDurationPicker = () => {
        const { chatRoom } = this.props
        if (!chatRoom) return null
        return (
            <DateTimePicker
                isVisible={this.state.muteDurationPicker}
                mode="datetime"
                titleIOS="Mute this channel until"
                minimumDate={new Date()}
                onConfirm={(date) => {
                    this.setState(
                        {
                            ...this.state,
                            muteDurationPicker: false,
                        },
                        () => {
                            this.props.muteChatRoom(date, chatRoom)
                        }
                    )
                }}
                onCancel={() => {
                    this.setState({
                        ...this.state,
                        muteDurationPicker: false,
                    })
                }}
                isDarkModeEnabled={false}
            />
        )
    }

    /**
     * Options are
     * 1. View profile
     * 2. Mute Conversation
     * 3. Search Messages
     * 4. Delete all messages
     */
    renderPrivateChatOptions = (otherUser) => {
        if (!otherUser) return
        return (
            <Menu style={styles.menu} appearance="noDivider">
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            View profile
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(props, 'person', styles.accessoryLeft)
                    }
                    onPress={() => this.props.openProfile(otherUser._id)}
                    style={styles.menuItem}
                />
                {/* // Once API for this method is ready, uncomment this and delete the toggle mute
                    <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Mute Channel
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(
                            props,
                            'notifications-none',
                            styles.accessoryLeft
                        )
                    }
                    onPress={this.handleMuteDuration}
                    style={styles.menuItem}
                /> */}
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Mute Group Chat
                        </Text>
                    )}
                    accessoryRight={(props) => (
                        <ToggleField
                            {...props}
                            checked={this.state.isMuted}
                            onCheckedChange={(val) =>
                                this.setState({
                                    isMuted: val,
                                })
                            }
                            style={{ marginRight: 16 }}
                        />
                    )}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(
                            props,
                            'notifications-none',
                            styles.accessoryLeft
                        )
                    }
                    style={styles.menuItem}
                />
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Search Messages
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(props, 'search', styles.accessoryLeft)
                    }
                    onPress={this.openMessageSearch}
                    style={styles.menuItem}
                />
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Delete all messages
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(props, 'delete', styles.accessoryLeft)
                    }
                    onPress={this.deleteConversationMessages}
                    style={styles.menuItem}
                />
            </Menu>
        )
    }

    /**
     * Options are
     * 1. Edit Group Chat (if admin)
     * 2. Mute Channel
     * 3. Manage Members (if admin) / View Members (if member)
     * 4. Add Member (if allow invite friend)
     * 5. Search messages
     * 6. Delete all messages
     * 7. Leave Conversation
     */
    renderGroupChatOptions = () => {
        const { chatRoom, isAdmin } = this.props
        if (!chatRoom) return null
        return (
            <Menu style={styles.menu} appearance="noDivider">
                {isAdmin ? (
                    <MenuItem
                        title={() => (
                            <Text category="h6" style={styles.title}>
                                Edit Group Settings
                            </Text>
                        )}
                        accessoryRight={ForwardIcon}
                        accessoryLeft={(props) =>
                            makeAccessoryIcon(
                                props,
                                'settings',
                                styles.accessoryLeft
                            )
                        }
                        onPress={() => {
                            Actions.push('createChatRoomStack', {
                                initializeFromState: true,
                                chat: chatRoom,
                            })
                        }}
                        style={styles.menuItem}
                    />
                ) : null}

                {/* // Once API for this method is ready, uncomment this and delete the toggle mute
                    <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Mute Channel
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(
                            props,
                            'notifications-none',
                            styles.accessoryLeft
                        )
                    }
                    onPress={this.handleMuteDuration}
                    style={styles.menuItem}
                /> */}
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Mute Group Chat
                        </Text>
                    )}
                    accessoryRight={(props) => (
                        <ToggleField
                            {...props}
                            checked={this.state.isMuted}
                            onCheckedChange={(val) => {
                                console.log('THIS IS MUTE CHAT', val)
                                this.setState({
                                    isMuted: val,
                                })
                            }}
                            style={{ marginRight: 16 }}
                        />
                    )}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(
                            props,
                            'notifications-none',
                            styles.accessoryLeft
                        )
                    }
                    style={styles.menuItem}
                />
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Manage Members
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(props, 'people', styles.accessoryLeft)
                    }
                    onPress={() => {
                        Actions.push('chatRoomMembers')
                    }}
                    style={styles.menuItem}
                />
                {chatRoom.membersCanAdd || isAdmin ? (
                    <MenuItem
                        title={() => (
                            <Text category="h6" style={styles.title}>
                                Add Friend
                            </Text>
                        )}
                        accessoryRight={ForwardIcon}
                        accessoryLeft={(props) =>
                            makeAccessoryIcon(
                                props,
                                'person-add',
                                styles.accessoryLeft
                            )
                        }
                        onPress={this.openAddMember}
                        style={styles.menuItem}
                    />
                ) : null}
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Search Messages
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(props, 'search', styles.accessoryLeft)
                    }
                    onPress={this.openMessageSearch}
                    style={styles.menuItem}
                />
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Delete all messages
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(props, 'delete', styles.accessoryLeft)
                    }
                    onPress={this.deleteConversationMessages}
                    style={styles.menuItem}
                />
                <MenuItem
                    title={() => (
                        <Text category="h6" style={styles.title}>
                            Leave Group Conversation
                        </Text>
                    )}
                    accessoryRight={ForwardIcon}
                    accessoryLeft={(props) =>
                        makeAccessoryIcon(props, 'input', styles.accessoryLeft)
                    }
                    onPress={this.leaveConversation}
                    style={styles.menuItem}
                />
            </Menu>
        )
    }

    render() {
        const { eva, style, chatRoom, otherUser } = this.props

        let componentToRender
        // Chat hasn't finished loading
        if (!chatRoom || (chatRoom.roomType == 'Direct' && !otherUser)) {
            componentToRender = (
                <Text
                    style={{
                        fontSize: 18,
                        color: '#999',
                        textAlign: 'center',
                        marginTop: 48,
                    }}
                >
                    Loading...
                </Text>
            )
        } else {
            componentToRender = (
                <>
                    {this.renderMuteDurationPicker()}
                    {chatRoom.roomType == 'Direct'
                        ? this.renderPrivateChatOptions(otherUser)
                        : this.renderGroupChatOptions()}
                </>
            )
        }

        return (
            <Layout style={style}>
                <ModalHeader
                    title="Info"
                    actionHidden={true}
                    back={true}
                    onCancel={this.close}
                    containerStyles={[
                        styles.modalContainer,
                        eva.style.backgroundPrimary,
                    ]}
                    backButtonStyle={styles.modalBackButton}
                    titleTextStyle={styles.modalTitleText}
                />
                <View style={styles.container}>{componentToRender}</View>
            </Layout>
        )
    }
}

/**
 * Map app theme to styles. These styles can be accessed
 * using the <eva> prop. For example,
 * const { eva } = this.props;
 * eva.styles.backgroundPrimary;
 * @see https://github.com/akveo/react-native-ui-kitten/blob/master/docs/src/articles/design-system/use-theme-variables.md
 */
const mapThemeToStyles = (theme) => ({
    backgroundPrimary: {
        backgroundColor: theme['color-primary-500'],
    },
})

const styles = StyleSheet.create({
    backdrop: {},
    container: {
        height: '100%',
    },
    modalContainer: {
        elevation: 3,
        shadowColor: '#666',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    modalBackButton: {
        tintColor: '#fff',
    },
    modalTitleText: {
        color: '#fff',
    },
    formContainer: {
        padding: 16,
    },
    menu: {},
    accessoryLeft: {
        marginHorizontal: 0,
        marginRight: 10,
    },
    title: {
        flex: 1,
    },
    menuItem: {
        justifyContent: 'flex-start',
        flex: 1,
        paddingVertical: 16,
        paddingLeft: 16,
    },
})

const mapStateToProps = (state) => {
    const { userId, user } = state.user
    const { chatRoomsMap, activeChatRoomId, messages } = state.chatRoom

    let chatRoom = chatRoomsMap[activeChatRoomId]

    // extract details from the chat room
    let chatRoomName = 'Loading...'
    let chatRoomImage = null
    let otherUser = null
    let isAdmin = false

    if (chatRoom) {
        chatRoom.members =
            chatRoom.members &&
            chatRoom.members.filter((memberDoc) => memberDoc.memberRef)
        if (chatRoom.roomType == 'Direct') {
            otherUser =
                chatRoom.members &&
                chatRoom.members.find(
                    (memberDoc) => memberDoc.memberRef._id != userId
                )
            if (otherUser) {
                otherUser = otherUser.memberRef
                chatRoomName = otherUser.name
                chatRoomImage =
                    otherUser.profile && otherUser.profile.image
                        ? { uri: `${IMAGE_BASE_URL}${otherUser.profile.image}` }
                        : undefined
            }
        } else {
            chatRoomName = chatRoom.name
            chatRoomImage = {
                uri: chatRoom.picture
                    ? `${IMAGE_BASE_URL}${chatRoom.picture}`
                    : GROUP_CHAT_DEFAULT_ICON_URL,
            }
            isAdmin =
                chatRoom.members &&
                chatRoom.members.find(
                    (memberDoc) =>
                        memberDoc.memberRef._id == userId &&
                        memberDoc.status == 'Admin'
                )
        }
    }

    // extract details from the user object
    const notificationPrefs = user.chatNotificationPreferences
    const mutedChatRooms =
        notificationPrefs && notificationPrefs.mutedChatRoomRefs
    const isMuted =
        mutedChatRooms &&
        chatRoom &&
        mutedChatRooms.find((id) => id.toString() == chatRoom._id.toString())

    return {
        chatRoom,
        chatRoomName,
        chatRoomImage,
        otherUser,
        messages,
        user,
        isMuted,
        isAdmin,
    }
}

// Wrap component with style
const styledChatRoomOptions = withStyles(ChatRoomOptions, mapThemeToStyles)
export default connect(mapStateToProps, {
    openProfile,
    openProfileDetail,
    muteChatRoom,
    addMemberToChatRoom,
    removeChatMember,
    deleteConversationMessages,
    changeChatRoomMute,
    // For user invite modal
    loadFriends,
    refreshChatRoom,
    searchFriend,
    openMultiUserInviteModal,
})(styledChatRoomOptions)
