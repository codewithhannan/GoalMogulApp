import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import FormContainer from './Common/FormContainer';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationLogin, registrationNextAddProfile } from '../actions';

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    };
  }

  handleLogInPressed() {
    console.log('login pressed');
    this.props.registrationLogin();
  }

  handleNextPressed() {
    console.log('next pressed');
    this.props.registrationNextAddProfile();
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
      <TouchableWithoutFeedback onPress={this.handleLogInPressed.bind(this)}>
        <View>
          <Button text='Log In to your account' arrow />
        </View>
      </TouchableWithoutFeedback>
    );
  }

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
      <View style={Styles.containerStyle}>
        <Header />
        <View style={Styles.bodyContainerStyle}>
          <Text style={styles.titleTextStyle}>Get Started!</Text>
          {this.renderForm()}
          <TouchableWithoutFeedback onPress={this.handleNextPressed.bind(this)}>
            <View>
              <Button text='Next' />
            </View>
          </TouchableWithoutFeedback>
          {this.renderSplitter()}
          {this.renderLogIn()}
        </View>
      </View>
    );
  }
}

const styles = {
  titleTextStyle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#646464',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 25
  },
  splitterStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 10
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

const mapStateToProps = state => {
  const { username, password, error, loading } = state.auth;

  return {
    username: username,
    password: password,
    error: error,
    loading: loading
  }
};

export default connect(null, { registrationLogin, registrationNextAddProfile })(Account);
