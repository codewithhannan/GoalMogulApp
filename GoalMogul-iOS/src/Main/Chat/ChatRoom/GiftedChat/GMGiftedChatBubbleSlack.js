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
} from 'react-native'
import { MessageText, Time, utils } from 'react-native-gifted-chat'
import { color } from '../../../../styles/basic'
import { MemberDocumentFetcher } from '../../../../Utils/UserUtils'
import CommentRef from '../../../Goal/GoalDetailCard/Comment/CommentRef'
import ChatMessageImage from '../../Modals/ChatMessageImage'

const { isSameDay } = utils

function isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(
        diffMessage.user &&
        currentMessage.user &&
        diffMessage.user._id === currentMessage.user._id
    )
}

export default class Bubble extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isExpanded: false,
            wrapperOpacityAnim: new Animated.Value(1),
            wrapperPaddingAnim: new Animated.Value(0),
            timeHeightAnim: new Animated.Value(0),
            userRef: null,
        }
    }

    componentDidMount() {
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

    // For Gomo Bot messages
    openCreateGoal() {
        const { goalRecommendation } = this.props.currentMessage
        const { recommendedTitle } = goalRecommendation

        const goal = {
            title: recommendedTitle,
            shareToGoalFeed: true,
            needs: [],
            steps: [],
        }

        // This callback will be called after goal is successfully created. See CreateGoalModal.js line 127.
        const callback = () => {}

        Actions.push('createGoalModal', {
            isImportedGoal: true,
            goal,
            callback,
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
            </View>
        )
    }

    renderSharedContent() {
        const { currentMessage } = this.props
        if (currentMessage.sharedEntity) {
            let userRef, tribeRef, eventRef, suggestionType
            if (currentMessage.sharedEntity.userRef) {
                suggestionType = 'User'
                userRef = currentMessage.sharedEntity.userRef
                if (typeof userRef != 'object') {
                    userRef = {
                        _id: userRef,
                        name: 'GoalMogul member',
                    }
                }
            } else if (currentMessage.sharedEntity.tribeRef) {
                suggestionType = 'Tribe'
                tribeRef = currentMessage.sharedEntity.tribeRef
                if (typeof tribeRef != 'object') {
                    tribeRef = {
                        _id: tribeRef,
                        name: 'GoalMogul tribe',
                    }
                }
            } else if (currentMessage.sharedEntity.eventRef) {
                suggestionType = 'Event'
                eventRef = currentMessage.sharedEntity.eventRef
                if (typeof eventRef != 'object') {
                    eventRef = {
                        _id: eventRef,
                        name: 'GoalMogul event',
                    }
                }
            } else {
                return null
            }
            return (
                <CommentRef
                    containerStyles={{
                        width: 240,
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                    item={{ suggestionType, userRef, tribeRef, eventRef }}
                />
            )
        }
        return null
    }

    renderMessageText() {
        if (this.props.currentMessage.text) {
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

    // Render customized view
    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props)
        }
        return null
    }

    render() {
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
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <View>
                        {this.renderCustomView()}
                        {messageHeader}
                        {this.renderMessageImage()}
                        {this.renderSharedContent()}
                        {this.renderMessageText()}
                        {this.renderGoalRecommendation()}
                    </View>
                </View>
            </View>
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
