import React from 'react';
import {
    Image,
    Text,
    View
} from 'react-native';

// Components
import DelayedButton from '../../Common/Button/DelayedButton';
import { DEFAULT_STYLE, FONT_FAMILY_2 } from '../../../styles';


const DEBUG_KEY = '[ UI ActionButton ]';

class ActionButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false
        };
    }

    handleOnPress = () => {
        if (this.state.buttonDisabled) return;
        this.setState({
            ...this.state,
            buttonDisabled: true
        });
        this.props.onPress();
        // console.log(`${DEBUG_KEY}: set timeout`);
        setTimeout(() => {
            this.setState({
                ...this.state,
                buttonDisabled: false
            });
        }, 800);
        // console.log(`${DEBUG_KEY}: enable button`);
    }

    render() {
        const { containerStyle, count, disabled, onTextPress, textContainerStyle, unitText } = this.props;
        const countText = !count || count === 0 ? null : (
                <DelayedButton activeOpacity={0.6} onPress={onTextPress} style={textContainerStyle} disabled={!onTextPress}>
                    <Text style={{ ...DEFAULT_STYLE.buttonText_1, ...styles.textStyle, ...this.props.textStyle }}>
                        {this.props.count}{unitText ? ` ${unitText}` : ''}
                    </Text>
                </DelayedButton>
            );

        const buttonDisabled = disabled === true;
        return (
            <DelayedButton
                activeOpacity={0.6}
                style={{ ...styles.containerStyle, ...containerStyle }}
                onPress={this.handleOnPress}
                disabled={(this.state.buttonDisabled || buttonDisabled)}
            >
                <View
                    style={{
                        ...styles.iconContainerStyle,
                        ...this.props.iconContainerStyle,
                        opacity: buttonDisabled ? 0.4 : 1
                    }}
                >
                    <Image
                        resizeMode="contain"
                        source={this.props.iconSource}
                        style={{ ...DEFAULT_STYLE.buttonIcon_1, ...this.props.iconStyle }}
                    />
                </View>
                {countText}
            </DelayedButton>
        );
    }
}

const styles = {
    containerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    iconContainerStyle: {
        height: 32,
        width: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontFamily: FONT_FAMILY_2,
        marginLeft: 8
    }
};

export default ActionButton;
