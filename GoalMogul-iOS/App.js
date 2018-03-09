import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './src/Login';
import Home from './src/Home';
import Account from './src/Registration/Account';
import AddProfilePic from './src/Registration/AddProfilePic';
import IntroForm from './src/Registration/IntroForm';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <Account />
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
