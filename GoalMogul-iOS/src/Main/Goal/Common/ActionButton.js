import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View
} from 'react-native';

class ActionButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: false
    };
  }

  handleOnPress = () => {
    this.setState({
      ...this.state,
      buttonDisabled: true
    });
    this.props.onPress();
    setTimeout(() => {
      this.setState({
        ...this.state,
        buttonDisabled: false
      });
    }, 500);
  }

  render() {
    const { containerStyle, count } = this.props;
    const countText = !count || count === 0
      ? ''
      : <Text style={{ ...styles.textStyle, ...this.props.textStyle }}>{this.props.count}</Text>;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={{ ...styles.containerStyle, ...containerStyle }}
        onPress={this.handleOnPress}
        disabled={this.state.buttonDisabled}
      >
        <View style={{ ...styles.iconContainerStyle, ...this.props.iconContainerStyle }}>
          <Image
            source={this.props.iconSource}
            style={{ ...styles.iconStyle, ...this.props.iconStyle }}
          />
        </View>
        {countText}
      </TouchableOpacity>
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
    fontSize: 11,
    marginLeft: 8
  }
};

export default ActionButton;
