import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo';

import HeaderLogo from './asset/header/header-logo-white.png';

const width = Dimensions.get('window').width

class SplashScreen extends Component {

  renderLogo() {
    return (
      <View style={styles.headerContainerStyle}>
        <Image style={styles.imageStyle} source={HeaderLogo} />
        <Text style={styles.headerBoldTextStyle}>Goal</Text>
        <Text style={styles.headerTextStyle}>Mogul</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <LinearGradient
          colors={['#4bcaf4', '#1caadb']}
          style={{ flex: 1 }}
        >
          {this.renderLogo()}

          <View>
            <Text style={styles.titleTextStyle}>Achieve more,</Text>
            <Text style={styles.titleTextStyle}>together.</Text>
          </View>

          <View style={styles.highlightContainerStyle}>
            <TouchableOpacity style={styles.reactionContainerStyle}>
              <Text style={styles.buttonTextStyle}>Get Started</Text>
              <Icon
                name='ios-arrow-round-forward'
                type='ionicon'
                color='#ffffff'
                iconStyle={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.loginHighlightContainerStyle}>
            <Text style={styles.haveAccountTextStyle}>
              Have an account?
            </Text>
            <TouchableOpacity>
              <Text style={styles.loginTextStyle}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

    );
  }
}

const styles = {
  containerStyle: {
    flex: 1
  },
  headerContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  headerTextStyle: {
    fontSize: 32,
    color: '#ffffff',
    letterSpacing: 1
  },
  headerBoldTextStyle: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 1
  },
  imageStyle: {
    height: 45,
    width: 45,
    marginRight: 10
  },
  buttonTextStyle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    alignSelf: 'center'
  },
  highlightContainerStyle: {
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#4ccbf5',
    height: 50,
    width: 220,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  reactionContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  titleTextStyle: {
    fontSize: 20,
    color: '#217a9b',
    alignSelf: 'center'
  },
  loginHighlightContainerStyle: {
    backgroundColor: '#4ccbf5',
    flexDirection: 'row',
    height: 60,
    width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  loginTextStyle: {
    paddingLeft: 3,
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 18,
  },
  haveAccountTextStyle: {
    fontSize: 15,
    color: '#0d6992'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 26,
    marginLeft: 5,
    marginTop: 3
  }
};

export default SplashScreen;
