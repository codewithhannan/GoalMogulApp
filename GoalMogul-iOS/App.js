import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './src/Login';
import Home from './src/Home';
import Account from './src/Registration/Account';
import AddProfilePic from './src/Registration/AddProfilePic';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <AddProfilePic />
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
