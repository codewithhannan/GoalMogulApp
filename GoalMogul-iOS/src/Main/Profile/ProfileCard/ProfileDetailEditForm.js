import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
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

    let profileImage = (
      <ImageBackground style={styles.imageStyle} source={profilePic}>
        <View style={styles.iconContainerStyle}>
          <Image style={styles.editIconStyle} source={editImage} />
        </View>
      </ImageBackground>
    )
    if (value) {
      let image;
      if (hasImageModified) {
        image = value;
      } else {
        image = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${value}`;
      }
      profileImage =
        <ImageBackground style={styles.imageStyle} source={{ uri: image }} >
          <View style={styles.iconContainerStyle}>
            <Image style={styles.editIconStyle} source={editImage} />
          </View>
        </ImageBackground>;
    }

    return (
      <TouchableOpacity onPress={this.chooseImage}>
        <View style={{ alignSelf: 'center' }}>
          {profileImage}
        </View>
      </TouchableOpacity>
    );
  }

  // TODO: convert this to an independent component
  renderInput = ({
    input: { onChange, ...restInput },
    label,
    secure,
    limitation,
    multiline,
    disabled,
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
          characterRestriction={limitation}
          multiline={multiline}
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
          <Field name='profile.image' label='Profile Picture' component={this.renderImage} />
          <Field
            name='name'
            label='Name'
            component={this.renderInput}
            disabled={this.props.uploading}
          />
          <Field
            name='headline'
            label='Headline'
            component={this.renderInput}
            disabled={this.props.uploading}
          />
          <Field
            name='profile.occupation'
            label='Occupation'
            component={this.renderInput}
            disabled={this.props.uploading}
          />
          <Field
            name='profile.elevatorPitch'
            label='Elevator Pitch'
            component={this.renderInput}
            disabled={this.props.uploading}
            limitation={250}
          />
          <Field
            name='profile.about'
            label='About'
            component={this.renderInput}
            limitation={250}
            disabled={this.props.uploading}
            multiline
          />
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
    borderRadius: 5,
    marginTop: 10,
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainerStyle: {
    width: 32,
    height: 32,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  editIconStyle: {
    width: 28,
    height: 28,
    borderRadius: 10
  }
};

ProfileDetailEditForm = reduxForm({
  form: 'profileDetailEditForm',
  enableReinitialize: true
})(ProfileDetailEditForm);

const mapStateToProps = state => {
  return {
    uploading: state.profile.uploading,
    initialValues: state.profile.user
  };
};

export default connect(
  mapStateToProps,
  { submitUpdatingProfile }
)(ProfileDetailEditForm);
