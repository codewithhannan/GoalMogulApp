import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View
} from 'react-native';

// Components
import DelayedButton from '../../Common/Button/DelayedButton';

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
    const countText = !count || count === 0
      ? null
      : (
        <DelayedButton activeOpacity={0.6} onPress={onTextPress} style={textContainerStyle} disabled={!onTextPress}>
          <Text style={{ ...styles.textStyle, ...this.props.textStyle }}>{this.props.count}{unitText ? ` ${unitText}` : ''}</Text>
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
            source={this.props.iconSource}
            style={{ ...styles.iconStyle, ...this.props.iconStyle }}
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
  iconStyle: {
    height: 16,
    width: 16,
    borderRadius: 8
  },
  textStyle: {
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '600'
  }
};

export default ActionButton;
