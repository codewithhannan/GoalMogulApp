import React, { Component } from 'react';
import {
  View,
  Image,
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
    console.log('submitting form: ', values);
  };

  renderImage = ({
    input: { onChange, value, ...restInput },
    label,
    meta: { error },
    ...custom
  }) => {
    let profileImage = <Image style={styles.imageStyle} source={profilePic} />;
    if (value) {
      const image = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${value}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: image }} />;
    }

    return (
      <TouchableOpacity>
        <View style={{ alignSelf: 'center' }}>
          {profileImage}
          <Image style={styles.editIconStyle} source={editImage} />
        </View>
      </TouchableOpacity>
    );
  }

  renderInput = ({
    input: { onChange, ...restInput },
    label,
    meta: { touched, error },
    ...custom
  }) => {
    return (
      <View style={styles.inputContainerStyle}>
        <TextField
          label={label}
          title={custom.title}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={onChange}
          error={error}
          enablesReturnKeyAutomatically={false}
          returnKeyType='done'
          {...custom}
          {...restInput}
        />
      </View>
    );
  };

  render() {
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
          <Field name='profile.image' label='profile picture' component={this.renderImage} />
          <Field name='name' label='Name' component={this.renderInput} title='this is test' />
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
    marginBottom: 5,
  },
  imageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10
  },
  editIconStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  }
};

const mapStateToProps = state => {
  return { initialValues: state.profile.user };
};

export default (connect(mapStateToProps, null)(reduxForm({
  form: 'profileDetailEditForm',
  enableReinitialize: true
})(ProfileDetailEditForm)));
