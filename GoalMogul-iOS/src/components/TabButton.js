import React from 'react';
import { View, Text } from 'react-native';

const TabButton = (props) => {
  return (
    <Text style={styles.containerStyle}>
      {props.text}
    </Text>
  );
};

const styles = {
  containerStyle: {
    justifyContent: 'center',
    fontSize: 10,
    color: '#33495f'
  }
};

export default TabButton;
