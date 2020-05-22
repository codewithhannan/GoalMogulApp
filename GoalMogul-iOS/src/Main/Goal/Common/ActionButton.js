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
        const countText = (
                <DelayedButton activeOpacity={0.6} onPress={onTextPress} style={textContainerStyle} disabled={!onTextPress}>
                    <Text style={{ ...DEFAULT_STYLE.buttonText_1, ...styles.textStyle, ...this.props.textStyle }}>
                        {count > 0 ? count : ''}{unitText ? ` ${unitText + (count > 1 ? 's' : '')}` : ''}
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        ...DEFAULT_STYLE.smallTitle_1,
        marginLeft: 8
    }
};

export default ActionButton;
