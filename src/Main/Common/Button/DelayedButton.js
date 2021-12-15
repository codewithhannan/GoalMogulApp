/**
 * This button will have a delay between the first tap and the second tap
 *
 * @format
 */

import React from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableHighlight,
} from 'react-native'

class DelayedButton extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            disabled: false,
        }
        this.clearTimer = this.clearTimer.bind(this)
        this.setTimer = this.setTimer.bind(this)
    }

    componentWillUnmount = () => {
        this.clearTimer()
    }

    setTimer = (timeout) => {
        if (this.timerHandle) {
            return
        }
        // Remember the timer handle
        this.timerHandle = setTimeout(() => {
            this.setState({
                disabled: false,
            })
            this.timerHandle = 0
        }, timeout)
    }

    clearTimer = () => {
        if (this.timerHandle) {
            clearTimeout(this.timerHandle)
            this.timerHandle = 0
        }
    }

    handleOnPress = () => {
        const delay = this.props.delay || 500
        const { onPress } = this.props
        onPress()
        this.setState({
            disabled: true,
        })
        this.setTimer(delay)
    }

    render() {
        const {
            touchableWithoutFeedback,
            touchableHighlight,
            hidden,
            onRef,
            index,
        } = this.props
        if (hidden) return null
        if (touchableHighlight) {
            return (
                <TouchableHighlight
                    index={index}
                    onPress={this.handleOnPress}
                    disabled={this.state.disabled || this.props.disabled}
                    underlayColor="gray"
                    {...this.props}
                    ref={onRef || (() => {})}
                >
                    {this.props.children}
                </TouchableHighlight>
            )
        }
        if (touchableWithoutFeedback) {
            return (
                <TouchableWithoutFeedback
                    {...this.props}
                    index={index}
                    onPress={this.handleOnPress}
                    // onLongPress={this.props.onLongPress}
                    delayLongPress={200}
                    disabled={this.state.disabled || this.props.disabled}
                    ref={onRef || (() => {})}
                >
                    {this.props.children}
                </TouchableWithoutFeedback>
            )
        }
        return (
            <TouchableOpacity
                {...this.props}
                index={index}
                // onLongPress={this.props.onLongPress}
                onPress={this.handleOnPress}
                delayLongPress={200}
                disabled={this.state.disabled || this.props.disabled}
                ref={onRef || (() => {})}
            >
                {this.props.children}
            </TouchableOpacity>
        )
    }
}

export default DelayedButton
