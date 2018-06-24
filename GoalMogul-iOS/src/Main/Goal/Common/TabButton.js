import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { Icon } from 'react-native-elements';

const TabButton = (props) => {
  const backgroundColor = props.selected ? '#45C9F6' : 'white';
  const tintColor = props.selected ? 'white' : '#616161';
  const color = props.selected ? 'white' : '#616161';
  const fontWeight = props.selected ? '700' : '600';

  // Tab icon
  const image = props.iconSource ?
    (<Image
      source={props.iconSource}
      style={{ ...styles.iconStyle, ...props.iconStyle, tintColor }}
    />)
    : '';

  return (
    <TouchableOpacity
      style={{ ...styles.containerStyle, backgroundColor }}
      onPress={props.onPress}
    >
      {image}
      <Text style={{ ...styles.textStyle, ...props.textStyle, color, fontWeight }}>
        {props.text}
      </Text>
      <Icon name='dot-single' type='entypo' color={color} size={20} />
      <Text style={{ ...styles.countTextStyle, color }}>{props.count}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 38
  },
  iconStyle: {
    height: 26,
    width: 26,
  },
  textStyle: {
    fontSize: 11,
    marginLeft: 8,
  },
  countTextStyle: {
    fontSize: 11,
  }
};

export default TabButton;
