import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Actions } from 'react-native-router-flux';

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import Input from './Common/Input';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationLogin, registrationNextAddProfile, handleOnFormChange } from '../actions';

/* Refactor validation as a separate module */
const validateInput = value =>
  value && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ||
    /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/i.test(value))
    ? 'Invalid input'
    : undefined;

const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;

const minLength8 = minLength(8);

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

class Account extends Component {

  handleContainerOnPressed() {
    Keyboard.dismiss();
  }

  handleLogInPressed() {
    console.log('login pressed');
    Actions.login();
  }

  handleNextPressed = values => {
    console.log('next pressed: with values', values);
    const errors = validate(values);
    if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
      throw new SubmissionError(errors);
    }
    const { name, email, password } = values;

    Keyboard.dismiss();
    return this.props.registrationNextAddProfile({ name, email, password });
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

  renderError(error) {
    return error ? (
      <View style={{ height: 15 }}>
        <Text style={styles.errorStyle}>{error}</Text>
      </View>
    ) : null;
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
  // <KeyboardAvoidingView
  //   behavior='position'
  //   style={{ flex: 1 }}
  //   contentContainerStyle={Styles.containerStyle}
  //   keyboardVerticalOffset={-150}
  // >
  render() {
    const { handleSubmit, error } = this.props;
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='never'
          overScrollMode='never'
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={this.handleContainerOnPressed.bind(this)}>
            <View style={Styles.containerStyle}>
              <Header />
              <View style={Styles.bodyContainerStyle}>
                {this.renderError(error)}
                <Text style={styles.titleTextStyle}>Get Started!</Text>
                <Field
                  name='name'
                  label='Full name'
                  component={Input}
                  disabled={this.props.loading}
                />
                <Field
                  name='email'
                  label='Email or Phone number'
                  title='please specify your country code, e.g. +1 for US'
                  component={Input}
                  validate={validateInput}
                  disabled={this.props.loading}
                />
                <Field
                  name='password'
                  label='Password'
                  component={Input}
                  secure
                  validate={minLength8}
                  disabled={this.props.loading}
                />

                <TouchableWithoutFeedback onPress={handleSubmit(this.handleNextPressed)}>
                  <View>
                    <Button text='Next' />
                  </View>
                </TouchableWithoutFeedback>
                {this.renderSplitter()}
                {this.renderLogIn()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}


const styles = {
  titleTextStyle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#646464',
    alignSelf: 'center',
    marginTop: 25,
  },
  splitterStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  errorStyle: {
    marginTop: 15,
    color: '#ff0033',
    justifyContent: 'center',
    marginBottom: 4,
    alignSelf: 'center'
  }
};

Account = reduxForm({
  form: 'accountRegistrationForm'
})(Account);

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

export default connect(
  mapStateToProps,
  {
    registrationLogin,
    registrationNextAddProfile,
    handleOnFormChange
  }
)(Account);
