/**
 * Chat room public view is only for non members. It gives member an overview of what this chat
 * room is about
 *
 * @format
 */

import React from 'react'
import { Dimensions, ScrollView, View } from 'react-native'
import { Divider, Image, Text } from 'react-native-elements'
import { DotIndicator } from 'react-native-indicators'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { openProfile } from '../../../actions'
import Icons from '../../../asset/base64/Icons'
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png'
import leaveIcon from '../../../asset/utils/logout.png'
import plusIcon from '../../../asset/utils/plus.png'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'
import {
    cancelJoinRequest,
    sendJoinRequest,
} from '../../../redux/modules/chat/ChatRoomOptionsActions'
// Selector
import { makeGetChatRoom } from '../../../redux/modules/chat/ChatSelector'
import {
    GROUP_CHAT_DEFAULT_ICON_URL,
    IMAGE_BASE_URL,
} from '../../../Utils/Constants'
import Dot from '../../Common/Dot'
import ModalHeader from '../../Common/Header/ModalHeader'
import LoadingModal from '../../Common/Modal/LoadingModal'
import { StackedAvatarsV2 } from '../../Common/StackedAvatars'
import SettingCard from '../../Setting/SettingCard'

const windowWidth = Dimensions.get('window').width

const { CheckIcon: check } = Icons
const DEBUG_KEY = '[ UI ChatRoomPublicView ]'
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]
const LISTENER_KEY = 'ChatRoomOptions'
class ChatRoomPublicView extends React.Component {
    _keyExtractor = (item) => item._id

    closeOptions() {
        Actions.pop()
    }

    openMembers() {
        Actions.push('chatRoomMembers')
    }

    // Sent join request for the chat room
    sendJoinRequest() {
        const { chatRoom } = this.props
        if (!chatRoom) return
        this.props.sendJoinRequest(chatRoom._id)
    }

    // Withdraw the join request
    cancelJoinRequest() {
        const { chatRoom } = this.props
        if (!chatRoom) return
        this.props.cancelJoinRequest(chatRoom._id)
    }

    renderChatRoomStatus() {
        const { chatRoom, user } = this.props
        const memberDoc =
            chatRoom.members &&
            chatRoom.members.find(
                (memberDoc) =>
                    memberDoc.memberRef._id == user._id &&
                    memberDoc.status === 'JoinRequester'
            )
        const memberStatus = memberDoc && memberDoc.status
        const tintColor = '#2dca4a'
        if (!memberStatus) return null
        // If there is memberStatus, it means user is a JoinRequest. So display "Join Request Sent"
        return (
            <View
                activeOpacity={0.6}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 8,
                    height: 23,
                }}
            >
                <Image
                    source={check}
                    style={{
                        height: 10,
                        width: 13,
                        tintColor,
                    }}
                />
                <Text
                    style={{
                        ...styles.tribeStatusTextStyle,
                        color: tintColor,
                    }}
                >
                    Join Request Sent
                </Text>
            </View>
        )
    }

    renderChatRoomDetails() {
        const { chatRoom, chatRoomName, chatRoomImage } = this.props
        if (!chatRoom) return null
        const newDate = chatRoom.created
            ? new Date(chatRoom.created)
            : new Date()
        const date = `${
            months[newDate.getMonth() - 1]
        } ${newDate.getDate()}, ${newDate.getFullYear()}`
        return (
            <View>
                <View style={styles.imagePaddingContainerStyle} />
                <View style={styles.imageWrapperStyle}>
                    <View style={styles.imageContainerStyle}>
                        <Image
                            onLoadStart={() =>
                                this.setState({ imageLoading: true })
                            }
                            onLoadEnd={() =>
                                this.setState({ imageLoading: false })
                            }
                            style={styles.imageStyle}
                            source={chatRoomImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View style={styles.generalInfoContainerStyle}>
                    <Text style={{ fontSize: 22, fontWeight: '300' }}>
                        {chatRoomName}
                    </Text>
                    {chatRoom.roomType === 'Direct' ? null : (
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 8,
                                marginBottom: 8,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.tribeStatusTextStyle}>
                                {chatRoom.isPublic ? 'Public' : 'Private'}
                            </Text>
                            <Divider
                                orthogonal
                                height={12}
                                borderColor="gray"
                            />
                            {this.renderChatRoomStatus()}
                        </View>
                    )}
                    <View
                        style={{
                            width: windowWidth * 0.75,
                            borderColor: '#f1f1f1',
                            borderWidth: 0.5,
                        }}
                    />
                    <View style={styles.eventContainerStyle}>
                        <StackedAvatarsV2 chatMembers={chatRoom.members} />
                        <Text style={{ ...styles.eventInfoBasicTextStyle }}>
                            {chatRoom.memberCount} members
                        </Text>
                        <Dot
                            iconStyle={{
                                tintColor: '#616161',
                                width: 4,
                                height: 4,
                                marginLeft: 4,
                                marginRight: 4,
                            }}
                        />
                        <Text style={{ ...styles.eventInfoBasicTextStyle }}>
                            Created: {date}{' '}
                        </Text>
                    </View>

                    {chatRoom.description ? (
                        <View
                            style={{
                                alignSelf: 'center',
                                width: windowWidth * 0.75,
                                marginBottom: 15,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#646464',
                                    fontStyle: 'italic',
                                    marginBottom: 2,
                                    alignSelf: 'flex-start',
                                }}
                            >
                                Description
                            </Text>
                            <Text style={{ fontSize: 14, color: '#646464' }}>
                                {chatRoom.description}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>
        )
    }

    render() {
        const { chatRoom, isJoinRequester } = this.props
        if (!chatRoom) {
            return null
        }

        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <View style={styles.homeContainerStyle}>
                    <LoadingModal
                        visible={this.props.chatRoom.updating}
                        customIndicator={
                            <DotIndicator size={12} color="white" />
                        }
                    />
                    <ModalHeader
                        title={'Details'}
                        actionHidden={true}
                        back={true}
                        onCancel={this.closeOptions}
                    />
                    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                        <ScrollView>
                            {this.renderChatRoomDetails()}
                            {isJoinRequester ? (
                                <SettingCard
                                    title="Cancel join request"
                                    icon={leaveIcon}
                                    explanation={
                                        'Click to cancel the join request'
                                    }
                                    onPress={this.cancelJoinRequest.bind(this)}
                                    containerStyle={{
                                        borderTopWidth: 1,
                                        borderTopColor: '#e6e6e6',
                                    }}
                                />
                            ) : (
                                <SettingCard
                                    title="Join the conversation"
                                    icon={plusIcon}
                                    explanation={'Click to send join request'}
                                    onPress={this.sendJoinRequest.bind(this)}
                                    containerStyle={{
                                        borderTopWidth: 1,
                                        borderTopColor: '#e6e6e6',
                                    }}
                                />
                            )}
                        </ScrollView>
                    </View>
                </View>
            </MenuProvider>
        )
    }
}

