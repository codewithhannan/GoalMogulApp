import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';

const Button = (props) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={props.onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginTop: 10,
          padding: 7,
          borderRadius: 5,
          backgroundColor: '#f3f3f3'
        }}
      >
        <Image
          source={props.source}
          style={{
            backgroundColor: '#f3f3f3',
            height: 10,
            width: 10,
            tintColor: '#a1a1a1',
            alignSelf: 'center',
            ...props.style
          }}
        />
        <Text style={{ fontSize: 10, marginLeft: 5, alignSelf: 'center', color: '#a1a1a1' }}>
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
