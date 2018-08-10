import React, { Component } from 'react';
import { TextInput, Platform } from 'react-native';

const iosTextHeight = 20.5;
const androidTextHeight = 20.5;
const textHeight = Platform.OS === 'ios' ? iosTextHeight : androidTextHeight;

class TextInputLines extends Component {
  state = { height: textHeight * 2, lines: 1 }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value === '') {
      this.setState({ height: textHeight * 2, lines: 1 });
    }
  }

  render() {
    const {
      style,
      value,
      placeholder,
      numberOfLines = 8,
      autoFocus = true,
      onChangeText 
    } = this.props;

    return (
      <TextInput
        style={[style, { height: this.state.height }]}
        multiline
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => onChangeText(text)}
        onContentSizeChange={(event) => {
          const height = Platform.OS === 'ios'
            ? event.nativeEvent.contentSize.height
            : event.nativeEvent.contentSize.height - androidTextHeight;
          const lines = Math.round(height / textHeight);
          const visibleLines = lines < numberOfLines ? lines : numberOfLines;
          const visibleHeight = textHeight * (visibleLines + 1);
          this.setState({ height: visibleHeight, lines: visibleLines });
        }}
        underlineColorAndroid='transparent'
      />
  );
  }
}

export default TextInputLines;
