import React from 'react';
import { View } from 'react-native';

const Divider = () => {
  return (
    <View style={styles.containerStyle} />
  );
};

const styles = {
  containerStyle: {
    borderLeftColor: 'black',
    borderLeftWidth: 1,
  }
};

export default Divider;
