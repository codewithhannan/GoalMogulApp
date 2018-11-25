import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';

const ProfileActionButton = (props) => {
  let image = '';
  if (props.source) {
    image = (
      <Image
        source={props.source}
        style={{ backgroundColor: '#f3f3f3', height: 15, width: 15, ...props.style }}
      />
    );
  }
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={props.onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginTop: 7,
          marginRight: 8,
          padding: 7,
          borderRadius: 5,
          backgroundColor: '#f3f3f3'
        }}
      >
        {image}
      <Text style={{ fontSize: 9.5, marginLeft: 5, alignSelf: 'center' }}>
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileActionButton;
