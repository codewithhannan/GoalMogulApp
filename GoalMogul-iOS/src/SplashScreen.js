import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import {
  LinearGradient,
  Font,
  AppLoading,
  Asset
} from 'expo';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

// Actions
import { auth as Auth, hideSplashScreen } from './redux/modules/auth/Auth';

import {
  loginUser
} from './actions';

/* Asset */
import HeaderLogo from './asset/header/header-logo-white.png';
import Helpfulness from './asset/utils/help.png';

// Components
import {
  RightArrowIcon
} from './Utils/Icons';

const width = Dimensions.get('window').width
const DEBUG_KEY = '[ UI SplashScreen ]';
class SplashScreen extends Component {
  constructor(props) {
    super(props);
    // Expo.SplashScreen.preventAutoHide();
    this.state = {
      fontLoaded: false,
      appReady: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'gotham-pro': require('../assets/fonts/GothamPro.ttf'),
      'gotham-pro-bold': require('../assets/fonts/GothamPro-Bold.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  // Functions to preload static assets
  async _loadAssetsAsync(callback) {
    const imageAssets = cacheImages([
      require('./asset/utils/badge.png'),
      require('./asset/utils/dropDown.png'),
      require('./asset/utils/like.png'),
      require('./asset/utils/bulb.png'),
      require('./asset/utils/progressBar.png'),
      require('./asset/utils/help.png'),
      require('./asset/utils/privacy.png'),
      require('./asset/utils/edit.png'),
      require('./asset/utils/check.png'),
      require('./asset/utils/addUser.png'),
      require('./asset/utils/default_profile.png'),
      require('./asset/utils/defaultUserProfile.png'),
      require('./asset/utils/meetSetting.png'),
      require('./asset/utils/back.png'),
      require('./asset/utils/next.png'),
      require('./asset/utils/plus.png'),
      require('./asset/utils/cancel_no_background.png'),
      require('./asset/utils/briefcase.png'),
      require('./asset/utils/love.png'),
      require('./asset/utils/cancel.png'),
      require('./asset/utils/post.png'),
      require('./asset/utils/friendsSettingIcon.png'),
      require('./asset/utils/camera.png'),
      require('./asset/utils/cameraRoll.png'),
      require('./asset/utils/photoIcon.png'),
      require('./asset/utils/expand.png'),
      require('./asset/utils/forward.png'),
      require('./asset/utils/steps.png'),
      require('./asset/utils/activity.png'),
      require('./asset/utils/calendar.png'),
      require('./asset/utils/location.png'),
      require('./asset/utils/lightBulb.png'),
      require('./asset/utils/comment.png'),
      require('./asset/utils/reply.png'),
      require('./asset/utils/makeSuggestion.png'),
      require('./asset/utils/imageOverlay.png'),
      require('./asset/utils/info_white.png'),
      require('./asset/utils/info.png'),
      require('./asset/utils/progressBarCounter.png'),
      require('./asset/utils/progressBarOpac.png'),
      require('./asset/utils/progressBar_small.png'),
      require('./asset/utils/progressBar_medium.png'),
      require('./asset/utils/progressBar_large.png'),
      require('./asset/utils/progressBar_counter_small.png'),
      require('./asset/utils/progressBar_counter_medium.png'),
      require('./asset/utils/progressBar_counter_large.png'),
      require('./asset/utils/HelpBG2.png'),
      require('./asset/utils/allComments.png'),
      require('./asset/utils/undo.png'),
      require('./asset/utils/trash.png'),
      require('./asset/utils/invite.png'),
      require('./asset/utils/tutorial.png'),
      require('./asset/utils/right_arrow.png'),
      require('./asset/utils/search.png'),
      require('./asset/utils/dot.png'),
      require('./asset/utils/envelope.png'),
      require('./asset/utils/eventIcon.png'),
      require('./asset/utils/tribeIcon.png'),
      // Friends Tab images
      require('./asset/utils/Friends.png'),
      require('./asset/utils/ContactSync.png'),
      require('./asset/utils/People.png'),
      require('./asset/utils/Suggest.png'),
      require('./asset/utils/clipboard.png'),
      require('./asset/utils/logout.png'),
      require('./asset/utils/bug_report.png'),
      // Suggestion Modal Icons
      require('./asset/suggestion/book.png'),
      require('./asset/suggestion/chat.png'),
      require('./asset/suggestion/event.png'),
      require('./asset/suggestion/flag.png'),
      require('./asset/suggestion/friend.png'),
      require('./asset/suggestion/group.png'),
      require('./asset/suggestion/link.png'),
      require('./asset/suggestion/other.png'),
      // Explore related icons
      require('./asset/explore/explore.png'),
      require('./asset/explore/tribe.png'),
      require('./asset/explore/PeopleGlobe.png'),
      require('./asset/explore/ExploreImage.png'),
      // Navigation Icons
      require('./asset/footer/navigation/home.png'),
      require('./asset/footer/navigation/bell.png'),
      require('./asset/footer/navigation/meet.png'),
      require('./asset/footer/navigation/chat.png'),
      require('./asset/footer/navigation/star.png'),
      require('./asset/header/menu.png'),
      require('./asset/header/setting.png'),
      require('./asset/header/home-logo.png'),
      require('./asset/header/header-logo-white.png'),
      require('./asset/header/header-logo.png'),
      require('./asset/header/logo.png'),
      // Banners
      require('./asset/banner/bronze.png'),
      require('./asset/banner/gold.png'),
      require('./asset/banner/green.png'),
      require('./asset/banner/iron.png'),
      require('./asset/banner/purple.png'),
      require('./asset/banner/silver.png'),
      // Tutorial
      require('../assets/tutorial/RightArrow.png'),
      require('../assets/tutorial/Replay.png'),
      require('../assets/tutorial/logo.png')
    ]);

    const fontAssets = cacheFonts({
      'gotham-pro': require('../assets/fonts/GothamPro.ttf'),
      'gotham-pro-bold': require('../assets/fonts/GothamPro-Bold.ttf')
    });

    await Promise
      .all([...imageAssets, ...fontAssets])
      .catch(err => {
        console.log(`${DEBUG_KEY}: [ _loadAssetsAsync ]: err`, err);
      });

    console.log('finish loading images');

    await Auth.getKey().then((res) => {
      if (!(res instanceof Error)) {
        if (!_.isEmpty(res)) {
          return callback(res);
        }
      }
    }).catch((err) => console.log(`${DEBUG_KEY}: log in user with err: `, err));
    console.log('finish loading keys');
    this.props.hideSplashScreen();

    return;
  }

  handleGetStartedOnPress() {
    this.props.registration();
  }

  handleLoginPress() {
    this.props.login();
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
    if (!this.state.appReady) {
      return (
        <AppLoading
          startAsync={() => this._loadAssetsAsync(this.props.loginUser)}
          onFinish={() => this.setState({ appReady: true })}
          onError={console.warn}
          autoHideSplash={false}
        />
      );
    }

    return (
      <View style={styles.containerStyle}>
        <LinearGradient
          colors={['#4bcaf4', '#1caadb']}
          style={{ flex: 1 }}
        >
          {this.renderLogo()}

          <View style={styles.bodyContainerStyle}>
            <Image style={styles.imageStyle} source={Helpfulness} resizeMode='contain' />
            {this.state.fontLoaded ?
              <View style={{ marginTop: 30 }}>
                <Text style={styles.titleTextStyle}>Achieve more,</Text>
                <Text style={styles.titleTextStyle}>together.</Text>
              </View>
              : null
            }
          </View>

          <View style={styles.highlightContainerStyle}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.reactionContainerStyle}
              onPress={this.handleGetStartedOnPress.bind(this)}
            >
              {
                this.state.fontLoaded ?
                  <Text style={styles.buttonTextStyle}>Get Started</Text>
                : null
              }

              <RightArrowIcon 
                iconStyle={{ 
                  ...styles.iconStyle, 
                  tintColor: '#ffffff',
                  height: 15,
                  width: 30
                }} 
              />
              {/** 
                <Icon
                name='ios-arrow-round-forward'
                type='ionicon'
                color='#ffffff'
                iconStyle={styles.iconStyle}
                />
              */}
              
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.loginHighlightContainerStyle}
            onPress={this.handleLoginPress.bind(this)}
          >
            {
              this.state.fontLoaded ?
                <Text style={styles.haveAccountTextStyle}>
                  Have an account?
                </Text>
              : null
            }

            <TouchableOpacity activeOpacity={0.6} onPress={this.handleLoginPress.bind(this)}>
              {
                this.state.fontLoaded ?
                  <Text style={styles.loginTextStyle}>Log In</Text>
                : null
              }
            </TouchableOpacity>
          </TouchableOpacity>
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
    marginRight: 10,
    marginBottom: 3
  },

  // Body style
  bodyContainerStyle: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    height: 200,
    width: 200,
    tintColor: '#045C7A'
  },
  titleTextStyle: {
    fontSize: 22,
    color: '#045C7A',
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
    marginTop: 5,
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
    alignSelf: 'center',
    borderRadius: 5
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
    // fontSize: 26,
    marginLeft: 5
  }
};

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
  });
}

function cacheFonts(fonts) {
  return [Font.loadAsync(fonts)];
}

const mapDispatchToProps = (dispatch) => {
  return {
    registration: () => Actions.push('registrationAccount'),
    login: () => Actions.push('login'),
    loginUser: (val) => dispatch(loginUser(val)),
    hideSplashScreen: () => dispatch(hideSplashScreen())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SplashScreen);
