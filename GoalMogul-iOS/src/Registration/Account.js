import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

/* Components */
import RegistrationContainer from './RegistrationContainer';
import RegistrationBody from './RegistrationBody';
import Header from './Header';
import Button from './Button';
import Divider from './Divider';

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    };
  }

  renderSplitter() {
    return (
      <View style={styles.splitterStyle}>
        <Divider horizontal width={80} />
        <Text style={styles.splitterTextStyle}>OR</Text>
        <Divider horizontal width={80} />
      </View>
    );
  }

  renderLogIn() {
    return (
      <View style={styles.logInContainer}>
        <Text style={styles.logInTextStyle}>Log In to your account</Text>
      </View>
    );
  }
  // <View style={styles.textInputStyle}>

  renderForm() {
    return (
      <View style={styles.formContainer}>
          <TextInput
            style={styles.textInputStyle}
            placeholder='Full Name'
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
          />

        <Divider horizontal flex={1} color='#eaeaea' />
        <TextInput
          style={styles.textInputStyle}
          placeholder='Email'
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <Divider horizontal flex={1} color='#eaeaea' />
        <TextInput
          style={styles.textInputStyle}
          placeholder='Password'
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
      </View>
    );
  }

  render() {
    return (
      <RegistrationContainer>
        <Header />
        <RegistrationBody>
          <Text style={styles.titleTextStyle}>Get Started!</Text>
          {this.renderForm()}
          <Button text='Next' />
          {this.renderSplitter()}
          {this.renderLogIn()}
        </RegistrationBody>
      </RegistrationContainer>
    );
  }
}

const styles = {
  titleTextStyle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#646464',
    alignSelf: 'center',
    marginTop: 28,
    marginBottom: 28
  },
  splitterStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  splitterTextStyle: {
    fontSize: 15,
    color: '#646464',
    fontWeight: '800',
    marginLeft: 10,
    marginRight: 10
  },
  logInContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logInTextStyle: {
    fontSize: 15,
    color: '#34c0dd',
    fontWeight: '600'
  },
  formContainer: {
    display: 'flex',
    borderWidth: 2,
    borderColor: '#eaeaea',
    marginBottom: 12,
    marginRight: 18,
    marginLeft: 18
  },
  textInputStyle: {
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16
  }
};

export default Account;
