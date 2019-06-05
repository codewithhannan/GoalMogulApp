import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';
import DelayedButton from './DelayedButton';

const DEBUG_KEY = '[ UI ProfileActionButton ]';
const ProfileActionButton = (props) => {
  let image = null;
  if (props.source) {
    image = (
      <Image
        source={props.source}
        style={{ backgroundColor: '#f3f3f3', height: 15, width: 15, ...props.style }}
      />
    );
  }

  const textComponent = props.text
    ? (
      <Text style={{ fontSize: 9.5, marginLeft: 5, alignSelf: 'center' }}>
          {props.text}
      </Text>
    ) : null

  return (
    <DelayedButton activeOpacity={0.6} onPress={props.onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          padding: 7,
          borderRadius: 5,
          backgroundColor: '#f3f3f3',
          ...props.containerStyle
        }}
      >
        {image}
        {textComponent}
      </View>
    </DelayedButton>
  );
};

export default ProfileActionButton;
