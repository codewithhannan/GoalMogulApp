import React, { Component } from "react";
import { View } from "react-native";
import { TextField } from "react-native-material-textfield-gm";

class Input extends Component {
  focus() {
    this.input.focus();
  }

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
      onSubmitEditing,
      returnKeyType,
      textContentType,
      meta: { touched, error },
      ...custom
    } = this.props;
    return (
      <View style={styles.inputContainerStyle}>
        <TextField
          ref={(ref) => (this.input = ref)}
          label={label}
          title={title}
          autoCapitalize={"none"}
          autoCorrect={false}
          onChangeText={onChange}
          error={error}
          enablesReturnKeyAutomatically={false}
          returnKeyType={returnKeyType || "done"}
          secureTextEntry={secure}
          characterRestriction={limitation}
          multiline={multiline}
          keyboardType={keyboardType || "default"}
          labelHeight={26}
          fontSize={17}
          disabled={disabled}
          onSubmitEditing={onSubmitEditing}
          textContentType={textContentType}
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
    paddingRight: 20,
  },
};

export default Input;
