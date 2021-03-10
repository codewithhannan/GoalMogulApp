/**
 * /* eslint no-use-before-define: ["error", { "variables": false }]
 *
 * @format
 */

import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {
    Alert,
    Animated,
    Clipboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewPropTypes,
} from 'react-native'
import { Layout, Text as KittenText } from '@ui-kitten/components'
import { MessageText, MessageVideo } from 'react-native-gifted-chat'
import { Actions } from 'react-native-router-flux'
import { color } from '../../../../styles/basic'
import { MemberDocumentFetcher } from '../../../../Utils/UserUtils'
import CommentRef from '../../../Goal/GoalDetailCard/Comment/CommentRef'
import ChatMessageImage from '../../Modals/ChatMessageImage'

function isSameDay(currentMessage = {}, diffMessage = {}) {
    if (!diffMessage.createdAt) {
        return false
    }

    const currentCreatedAt = moment(currentMessage.createdAt)
    const diffCreatedAt = moment(diffMessage.createdAt)

    if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
        return false
    }

    return currentCreatedAt.isSame(diffCreatedAt, 'day')
}

function isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(
        diffMessage.user &&
        currentMessage.user &&
        diffMessage.user._id === currentMessage.user._id
    )
}

export default class ChatRoomConversationBubble extends React.Component {
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

