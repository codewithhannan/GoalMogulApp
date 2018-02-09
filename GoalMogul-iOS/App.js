import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Login from './src/Login'
import { LinearGradient } from 'expo';


export default class App extends React.Component {
  render () {
    return (
      <View style={styles.container}>

        <Login />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
