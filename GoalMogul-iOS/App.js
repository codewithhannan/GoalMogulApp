import React from 'react';
import { StyleSheet, View, Linking, Image } from 'react-native';
import { AppLoading, Font, Asset } from 'expo';

/* State management */
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Actions } from 'react-native-router-flux';

/* Reducers */
// import reducers from './src/reducers';
import { persistor, store } from './src/store';

/* Router */
import Router from './src/Router';

export default class App extends React.Component {

  state = {
    appReady: false
  }

  // TODO: in ComponentWillMount set up dependencies for verification and
  // Persist app state. Check if AuthReducers' user token is null and valid.

  // Functions to preload static assets
  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('./src/asset/utils/badge.png'),
      require('./src/asset/utils/dropDown.png'),
      require('./src/asset/utils/like.png'),
      require('./src/asset/utils/bulb.png'),
      require('./src/asset/utils/progressBar.png'),
      require('./src/asset/utils/help.png'),
      require('./src/asset/utils/privacy.png'),
      require('./src/asset/utils/edit.png'),
      require('./src/asset/utils/check.png'),
      require('./src/asset/utils/addUser.png'),
      require('./src/asset/utils/default_profile.png'),
      require('./src/asset/utils/defaultUserProfile.png'),
      require('./src/asset/utils/meetSetting.png'),
      require('./src/asset/utils/back.png'),
      require('./src/asset/utils/next.png'),
      require('./src/asset/utils/plus.png'),
      require('./src/asset/utils/cancel_no_background.png'),
      require('./src/asset/utils/briefcase.png'),
      require('./src/asset/utils/love.png'),
      require('./src/asset/utils/cancel.png'),
      require('./src/asset/utils/post.png'),
      require('./src/asset/utils/friendsSettingIcon.png'),
      require('./src/asset/utils/camera.png'),
      require('./src/asset/utils/cameraRoll.png'),
      require('./src/asset/utils/photoIcon.png'),
      require('./src/asset/utils/expand.png'),
      require('./src/asset/utils/forward.png'),
      require('./src/asset/utils/steps.png'),
      require('./src/asset/utils/activity.png'),
      require('./src/asset/utils/calendar.png'),
      require('./src/asset/utils/location.png'),
      require('./src/asset/utils/lightBulb.png'),
      require('./src/asset/utils/comment.png'),
      require('./src/asset/utils/reply.png'),
      // Suggestion Modal Icons
      require('./src/asset/suggestion/book.png'),
      require('./src/asset/suggestion/chat.png'),
      require('./src/asset/suggestion/event.png'),
      require('./src/asset/suggestion/flag.png'),
      require('./src/asset/suggestion/friend.png'),
      require('./src/asset/suggestion/group.png'),
      require('./src/asset/suggestion/link.png'),
      require('./src/asset/suggestion/other.png'),
      // Navigation Icons
      require('./src/asset/footer/navigation/home.png'),
      require('./src/asset/footer/navigation/bell.png'),
      require('./src/asset/footer/navigation/meet.png'),
      require('./src/asset/footer/navigation/chat.png'),
      require('./src/asset/footer/navigation/star.png'),
      require('./src/asset/header/menu.png'),
      require('./src/asset/header/setting.png'),
      require('./src/asset/header/home-logo.png'),
      require('./src/asset/header/header-logo-white.png'),
      require('./src/asset/header/header-logo.png'),
      require('./src/asset/header/logo.png'),
    ]);

    const fontAssets = cacheFonts({
      'gotham-pro': require('./assets/fonts/GothamPro.ttf'),
      'gotham-pro-bold': require('./assets/fonts/GothamPro-Bold.ttf')
    });

    return Promise.all([...imageAssets, ...fontAssets]);

    // this.setState({ appReady: true });
  }

  render() {
    if (!this.state.appReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ appReady: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={styles.container}>
            <Router />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return Font.loadAsync(fonts);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
