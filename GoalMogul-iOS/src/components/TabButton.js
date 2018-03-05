import React from 'react';
import { View, Text } from 'react-native';

const TabButton = (props) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>
        {props.text}
      </Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#33495f',
  }
};

export default TabButton;
