/**
 * /* eslint no-use-before-define: ["error", { "variables": false }]
 *
 * @format
 */

import PropTypes from 'prop-types'
import React from 'react'
import {
    Dimensions,
    Keyboard,
    StyleSheet,
    View,
    ViewPropTypes,
} from 'react-native'

const DEFAULT_ACCESSORY_HEIGHT = 70

export default class ChatRoomConversationInputToolbar extends React.Component {
    constructor(props) {
        super(props)

        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)

        this.contentSize = undefined

        this.state = {
            position: 'absolute',
        }
    }

    componentWillMount() {
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow
        )
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide
        )
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
    }

    keyboardWillShow() {
        if (this.state.position !== 'relative') {
            this.setState({
                position: 'relative',
            })
        }
    }

    keyboardWillHide() {
        if (this.state.position !== 'absolute') {
            this.setState({
                position: 'absolute',
            })
        }
    }

    onLayout = (e) => {
        const { layout } = e.nativeEvent

        if (!layout) {
            return
        }

        /**
         * In giftedchat, it uses below methods to compute message container height:
         * @see https://github.com/FaridSafi/react-native-gifted-chat/blob/master/src/GiftedChat.tsx#L568
         * Total allowed hight - composer height - keyboard height - top safe area height for iphone X.
         *
         * However, the method it used to get composer height is as followed:
         * @see https://github.com/FaridSafi/react-native-gifted-chat/blob/master/src/GiftedChat.tsx#L558
         * current composerHeight + 2 * min accessory height - min composer height
         *
         * We do render accessory but only on the bottom. Instead, we have an image preview above the
         * accessory. Thus height of image preview + height of accessory > 2 * accessory height.
         *
         * To compensate for the internal logic, we need to call this function to adjust the overall
         * composer height when the whole InputToolBar change.
         *
         * To clarify even more,
         * InputToolBar height = text input height + image preview (if one) height + accessory height
         * where accessories are adding image icon, emoji icon, suggest icon and send icon.
         */
        if (
            !this.contentSize ||
            (this.contentSize && this.contentSize.height !== layout.height)
        ) {
            this.contentSize = layout
            this.props.onInputSizeChanged({
                height: layout.height - DEFAULT_ACCESSORY_HEIGHT,
            })
        }
    }

    renderActions() {
        if (this.props.renderActions) {
            return this.props.renderActions(this.props)
        }
        return null
    }

    renderSend() {
        if (this.props.renderSend) {
            return this.props.renderSend(this.props)
        }
        return null
    }

    renderComposer() {
        if (this.props.renderComposer) {
            return this.props.renderComposer(this.props)
        }
        return null
    }

    renderAccessory(accessoryLocation) {
        if (this.props.renderAccessory) {
            return (
                <View style={[styles.accessory, this.props.accessoryStyle]}>
                    {this.props.renderAccessory(this.props, accessoryLocation)}
                </View>
            )
        }
        return null
    }

    render() {
        return (
            <View
                style={[
                    styles.container,
                    this.props.containerStyle,
                    { position: this.state.position },
                ]}
                onLayout={this.onLayout}
            >
                {this.renderAccessory('top')}
                <View style={[styles.primary, this.props.primaryStyle]}>
                    {this.renderActions()}
                    {this.renderComposer()}
                    {this.renderSend()}
                </View>
                {this.renderAccessory('bottom')}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#b2b2b2',
        backgroundColor: 'white',
        bottom: 0,
        left: 0,
        right: 0,
        width: Dimensions.get('window').width,
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    accessory: {},
})

ChatRoomConversationInputToolbar.defaultProps = {
    renderAccessory: null,
    renderActions: null,
    renderSend: null,
    renderComposer: null,
    containerStyle: {},
    primaryStyle: {},
    accessoryStyle: {},
    onPressActionButton: () => {},
}

ChatRoomConversationInputToolbar.propTypes = {
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,
    renderComposer: PropTypes.func,
    onPressActionButton: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    primaryStyle: ViewPropTypes.style,
    accessoryStyle: ViewPropTypes.style,
}
