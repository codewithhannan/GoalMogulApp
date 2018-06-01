import React from 'react';
import { Text, View } from 'react-native';

const EmptyResult = (props) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>{props.text}</Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    alignItems: 'center'
  },
  textStyle: {
    paddingTop: 150,
    fontSize: 17,
    fontWeight: '600',
    color: '#818181'
  }
};

export default EmptyResult;
