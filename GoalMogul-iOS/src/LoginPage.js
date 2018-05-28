import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';

/* Components */
import Header from './Registration/Common/Header';
import Button from './Registration/Common/Button';
import Divider from './Registration/Common/Divider';
import Input from './Registration/Common/Input';

/* Styles */
import Styles from './Registration/Styles';

/* Actions */
import { registerUser, loginUser } from './actions';

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  return errors;
};

class LoginPage extends Component {

  handleContainerOnPressed() {
    Keyboard.dismiss();
  }

  handleSignUp() {
    console.log('User try to register');
    this.props.registerUser();
  }

  handleLoginPressed = values => {
    const errors = validate(values);
    if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
      throw new SubmissionError(errors);
    }
    const { username, password } = values;

    Keyboard.dismiss();
    return this.props.loginUser({ username, password });
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

  renderCreateAccount() {
    return (
      <TouchableWithoutFeedback onPress={this.handleSignUp.bind(this)}>
        <View>
          <Button text='Create a new account' arrow />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderError(error) {
    return error ? (
      <View style={{ height: 29 }}>
        <Text style={styles.errorStyle}>{error}</Text>
      </View>
    ) : (
      <View style={{ height: 29 }} />
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
                {/* <Text style={styles.titleTextStyle}>Get Started!</Text> */}

                <Field
                  name='username'
                  label='Email or Phone number'
                  keyboardType='email-address'
                  component={Input}
                  disabled={this.props.loading}
                />
                <Field
                  name='password'
                  label='Password'
                  component={Input}
                  secure
                  disabled={this.props.loading}
                />
                <TouchableOpacity onPress={handleSubmit(this.handleLoginPressed)}>
                  <View>
                    <Button text='Log In' />
                  </View>
                </TouchableOpacity>
                {this.renderSplitter()}
                {this.renderCreateAccount()}
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
  errorStyle: {
    paddingTop: 12,
    color: '#ff0033',
    justifyContent: 'center',
  }
};

const mapStateToProps = state => {
  const { loading } = state.auth;

  return {
    loading
  };
};

LoginPage = reduxForm({
  form: 'loginForm'
})(LoginPage);

export default connect(
  mapStateToProps,
  {
    registerUser,
    loginUser
  }
)(LoginPage);
