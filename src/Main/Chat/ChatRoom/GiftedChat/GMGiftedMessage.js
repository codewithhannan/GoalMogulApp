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

export default class GMGiftedMessage extends React.Component {
    constructor(props) {
        super(props)
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
        const { messageDoc } = this.props
        const bubbleProps = this.getInnerComponentProps()
        if (this.props.renderBubble) {
            return this.props.renderBubble(bubbleProps)
        }
        return <Bubble {...bubbleProps} messageDoc={messageDoc} />
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
        const { currentMessage, nextMessage, previousMessage } = this.props
        const marginBottom = isSameUser(currentMessage, nextMessage) ? 2 : 10

        const marginTop =
            isSameUser(currentMessage, previousMessage) &&
            isSameDay(currentMessage, previousMessage)
                ? 2
                : 10
        return (
            <View>
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
            </View>
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

GMGiftedMessage.contextTypes = {
    actionSheet: PropTypes.func,
}

GMGiftedMessage.defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
}

GMGiftedMessage.propTypes = {
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
