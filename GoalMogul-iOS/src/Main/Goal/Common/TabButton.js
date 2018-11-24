import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';

const TabButton = (props) => {
  const backgroundColor = props.selected ? '#46C8F5' : 'white';
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

  const stat = !props.count ? '' :
    (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name='dot-single' type='entypo' color={color} size={20} />
        <Text style={{ ...styles.countTextStyle, color }}>{props.count}</Text>
      </View>
    );

  return (
    <TouchableOpacity activeOpacity={0.85}
      style={{ ...styles.containerStyle, backgroundColor }}
      onPress={props.onPress}
    >
      {image}
      <Text style={{ ...styles.textStyle, ...props.textStyle, color, fontWeight }}>
        {props.text}
      </Text>
      {stat}
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
