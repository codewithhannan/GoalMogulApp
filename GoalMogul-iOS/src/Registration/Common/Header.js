import React from 'react';
import { View, Image, Text } from 'react-native';

/* Asset */
import HeaderImage from '../../asset/header/header-logo.png';
import HeaderLogo from '../../asset/header/header-logo-white.png';

const Header = (props) => {
  let headerStyle = { ...styles.containerStyle }

  if (props.name) {
    headerStyle.height = 167;
    headerStyle.paddingTop = 0;
    return (
      <View style={headerStyle}>
        <Image style={styles.imageStyle} source={HeaderLogo} />
        <Text style={styles.introTextStyle}>Welcome to GoalMogul,</Text>
        <Text style={styles.headerNameStyle}>{props.name}</Text>
      </View>
    );
  }

  if (props.contact) {
    headerStyle.height = 157;
    headerStyle.paddingTop = 0;
    return (
      <View style={headerStyle}>
        <Image style={styles.imageStyle} source={HeaderLogo} />
        <Text style={styles.introTextStyle}>Contacts on GoalMogul,</Text>
      </View>
    );
  }

  return (
    <View style={headerStyle}>
      <Image source={HeaderImage} />
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    backgroundColor: '#34c0dd',
    height: 207,
    paddingTop: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    height: 38,
    width: 38
  },
  introTextStyle: {
    fontSize: 19,
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 8
  },
  headerNameStyle: {
    fontSize: 24,
    fontWeight: '800',
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff'
  }
};

export default Header;
