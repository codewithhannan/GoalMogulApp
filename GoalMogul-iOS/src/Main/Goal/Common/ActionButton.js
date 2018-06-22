import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text
} from 'react-native';

const ActionButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={props.onPress}
    >
      <Image source={props.iconSource} style={{ ...styles.iconStyle, ...props.styles }} />
      <Text style={{ ...styles.textStyle, ...props.textStyle }}>{props.count}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconStyle: {
    height: 40,
    width: 40
  },
  textStyle: {
    fontSize: 12,
    marginLeft: 8
  }
};

export default ActionButton;
