import React from 'react';
import { View, Image, Text } from 'react-native';

/* Asset */
import HeaderImage from '../asset/header/header_logo.png'

const Header = (props) => {
  let headerStyle = { ...styles.containerStyle }

  if (props.name) {
    headerStyle.height = 167
    return (
      <View style={headerStyle}>
        <Image style={styles.imageStyle} source={HeaderImage} />
        <Text style={styles.introTextStyle}>Welcome to GoalMogul,</Text>
        <Text style={styles.headerNameStyle}>{props.name}</Text>
      </View>
    );
  }

  return (
    <View style={headerStyle}>
      <Image style={styles.imageStyle} source={HeaderImage} />
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    backgroundColor: '#34c0dd',
    height: 205,
    paddingTop: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {

  },
  introTextStyle: {
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff'
  },
  headerNameStyle: {
    fontSize: 26,
    fontWeight: '800',
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff'
  }
};

export default Header;
