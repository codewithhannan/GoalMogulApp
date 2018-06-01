import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';

const ProfileActionButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-end', padding: 15, paddingTop: 10 }}>
        <Image
          source={props.source}
          style={{ height: 15, width: 15, ...props.style }}
        />
        <Text style={{ fontSize: 10, marginLeft: 5, alignSelf: 'center' }}>
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileActionButton;
