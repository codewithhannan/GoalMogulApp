import React, { Component } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import _ from 'lodash';

// Assets
import menu from '../../../asset/header/menu.png';

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
      move,
      moveEnd,
      canDrag,
      meta: { touched, error },
      ...custom
    } = this.props;

    const icon = iconSource ?
      <Image source={iconSource} style={{ ...iconStyle }} />
      :
      '';

    const gestureHandler = canDrag
      ? (
        <TouchableOpacity
          onLongPress={move}
          onPressOut={moveEnd}
          style={{ padding: 12, paddingRight: 6 }}
        >
          <Image source={menu} style={{ height: 20, width: 22 }} />
        </TouchableOpacity>
    ) : '';

    return (
      <View style={styles.inputContainerStyle}>
        {gestureHandler}
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
          activeOpacity={0.85}
          style={{ padding: 12, paddingLeft: 6, alignItems: 'flex-end', alignSelf: 'center' }}
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
