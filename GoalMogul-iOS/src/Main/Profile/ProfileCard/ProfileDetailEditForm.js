import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActionSheetIOS,
  Dimensions,
  SafeAreaView,
  Keyboard
} from 'react-native';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DotIndicator } from 'react-native-indicators';

/* Component */
import FormHeader from '../../Common/Header/FormHeader';
import LoadingModal from '../../Common/Modal/LoadingModal';

/* Asset */
import editImage from '../../../asset/utils/edit.png';
import profilePic from '../../../asset/utils/defaultUserProfile.png';

/* Actions */
import { submitUpdatingProfile, openCamera, openCameraRoll } from '../../../actions';

// Selectors
import {
  getUserDataByPageId,
  getUserData
} from '../../../redux/modules/User/Selector';

/** Constants */
import { IMAGE_BASE_URL } from '../../../Utils/Constants';

const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel'];
const TAKING_PICTURE_INDEX = 0;
const CAMERA_ROLL_INDEX = 1;
const CANCEL_INDEX = 2;

const { width, height } = Dimensions.get('window');
const DEBUG_KEY = '[ UI ProfileDetailEditForm ]';

class ProfileDetailEditForm extends Component {

  updateRef(name, ref) {
    this[name] = ref;
  }

  submit = values => {
    const hasImageModified = JSON.stringify(this.props.initialValues.profile.image) !==
      JSON.stringify(values.profile.image);
    this.props.submitUpdatingProfile({ values, hasImageModified }, this.props.pageId);
  };

  _scrollToInput (reactNode) {
  // Add a 'scroll' ref to your ScrollView
  this.scrollview.props.scrollToFocusedInput(reactNode)
}

