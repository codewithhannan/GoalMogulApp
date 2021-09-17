/**
 * /*
 *     On load we need to:
 *     - subscribe to messages service for new message info
 *     - connect to live chat service for typing indicator
 *     - fetch the full chat document with members populated
 *
 * @format
 */

import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import {
    Dimensions,
    FlatList,
    Platform,
    TouchableOpacity,
    View,
} from 'react-native'
import { Divider, Text } from 'react-native-elements'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { TabView } from 'react-native-tab-view'
import { connect } from 'react-redux'
import { openProfile } from '../../../actions'
import {
    acceptChatMemberJoinRequest,
    demoteChatMember,
    promoteChatMember,
    refreshChatMembersTab,
    removeChatMember,
    selectChatMembersTab,
} from '../../../redux/modules/chat/ChatRoomMembersActions'
import { color } from '../../../styles/basic'
import { DEVICE_MODEL, IPHONE_MODELS } from '../../../Utils/Constants'
// Actions
import ModalHeader from '../../Common/Header/ModalHeader'
import ProfileImage from '../../Common/ProfileImage'
import TabButtonGroup from '../../Common/TabButtonGroup'

const SCREEN_WIDTH = Dimensions.get('window').width
const SEARCHBAR_HEIGHT =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 30 : 40
const SCREEN_HEIGHT = Dimensions.get('window').height
const BODY_HEIGHT = SCREEN_HEIGHT - 48.5 - SEARCHBAR_HEIGHT - 150

const DEBUG_KEY = '[ UI ChatRoomMembers ]'
const LISTENER_KEY = 'ChatRoomMembers'
class ChatRoomMembers extends React.Component {
    _keyExtractor = (item) => item._id

    closeMembers() {
        Actions.pop()
    }
    openUserProfile(user) {
        const userId = user._id
        this.props.openProfile(userId)
    }
    handleOnRefresh() {
        this.props.refreshChatMembersTab(this.props.chatRoom._id)
    }
    promoteMember = (userId) => {
        this.props.promoteChatMember(userId, this.props.chatRoom._id)
    }
    demoteMember = (userId) => {
        this.props.demoteChatMember(userId, this.props.chatRoom._id)
    }
    acceptJoinRequest = (userId) => {
        this.props.acceptChatMemberJoinRequest(userId, this.props.chatRoom._id)
    }
    removeMember = (userId) => {
        this.props.removeChatMember(userId, this.props.chatRoom._id)
    }

