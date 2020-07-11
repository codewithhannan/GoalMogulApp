/** @format */

import _ from 'lodash'
import React from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import profilePic from '../../../asset/utils/defaultUserProfile.png'
import { GROUP_CHAT_DEFAULT_ICON_URL } from '../../../Utils/Constants'
// Components
import ProfileImage from '../../Common/ProfileImage'
import Timestamp from '../../Goal/Common/Timestamp'

class ChatRoomCard extends React.Component {
    handleCardOnPress = () => {
        this.props.onItemSelect(this.props.item)
    }

    renderCardImage(imageUrl) {
        if (!imageUrl) {
            return null
        }
        return (
            <ProfileImage
                imageStyle={{ height: 45, width: 45, borderRadius: 5 }}
                imageUrl={imageUrl}
                rounded
                imageContainerStyle={styles.imageContainerStyle}
            />
        )
    }

    renderTitle(item) {
        let title = item.name
        if (!title && item.isChatRoom) {
            title =
                item.roomType == 'Direct'
                    ? item.members.find(
                          (memDoc) =>
                              memDoc.memberRef._id.toString() !=
                              this.props.currentUserId
                      )
                    : item.name
            title = typeof title == 'object' ? title.memberRef.name : title
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 2,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        color: '#3B414B',
                        fontSize: 16,
                        fontWeight: '700',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
        )
    }

    /**
     * Render category and member information
     */
    renderChatInformation(item) {
        if (!item.isChatRoom) {
            return null
        }
        let count = item.memberCount
        if (count > 999) {
            count = '1k+'
        }
        const defaultTextStyle = { color: '#abb1b0', fontSize: 10 }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 3,
                }}
            >
                {/*<Text style={defaultTextStyle}>{category}</Text>
				<Dot />*/}
                {count && item.roomType == 'Group' ? (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...defaultTextStyle, color: '#15aad6' }}>
                            {count}
                        </Text>
                        <Text style={defaultTextStyle}>&nbsp;members</Text>
                    </View>
                ) : null}
            </View>
        )
    }

    renderCardContent(item) {
        let content
        const lastMessageText = _.get(item, 'latestMessage.content.message', '')
        if (this.props.renderDescription && item.description) {
            content = item.description
        } else if (item.isFriend) {
            // for friend search results
            content = 'Tap to start a conversation...'
        } else if (item.latestMessage) {
            if (lastMessageText) {
                // If last message is sent by current user, add a prefix
                // You: {message to render}
                // to indicate the differences
                content = _.isEqual(
                    item.latestMessage.creator,
                    this.props.currentUserId
                )
                    ? `You: ${lastMessageText}`
                    : lastMessageText
            } else if (item.latestMessage.media) {
                content = 'Chat member sent an image...'
            } else if (item.latestMessage.sharedEntity) {
                const {
                    chatRoomRef,
                    eventRef,
                    goalRef,
                    needRef,
                    stepRef,
                    postRef,
                    tribeRef,
                    userRef,
                } = item.latestMessage.sharedEntity
                if (chatRoomRef) {
                    content = 'Chat member shared a chat room...'
                } else if (eventRef) {
                    content = 'Chat member shared an event...'
                } else if (goalRef && needRef) {
                    content = 'Chat member shared a need...'
                } else if (goalRef && stepRef) {
                    content = 'Chat member shared a step...'
                } else if (goalRef) {
                    content = 'Chat member shared a goal...'
                } else if (postRef) {
                    content = 'Chat member shared a post...'
                } else if (tribeRef) {
                    content = 'Chat member shared a tribe...'
                } else if (userRef) {
                    content = 'Chat member shared a user...'
                } else {
                    content = 'View latest message...'
                }
            } else {
                content = 'View latest message...'
            }
        } else {
            content = 'No messages in this conversation...'
        }

        return (
            <View
                style={{
                    justifyContent: 'flex-start',
                    flex: 1,
                    marginLeft: 10,
                }}
            >
                {this.renderTitle(item)}
                <View
                    style={{
                        marginTop:
                            item.roomType == 'Group' && item.memberCount
                                ? 3
                                : 6,
                    }}
                >
                    <Text
                        style={{
                            flex: 1,
                            flexWrap: 'wrap',
                            color: '#838f97',
                            fontSize: 16,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {content}
                    </Text>
                </View>
                {/* TODO put member count as a small circle on the bottom right of group convo image */}
                {/* {this.renderChatInformation(item)} */}
            </View>
        )
    }

    renderTimestamp(item) {
        if (!item.isChatRoom) {
            return null
        }

        const lastUpdated = item.lastActive || new Date()

        return (
            <View
                style={{
                    justifyContent: 'center',
                    flexBasis: 108,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: 6,
                        paddingTop: 24,
                    }}
                >
                    <Text
                        style={{
                            marginRight: 6,
                            color: '#ccc',
                            fontSize: 10,
                            paddingTop: 2,
                        }}
                    >
                        |
                    </Text>
                    <Timestamp
                        textStyles={{
                            color: '#999',
                            fontSize: 13,
                        }}
                        time={timeago().format(lastUpdated)}
                    />
                </View>
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        // extract profile
        let cardImage
        if (item.isFriend || item.roomType == 'Direct') {
            cardImage = item.isFriend
                ? item
                : item.members &&
                  item.members.find(
                      (memDoc) =>
                          memDoc.memberRef._id != this.props.currentUserId
                  )
            if (cardImage) {
                cardImage = cardImage.profile || cardImage.memberRef.profile
            }
            cardImage = (cardImage && cardImage.image) || profilePic
        } else {
            cardImage = (item && item.picture) || GROUP_CHAT_DEFAULT_ICON_URL
        }

        const maybeUnreadHighlight =
            item.unreadMessageCount > 0
                ? {
                      backgroundColor: '#E0F0FF',
                  }
                : {}

        return (
            <TouchableHighlight
                underlayColor="#F1F1F1"
                activeOpacity={0.9}
                style={{
                    ...styles.cardContainerStyle,
                    ...maybeUnreadHighlight,
                }}
                onPress={this.handleCardOnPress}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flexGrow: 1,
                    }}
                >
                    {this.renderCardImage(cardImage)}
                    {this.renderCardContent(item)}
                    {this.renderTimestamp(item)}
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = {
    cardContainerStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 12,
        paddingRight: 12,
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
}

export default connect(
    (state) => ({
        currentUserId: state.user.userId,
    }),
    null
)(ChatRoomCard)
