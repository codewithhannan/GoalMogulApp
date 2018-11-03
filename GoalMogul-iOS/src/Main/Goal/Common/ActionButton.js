import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View
} from 'react-native';

const ActionButton = (props) => {
  const { containerStyle, count } = props;
  const countText = count || count === 0
    ? ''
    : <Text style={{ ...styles.textStyle, ...props.textStyle }}>{props.count}</Text>;

  return (
    <TouchableOpacity
      style={{ ...styles.containerStyle, ...containerStyle }}
      onPress={props.onPress}
    >
      <View style={{ ...styles.iconContainerStyle, ...props.iconContainerStyle }}>
        <Image source={props.iconSource} style={{ ...styles.iconStyle, ...props.iconStyle }} />
      </View>
      {countText}
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  iconContainerStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    height: 26,
    width: 26,
    borderRadius: 13
  },
  textStyle: {
    fontSize: 12,
    marginLeft: 8
  }
};

export default ActionButton;
