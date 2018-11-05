import React from 'react';
import { Text } from 'react-native';

const Timestamp = (props) => {
  // TODO: format time
  return (
    <Text style={styles.containerStyle}>
      {props.time}
    </Text>
  );
};

const styles = {
  containerStyle: {
    fontSize: 10,
    color: '#636363',
    marginTop: 1
  }
};

export default Timestamp;
