import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import { userNameChanged, passwordChanged, registerUser, loginUser } from './actions';

class Login extends Component {

  onUserNameChange(text) {
    this.props.userNameChanged(text);
  }

  onPasswordChange(pw) {
    this.props.passwordChanged(pw);
  }

  handleLogIn() {
    // console.log(`User try to log in for username: ${this.props.username}`);
    let username = this.props.username;
    let password = this.props.password;
    this.props.loginUser({ username, password });
  }

  handleSignUp() {
    console.log('User try to register');
    this.props.registerUser();
  }

  renderError() {
    if (this.props.error) {
      //TODO: return a toast to properly show error message
      return (
        <View>
          <Text style={styles.errorStyle}>{this.props.error}</Text>
        </View>
      );
    }
  }

  renderButton() {
    if (this.props.loading) {
      //TODO: render spiner
    }

    // TODO: render login button
  }

  render() {
    const { containerStyle, headerStyle, formStyle, inputLabelStyle, textInputStyle } = styles;
    return (
      <View style={containerStyle}>
        <View style={headerStyle}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>GOALMOGUL</Text>
        </View>
        {/* Render customized error message */}
        {this.renderError()}
        <View style={formStyle}>
          <Text style={inputLabelStyle}>EMAIL</Text>
          <TextInput
            style={textInputStyle}
            onChangeText={this.onUserNameChange.bind(this)}
            value={this.props.username}
          />
        </View>

        <View style={formStyle}>
          <Text style={inputLabelStyle}>PASSWORD</Text>
          <TextInput
            style={textInputStyle}
            secureTextEntry
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.password}
          />
        </View>

        <Button
          text='JOIN NOW'
          textStyle={{ fontWeight: '400',
            color: '#fff',
            fontSize: 20,
            paddingLeft: 30,
            paddingRight: 30 }}
          buttonStyle={{
            width: 220,
            height: 45,
            borderColor: '#fff',
            backgroundColor: '#1a9edc',
            borderWidth: 4,
            borderRadius: 20,
            marginTop: 30,
            alignSelf: 'center'
          }}
          containerStyle={{ marginTop: 10 }}
          onPress={this.handleSignUp.bind(this)}
        />

        <Button
          text='LOGIN'
          clear
          textStyle={{ color: '#fff',
            fontWeight: '400',
            fontSize: 20,
            paddingLeft: 30,
            paddingRight: 30,
            textDecorationLine: 'underline' }}
          buttonStyle={{
            backgroundColor: '#1a9edc',
            alignSelf: 'center',
            marginTop: 100
          }}
          containerStyle={{ marginTop: 20 }}
          onPress={this.handleLogIn.bind(this)}
        />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: '#1a9edc',
    flex: 1
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 40
  },
  formStyle: {
    backgroundColor: '#3cb9e4',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10
  },
  inputLabelStyle: {
    marginTop: 15,
    marginLeft: 15,
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  textInputStyle: {
    height: 45,
    marginLeft: 30,
    fontSize: 22,
    color: '#fff',
    marginBottom: 5
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 4,
    borderColor: '#fff'
  },
  errorStyle: {
    color: '#ff0033',
    justifyContent: 'center',
    marginBottom: 4
  }
};

const mapStateToProps = state => {
  const { username, password, error, loading } = state.auth;

  return {
    username: username,
    password: password,
    error: error,
    loading: loading
  }
};

export default connect(
  mapStateToProps, { 
    userNameChanged, 
    passwordChanged, 
    registerUser,
    loginUser
  })
  (Login);
