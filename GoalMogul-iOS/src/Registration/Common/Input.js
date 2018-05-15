import React, { Component } from 'react';
import {
  View
} from 'react-native';
import { TextField } from 'react-native-material-textfield';

class Input extends Component {
  render() {
    const {
      input: { onChange, ...restInput },
      label,
      secure,
      limitation,
      multiline,
      keyboardType,
      title,
      disabled,
      meta: { touched, error },
      ...custom
    } = this.props;
    return (
      <View style={styles.inputContainerStyle}>
        <TextField
          label={label}
          title={title}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={onChange}
          error={error}
          enablesReturnKeyAutomatically={false}
          returnKeyType='done'
          secureTextEntry={secure}
          characterRestriction={limitation}
          multiline={multiline}
          keyboardType={keyboardType || 'default'}
          labelHeight={26}
          fontSize={17}
          disabled={disabled}
          {...custom}
          {...restInput}
        />
      </View>
    );
  }
}

const styles = {
  inputContainerStyle: {
    paddingLeft: 20,
    paddingRight: 20
  }
};

export default Input;
