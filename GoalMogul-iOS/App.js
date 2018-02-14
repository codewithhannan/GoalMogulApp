import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './src/Login';
import Home from './src/Home';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <Home />
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
