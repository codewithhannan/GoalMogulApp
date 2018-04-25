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

/* Components */
import Header from './Common/Header';
import Button from './Common/Button';
import Divider from './Common/Divider';
import InputField from './Common/InputField';
import Input from './Common/Input';

/* Styles */
import Styles from './Styles';

/* Actions */
import { registrationLogin, registrationNextAddProfile, handleOnFormChange } from '../actions';

/* Refactor validation as a separate module */
const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
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
    this.props.registrationLogin();
  }

  handleNextPressed = values => {
    console.log('next pressed: with values', values);
    const errors = validate(values);
    if (errors) {
      throw new SubmissionError(errors);
    }
    const { name, email, password } = values;

    Keyboard.dismiss();
    this.props.registrationNextAddProfile({ name, email, password });
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
  // <KeyboardAvoidingView
  //   behavior='position'
  //   style={{ flex: 1 }}
  //   contentContainerStyle={Styles.containerStyle}
  //   keyboardVerticalOffset={-150}
  // >
  render() {
    const { handleSubmit } = this.props;
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

                <Text style={styles.titleTextStyle}>Get Started!</Text>
                <Field
                  name='name'
                  label='Full name'
                  component={Input}
                />
                <Field
                  name='email'
                  label='Email'
                  component={Input}
                  validate={validateEmail}
                />
                <Field
                  name='password'
                  label='Password'
                  component={Input}
                  secure
                  validate={minLength8}
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
