import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert-jia';

/* State management */
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// import { Actions } from 'react-native-router-flux';

/* Reducers */
// import reducers from './src/reducers';
import { persistor, store } from './src/store';

// Components
import { DropDownHolder } from './src//Main/Common/Modal/DropDownModal';

/* Router */
import Router from './src/Router';

import SocketIOManager from './src/socketio/SocketIOManager';
import LiveChatService from './src/socketio/services/LiveChatService';
import MessageStorageService from './src/services/chat/MessageStorageService';

// Disable font scaling at the start of the App
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appReady: false
    };

    // must be initialized in this order as each depends on the previous
    SocketIOManager.initialize();
    LiveChatService.initialize();
    MessageStorageService.initialize();
  }
  // TODO: in ComponentWillMount set up dependencies for verification and
  // Persist app state. Check if AuthReducers' user token is null and valid.

  // Functions to preload static assets
  // async _loadAssetsAsync() {
  //   const imageAssets = cacheImages([
  //     require('./src/asset/utils/badge.png'),
  //     require('./src/asset/utils/dropDown.png'),
  //     require('./src/asset/utils/like.png'),
  //     require('./src/asset/utils/bulb.png'),
  //     require('./src/asset/utils/progressBar.png'),
  //     require('./src/asset/utils/help.png'),
  //     require('./src/asset/utils/privacy.png'),
  //     require('./src/asset/utils/edit.png'),
  //     require('./src/asset/utils/check.png'),
  //     require('./src/asset/utils/addUser.png'),
  //     require('./src/asset/utils/default_profile.png'),
  //     require('./src/asset/utils/defaultUserProfile.png'),
  //     require('./src/asset/utils/meetSetting.png'),
  //     require('./src/asset/utils/back.png'),
  //     require('./src/asset/utils/next.png'),
  //     require('./src/asset/utils/plus.png'),
  //     require('./src/asset/utils/cancel_no_background.png'),
  //     require('./src/asset/utils/briefcase.png'),
  //     require('./src/asset/utils/love.png'),
  //     require('./src/asset/utils/cancel.png'),
  //     require('./src/asset/utils/post.png'),
  //     require('./src/asset/utils/friendsSettingIcon.png'),
  //     require('./src/asset/utils/camera.png'),
  //     require('./src/asset/utils/cameraRoll.png'),
  //     require('./src/asset/utils/photoIcon.png'),
  //     require('./src/asset/utils/expand.png'),
  //     require('./src/asset/utils/forward.png'),
  //     require('./src/asset/utils/steps.png'),
  //     require('./src/asset/utils/activity.png'),
  //     require('./src/asset/utils/calendar.png'),
  //     require('./src/asset/utils/location.png'),
  //     require('./src/asset/utils/lightBulb.png'),
  //     require('./src/asset/utils/comment.png'),
  //     require('./src/asset/utils/reply.png'),
  //     require('./src/asset/utils/makeSuggestion.png'),
  //     require('./src/asset/utils/imageOverlay.png'),
  //     require('./src/asset/utils/info_white.png'),
  //     require('./src/asset/utils/info.png'),
  //     // Suggestion Modal Icons
  //     require('./src/asset/suggestion/book.png'),
  //     require('./src/asset/suggestion/chat.png'),
  //     require('./src/asset/suggestion/event.png'),
  //     require('./src/asset/suggestion/flag.png'),
  //     require('./src/asset/suggestion/friend.png'),
  //     require('./src/asset/suggestion/group.png'),
  //     require('./src/asset/suggestion/link.png'),
  //     require('./src/asset/suggestion/other.png'),
  //     // Explore related icons
  //     require('./src/asset/explore/explore.png'),
  //     require('./src/asset/explore/tribe.png'),
  //     // Navigation Icons
  //     require('./src/asset/footer/navigation/home.png'),
  //     require('./src/asset/footer/navigation/bell.png'),
  //     require('./src/asset/footer/navigation/meet.png'),
  //     require('./src/asset/footer/navigation/chat.png'),
  //     require('./src/asset/footer/navigation/star.png'),
  //     require('./src/asset/header/menu.png'),
  //     require('./src/asset/header/setting.png'),
  //     require('./src/asset/header/home-logo.png'),
  //     require('./src/asset/header/header-logo-white.png'),
  //     require('./src/asset/header/header-logo.png'),
  //     require('./src/asset/header/logo.png'),
  //   ]);
  //
  //   const fontAssets = cacheFonts({
  //     'gotham-pro': require('./assets/fonts/GothamPro.ttf'),
  //     'gotham-pro-bold': require('./assets/fonts/GothamPro-Bold.ttf')
  //   });
  //
  //   return Promise.all([...imageAssets, ...fontAssets]);
  // }

  render() {
    // if (!this.state.appReady) {
    //   return (
    //     <AppLoading
    //       startAsync={this._loadAssetsAsync}
    //       onFinish={() => this.setState({ appReady: true })}
    //       onError={console.warn}
    //     />
    //   );
    // }
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={styles.container}>
            <Router />
          </View>
          <DropdownAlert 
            ref={ref => DropDownHolder.setDropDown(ref)}
            closeInterval={7500}
            containerStyle={styles.toastCustomContainerStyle}
          />
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  toastCustomContainerStyle: {
    backgroundColor: '#2B73B6'
  },
  // cancel button is currently not used
  cancelBtnImageStyle: {
    padding: 6,
    width: 30,
    height: 30,
    alignSelf: 'center'
  },
});
