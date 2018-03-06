import React from 'react';
import { View, Image } from 'react-native';

/* Asset */
import HeaderImage from '../asset/header/header_logo.png'

const Header = () => {
  return (
    <View style={styles.containerStyle}>
      <Image style={styles.imageStyle} source={HeaderImage} />
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    height: 205,
    backgroundColor: '#34c0dd',
    paddingTop: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {

  }
};

export default Header;
