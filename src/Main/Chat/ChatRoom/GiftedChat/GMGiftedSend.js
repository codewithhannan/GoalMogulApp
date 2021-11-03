/**
 * This component borrows the idea from
 * @see https://github.com/FaridSafi/react-native-gifted-chat/blob/master/src/Send.tsx
 *
 * It adds the customization for the needs of message media ref check so that user
 * can send an image without adding any text
 *
 * GiftedChat doesn't allow send a message with only image. Thus we need to add a layer
 * in Send function to allow that. Additionally, before calling onSend,
 * GiftedChat wraps it with onSend(messages: TMessage[] = [], shouldResetInputToolbar = false)
 * Thus here, we just use messageMediaRef to do the determination and use actual
 * sendMessage function to attach the message media ref
 * @format
 */

import { Icon } from '@ui-kitten/components'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { color } from '../../../../styles/basic'

const styles = StyleSheet.create({
    container: {
        height: 44,
        justifyContent: 'flex-end',
    },
    text: {
        fontWeight: '600',
        fontSize: 17,
        backgroundColor: 'transparent',
        marginBottom: 12,
        marginLeft: 10,
        marginRight: 10,
    },
    iconStyle: {
        height: 30,
        width: 30,
    },
})

const allowSend = (text, messageMediaRef, messageVoiceRef, messageVideoRef) =>
    (text && text.trim().length > 0) ||
    messageMediaRef ||
    messageVoiceRef ||
    messageVideoRef

export default class Send extends Component {
    static defaultProps = {
        text: '',
        onSend: () => {},
        label: 'Send',
        containerStyle: {},
        textStyle: {},
        children: null,
        alwaysShowSend: false,
        disabled: false,
        sendButtonProps: null,
    }

    static propTypes = {
        text: PropTypes.string,
        onSend: PropTypes.func,
        label: PropTypes.string,
        containerStyle: PropTypes.object,
        textStyle: PropTypes.object,
        children: PropTypes.element,
        alwaysShowSend: PropTypes.bool,
        disabled: PropTypes.bool,
        sendButtonProps: PropTypes.object,
    }

    handleOnPress = () => {
        const {
            text,
            onSend,
            messageMediaRef,
            messageVoiceRef,
            messageVideoRef,
        } = this.props
        if (
            (text || messageMediaRef || messageVoiceRef || messageVideoRef) &&
            onSend
        ) {
            onSend({ text: text.trim() }, true)
        }
    }

    renderSend = () => {
        const {
            text,
            messageMediaRef,
            messageVoiceRef,
            messageVideoRef,
            disabled,
        } = this.props
        let tintColor =
            allowSend(
                text,
                messageMediaRef,
                messageVoiceRef,
                messageVideoRef
            ) && !disabled
                ? color.GM_BLUE
                : 'lightgray'
        return (
            <View>
                <Icon
                    name="send"
                    pack="material-community"
                    style={[styles.iconStyle, { tintColor }]}
                />
            </View>
        )
    }

    render() {
        const {
            text,
            containerStyle,
            children,
            textStyle,
            label,
            alwaysShowSend,
            disabled,
            sendButtonProps,
            messageMediaRef,
            messageVoiceRef,
            messageVideoRef,
        } = this.props
        if (
            alwaysShowSend ||
            allowSend(text, messageMediaRef, messageVoiceRef, messageVideoRef)
        ) {
            return (
                <TouchableOpacity
                    testID="send"
                    accessible
                    accessibilityLabel="send"
                    style={[styles.container, containerStyle]}
                    onPress={this.handleOnPress}
                    accessibilityTraits="button"
                    disabled={
                        !allowSend(
                            text,
                            messageMediaRef,
                            messageVoiceRef,
                            messageVideoRef
                        ) && disabled
                    }
                    {...sendButtonProps}
                >
                    <View>{children || this.renderSend()}</View>
                </TouchableOpacity>
            )
        }
        return <View />
    }
}
