import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { userNameChanged, passwordChanged } from './actions';
import { Button } from 'react-native-elements';


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isAuthenticated: false,
      isOpen: false,
      text: ''
    };
  }

  onUserNameChange(text) {
    this.props.userNameChanged(text);
  }

  onPasswordChange(pw) {
    this.props.passwordChanged(pw);
  }

  handleLogIn() {
    console.log(`User try to log in for username: ${this.state.username}`);
  }

  handleSignUp() {
    console.log(`User try to sign up with username: ${this.state.username}`);
  }

  render() {
    const { containerStyle, headerStyle, formStyle, inputLabelStyle, textInputStyle } = styles;
    return (
      <View style={containerStyle}>
        <View style={headerStyle}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>GOALMOGUL</Text>
        </View>

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
          title='JOIN NOW'
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
          onPress={this.handleSignUp}
        />

        <Button
          title='LOGIN'
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
          onPress={this.handleLogIn}
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
  }
};

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    password: state.auth.password
  }
};

export default connect(mapStateToProps, { userNameChanged, passwordChanged })(Login);
