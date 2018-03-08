import React from 'react';
import { View, Text } from 'react-native';

const Button = (props) => {
  const containerStyle = { ...styles.containerStyle };
  const textStyle = { ...styles.textStyle };

  if (props.arrow) {
    containerStyle.backgroundColor = '#ffffff';
    textStyle.color = '#34c0dd';
    textStyle.fontWeight = '600';
    
    return (
      <View style={containerStyle}>
        <Text style={textStyle}>{props.text}</Text>
      </View>
    );
  }
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>{props.text}</Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 18,
    marginRight: 18,
    height: 41,
    justifyContent: 'center',
    backgroundColor: '#34c0dd'
  },
  textStyle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    alignSelf: 'center'
  }
};

export default Button;
