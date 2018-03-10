import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './src/Login';
import Home from './src/Home';
import Account from './src/Registration/Account';
import AddProfilePic from './src/Registration/AddProfilePic';
import IntroForm from './src/Registration/IntroForm';
import Contact from './src/Registration/Contacts';
import ContactSync from './src/Registration/ContactSync';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <ContactSync />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
