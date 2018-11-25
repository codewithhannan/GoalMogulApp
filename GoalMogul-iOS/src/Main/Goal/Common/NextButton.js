import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import DropDown from '../../../asset/utils/dropDown.png';

const NextButton = props => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={{ ...styles.containerStyle, ...styles.borderShadow }}>
      <Text style={styles.textStyle}>next</Text>
      <Image source={DropDown} style={{ height: 8, width: 10 }} />
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  textStyle: {
    marginTop: 1,
    fontSize: 10,
    color: '#c0c4c5'
  },
  borderShadow: {
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  }
};

export default NextButton;
