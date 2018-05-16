import React from 'react';
import { View, Text, Animated } from 'react-native';

const TabButton = (props) => {
  if (props.onSelect) {
    return (
      <View style={styles.onSelectContainerStyle}>
        <Animated.Text style={styles.onSelectTextStyle}>
          {props.text}
        </Animated.Text>
      </View>
    );
  }
  return (
    <View style={styles.containerStyle}>
      <Animated.Text style={styles.textStyle}>
        {props.text}
      </Animated.Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  onSelectContainerStyle: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4dc9f2'
  },
  textStyle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#696969',
  },
  onSelectTextStyle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  }
};

export default TabButton;