    _renderItem = (data) => {
        const memberDoc = data.item
        const { isAdmin, userId } = this.props
        const userDoc = memberDoc.memberRef

        if (!userDoc) return null
        const memberStatus = memberDoc.status

        return (
            <View style={styles.memberCardContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.openUserProfile(userDoc)}
                    style={styles.memberCardBodyContainerStyle}
                >
                    <ProfileImage
                        imageStyle={{ height: 35, width: 35, borderRadius: 50 }}
                        imageUrl={userDoc.profile && userDoc.profile.image}
                        defaultImageContainerStyle={{
                            ...styles.imageContainerStyle,
                        }}
                        userId={userDoc._id}
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            marginLeft: 6,
                            marginTop: 6,
                            color: '#666',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {userDoc.name}
                    </Text>
                </TouchableOpacity>
                <View style={styles.memberCardActionsStyle}>
                    {isAdmin &&
                        memberStatus == 'Member' &&
                        userId != userDoc._id && (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => this.promoteMember(userDoc._id)}
                                style={{
                                    backgroundColor: '#F1F1F1',
                                    borderRadius: 3,
                                    padding: 6,
                                }}
                            >
                                <Text style={{ fontSize: 10, color: '#AAA' }}>
                                    Make admin
                                </Text>
                            </TouchableOpacity>
                        )}
                    {isAdmin &&
                        memberStatus == 'Admin' &&
                        userId != userDoc._id && (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => this.demoteMember(userDoc._id)}
                                style={{
                                    backgroundColor: '#F1F1F1',
                                    borderRadius: 3,
                                    padding: 6,
                                }}
                            >
                                <Text style={{ fontSize: 10, color: '#AAA' }}>
                                    Demote admin
                                </Text>
                            </TouchableOpacity>
                        )}
                    {isAdmin &&
                        memberStatus == 'JoinRequester' &&
                        userId != userDoc._id && (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() =>
                                    this.acceptJoinRequest(userDoc._id)
                                }
                            >
                                <MaterialIcons
                                    name="check"
                                    size={27}
                                    color="#61BA68"
                                />
                            </TouchableOpacity>
                        )}
                    {isAdmin && userId != userDoc._id && (
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.removeMember(userDoc._id)}
                            style={{ marginLeft: 9 }}
                        >
                            <MaterialIcons
                                name="cancel"
                                size={27}
                                color="#F47474"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        )
    }
    _renderListEmptyState = () => {
        if (!this.props.refreshing) {
            return (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: BODY_HEIGHT,
                    }}
                >
                    <Text
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 18,
                            color: '#999',
                        }}
                    >
                        No members...
                    </Text>
                </View>
            )
        }
        return null
    }
    _renderMemberList = (key) => {
        const { chatRoom } = this.props
        if (!chatRoom || !chatRoom.members) return null

        const memberList = chatRoom.members.filter((memberDoc) => {
            switch (key) {
                case 'members':
                    return memberDoc.status == 'Member'
                case 'admins':
                    return memberDoc.status == 'Admin'
                case 'joinRequesters':
                    return memberDoc.status == 'JoinRequester'
                default:
                    return false
            }
        })
        return (
            <FlatList
                data={memberList}
                renderItem={this._renderItem.bind(this)}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                refreshing={this.props.refreshing}
                onRefresh={this.handleOnRefresh.bind(this)}
                ListEmptyComponent={this._renderListEmptyState.bind(this)}
            />
        )
    }
    _renderScene = ({ route }) => {
        return this._renderMemberList(route.key)
    }
    _renderHeader = (props) => {
        return (
            <View>
                <Divider color="#F9F9F9" />
                <TabButtonGroup buttons={props} />
            </View>
        )
    }
    render() {
        const { chatRoom } = this.props
        if (!chatRoom) {
            return null
        }
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <View style={styles.homeContainerStyle}>
                    <ModalHeader
                        title={'Conversation Members'}
                        actionHidden={true}
                        back={true}
                        onCancel={this.closeMembers}
                        containerStyles={{
                            backgroundColor: color.GM_BLUE,
                        }}
                        backButtonStyle={{
                            tintColor: '#21364C',
                        }}
                        titleTextStyle={{
                            color: '#21364C',
                        }}
                    />
                    <TabView
                        navigationState={this.props.navigationState}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderHeader}
                        onIndexChange={this.props.selectChatMembersTab}
                        useNativeDriver
                    />
                </View>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { userId } = state.user
    const { chatRoomsMap, activeChatRoomId } = state.chatRoom
    const { refreshing, navigationState } = state.chatRoomMembers

    let chatRoom = chatRoomsMap[activeChatRoomId]
    if (chatRoom) {
        chatRoom.members =
            chatRoom.members &&
            chatRoom.members.filter((memberDoc) => memberDoc.memberRef)
    }

    // extract details from the chat room
    let isAdmin = false
    if (chatRoom && chatRoom.roomType != 'Direct') {
        isAdmin =
            chatRoom.members &&
            chatRoom.members.find(
                (memberDoc) =>
                    memberDoc.memberRef._id == userId &&
                    memberDoc.status == 'Admin'
            )
    }

    return {
        chatRoom,
        isAdmin,
        refreshing,
        navigationState,
        userId,
    }
}

export default connect(mapStateToProps, {
    openProfile,
    selectChatMembersTab,
    refreshChatMembersTab,
    promoteChatMember,
    demoteChatMember,
    acceptChatMemberJoinRequest,
    removeChatMember,
})(ChatRoomMembers)

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    chatIconStyle: {
        height: 21,
        width: 21,
        marginRight: 5,
        borderRadius: 3,
        overflow: 'hidden',
        padding: 1,
    },

    // Event info related styles
    tribeStatusTextStyle: {
        fontSize: 11,
        marginLeft: 4,
        marginRight: 4,
    },
    generalInfoContainerStyle: {
        backgroundColor: 'white',
        alignItems: 'center',
    },
    eventContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    eventInfoBasicTextStyle: {
        fontSize: 11,
        fontWeight: '300',
    },
    imagePaddingContainerStyle: {
        height: ((SCREEN_WIDTH * 0.95) / 3 + 30 - 10) / 2,
        backgroundColor: '#1998c9',
    },
    imageWrapperStyle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        height: ((SCREEN_WIDTH * 0.95) / 3 + 30 + 10) / 2,
        // height: 80,
        backgroundColor: 'white',
    },

    imageContainerStyle: {
        borderWidth: 1,
        borderColor: '#646464',
        alignItems: 'center',
        borderRadius: 14,
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        height: 35,
        width: 35,
    },
    memberCardContainerStyle: {
        flexDirection: 'row',
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    memberCardBodyContainerStyle: {
        marginLeft: 12,
        paddingRight: 12,
        flex: 1,
        flexDirection: 'row',
        flexGrow: 1,
    },
    memberCardActionsStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 0,
    },
}
