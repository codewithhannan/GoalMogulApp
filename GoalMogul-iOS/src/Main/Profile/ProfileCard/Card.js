import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    marginBottom: 1
  }
};

export default Card;
