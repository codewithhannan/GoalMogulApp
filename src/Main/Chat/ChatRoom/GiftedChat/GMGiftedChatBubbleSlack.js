/**
 * This is copied from @see https://github.com/FaridSafi/react-native-gifted-chat/blob/master/example-slack-message/src/SlackBubble.js
 * and modified to meet the customized needs for GoalMogul chat
 *
 * @format
 */

import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
    Alert,
    Animated,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewPropTypes,
    TouchableHighlight,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { MessageText, Time, utils } from 'react-native-gifted-chat'
import { color, text } from '../../../../styles/basic'
import { MemberDocumentFetcher } from '../../../../Utils/UserUtils'
import CommentRef from '../../../Goal/GoalDetailCard/Comment/CommentRef'
import ChatMessageImage from '../../Modals/ChatMessageImage'
import ShareCard from '../../../Common/Card/ShareCard'
import EarnBadgeModal from '../../../Gamification/Badge/EarnBadgeModal'
import InviteFriendModal from '../../../MeetTab/Modal/InviteFriendModal'
import { sendMessage } from '../../../../redux/modules/chat/ChatRoomActions'
import UUID from 'uuid/v4'
import { Video, AVPlaybackStatus } from 'expo-av'
import RNUrlPreview from 'react-native-url-preview'

const { isSameDay } = utils

function isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(
        diffMessage.user &&
        currentMessage.user &&
        diffMessage.user._id === currentMessage.user._id
    )
}

class Bubble extends React.Component {
    constructor(props) {
        super(props)

        this.splittedText = ''

        this.state = {
            isExpanded: false,
            wrapperOpacityAnim: new Animated.Value(1),
            wrapperPaddingAnim: new Animated.Value(0),
            timeHeightAnim: new Animated.Value(0),
            userRef: null,
            optionsAction: {},
            showBadgeModal: false,
            showInviteFriendModal: false,
            status: {},
            preffiled: '',
        }
    }

    async componentDidMount() {
        const { currentMessage } = this.props
        if (
            currentMessage.sharedEntity &&
            currentMessage.sharedEntity.userRef
        ) {
            const token = this.props.token
            MemberDocumentFetcher.getUserDocument(
                currentMessage.sharedEntity.userRef,
                token,
                {}
            ).then((userDoc) => {
                this.setState({
                    userRef: userDoc,
                })
            })
        }
    }

    onOptionSelect(selectedOption) {
        switch (selectedOption) {
            case 'Create Goal': {
                return this.openCreateGoal.bind(this)
            }
            case 'View BadgeDetail': {
                return this.openBadgeDetails.bind(this)
            }
            case 'View Goals': {
                return this.openProfileGoals.bind(this)
            }
            case 'Invite Friends': {
                return this.setState({
                    ...this.state,
                    showInviteFriendModal: true,
                })
            }
            case 'Open TrendingGoals': {
                return this.openTrendingGoals.bind(this)
            }
            case 'Open GoMo': {
                return this.openGoMoChat.bind(this)
            }
            default:
                return
        }
    }

    // For Gomo Bot messages
    openCreateGoal() {
        /* const { goalRecommendation } = this.props.currentMessage
        const { recommendedTitle } = goalRecommendation

        const goal = {
            title: recommendedTitle,
            shareToGoalFeed: true,
            needs: [],
            steps: [],
        }

        // This callback will be called after goal is successfully created. See CreateGoalModal.js line 127.
        const callback = () => { }

        Actions.push('createGoalModal', {
            isImportedGoal: true,
            goal,
            callback,
        }) */

        Actions.push('createGoalModal', { preffiled: this.splittedText })
    }
    openBadgeDetails() {
        this.setState({ ...this.state, showBadgeModal: true })
    }
    openProfileGoals() {
        Actions.push('mainProfile')
    }
    openInviteFriends() {
        this.setState({ ...this.state, showInviteFriendModal: true })
    }
    closeInviteFriends() {
        this.setState({ ...this.state, showInviteFriendModal: false })
    }
    openTrendingGoals() {
        Actions.push('trendingGoalView')
    }
    openGoMoChat() {
        let gomoExist = false
        let chatroomId = this.props.chatRooms.filter((chatroom) => {
            for (let member of chatroom.members) {
                console.log('THIS IS MEMBERRRSSS', member)
                if (member.memberRef.name == 'GoalMogul Planner (GoMo)') {
                    gomoExist = true
                    break
                }
            }
            if (gomoExist) return chatroom
        })

        Actions.push('chatRoomConversation', {
            chatRoomId: chatroomId[0]._id,
        })
    }

