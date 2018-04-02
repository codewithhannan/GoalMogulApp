import React from 'react';
import { Text } from 'react-native';

const Position = (props) => {
  return (
    <Text
      style={styles.containerStyle}
      numberOfLines={1}
    >
      {props.text.toUpperCase()}
    </Text>
  );
};

const styles = {
  containerStyle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34c0dd'
  }
};

export default Position;
