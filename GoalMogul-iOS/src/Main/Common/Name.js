import React from 'react';
import { Text } from 'react-native';

const Name = (props) => {
  return (
    <Text
      style={styles.containerStyle}
      numberOfLines={1}
      ellipsizeMode='tail'
    >
      {props.text}
    </Text>
  );
};

const styles = {
  containerStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    maxWidth: 100
  }
};

export default Name;
