import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';

/* Component */
import FormHeader from '../../Common/Header/FormHeader';

/* Asset */
import editImage from '../../../asset/utils/edit.png';

/* Asset to delete */
import profilePic from '../../../asset/test-profile-pic.png';

class ProfileDetailEditForm extends Component {

  onFieldSubmit = fieldType => {
    // TODO: link to onFocus for next field
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  submit = values => {
    console.log('submitting form: ');
  };

  renderImage = ({
    input: { onChange, ...restInput },
    label,
    meta: { touched, error },
    ...custom
  }) => {

  }

  renderInput = ({
    input: { onChange, value, ...restInput },
    label,
    meta: { touched, error },
    ...custom
  }) => {
    console.log('input is: ', value);
    return (
      <View style={styles.inputContainerStyle}>
        <TextField
          label={label}
          autoCapitalize={'none'}
          autoCorrect={false}
          string={value}
          onChangeText={onChange}
          error={error}
          enablesReturnKeyAutomatically={false}
          returnKeyType='done'
          {...custom}
        />
      </View>
    );
  };

  render() {

    console.log('inital value are : ', this.props.initialValues);
    const { handleSubmit } = this.props;

    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <FormHeader title='Profile' onSubmit={handleSubmit(this.submit)} />
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }}
        >
          <Field name='name' label='Name' component={this.renderInput} />
          <Field name='email' label='Email' component={this.renderInput} />
          <Field name='password' label='Password' component={this.renderInput} />
          <Field name='headline' label='Headline' component={this.renderInput} />
          <Field name='profile.occupation' label='Occupation' component={this.renderInput} />
          <Field name='profile.elevatorPitch' label='elevator pitch' component={this.renderInput} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  inputContainerStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5
  }
};

const mapStateToProps = state => {
  return { initialValues: state.profile.user };
};

export default (connect(mapStateToProps, null)(reduxForm({
  form: 'profileDetailEditForm',
  enableReinitialize: true
})(ProfileDetailEditForm)));
