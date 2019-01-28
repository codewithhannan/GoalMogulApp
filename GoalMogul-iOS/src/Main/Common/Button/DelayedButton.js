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
    }

    handleOnPress = () => {
        const delay = this.props.delay || 300;
        const { onPress } = this.props;
        onPress();
        this.setState({
            ...this.state,
            disabled: true
        });
        setTimeout(() => {
            this.setState({
                ...this.state,
                disabled: false
            });
        }, delay);
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