    onLongPress = () => {
        if (this.props.onLongPress) {
            this.props.onLongPress(this.context, this.props.currentMessage)
        } else if (this.props.currentMessage.text) {
            const options =
                this.props.optionTitles.length > 0
                    ? this.props.optionTitles.slice(0, 2)
                    : ['Copy Text', 'Cancel']
            const cancelButtonIndex = options.length - 1
            this.context.actionSheet().showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            Clipboard.setString(this.props.currentMessage.text)
                            break
                        default:
                            break
                    }
                }
            )
        }
    }

    handleBubbleToNext() {
        if (
            isSameUser(this.props.currentMessage, this.props.nextMessage) &&
            isSameDay(this.props.currentMessage, this.props.nextMessage)
        ) {
            return StyleSheet.flatten([
                styles[this.props.position].containerToNext,
                this.props.containerToNextStyle[this.props.position],
            ])
        }
        return null
    }

    handleBubbleToPrevious() {
        if (
            isSameUser(this.props.currentMessage, this.props.previousMessage) &&
            isSameDay(this.props.currentMessage, this.props.previousMessage)
        ) {
            return StyleSheet.flatten([
                styles[this.props.position].containerToPrevious,
                this.props.containerToPreviousStyle[this.props.position],
            ])
        }
        return null
    }

    renderMessageText() {
        if (this.props.currentMessage.text) {
            const {
                containerStyle,
                wrapperStyle,
                ...messageTextProps
            } = this.props
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps)
            }
            return (
                <MessageText
                    {...messageTextProps}
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
            )
        }
        return null
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

    renderMessageVideo() {
        if (this.props.currentMessage.video) {
            const {
                containerStyle,
                wrapperStyle,
                ...messageVideoProps
            } = this.props
            if (this.props.renderMessageVideo) {
                return this.props.renderMessageVideo(messageVideoProps)
            }
            return (
                <MessageVideo
                    {...messageVideoProps}
                    videoStyle={{
                        borderRadius: 9,
                        width: 'auto',
                        minWidth: 150,
                    }}
                />
            )
        }
        return null
    }

    renderTicks() {
        const { currentMessage } = this.props
        if (this.props.renderTicks) {
            return this.props.renderTicks(currentMessage)
        }
        if (currentMessage.user._id !== this.props.user._id) {
            return null
        }
        if (
            currentMessage.sent ||
            currentMessage.received ||
            currentMessage.pending
        ) {
            return (
                <View style={styles.tickView}>
                    {currentMessage.sent && (
                        <Text style={[styles.tick, this.props.tickStyle]}>
                            ✓
                        </Text>
                    )}
                    {currentMessage.received && (
                        <Text style={[styles.tick, this.props.tickStyle]}>
                            ✓
                        </Text>
                    )}
                    {currentMessage.pending && (
                        <Text style={[styles.tick, this.props.tickStyle]}>
                            🕓
                        </Text>
                    )}
                </View>
            )
        }
        return null
    }

    renderTime() {
        const { currentMessage, position } = this.props
        if (currentMessage.createdAt) {
            const containerStyle = {
                left: {
                    height: this.state.timeHeightAnim,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 5,
                },
                right: {
                    height: this.state.timeHeightAnim,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 5,
                },
            }
            return (
                <Animated.View
                    style={{
                        ...containerStyle[position],
                        height: this.state.timeHeightAnim,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 10,
                            backgroundColor: 'transparent',
                            textAlign: 'right',
                            color: '#aaa',
                        }}
                    >
                        {moment(currentMessage.createdAt)
                            .locale(this.context.getLocale())
                            .format('LT')}
                    </Text>
                </Animated.View>
            )
        }
        return null
    }

    renderUsername() {
        const { currentMessage } = this.props
        // if (this.props.renderUsernameOnMessage) {
        // if (currentMessage.user._id === this.props.user._id) {
        //     return null
        // }
        return (
            <Layout style={styles.usernameView}>
                <Text style={[styles.username, this.props.usernameStyle]}>
                    {currentMessage.user.name}
                </Text>
            </Layout>
        )
        // }
        return null
    }

    renderUsernameTimeBlock() {
        const { currentMessage } = this.props
        return (
            <Layout style={styles.usernameView}>
                <KittenText
                    category="p1"
                    style={{
                        marginRight: 6,
                    }}
                >
                    {currentMessage.user.name}
                </KittenText>
                <KittenText category="p1" appearance="hint">
                    {moment(currentMessage.createdAt)
                        .locale(this.context.getLocale())
                        .format('LT')}
                </KittenText>
            </Layout>
        )
    }

    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props)
        }
        return null
    }

    toggleContainerStyle() {
        const isExpanded = !this.state.isExpanded
        if (isExpanded) {
            Animated.timing(this.state.wrapperOpacityAnim, {
                useNativeDriver: false,
                toValue: 0.6,
                duration: 300,
            }).start()
            Animated.timing(this.state.timeHeightAnim, {
                useNativeDriver: false,
                toValue: 15,
                duration: 300,
            }).start()
        } else {
            Animated.timing(this.state.wrapperOpacityAnim, {
                useNativeDriver: false,
                toValue: 1,
                duration: 300,
            }).start()
            Animated.timing(this.state.timeHeightAnim, {
                useNativeDriver: false,
                toValue: 0,
                duration: 300,
            }).start()
        }
        this.setState({ isExpanded })
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
                        <Text style={{ color: '#fff', fontSize: 15 }}>Edi</Text>
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
    dismissSuggestion() {
        Alert.alert(
            'Dismiss...',
            'Are you sure you want to delete this message?',
            [
                {
                    text: 'Dismiss',
                    onPress: () =>
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

    render() {
        return (
            <Layout
                style={[
                    styles[this.props.position].container,
                    this.props.containerStyle[this.props.position],
                    this.props.currentMessage.isLocal
                        ? {
                              opacity: 0.6,
                          }
                        : {},
                ]}
            >
                <Layout>{this.renderUsernameTimeBlock()}</Layout>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onLongPress={this.onLongPress}
                    onPress={this.toggleContainerStyle.bind(this)}
                    {...this.props.touchableProps}
                >
                    <Animated.View
                        style={[
                            styles[this.props.position].wrapper,
                            this.props.wrapperStyle[this.props.position],
                            {
                                opacity: this.state.wrapperOpacityAnim,
                                paddingTop: this.state.wrapperPaddingAnim,
                                paddingBottom: this.state.wrapperPaddingAnim,
                            },
                            this.handleBubbleToNext(),
                            this.handleBubbleToPrevious(),
                        ]}
                    >
                        <View>
                            {this.renderCustomView()}
                            {this.renderMessageImage()}
                            {this.renderMessageVideo()}
                            {this.renderSharedContent()}
                            {this.renderMessageText()}
                            <View
                                style={[
                                    styles[this.props.position].bottom,
                                    this.props.bottomContainerStyle[
                                        this.props.position
                                    ],
                                ]}
                            >
                                {this.renderUsername()}
                                {this.renderTime()}
                                {this.renderTicks()}
                            </View>
                            {this.renderGoalRecommendation()}
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Layout>
        )
    }
}

const styles = {
    left: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-start',
        },
        wrapper: {
            // borderRadius: 15,
            marginRight: 60,
            minHeight: 20,
            justifyContent: 'flex-end',

            // overrides
            // backgroundColor: '#FCFCFC',
            // elevation: 1,
            // shadowColor: '#999',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.1,
            // shadowRadius: 3,
            // borderRadius: 9,
            // borderColor: '#EDEDED',
            // borderWidth: 1,
        },
        containerToNext: {
            borderBottomLeftRadius: 3,
        },
        containerToPrevious: {
            borderTopLeftRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
    }),
    right: StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-end',
        },
        wrapper: {
            // borderRadius: 15,
            marginLeft: 60,
            minHeight: 20,
            justifyContent: 'flex-end',

            // overrides
            // backgroundColor: '#F5F9FA',
            // elevation: 1,
            // shadowColor: '#999',
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.1,
            // shadowRadius: 3,
            // borderRadius: 9,
            // borderColor: '#D1ECF6',
            // borderWidth: 1,
        },
        containerToNext: {
            borderBottomRightRadius: 3,
        },
        containerToPrevious: {
            borderTopRightRadius: 3,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
    }),
    tick: {
        fontSize: 10,
        backgroundColor: 'transparent',
        color: 'white',
    },
    tickView: {
        flexDirection: 'row',
        marginRight: 10,
    },
    username: {
        top: -3,
        left: 0,
        fontSize: 12,
        backgroundColor: 'transparent',
        color: '#aaa',
    },
    usernameView: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
}

ChatRoomConversationBubble.contextTypes = {
    actionSheet: PropTypes.func,
    getLocale: PropTypes.func,
}

ChatRoomConversationBubble.defaultProps = {
    touchableProps: {},
    onLongPress: null,
    renderMessageImage: null,
    renderMessageVideo: null,
    renderMessageText: null,
    renderCustomView: null,
    renderUsername: null,
    renderTicks: null,
    renderTime: null,
    position: 'left',
    optionTitles: ['Copy Text', 'Cancel'],
    currentMessage: {
        text: null,
        createdAt: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    bottomContainerStyle: {},
    tickStyle: {},
    usernameStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
}

ChatRoomConversationBubble.propTypes = {
    user: PropTypes.object.isRequired,
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageVideo: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    renderUsernameOnMessage: PropTypes.bool,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    wrapperStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    bottomContainerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    tickStyle: Text.propTypes.style,
    usernameStyle: Text.propTypes.style,
    containerToNextStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
}
