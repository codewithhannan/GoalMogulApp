import React, { Component } from 'react';
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

/* Asset */
import HeaderImage from '../../asset/header/header-logo.png';
import HeaderLogo from '../../asset/header/header-logo-white.png';

import Pagination from './Pagination';

import { registrationBack, registrationLogin } from '../../actions';

// const IMAGE_HEIGHT_SMALL = 60;
// const IMAGE_HEIGHT = 80;
// const VIEW_HEIGHT = 207;
// const VIEW_AMOUNT = 20;

class Header extends Component {

  // constructor(props) {
  //   super(props);
  //
  //   this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
  //   this.containerViewHeight = new Animated.Value(VIEW_HEIGHT);
  // }
  //
  // componentWillMount() {
  //   this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
  //   this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  // }
  //
  // componentWillUnmount() {
  //   this.keyboardWillShowSub.remove();
  //   this.keyboardWillHideSub.remove();
  // }
  //
  // keyboardWillShow = (event) => {
  //   Animated.timing(this.imageHeight, {
  //     duration: event.duration,
  //     toValue: IMAGE_HEIGHT_SMALL,
  //   }).start();
  // };
  //
  // keyboardWillHide = (event) => {
  //   Animated.timing(this.imageHeight, {
  //     duration: event.duration,
  //     toValue: IMAGE_HEIGHT,
  //   }).start();
  // };

  handleBackOnClick() {
    this.props.registrationBack();
  }

  handleLoginBackOnClick() {
    this.props.registrationLogin();
  }

  renderBackButton() {
    return (
      <TouchableWithoutFeedback onPress={this.handleBackOnClick.bind(this)}>
        <View style={styles.navBarStyle}>
          <Icon
            type='entypo'
            name='chevron-thin-left'
            containerStyle={styles.iconStyle}
            color='white'
          />
        </View>
      </TouchableWithoutFeedback>
    );
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
          {this.renderBackButton()}
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
          {this.renderBackButton()}
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
              color='white'
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
    backgroundColor: '#45C9F6',
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
    justifyContent: 'flex-start'
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
