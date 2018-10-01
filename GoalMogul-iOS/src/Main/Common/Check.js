import React from 'react';
import {
  View,
  Image
} from 'react-native';
import check from '../../asset/utils/check.png';

const Check = ({ selected }) => {
  const checkIconContainerStyle = selected
    ? { ...styles.checkIconContainerStyle, borderWidth: 0.5, backgroundColor: '#a0deba' }
    : { ...styles.checkIconContainerStyle };

  const checkIconStyle = selected
    ? { ...styles.checkIconStyle }
    : { ...styles.checkIconStyle };

  return (
    <View style={checkIconContainerStyle}>
      <Image source={check} resizeMode='contain' style={checkIconStyle} />
    </View>
  );
};

const styles = {
  checkIconContainerStyle: {
    marginLeft: 8,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'lightgray',
    alignSelf: 'center'
  },
  checkIconStyle: {
    width: 16,
    height: 14
  }
};

export default Check;
