/**
 * This button will have a delay between the first tap and the second tap
 */
import React from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

class DelayedButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };
        this.clearTimer = this.clearTimer.bind(this);
        this.setTimer = this.setTimer.bind(this);
    }
    
    componentWillUnmount = () => {
        this.clearTimer();
    }

    setTimer = (timeout) => {
        if (this.timerHandle) {
          return;
        }
        // Remember the timer handle
        this.timerHandle = setTimeout(() => {
            this.setState({ 
                ...this.state,
                disabled: false 
            });
            this.timerHandle = 0;
        }, timeout);
    }
    
    clearTimer = () => {
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
            this.timerHandle = 0;
        }
    }

    handleOnPress = () => {
        const delay = this.props.delay || 300;
        const { onPress } = this.props;
        onPress();
        this.setState({
            ...this.state,
            disabled: true
        });
        this.setTimer(delay); 
    } 

    render() {
        const { touchableWithoutFeedback } = this.props;
        if (touchableWithoutFeedback) {
            return (
                <TouchableWithoutFeedback 
                    {...this.props}
                    onPress={this.handleOnPress}
                    disabled={this.state.disabled}
                >
                    {this.props.children}
                </TouchableWithoutFeedback>
            );
        }
        return (
            <TouchableOpacity 
                {...this.props}
                onPress={this.handleOnPress}
                disabled={this.state.disabled}
            >
                {this.props.children}
            </TouchableOpacity>
        );
    }
}

export default DelayedButton;
