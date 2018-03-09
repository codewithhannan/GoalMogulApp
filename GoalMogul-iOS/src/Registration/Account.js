import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

/* Components */
import RegistrationContainer from './RegistrationContainer';
import RegistrationBody from './RegistrationBody';
import Header from './Header';
import Button from './Button';
import Divider from './Divider';
import FormContainer from './FormContainer';

/* Styles */
import Styles from './Styles';

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
      <FormContainer>
          <TextInput
            style={Styles.textInputStyle}
            placeholder='Full Name'
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
          />

        <Divider horizontal flex={1} color='#eaeaea' />
        <TextInput
          style={Styles.textInputStyle}
          placeholder='Email'
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <Divider horizontal flex={1} color='#eaeaea' />
        <TextInput
          style={Styles.textInputStyle}
          placeholder='Password'
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
      </FormContainer>
    );
  }

  render() {
    return (
      <RegistrationContainer>
        <Header />
        <RegistrationBody>
          <Text style={Styles.titleTextStyle}>Get Started!</Text>
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
  }
};

export default Account;