const makeMapStateToProps = () => {
    const getChatRoom = makeGetChatRoom()

    const mapStateToProps = (state, props) => {
        const { userId, user } = state.user
        const { chatRoomId, path } = props

        let chatRoom
        if (!path && props.chatRoom) {
            chatRoom = props.chatRoom
        } else {
            chatRoom = getChatRoom(state, chatRoomId, path)
        }

        // extract details from the chat room
        let chatRoomName = 'Loading...'
        let chatRoomImage = null
        let otherUser = null
        let isJoinRequester
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
                    chatRoomImage = getProfileImageOrDefaultFromUser(
                        otherUser,
                        defaultProfilePic
                    )
                }
            } else {
                chatRoomName = chatRoom.name
                chatRoomImage = {
                    uri: chatRoom.picture
                        ? `${IMAGE_BASE_URL}${chatRoom.picture}`
                        : GROUP_CHAT_DEFAULT_ICON_URL,
                }
                isJoinRequester =
                    chatRoom.members &&
                    chatRoom.members.find(
                        (memberDoc) =>
                            (memberDoc.memberRef._id == userId ||
                                memberDoc.memberRef == userId) &&
                            memberDoc.status == 'JoinRequester'
                    )
            }
        }

        return {
            chatRoom,
            chatRoomName,
            chatRoomImage,
            otherUser,
            user,
            isJoinRequester,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    openProfile,
    cancelJoinRequest,
    sendJoinRequest,
})(wrapAnalytics(ChatRoomPublicView, SCREENS.CHATROOM_PUBLIC_VIEW))

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
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
        height: ((windowWidth * 0.95) / 3 + 30 - 10) / 2,
        backgroundColor: '#1998c9',
        // backgroundColor: 'white'
    },
    imageWrapperStyle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0,
        shadowRadius: 2,
        height: ((windowWidth * 0.95) / 3 + 30 + 10) / 2,
        // height: 80,
        backgroundColor: 'white',
    },

    imageContainerStyle: {
        borderWidth: 1,
        borderColor: '#646464',
        alignItems: 'center',
        borderRadius: 14,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    imageStyle: {
        width: (windowWidth * 1.1) / 3,
        height: (windowWidth * 0.95) / 3,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'white',
    },
}
