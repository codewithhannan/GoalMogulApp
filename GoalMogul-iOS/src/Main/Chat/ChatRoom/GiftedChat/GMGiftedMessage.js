/**
 * This is based off the idea from
 * @see https://github.com/FaridSafi/react-native-gifted-chat/blob/master/example-slack-message/src/SlackMessage.js
 *
 * @format
 */

import * as Haptics from 'expo-haptics'
import PropTypes from 'prop-types'
import React from 'react'
import {
    Animated,
    Clipboard,
    StyleSheet,
    TouchableHighlight,
    View,
    ViewPropTypes,
} from 'react-native'
import { Avatar, Day, utils } from 'react-native-gifted-chat'
import Bubble from './GMGiftedChatBubbleSlack'

const { isSameDay } = utils

function isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(
        diffMessage.user &&
        currentMessage.user &&
        diffMessage.user._id === currentMessage.user._id
    )
}

export default class Message extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // Start the message at a lower offset, and animate it into view
            posOffsetForSlideAnim: new Animated.Value(-24),
        }
    }

    componentDidMount() {
        Animated.timing(this.state.posOffsetForSlideAnim, {
            toValue: 0,
            duration: 400,
        }).start()
    }

    getInnerComponentProps() {
        const { containerStyle, ...props } = this.props
        return {
            ...props,
            position: 'left',
            isSameUser,
            isSameDay,
        }
    }

    onLongPress = () => {
        // Haptic effect to notify user on interaction
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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

    renderDay() {
        if (this.props.currentMessage.createdAt) {
            const dayProps = this.getInnerComponentProps()
            if (this.props.renderDay) {
                return this.props.renderDay(dayProps)
            }
            return <Day {...dayProps} />
        }
        return null
    }

    renderBubble() {
        const bubbleProps = this.getInnerComponentProps()
        if (this.props.renderBubble) {
            return this.props.renderBubble(bubbleProps)
        }
        return <Bubble {...bubbleProps} />
    }

    renderAvatar() {
        let extraStyle
        if (
            isSameUser(this.props.currentMessage, this.props.previousMessage) &&
            isSameDay(this.props.currentMessage, this.props.previousMessage)
        ) {
            // Set the invisible avatar height to 0, but keep the width, padding, etc.
            extraStyle = { height: 0 }
        }

        const avatarProps = this.getInnerComponentProps()
        return (
            <Avatar
                {...avatarProps}
                imageStyle={{
                    left: [
                        styles.slackAvatar,
                        avatarProps.imageStyle,
                        extraStyle,
                    ],
                }}
            />
        )
    }

    render() {
        const hasNextMessage = Object.keys(this.props.nextMessage).length
        const isSentByThisAppUser = this.props.currentMessage.isLocal
        const marginBottom = isSameUser(
            this.props.currentMessage,
            this.props.nextMessage
        )
            ? 2
            : 10

        const marginTop =
            isSameUser(this.props.currentMessage, this.props.previousMessage) &&
            isSameDay(this.props.currentMessage, this.props.previousMessage)
                ? 2
                : 10
        return (
            <Animated.View
                style={
                    // slide up if this is the latest message in the list, and it's sent by the app user
                    !hasNextMessage && isSentByThisAppUser
                        ? {
                              top: this.state.posOffsetForSlideAnim,
                          }
                        : {}
                }
            >
                {this.renderDay()}
                <TouchableHighlight
                    onLongPress={this.onLongPress}
                    accessibilityTraits="text"
                    underlayColor="#F1F1F1"
                    activeOpacity={0.9}
                >
                    <View
                        style={[
                            styles.container,
                            { marginBottom, marginTop },
                            this.props.containerStyle,
                        ]}
                    >
                        {this.renderAvatar()}
                        {this.renderBubble()}
                    </View>
                </TouchableHighlight>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginLeft: 8,
        marginRight: 0,
    },
    slackAvatar: {
        // The bottom should roughly line up with the first line of message text.
        height: 40,
        width: 40,
        borderRadius: 100,
    },
})

Message.contextTypes = {
    actionSheet: PropTypes.func,
}

Message.defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
}

Message.propTypes = {
    renderAvatar: PropTypes.func,
    renderBubble: PropTypes.func,
    renderDay: PropTypes.func,
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
}
