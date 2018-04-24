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
import { LinearGradient, Font } from 'expo';

/* Asset */
import HeaderLogo from './asset/header/header-logo-white.png';
import Helpfulness from './asset/utils/help.png';

const width = Dimensions.get('window').width

class SplashScreen extends Component {

  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'gotham-pro': require('../assets/fonts/GothamPro.ttf'),
      'gotham-pro-bold': require('../assets/fonts/GothamPro-Bold.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  renderLogo() {
    return (
      <View style={styles.headerContainerStyle}>
        <Image style={styles.logoImageStyle} source={HeaderLogo} />
        {
          this.state.fontLoaded ?
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.headerBoldTextStyle}>Goal</Text>
              <Text style={styles.headerTextStyle}>Mogul</Text>
            </View>
          : null
        }
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

          <View style={styles.bodyContainerStyle}>
            <Image style={styles.imageStyle} source={Helpfulness} />
            {this.state.fontLoaded ?
              <View>
                <Text style={styles.titleTextStyle}>Achieve more,</Text>
                <Text style={styles.titleTextStyle}>together.</Text>
              </View>
              : null
            }
          </View>

          <View style={styles.highlightContainerStyle}>
            <TouchableOpacity style={styles.reactionContainerStyle}>
              {
                this.state.fontLoaded ?
                  <Text style={styles.buttonTextStyle}>Get Started</Text>
                : null
              }

              <Icon
                name='ios-arrow-round-forward'
                type='ionicon'
                color='#ffffff'
                iconStyle={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.loginHighlightContainerStyle}>
            {
              this.state.fontLoaded ?
                <Text style={styles.haveAccountTextStyle}>
                  Have an account?
                </Text>
              : null
            }

            <TouchableOpacity>
              {
                this.state.fontLoaded ?
                  <Text style={styles.loginTextStyle}>Log In</Text>
                : null
              }
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
  // Header style
  headerContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70
  },
  headerTextStyle: {
    fontSize: 36,
    color: '#ffffff',
    fontFamily: 'gotham-pro'
  },
  headerBoldTextStyle: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '800',
    fontFamily: 'gotham-pro-bold'
  },
  logoImageStyle: {
    height: 45,
    width: 45,
    marginRight: 10
  },

  // Body style
  bodyContainerStyle: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    height: 230,
    width: 230,
    tintColor: '#217a9b'
  },
  titleTextStyle: {
    fontSize: 22,
    color: '#217a9b',
    alignSelf: 'center',
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'gotham-pro'
  },

  // Highlight style
  buttonTextStyle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    alignSelf: 'center',
    fontFamily: 'gotham-pro-bold'
  },
  highlightContainerStyle: {
    marginTop: 50,
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

  // Footer style
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
    fontFamily: 'gotham-pro-bold'
  },
  haveAccountTextStyle: {
    fontSize: 15,
    color: '#0d6992',
    marginRight: 3,
    fontFamily: 'gotham-pro'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 26,
    marginLeft: 5,
    marginTop: 3
  }
};

export default connect(null, null)(SplashScreen);
