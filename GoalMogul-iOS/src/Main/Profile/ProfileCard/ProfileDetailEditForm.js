import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Dimensions
} from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';

/* Component */
import FormHeader from '../../Common/Header/FormHeader';

/* Asset */
import editImage from '../../../asset/utils/edit.png';
import profilePic from '../../../asset/utils/defaultUserProfile.png';

/* Actions */
import { submitUpdatingProfile, openCamera, openCameraRoll } from '../../../actions';

const BUTTONS = ['Taking Pictures', 'Camera Roll', 'Cancel'];
const TAKING_PICTURE_INDEX = 0;
const CAMERA_ROLL_INDEX = 1;
const CANCEL_INDEX = 2;

const { width, height } = Dimensions.get('window');

class ProfileDetailEditForm extends Component {

  updateRef(name, ref) {
    this[name] = ref;
  }

  submit = values => {
    const hasImageModified = JSON.stringify(this.props.initialValues.profile.image) !==
      JSON.stringify(values.profile.image);
    this.props.submitUpdatingProfile({ values, hasImageModified });
  };

  handleOnFocus = (position) => {
    console.log('on focus');
    this.refs.scrollview.scrollTo({ x: 0, y: position, animated: true })
  }

  chooseImage = async () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      console.log('button clicked', BUTTONS[buttonIndex]);
      switch (buttonIndex) {
        case TAKING_PICTURE_INDEX:
          this.props.openCamera((result) => {
            this.props.change('profile.image', result.uri);
          });
          break;
        case CAMERA_ROLL_INDEX:
          this.props.openCameraRoll((result) => {
            this.props.change('profile.image', result.uri);
          });
          break;
        default:
          return;
      }
    });
  }

  renderImage = ({
    input: { value },
    // meta: { error },
  }) => {
    const hasImageModified = JSON.stringify(this.props.initialValues.profile.image) !==
      JSON.stringify(value);

    let profileImage = (
      <View style={styles.imageContainerStyle}>
        <View style={styles.imageWrapperStyle}>
          <ImageBackground
            style={styles.imageStyle}
            source={profilePic}
            imageStyle={{ borderRadius: 13 }}
          >
            <View style={styles.iconContainerStyle}>
              <Image style={styles.editIconStyle} source={editImage} />
            </View>
          </ImageBackground>
        </View>
      </View>
    )
    if (value) {
      let image;
      if (hasImageModified) {
        image = value;
      } else {
        image = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${value}`;
      }
      profileImage = (
        <View style={styles.imageContainerStyle}>
          <View style={styles.imageWrapperStyle}>
            <ImageBackground
              style={styles.imageStyle}
              source={{ uri: image }}
              imageStyle={{ borderRadius: 13 }}
            >
              <View style={styles.iconContainerStyle}>
                <Image style={styles.editIconStyle} source={editImage} />
              </View>
            </ImageBackground>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={this.chooseImage}>
        <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
          {profileImage}
        </View>
      </TouchableOpacity>
    );
  }

  // TODO: convert this to an independent component
  renderInput = ({
    input: { onChange, onFocus, ...restInput },
    label,
    secure,
    limitation,
    multiline,
    disabled,
    clearButtonMode,
    enablesReturnKeyAutomatically,
    forFocus,
    meta: { error },
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
          enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
          returnKeyType='done'
          secureTextEntry={secure}
          characterRestriction={limitation}
          multiline={multiline}
          clearButtonMode={clearButtonMode}
          onFocus={forFocus}
          disabled={disabled}
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
          ref='scrollview'
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
            multiline
            clearButtonMode='while-editing'
            forFocus={() => this.handleOnFocus(150)}
          />
          <Field
            name='profile.about'
            label='About'
            component={this.renderInput}
            limitation={250}
            disabled={this.props.uploading}
            multiline
            forFocus={() => this.handleOnFocus(200)}
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
    opacity: 0.7,
    width: (width * 0.9) / 3,
    height: (width * 0.9) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  imageWrapperStyle: {
    alignItems: 'center',
    borderRadius: 14,
    borderColor: 'white',
    borderWidth: 1
  },
  imageContainerStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#646464',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    alignSelf: 'center',
    backgroundColor: 'white'
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
  {
    submitUpdatingProfile,
    openCamera,
    openCameraRoll
  }
)(ProfileDetailEditForm);
