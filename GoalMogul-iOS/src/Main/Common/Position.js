import React from 'react';
import { Text } from 'react-native';

const Position = (props) => {
  if (props.text) {
    return (
      <Text
        style={styles.containerStyle}
        numberOfLines={1}
      >
        {props.text.toUpperCase()}
      </Text>
    );
  }
  return '';
};

const styles = {
  containerStyle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#45C9F6',
    paddingTop: 3
  }
};

export default Position;
