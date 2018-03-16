import React from 'react';
import { View, Image, Text } from 'react-native';

/* Asset */
import HeaderImage from '../../asset/header/header-logo.png';
import HeaderLogo from '../../asset/header/header-logo-white.png';

import Pagination from './Pagination';

const renderPagination = (type) => {
  switch (type) {
    case 'profile':
      return <Pagination total={3} current={0} />;
    case 'intro':
      return <Pagination total={3} current={1} />;
    case 'contact':
      return <Pagination total={3} current={2} />;
    default:
      return '';
  }
};

const Header = (props) => {
  let headerStyle = { ...styles.containerStyle }

  let pagination = props.type ? renderPagination(props.type) : '';

  if (props.name) {
    headerStyle.height = 170;
    headerStyle.paddingTop = 0;
    return (
      <View style={headerStyle}>
        <Image style={styles.imageStyle} source={HeaderLogo} />
        <Text style={styles.introTextStyle}>Welcome to GoalMogul,</Text>
        <Text style={styles.headerNameStyle}>{props.name}</Text>
        {pagination}
      </View>
    );
  }

  if (props.contact) {
    headerStyle.height = 160;
    headerStyle.paddingTop = 0;
    return (
      <View style={headerStyle}>
        <Image style={styles.imageStyle} source={HeaderLogo} />
        <Text style={styles.introTextStyle}>Contacts on GoalMogul,</Text>
        {pagination}
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
    width: 38,
    marginTop: 18
  },
  introTextStyle: {
    fontSize: 19,
    justifyContent: 'center',
    alignSelf: 'center',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 6
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