    // For Gomo Bot messages
    dismissSuggestion() {
        Alert.alert(
            'Dismiss...',
            'Are you sure you want to delete this message?',
            [
                {
                    text: 'Dismiss',
                    onPress: () =>
                        // this.props.dismissGoalSuggestion is passed in through GiftedChat
                        // refer to ChatRoomConversation's usage of dismissGoalSuggestion
                        this.props.dismissGoalSuggestion(
                            this.props.currentMessage._id
                        ),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        )
    }

    renderGoalOptions() {
        const { options, text } = this.props.currentMessage

        const { user, chatRoom, messages } = this.props

        // console.log('this is props of chat', this.props.currentMessage)

        if (text.includes('It looks like your goal is to')) {
            this.splittedText = text.slice(30)
        }
        // console.log('THIS IS SPLITTTED TEXTTT', this.splittedText)

        if (_.isEmpty(options)) return null
        let optionsArray = []
        for (let option in options) {
            let transformedOption = { ...options[option], optionTitle: option }
            optionsArray.push(transformedOption)
        }
        console.log('optionsArrayyyyy', optionsArray)
        return (
            <View>
                {optionsArray.map((option) => {
                    return (
                        <View
                            style={{
                                // borderTopColor: '#eee',
                                width: '100%',
                                // marginTop: 12,
                                // paddingTop: 9,
                                // paddingBottom: 6,
                            }}
                        >
                            <TouchableHighlight
                                underlayColor="#ECECEC"
                                style={{
                                    paddingTop: 9,
                                    paddingBottom: 9,
                                    marginBottom: 12,
                                    borderRadius: 5,
                                    borderColor: color.GM_BLUE,
                                    borderWidth: 2,
                                    // padding: 80,
                                }}
                                onPress={() => {
                                    if (option.optionAction !== null) {
                                        if (
                                            option.optionTitle ===
                                            'Invite friends'
                                        ) {
                                            setTimeout(() => {
                                                this.setState({
                                                    showInviteFriendModal: true,
                                                })
                                            }, 3000)
                                        } else {
                                            let trigger = this.onOptionSelect(
                                                option.optionAction[0].action
                                            ).bind(this)
                                            setTimeout(() => {
                                                return trigger()
                                            }, 3000)
                                        }
                                    }

                                    this.props.sendMessage(
                                        [
                                            {
                                                optionId: option.optionId,
                                                text: option.optionTitle,
                                                user,
                                                createdAt: new Date(),
                                                _id: UUID(),
                                            },
                                        ],
                                        null,
                                        chatRoom,
                                        messages
                                    )

                                    // return trigger()
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 14,
                                        width: '99.8%',
                                        fontWeight: '600',
                                        fontFamily: text.FONT_FAMILY,
                                        color: color.GM_BLUE,
                                        textAlign: 'center',
                                    }}
                                >
                                    {option.optionTitle}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    )
                })}
            </View>
        )
    }

    renderGoalRecommendation() {
        const { goalRecommendation } = this.props.currentMessage

        if (!goalRecommendation) return null
        return (
            <View
                style={{
                    backgroundColor: '#F7FBFC',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    padding: 6,
                    marginBottom: 12,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#6FBAD4',
                            marginBottom: 6,
                        }}
                    >
                        Suggested Goal:
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            color: color.GM_BLUE,
                            fontWeight: '600',
                        }}
                    >
                        {goalRecommendation.recommendedTitle}
                    </Text>
                </View>
                <View
                    style={{
                        borderTopColor: '#eee',
                        borderTopWidth: 1,
                        marginTop: 12,
                        paddingTop: 9,
                        paddingBottom: 6,
                    }}
                >
                    <Text
                        style={{
                            marginBottom: 9,
                            fontSize: 12,
                            color: '#333',
                            textAlign: 'center',
                        }}
                    >
                        Edit goal and add to profile?
                    </Text>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 9,
                            paddingBottom: 9,
                            marginBottom: 9,
                            borderRadius: 6,
                            backgroundColor: color.GM_BLUE,
                        }}
                        onPress={this.openCreateGoal.bind(this)}
                    >
                        <Text style={{ color: '#fff', fontSize: 15 }}>
                            Edit and Add
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: 6,
                            paddingBottom: 6,
                            borderRadius: 6,
                            backgroundColor: '#F4DFDE',
                        }}
                        onPress={this.dismissSuggestion.bind(this)}
                    >
                        <Text style={{ color: '#C13E35', fontSize: 12 }}>
                            Dismiss
                        </Text>
                    </TouchableOpacity>
                </View>
                <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriends}
                />
            </View>
        )
    }

    renderSharedContent() {
        const { currentMessage } = this.props
        if (currentMessage.sharedEntity) {
            let userRef, tribeRef, goalRef
            if (currentMessage.sharedEntity.userRef) {
                userRef = currentMessage.sharedEntity.userRef
                if (typeof userRef == 'object') {
                    userRef = userRef._id
                }
                return <ShareCard userRef={userRef} />
            } else if (currentMessage.sharedEntity.tribeRef) {
                tribeRef = currentMessage.sharedEntity.tribeRef
                if (typeof tribeRef == 'object') {
                    tribeRef = tribeRef._id
                }
                return <ShareCard tribeRef={tribeRef} />
            } else if (currentMessage.sharedEntity.goalRef) {
                goalRef = currentMessage.sharedEntity.goalRef
                if (typeof goalRef == 'object') {
                    goalRef = goalRef._id
                }
                return <ShareCard goalRef={goalRef} />
            } else {
                return null
            }
        }
        return null
    }

    renderMessageText() {
        const {
            containerStyle,
            wrapperStyle,
            messageTextStyle,
            ...messageTextProps
        } = this.props
        if (this.props.renderMessageText) {
            return this.props.renderMessageText(messageTextProps)
        }

        if (this.props.messageDoc.content && this.props.currentMessage.text) {
            return (
                <>
                    <MessageText
                        {...messageTextProps}
                        textStyle={{
                            left: [
                                styles.standardFont,
                                styles.slackMessageText,
                                messageTextProps.textStyle,
                                messageTextStyle,
                            ],
                        }}
                    />
                    {/* <RNUrlPreview
                        text={`${this.props.currentMessage.text}`}
                        containerStyle={{ width: '100%', marginTop: 10 }}
                        title={false}
                        descriptionStyle={{ width: '100%' }}

                        // titleStyle={{ fontSize: 12 }}s
                    /> */}
                </>
            )
        } else if (this.props.currentMessage.text) {
            const {
                containerStyle,
                wrapperStyle,
                messageTextStyle,
                ...messageTextProps
            } = this.props
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps)
            }
            return (
                <MessageText
                    {...messageTextProps}
                    textStyle={{
                        left: [
                            styles.standardFont,
                            styles.slackMessageText,
                            messageTextProps.textStyle,
                            messageTextStyle,
                        ],
                    }}
                />
            )
        }
        return null
    }

    renderMessageImage() {
        if (this.props.currentMessage.image) {
            const {
                containerStyle,
                wrapperStyle,
                ...messageImageProps
            } = this.props

            if (this.props.renderMessageImage) {
                return this.props.renderMessageImage(messageImageProps)
            }
            return <ChatMessageImage {...messageImageProps} />
        }
        return null
    }

    renderTicks() {
        const { currentMessage } = this.props
        if (this.props.renderTicks) {
            return this.props.renderTicks(currentMessage)
        }
        if (
            !currentMessage.user ||
            currentMessage.user._id !== this.props.user._id
        ) {
            return null
        }
        if (currentMessage.sent || currentMessage.received) {
            return (
                <View style={[styles.headerItem, styles.tickView]}>
                    {currentMessage.sent && (
                        <Text
                            style={[
                                styles.standardFont,
                                styles.tick,
                                this.props.tickStyle,
                            ]}
                        >
                            ✓
                        </Text>
                    )}
                    {currentMessage.received && (
                        <Text
                            style={[
                                styles.standardFont,
                                styles.tick,
                                this.props.tickStyle,
                            ]}
                        >
                            ✓
                        </Text>
                    )}
                </View>
            )
        }
        return null
    }

    renderUsername() {
        if (
            !_.has(this.props.currentMessage, 'user') ||
            _.isEmpty(_.get(this.props.currentMessage, 'user'))
        )
            return
        const { user } = this.props.currentMessage
        const username = user.name

        if (username) {
            const {
                containerStyle,
                wrapperStyle,
                ...usernameProps
            } = this.props
            if (this.props.renderUsername) {
                return this.props.renderUsername(usernameProps)
            }
            return (
                <Text
                    style={[
                        styles.standardFont,
                        styles.headerItem,
                        styles.username,
                        this.props.usernameStyle,
                    ]}
                    // reuse the onPressAvatar to open user profile
                    // this is passed through GiftedChat props in
                    // ChatRoomConversation.js
                    onPress={() => this.props.onPressAvatar(user)}
                >
                    {username}
                </Text>
            )
        }
        return null
    }

    renderTime() {
        if (this.props.currentMessage.createdAt) {
            const { containerStyle, wrapperStyle, ...timeProps } = this.props
            if (this.props.renderTime) {
                return this.props.renderTime(timeProps)
            }
            return (
                <Time
                    {...timeProps}
                    containerStyle={{ left: [styles.timeContainer] }}
                    textStyle={{
                        left: [
                            styles.standardFont,
                            styles.headerItem,
                            styles.time,
                            timeProps.textStyle,
                        ],
                    }}
                />
            )
        }
        return null
    }

    renderAccountabilityRequest = () => {
        const { currentMessage } = this.props
        if (currentMessage.question?.request)
            return (
                <>
                    <View style={{ padding: 5 }}>
                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 16,
                                fontFamily: 'SFProDisplay-Bold',
                            }}
                        >
                            Do you want to accept Mike’s request?
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ padding: 12 }}>
                                <View
                                    style={{
                                        width: 100,
                                        height: 32,
                                        borderRadius: 3,
                                        backgroundColor: '#42C0F5',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 14,
                                            fontFamily: 'SFProDisplay-Regular',
                                            fontWeight: '400',
                                        }}
                                    >
                                        Accept
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 12 }}>
                                <View
                                    style={{
                                        width: 100,
                                        height: 32,
                                        borderRadius: 3,
                                        backgroundColor: '#E3E3E3',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#505050',
                                            fontSize: 14,
                                            fontFamily: 'SFProDisplay-Regular',
                                            fontWeight: '400',
                                        }}
                                    >
                                        Decline
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )
    }

    renderAccountabilityquestion = () => {
        const { currentMessage } = this.props

        if (currentMessage.question) {
            return (
                <>
                    <Text
                        style={{
                            fontSize: 15,
                            fontFamily: 'SFProDisplay-Semibold',

                            color: '#42C0F5',
                        }}
                    >
                        {`${currentMessage.question.title}`}
                    </Text>
                </>
            )
        }
    }

    // Render customized view
    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props)
        }
        return null
    }

    render() {
        const { user, chatRoom, messages } = this.props

        if (this.props.currentMessage.question) {
            console.log(
                'THIS ISSSSSS CURRRENT MESSAGE',
                this.props.currentMessage.question
            )
        }

        const isSameThread =
            isSameUser(this.props.currentMessage, this.props.previousMessage) &&
            isSameDay(this.props.currentMessage, this.props.previousMessage)

        const messageHeader = isSameThread ? null : (
            <View style={styles.headerView}>
                {this.renderUsername()}
                {this.renderTime()}
                {this.renderTicks()}
            </View>
        )
        return (
            <>
                <View style={[styles.container, this.props.containerStyle]}>
                    <View style={[styles.wrapper, this.props.wrapperStyle]}>
                        <View>
                            {this.renderCustomView()}
                            {messageHeader}
                            {this.renderMessageImage()}
                            {this.renderSharedContent()}
                            {this.renderMessageText()}
                            {this.renderAccountabilityquestion()}
                            {this.renderAccountabilityRequest()}
                            {this.renderGoalRecommendation()}
                            {this.renderGoalOptions()}
                        </View>
                    </View>
                    <EarnBadgeModal
                        isVisible={this.state.showBadgeModal}
                        closeModal={() => {
                            this.setState({
                                ...this.state,
                                showBadgeModal: false,
                            })
                        }}
                    />
                    <InviteFriendModal
                        isVisible={this.state.showInviteFriendModal}
                        closeModal={() => {
                            this.setState({
                                ...this.state,
                                showInviteFriendModal: false,
                            })
                        }}
                    />
                </View>
            </>
        )
    }
}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
    standardFont: {
        fontSize: 15,
    },
    slackMessageText: {
        marginLeft: 0,
        marginRight: 0,
    },
    container: {
        flex: 1,
        alignItems: 'flex-start',
    },
    wrapper: {
        marginRight: 16,
        minHeight: 20,
        justifyContent: 'flex-end',
    },
    username: {
        fontWeight: 'bold',
    },
    time: {
        textAlign: 'left',
        fontSize: 12,
    },
    timeContainer: {
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
    },
    headerItem: {
        marginRight: 10,
    },
    headerView: {
        // Try to align it better with the avatar on Android.
        marginTop: Platform.OS === 'android' ? -2 : 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    /* eslint-disable react-native/no-color-literals */
    tick: {
        backgroundColor: 'transparent',
        color: 'white',
    },
    /* eslint-enable react-native/no-color-literals */
    tickView: {
        flexDirection: 'row',
    },
    slackImage: {
        borderRadius: 3,
        marginLeft: 0,
        marginRight: 0,
    },
})

Bubble.contextTypes = {
    actionSheet: PropTypes.func,
}

Bubble.defaultProps = {
    touchableProps: {},
    onLongPress: null,
    renderMessageImage: null,
    renderMessageVideo: null,
    renderMessageText: null,
    renderCustomView: null,
    renderTime: null,
    currentMessage: {
        text: null,
        createdAt: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    tickStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
}

Bubble.propTypes = {
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    wrapperStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    messageTextStyle: Text.propTypes.style,
    usernameStyle: Text.propTypes.style,
    tickStyle: Text.propTypes.style,
    containerToNextStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
}

//states from redux store is used here
const mapStateToProps = (state) => {
    const { data: chatRooms } = state.chat.allChats
    const { user } = state.user
    const { messages, activeChatRoomId, chatRoomsMap } = state.chatRoom
    const chatRoom = activeChatRoomId && chatRoomsMap[activeChatRoomId]
    return {
        chatRooms,
        chatRoom,
        messages,
        user,
    }
}

export default connect(mapStateToProps, { sendMessage })(Bubble)
