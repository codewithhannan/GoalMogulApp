import React from 'react';
import { StyleSheet, View } from 'react-native';

/* State management */
import { Provider } from 'react-redux';
import { createStore } from 'redux';

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
    return (
      <Provider store={createStore(reducers)}>
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
