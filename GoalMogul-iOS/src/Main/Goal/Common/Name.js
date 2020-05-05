import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';

const styles = {
  containerStyle: {
    fontSize: 15,
    fontWeight: '600',
    maxWidth: 200,
  }
};

const Name = (props) => {
  const style = props.textStyle ? { ...styles.containerStyle, ...props.textStyle }
    : { ...styles.containerStyle };
  const { onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
        <Text
          style={style}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {props.text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Name;
