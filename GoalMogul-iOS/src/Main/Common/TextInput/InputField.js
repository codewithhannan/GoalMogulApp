import React, { Component } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import _ from 'lodash';

class InputField extends Component {

  constructor(props) {
   super(props);
   this.updateRef = this.updateRef.bind(this, 'input');
   this.onChange = this.onChange.bind(this);
   this.onChangeText = this.onChangeText.bind(this);
   this.onIconPress = this.onIconPress.bind(this);
 }

 onChange(event) {
    const { onChange } = this.props;
    console.log('something happens');
    if ('function' === typeof onChange) {
      onChange(event);
    }
  }

  onChangeText(text) {
    const { onChange } = this.props.input;

    if ('function' === typeof onChange) {
      onChange(text);
    }
  }

  onIconPress() {
    const { iconOnPress } = this.props;
    if (iconOnPress !== undefined) {
      iconOnPress();
    } else {
      this.clear();
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  clear() {
     this.input.clear();
     /* onChangeText is not triggered by .clear() */
     this.onChangeText('');
   }

  render() {
    const {
      input: { onFocus, value, ...restInput },
      multiline,
      editable,
      numberOfLines,
      placeholder,
      style,
      iconSource,
      iconStyle,
      iconOnPress,
      meta: { touched, error },
      ...custom
    } = this.props;

    const icon = iconSource ?
      <Image source={iconSource} style={{ ...iconStyle }} />
      :
      '';

    return (
      <View style={styles.inputContainerStyle}>
        <TextInput
          ref={this.updateRef}
          title={custom.title}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={this.onChangeText}
          onChange={this.onChange}
          numberOfLines={numberOfLines || 1}
          returnKeyType='done'
          multiline={multiline}
          onFocus={onFocus}
          editable={editable}
          placeholder={placeholder}
          style={style}
          value={_.isEmpty(value) ? '' : value}
          {...restInput}
          {...custom}
        />
        <TouchableOpacity
          style={{ padding: 15, alignItems: 'flex-end', alignSelf: 'center' }}
          onPress={this.onIconPress}
        >
          {icon}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  inputContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  }
};

export default InputField;