  handleOnFocus = (position) => {
    console.log('on focus');
    this.refs.scrollview.scrollTo({ x: 0, y: position, animated: true });
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
            imageStyle={{ borderRadius: 13, opacity: 0.5, resizeMode: 'cover' }}
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
        image = `${IMAGE_BASE_URL}${value}`;
      }
      profileImage = (
        <View style={styles.imageContainerStyle}>
          <View style={styles.imageWrapperStyle}>
            <ImageBackground
              style={styles.imageStyle}
              source={{ uri: image }}
              imageStyle={{ borderRadius: 13, opacity: 0.6, resizeMode: 'cover' }}
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
      <View style={{ width: '100%' }}>
        <TouchableOpacity activeOpacity={0.6} onPress={this.chooseImage}>
          <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
            {profileImage}
          </View>
        </TouchableOpacity>
      </View>
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
    onNextPress,
    autoCorrect,
    meta: { error },
    returnKeyType,
    ...custom
  }) => {
    return (
      <View style={styles.inputContainerStyle}>
        <TextField
          label={label}
          title={custom.title}
          autoCapitalize={'none'}
          autoCorrect={autoCorrect || true}
          onChangeText={onChange}
          error={error}
          enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
          returnKeyType={returnKeyType || 'done'}
          secureTextEntry={secure}
          characterRestriction={limitation}
          multiline={multiline}
          clearButtonMode={clearButtonMode}
          onFocus={forFocus}
          disabled={disabled}
          onKeyPress={(key) => {
            if (key === 'next' && onNextPress) {
              onNextPress();
            }
          }}
          {...custom}
          {...restInput}
        />
      </View>
    );
  };

  render() {
    const { headline, about, elevatorPitch, handleSubmit, uploading } = this.props;
    const isValidValues = validValues({ headline, about, elevatorPitch });

    return (
      <SafeAreaView
        forceInset={{ bottom: 'always' }}
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <LoadingModal 
          visible={this.props.uploading} 
          customIndicator={<DotIndicator size={12} color='white' />}  
        />
        <FormHeader
          title='Profile'
          onSubmit={handleSubmit(this.submit)}
          actionDisabled={!isValidValues || uploading}
        />
        <KeyboardAwareScrollView
          innerRef={ref => {this.scrollview = ref}}
          style={styles.scroll}
          extraScrollHeight={13}
          contentContainerStyle={{
            backgroundColor: 'white',
            flexGrow: 1 // this will fix scrollview scroll issue by passing parent view width and height to it
          }}
        >
          <Field name='profile.image' label='Profile Picture' component={this.renderImage.bind(this)} />
          <Field
            name='name'
            label='Name'
            component={this.renderInput}
            disabled={uploading}
            autoCorrect
          />
          <Field
            ref='headline'
            name='headline'
            label='Headline'
            component={this.renderInput}
            limitation={42}
            disabled={uploading}
            returnKeyType='next'
            onNextPress={() => {
              this.refs['occupation'].getRenderedComponent().focus();
              // this._scrollToInput(findNodeHandle(this._occupation));
            }}
            autoCorrect
          />
          <Field
            ref='occupation'
            name='profile.occupation'
            label='Occupation'
            component={this.renderInput}
            disabled={uploading}
            autoCorrect
          />
          <Field
            name='profile.elevatorPitch'
            label='Elevator Pitch'
            component={this.renderInput}
            disabled={uploading}
            limitation={250}
            multiline
            clearButtonMode='while-editing'
            autoCorrect
          />
          {/*  forFocus={() => this.handleOnFocus(150)} */}
          <Field
            name='profile.about'
            label='About'
            component={this.renderInput}
            limitation={250}
            disabled={uploading}
            multiline
            autoCorrect
          />
        {/*   forFocus={() => this.handleOnFocus(200)} */}


        </KeyboardAwareScrollView>
      </SafeAreaView>
    );

    // This is the original implementation without using KeyboardAwareScrollView
    // return (
    //   <KeyboardAvoidingView
    //     behavior='padding'
    //     style={{ flex: 1, backgroundColor: '#ffffff' }}
    //   >
    //     <FormHeader
    //       title='Profile'
    //       onSubmit={handleSubmit(this.submit)}
    //     />
    //     <ScrollView
    //       ref='scrollview'
    //       style={styles.scroll}
    //       keyboardShouldPersistTaps='handled'
    //       contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }}
    //     >
    //       <Field name='profile.image' label='Profile Picture' component={this.renderImage} />
    //       <Field
    //         name='name'
    //         label='Name'
    //         component={this.renderInput}
    //         disabled={this.props.uploading}
    //         autoCorrect
    //       />
    //       <Field
    //         name='headline'
    //         label='Headline'
    //         component={this.renderInput}
    //         disabled={this.props.uploading}
    //         autoCorrect
    //       />
    //       <Field
    //         name='profile.occupation'
    //         label='Occupation'
    //         component={this.renderInput}
    //         disabled={this.props.uploading}
    //         autoCorrect
    //       />
    //       <Field
    //         name='profile.elevatorPitch'
    //         label='Elevator Pitch'
    //         component={this.renderInput}
    //         disabled={this.props.uploading}
    //         limitation={250}
    //         multiline
    //         clearButtonMode='while-editing'
    //         forFocus={() => this.handleOnFocus(150)}
    //         autoCorrect
    //       />
    //       <Field
    //         name='profile.about'
    //         label='About'
    //         component={this.renderInput}
    //         limitation={250}
    //         disabled={this.props.uploading}
    //         multiline
    //         forFocus={() => this.handleOnFocus(200)}
    //         autoCorrect
    //       />
    //     </ScrollView>
    //   </KeyboardAvoidingView>
    // );
  }
}

/**
 * Validate critical form values
 * @param {*} headline 
 * @param {*} about 
 * @param {*} elevatorPitch 
 */
const validValues = ({ headline, about, elevatorPitch }) => {
  if (headline && headline.length > 42) {
    return false;
  }

  if (about && about.length > 250) {
    return false;
  }

  if (elevatorPitch && elevatorPitch.length > 250) {
    return false;
  }

  return true;
};

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
    width: (width * 0.9) / 3,
    height: (width * 0.9) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  imageWrapperStyle: {
    alignItems: 'center',
    borderRadius: 13,
    backgroundColor: 'black'
  },
  imageContainerStyle: {
    marginTop: 30,
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: 'white',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1.2 },
    shadowOpacity: 0.7,
    shadowRadius: 1.2,
    elevation: 1,
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
    borderRadius: 10,
    tintColor: 'white'
  }
};

ProfileDetailEditForm = reduxForm({
  form: 'profileDetailEditForm',
  enableReinitialize: true
})(ProfileDetailEditForm);

const mapStateToProps = (state, props) => {
  const { userId, pageId } = props;

  const selector = formValueSelector('profileDetailEditForm');

  const uploading = getUserDataByPageId(state, userId, pageId, 'uploading');
  const user = getUserData(state, userId, 'user');

  return {
    // uploading: state.profile.uploading,
    // initialValues: state.profile.user // This is before reducer redesign way
    uploading,
    initialValues: user,
    headline: selector(state, 'headline'),
    elevatorPitch: selector(state, 'profile.elevatorPitch'),
    about: selector(state, 'profile.about')
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
