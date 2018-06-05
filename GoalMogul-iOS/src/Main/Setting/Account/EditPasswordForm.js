import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import Input from '../../Common/Text/Input';

/* Styles */
import Styles from '../Styles';

/* Actions */
import { handleUpdatePassword } from '../../../actions';

/* TODO: abstract this validation fuction */
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;

const minLength8 = minLength(8);

const validate = values => {
  const errors = {};
  if (!values.oldPassword) {
    errors.oldPassword = 'Required';
  }
  if (!values.newPassword) {
    errors.newPassword = 'Required';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required';
  }

  return errors;
};

class EidtPasswordForm extends Component {

  handleOnSendPress = values => {
    Keyboard.dismiss();
    const errors = validate(values);
    if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
      console.log('submission error: ', errors);
      throw new SubmissionError(errors);
    }
    console.log('user tries to Reset password with values: ', values);
    // this.props.onResendEmailPress();
    return this.props.handleUpdatePassword(values);
  }

  renderPasswordForm() {
    return (
      <View>
        <Field name='oldPassword' label='Old password' component={Input} secure />
        <Field
          name='newPassword'
          label='New password'
          component={Input}
          validate={minLength8}
          secure
        />
        <Field
          name='confirmPassword'
          label='Confirm new password'
          component={Input}
          secure
        />
      </View>
    );
  }

  /* Refactor error function out */
  renderError(error) {
    return error ? (
      <View style={{ height: 15 }}>
        <Text style={styles.errorStyle}>{error}</Text>
      </View>
    ) : null;
  }

  renderButton(handleSubmit) {
    return (
      <TouchableOpacity onPress={handleSubmit(this.handleOnSendPress)}>
        <View style={Styles.buttonContainerStyle}>
          <Text style={Styles.buttonTextStyle}>Update</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderEmail() {
    if (this.props.email.address) {
      return (
        <Text style={Styles.detailTextStyle}>
          {this.props.email.address}
        </Text>
      );
    }
    return (
      <Text style={Styles.detailTextStyle}>
        andyzeng96@gmail.com
      </Text>
    );
  }

  render() {
    const { handleSubmit, error } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SearchBarHeader backButton rightIcon='empty' title="Password" />
        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1, backgroundColor: '#ffffff' }}
        >
          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }}
          >
            <View style={Styles.titleSectionStyle}>
              <Text style={Styles.titleTextStyle}>
                Update password
              </Text>
            </View>
            {this.renderError(error)}
            {this.renderPasswordForm()}
            {this.renderButton(handleSubmit)}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = {
  errorStyle: {
    marginTop: 15,
    color: '#ff0033',
    justifyContent: 'center',
    marginBottom: 4,
    alignSelf: 'center'
  }
};

const mapStateToProps = state => {
  const { email } = state.setting;

  return {
    email
  };
};

EidtPasswordForm = reduxForm({
  form: 'passwordEditForm',
})(EidtPasswordForm);

export default connect(
  mapStateToProps,
  {
    handleUpdatePassword
  }
)(EidtPasswordForm);
