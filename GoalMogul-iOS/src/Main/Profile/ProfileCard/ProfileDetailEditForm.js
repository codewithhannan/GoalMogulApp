import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ImagePickerIOS
} from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';

/* Component */
import FormHeader from '../../Common/Header/FormHeader';

/* Asset */
import editImage from '../../../asset/utils/edit.png';

/* Actions */
import { submitUpdatingProfile } from '../../../actions';

/* Asset to delete */
import profilePic from '../../../asset/test-profile-pic.png';

class ProfileDetailEditForm extends Component {

  updateRef(name, ref) {
    this[name] = ref;
  }

  submit = values => {
    const hasImageModified = JSON.stringify(this.props.initialValues.profile.image) !==
      JSON.stringify(values.profile.image);
    this.props.submitUpdatingProfile({ values, hasImageModified });
  };

  chooseImage = () => {
    ImagePickerIOS.canUseCamera(() => {
      ImagePickerIOS.openSelectDialog({}, imageUri => {
        this.props.change('profile.image', imageUri);
      }, () => {
        console.log('user cancel choosing from camera roll');
      });
    });
  }

  renderImage = ({
    input: { value },
    // meta: { error },
  }) => {
    const hasImageModified = JSON.stringify(this.props.initialValues.profile.image) !==
      JSON.stringify(value);

    let profileImage = <Image style={styles.imageStyle} source={profilePic} />;
    if (value) {
      let image;
      if (hasImageModified) {
        image = value;
      } else {
        image = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${value}`;
      }
      profileImage = <Image style={styles.imageStyle} source={{ uri: image }} />;
    }

    return (
      <TouchableOpacity onPress={this.chooseImage}>
        <View style={{ alignSelf: 'center' }}>
          {profileImage}
          <View style={styles.iconContainerStyle}>
            <Image style={styles.editIconStyle} source={editImage} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // TODO: convert this to an independent component
  renderInput = ({
    input: { onChange, ...restInput },
    label,
    secure,
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
          secureTextEntry={secure}
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
        <FormHeader
          title='Profile'
          onSubmit={handleSubmit(this.submit)}
        />
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }}
        >
          <Field name='profile.image' label='profile picture' component={this.renderImage} />
          <Field name='name' label='Name' component={this.renderInput} title='this is test' />
          <Field name='email' label='Email' component={this.renderInput} />
          <Field
            name='oldPassword'
            label='Enter old passwordd'
            component={this.renderInput}
            secure
          />
          <Field
            name='newPassword'
            label='Enter new password'
            component={this.renderInput}
            secure
          />
          <Field name='headline' label='Headline' component={this.renderInput} />
          <Field name='profile.about' label='About' component={this.renderInput} />
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
  iconContainerStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 3
  },
  editIconStyle: {
    width: 20,
    height: 20,
    borderRadius: 10
  }
};

ProfileDetailEditForm = reduxForm({
  form: 'profileDetailEditForm',
  enableReinitialize: true
})(ProfileDetailEditForm);

const mapStateToProps = state => {
  return {
    initialValues: state.profile.user
  };
};

export default connect(
  mapStateToProps,
  { submitUpdatingProfile }
)(ProfileDetailEditForm);
