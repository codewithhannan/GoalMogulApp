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

import React from 'react'
import {
    Text,
    Layout,
    withStyles,
    Menu,
    MenuItem,
    Icon,
} from '@ui-kitten/components'
import _ from 'lodash'
import R from 'ramda'
import moment from 'moment'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { StyleSheet, Alert, View } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'

import ModalHeader from '../../Common/Header/ModalHeader'
import Spacer from '../../Common/Spacer'
import {
    deleteConversationMessages,
    refreshChatRoom,
} from '../../../redux/modules/chat/ChatRoomActions'
import { removeChatMember } from '../../../redux/modules/chat/ChatRoomMembersActions'
import {
    addMemberToChatRoom,
    muteChatRoom,
    changeChatRoomMute,
} from '../../../redux/modules/chat/ChatRoomOptionsActions'
import { openProfile, loadFriends } from '../../../actions'
import {
    GROUP_CHAT_DEFAULT_ICON_URL,
    IMAGE_BASE_URL,
} from '../../../Utils/Constants'
import {
    actionSheet,
    switchByButtonIndex,
} from '../../Common/ActionSheetFactory'
import {
    openMultiUserInviteModal,
    searchFriend,
} from '../../../redux/modules/search/SearchActions'
import ToggleField from '../../Common/ToggleField'

// Icons
function ForwardIcon(props) {
    return <Icon name="chevron-right" pack="material" {...props} />
}

const makeAccessoryLeftIcon = (props, name) => {
    const { style, ...rest } = props
    return (
        <Icon
            name={name}
            style={[style, styles.accessoryLeft]}
            {...rest}
            pack="material"
        />
    )
}

class GroupChatInfo extends React.Component {
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
            isMuted: this.props.isMuted !== undefined,
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
     * close current page
     */
    close() {
        Actions.pop()
    }

    /**
     * Handle mute duration
     */
    handleMuteDuration = () => {
        const chatRoom = this.props.chatRoom
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
                    this.props.muteChatRoom(undefined, chatRoom)
                },
            ],
            [
                R.equals(2),
                () => {
                    // F
                    const muteDuration = moment(new Date())
                        .add(1, 'month')
                        .toDate()
                    this.props.muteChatRoom(muteDuration, chatRoom)
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

    /**
     * Open user page to add member
     */
    openAddMember = () => {
        const { chatRoom } = this.props
        if (!chatRoom) return

        const { name, _id } = chatRoom
        const callback = (selectedUserId) => {
            if (
                chatRoom.members.find(
                    (memberDoc) =>
                        memberDoc.status != 'JoinRequester' &&
                        memberDoc.memberRef._id == selectedUserId
                )
            ) {
                return Alert.alert('User is already a member')
            }
            this.props.addMemberToChatRoom(_id, selectedUserId)
        }

        const props = {
            searchFor: this.props.searchFriend,
            onSubmitSelection: (users, inviteToEntity, actionToExecute) => {
                const callback = () => {
                    this.props.refreshChatRoom(
                        inviteToEntity,
                        this.props.pageId,
                        null,
                        false
                    )
                    actionToExecute()
                }
                console.log('user to invite has length: ', users.length)
                console.log('first user is: ', users[0])
            },
            onCloseCallback: (actionToExecute) => {
                actionToExecute()
            },
            inviteToEntityType: 'Chat',
            inviteToEntityName: name,
            inviteToEntity: _id,
            preload: this.props.loadFriends,
        }

        this.props.openMultiUserInviteModal(props)
    }

    renderMuteDurationPicker() {
        const chatRoom = this.props.chatRoom
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
            />
        )
    }

    render() {
        const { eva, style } = this.props

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
                <View style={styles.container}>
                    {this.renderMuteDurationPicker()}
                    <Layout>
                        <Menu style={styles.menu} appearance="noDivider">
                            {this.props.isAdmin ? (
                                <MenuItem
                                    title={() => (
                                        <Text
                                            category="h6"
                                            style={styles.title}
                                        >
                                            Edit Group Chat
                                        </Text>
                                    )}
                                    accessoryRight={ForwardIcon}
                                    accessoryLeft={(props) =>
                                        makeAccessoryLeftIcon(props, 'settings')
                                    }
                                    onPress={() => {
                                        Actions.push('createChatRoomStack', {
                                            initializeFromState: true,
                                            chat: this.props.chatRoom,
                                        })
                                    }}
                                    style={styles.menuItem}
                                />
                            ) : null}

                            {/* <MenuItem
                                title={() => (
                                    <Text category="h6" style={styles.title}>
                                        Mute Channel
                                    </Text>
                                )}
                                accessoryRight={ForwardIcon}
                                accessoryLeft={(props) =>
                                    makeAccessoryLeftIcon(
                                        props,
                                        'notifications-none'
                                    )
                                }
                                onPress={this.handleMuteDuration}
                                style={styles.menuItem}
                            /> */}
                            <MenuItem
                                title={() => (
                                    <Text category="h6" style={styles.title}>
                                        Mute Channel
                                    </Text>
                                )}
                                accessoryRight={(props) => (
                                    <ToggleField
                                        {...props}
                                        checked={this.state.isMuted}
                                        onCheckedChange={(val) =>
                                            this.setState({
                                                ...this.state,
                                                isMuted: val,
                                            })
                                        }
                                        style={{ marginRight: 16 }}
                                    />
                                )}
                                accessoryLeft={(props) =>
                                    makeAccessoryLeftIcon(
                                        props,
                                        'notifications-none'
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
                                    makeAccessoryLeftIcon(props, 'people')
                                }
                                onPress={() => {
                                    Actions.push('chatRoomMembers')
                                }}
                                style={styles.menuItem}
                            />
                            <MenuItem
                                title={() => (
                                    <Text category="h6" style={styles.title}>
                                        Add Someone
                                    </Text>
                                )}
                                accessoryRight={ForwardIcon}
                                accessoryLeft={(props) =>
                                    makeAccessoryLeftIcon(props, 'person-add')
                                }
                                onPress={this.openAddMember}
                                style={styles.menuItem}
                            />
                            <MenuItem
                                title={() => (
                                    <Text category="h6" style={styles.title}>
                                        Leave Group Message
                                    </Text>
                                )}
                                accessoryRight={ForwardIcon}
                                accessoryLeft={(props) =>
                                    makeAccessoryLeftIcon(props, 'input')
                                }
                                onPress={this.leaveConversation}
                                style={styles.menuItem}
                            />
                        </Menu>
                    </Layout>
                </View>
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
    menu: {
        marginTop: 16,
    },
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
    const { chatRoomsMap, activeChatRoomId } = state.chatRoom

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
                        : profilePic
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
        mutedChatRooms.find(
            (id) => chatRoom && id.toString() == chatRoom._id.toString()
        )

    return {
        chatRoom,
        chatRoomName,
        chatRoomImage,
        otherUser,
        user,
        isMuted,
        isAdmin,
    }
}

// Wrap component with style
const styledGroupChatInfo = withStyles(GroupChatInfo, mapThemeToStyles)
export default connect(mapStateToProps, {
    openProfile,
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
})(styledGroupChatInfo)
