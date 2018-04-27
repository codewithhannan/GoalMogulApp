import React from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import Expo from 'expo';

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

  // TODO: in ComponentWillMount set up dependencies for verification and
  // Persist app state. Check if AuthReducers' user token is null and valid.

  render() {
    console.log('.env is: ', process.env.DEBUGGING_MODE);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
