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

import React, { useState } from 'react'
import {
    Text,
    Input,
    Layout,
    withStyles,
    Menu,
    MenuItem,
    Icon,
} from '@ui-kitten/components'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { MenuProvider } from 'react-native-popup-menu'
import { ScrollView, StyleSheet, Alert, View } from 'react-native'

import ModalHeader from '../../Common/Header/ModalHeader'
import ToggleField from '../../Common/ToggleField'
import Spacer from '../../Common/Spacer'
import { deleteConversationMessages } from '../../../redux/modules/chat/ChatRoomActions'
import { removeChatMember } from '../../../redux/modules/chat/ChatRoomMembersActions'
import {
    addMemberToChatRoom,
    changeChatRoomMute,
} from '../../../redux/modules/chat/ChatRoomOptionsActions'
import { openProfile } from '../../../actions'
import {
    GROUP_CHAT_DEFAULT_ICON_URL,
    IMAGE_BASE_URL,
} from '../../../Utils/Constants'

// Icons
function ForwardIcon(props) {
    return <Icon {...props} name="arrow-ios-forward" />
}

function BellIcon(props) {
    return <Icon {...props} name="bell-outline" />
}

// Sections
function BasicInfoSection() {
    return (
        <Input
            label="*Group Message Name"
            placeholder="Enter a name for this group"
            size="large"
            style={styles.formContainer}
        />
    )
}

function OtherSettingsSection(props) {
    const { leaveConversation } = props
    // TODO update this
    const [addSomeoneSelected, setAddSomeoneSelected] = useState(false)
    const [leaveSelected, setLeaveSelected] = useState(false)

    return (
        <>
            <Menu style={styles.menu} appearance="noDivider">
                <MenuItem
                    title={() => <Text category="h6">Manage Members</Text>}
                    accessoryRight={ForwardIcon}
                    onPress={() => {
                        Actions.push('chatRoomMembers')
                    }}
                    style={styles.menuItem}
                />
                <MenuItem
                    title={() => <Text category="h6">Add Someone</Text>}
                    accessoryRight={ForwardIcon}
                    // TODO replace the following two attributes
                    //  when wiring up functionalities
                    selected={addSomeoneSelected}
                    onPress={() => setAddSomeoneSelected(true)}
                    style={styles.menuItem}
                />
                <MenuItem
                    title={() => <Text category="h6">Leave Group Message</Text>}
                    accessoryRight={ForwardIcon}
                    // TODO replace the following two attributes
                    //  when wiring up functionalities
                    onPress={leaveConversation}
                    style={styles.menuItem}
                />
            </Menu>
        </>
    )
}

class GroupChatInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isMuted: undefined,
        }
    }

    componentDidMount() {
        this.setState({ isMuted: this.props.isMuted })
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevProps.isMuted == undefined && this.props.isMuted !== undefined) {
        //     console.log("isMuted has changed from undefined to: ", this.props.isMuted)
        // }
        if (
            prevState.isMuted !== undefined &&
            prevState.isMuted != this.state.isMuted
        ) {
            this.toggleMute(this.state.isMuted)
            console.log('hi there')
        }
    }
    /**
     * close current page
     */
    close() {
        Actions.pop()
    }

    // Action to mute the notification for this group chat
    toggleMute = (val) => {
        const { chatRoom } = this.props
        this.props.changeChatRoomMute(chatRoom._id, val)
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
        const searchFor = {
            type: 'addChatMember',
        }
        const cardIconStyle = { tintColor: APP_BLUE_BRIGHT }
        const cardIconSource = plusIcon
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
            this.props.addMemberToChatRoom(chatRoom._id, selectedUserId)
        }
        Actions.push('searchPeopleLightBox', {
            searchFor,
            cardIconSource,
            cardIconStyle,
            callback,
        })
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
                    <Layout>
                        <BasicInfoSection />
                        <Spacer size={3} />
                        <Menu style={styles.menu}>
                            <MenuItem
                                title={() => (
                                    <Text category="h6">Notification</Text>
                                )}
                                accessoryRight={ForwardIcon}
                                // TODO replace the following two attributes
                                //  when wiring up functionalities
                                onPress={() => {}}
                                style={styles.menuItem}
                            />
                        </Menu>
                        <Layout style={styles.formContainer}>
                            <ToggleField
                                label={<Text category="h6">Mute Channel</Text>}
                                checked={this.state.isMuted ? true : false} // Note: Sadly isMuted here is a chatRoomId
                                onCheckedChange={(val) => {
                                    this.setState({
                                        ...this.state,
                                        isMuted: val,
                                    })
                                }}
                            />
                        </Layout>
                        <Spacer size={3} />
                        <OtherSettingsSection
                            leaveConversation={this.leaveConversation}
                        />
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
    menuItem: {
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
    changeChatRoomMute,
    addMemberToChatRoom,
    removeChatMember,
    deleteConversationMessages,
})(styledGroupChatInfo)
