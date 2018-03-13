import React from 'react';
import { StyleSheet, View } from 'react-native';

/* State management */
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

/* Reducers */
import reducers from './reducers';

/* Components */
import Login from './src/Login';
import Home from './src/Home';
import Account from './src/Registration/Account';
import AddProfilePic from './src/Registration/AddProfilePic';
import IntroForm from './src/Registration/IntroForm';
import Contact from './src/Registration/Contacts';
import ContactSync from './src/Registration/ContactSync';

export default class App extends React.Component {

  // TODO: in ComponentWillMount set up dependencies for verification and
  // Persist app state

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

    return (
      <Provider store={store}>
        <View style={styles.container}>

          <IntroForm />
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
