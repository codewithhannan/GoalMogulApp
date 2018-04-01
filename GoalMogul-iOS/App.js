import React from 'react';
import { StyleSheet, View } from 'react-native';

/* State management */
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

/* Reducers */
import reducers from './src/reducers';

/* Router */
import Router from './src/Router';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

export default class App extends React.Component {

  // TODO: in ComponentWillMount set up dependencies for verification and
  // Persist app state. Check if AuthReducers' user token is null and valid.

  render() {
    console.log('.env is: ', process.env.DEBUGGING_MODE);
    return (
      <Provider store={store}>
        <View style={styles.container}>

          <Router />
        </View>
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
