import React, { Component } from 'react';
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

/* Asset */
import HeaderImage from '../../asset/header/header-logo.png';
import HeaderLogo from '../../asset/header/header-logo-white.png';

import Pagination from './Pagination';

import { registrationBack, registrationLogin } from '../../actions';

class Header extends Component {

  handleBackOnClick() {
    this.props.registrationBack();
  }

  handleLoginBackOnClick() {
    this.props.registrationLogin();
  }

  renderPagination(type) {
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
  }

  render() {
    const headerStyle = { ...styles.containerStyle }

    const pagination = this.props.type ? this.renderPagination(this.props.type) : '';

    if (this.props.name) {
      headerStyle.height = 170;
      headerStyle.paddingTop = 0;
      return (
        <View style={headerStyle}>
          <TouchableWithoutFeedback onPress={this.handleBackOnClick.bind(this)}>
            <View style={styles.navBarStyle}>
              <Icon
                type='entypo'
                name='chevron-thin-left'
                containerStyle={styles.iconStyle}
              />
            </View>
          </TouchableWithoutFeedback>
          <Image style={styles.imageStyle} source={HeaderLogo} />
          <Text style={styles.introTextStyle}>Welcome to GoalMogul,</Text>
          <Text style={styles.headerNameStyle}>{this.props.name}</Text>
          {pagination}
        </View>
      );
    }

    if (this.props.contact) {
      headerStyle.height = 160;
      headerStyle.paddingTop = 0;
      return (
        <View style={headerStyle}>
          <TouchableWithoutFeedback onPress={this.handleBackOnClick.bind(this)}>
            <View style={styles.navBarStyle}>
              <Icon
                type='entypo'
                name='chevron-thin-left'
                containerStyle={styles.iconStyle}
              />
            </View>
          </TouchableWithoutFeedback>
          <Image style={styles.imageStyle} source={HeaderLogo} />
          <Text style={styles.introTextStyle}>Contacts on GoalMogul,</Text>
          {pagination}
        </View>
      );
    }

    return (
      <View style={headerStyle}>
        <TouchableWithoutFeedback onPress={this.handleLoginBackOnClick.bind(this)}>
          <View style={styles.navBarStyle}>
            <Icon
              type='entypo'
              name='chevron-thin-left'
              containerStyle={styles.iconStyle}
            />
          </View>
        </TouchableWithoutFeedback>
        <Image source={HeaderImage} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    backgroundColor: '#34c0dd',
    height: 207,
    paddingTop: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navBarStyle: {
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 20,
    top: 30,
    display: 'flex',
    flexDirection: 'row'
  },
  iconStyle: {
    justifyContent: 'flex-start',
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

export default connect(null, { registrationBack, registrationLogin })(Header);
