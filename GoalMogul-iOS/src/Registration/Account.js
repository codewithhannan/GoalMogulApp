import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import FormContainer from './Common/FormContainer';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationLogin, registrationNextAddProfile, handleOnFormChange } from '../actions';

class Account extends Component {

  handleLogInPressed() {
    console.log('login pressed');
    this.props.registrationLogin();
  }

  handleNextPressed() {
    console.log('next pressed');
    this.props.registrationNextAddProfile();
  }

  handleOnNameChange(name) {
    this.props.handleOnFormChange(name, 'name');
  }

  handleOnEmailChange(email) {
    this.props.handleOnFormChange(email, 'email');
  }

  handleOnPasswordChange(password) {
    console.log('password is ', password);
    this.props.handleOnFormChange(password, 'password');
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
            onChangeText={this.handleOnNameChange.bind(this)}
            value={this.props.name}
          />

        <Divider horizontal flex={1} color='#eaeaea' />
        <TextInput
          style={Styles.textInputStyle}
          placeholder='Email'
          onChangeText={this.handleOnEmailChange.bind(this)}
          value={this.props.email}
        />
        <Divider horizontal flex={1} color='#eaeaea' />
        <TextInput
          style={Styles.textInputStyle}
          placeholder='Password'
          secureTextEntry
          onChangeText={this.handleOnPasswordChange.bind(this)}
          value={this.props.password}
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
  const { name, password, email, error, loading } = state.registration;

  return {
    name,
    email,
    password,
    error,
    loading
  };
};

export default connect(mapStateToProps, {
  registrationLogin,
  registrationNextAddProfile,
  handleOnFormChange })(Account);
