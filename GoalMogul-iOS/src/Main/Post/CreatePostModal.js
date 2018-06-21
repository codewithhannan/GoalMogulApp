import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';
import R from 'ramda';

/* Components */
import ModalHeader from '../Common/Header/ModalHeader';
import Button from '../Goal/Button';
import InputField from '../Common/TextInput/InputField';
import ViewableSettingMenu from '../Goal/ViewableSettingMenu';

// assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';
import plus from '../../asset/utils/plus.png';
import cancel from '../../asset/utils/cancel_no_background.png';
import camera from '../../asset/utils/camera.png';
import cameraRoll from '../../asset/utils/cameraRoll.png';
import photoIcon from '../../asset/utils/photoIcon.png';
import expand from '../../asset/utils/expand.png';


// Actions
import { openCameraRoll, openCamera } from '../../actions';

const STEP_PLACE_HOLDER = 'Add an important step to achieving your goal...';
const NEED_PLACE_HOLDER = 'Something you\'re specifically looking for help with';
const { width } = Dimensions.get('window');

class CreatePostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaModal: false
    };
  }

  componentDidMount() {
    this.initializeForm();
  }

  initializeForm() {
    const values = [{}];

    this.props.initialize({
      steps: [...values],
      needs: [...values],
      viewableSetting: 'Friends',
      media: undefined
    });
  }

  handleOpenCamera = () => {
    this.props.openCamera((result) => {
      this.props.change('media', result.uri);
    });
  }

  handleOpenCameraRoll = () => {
    this.props.openCameraRoll((result) => {
      this.props.change('media', result.uri);
    });
  }

  renderInput = ({
    input: { onChange, onFocus, value, ...restInput },
    multiline,
    editable,
    numberOfLines,
    placeholder,
    style,
    iconSource,
    iconStyle,
    iconOnPress,
    meta: { touched, error },
    ...custom
  }) => {
    const icon = iconSource ?
      <Image source={iconSource} style={{ ...iconStyle }} />
      :
      '';
    return (
      <View style={styles.inputContainerStyle}>
        <TextInput
          ref={input => { this.textInput = input; }}
          title={custom.title}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={onChange}
          numberOfLines={1 || numberOfLines}
          returnKeyType='done'
          multiline={multiline}
          onFocus={onFocus}
          editable={editable}
          placeholder={placeholder}
          style={style}
          value={_.isEmpty(value) ? '' : value}
          {...restInput}
          {...custom}
        />
        <TouchableOpacity
          style={{ padding: 15, alignItems: 'flex-end', alignSelf: 'center' }}
          onPress={iconOnPress}
        >
          {icon}
        </TouchableOpacity>
      </View>
    );
  };

  renderUserInfo() {
    let imageUrl = this.props.user.profile.image;
    let profileImage = (
      <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />
    );
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }

    const callback = R.curry((value) => this.props.change('viewableSetting', value));

    return (
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        {profileImage}
        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            Jordan Gardener
          </Text>
          <ViewableSettingMenu
            viewableSetting={this.props.viewableSetting}
            callback={callback}
            shareToMastermind={null}
          />
        </View>
      </View>
    );
  }

  // Current media type is only picture
  renderMedia() {
    if (this.props.media) {
      return (
        <ImageBackground
          style={styles.mediaStyle}
          source={{ uri: this.props.media }}
          imageStyle={{ borderRadius: 8, opacity: 0.7, resizeMode: 'stretch' }}
        >
          <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
            <Image
              source={photoIcon}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                height: 40,
                width: 50,
                tintColor: '#fafafa'
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.setState({ mediaModal: true })}
            style={{ position: 'absolute', top: 10, right: 15 }}
          >
            <Image
              source={expand}
              style={{ width: 15, height: 15, tintColor: '#fafafa' }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.change('media', false)}
            style={{ position: 'absolute', top: 10, left: 15 }}
          >
            <Image
              source={cancel}
              style={{ width: 15, height: 15, tintColor: '#fafafa' }}
            />
          </TouchableOpacity>
        </ImageBackground>
      );
    }
    return '';
  }

  renderImageModal() {
    if (this.props.media) {
      return (
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.mediaModal}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black'
            }}
          >
            <TouchableOpacity
              onPress={() => { this.setState({ mediaModal: false }); }}
              style={{ position: 'absolute', top: 30, left: 15, padding: 10 }}
            >
              <Image
                source={cancel}
                style={{
                  ...styles.cancelIconStyle,
                  tintColor: 'white'
                }}
              />
            </TouchableOpacity>
            <Image
              source={{ uri: this.props.media }}
              style={{ width, height: 200 }}
              resizeMode='cover'
            />
          </View>
        </Modal>
      );
    }
    return '';
  }

  renderPost() {
    const titleText = <Text style={styles.titleTextStyle}>Your Goal</Text>;
    return (
      <View style={{ marginTop: 15 }}>
        {titleText}
        <Field
          name='goal'
          label='goal'
          component={InputField}
          editable={this.props.uploading}
          numberOfLines={4}
          style={styles.goalInputStyle}
          placeholder='What are you trying to achieve?'
        />
      </View>
    );
  }

  renderActionIcons() {
    const actionIconStyle = { ...styles.actionIconStyle };
    const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle };
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity style={actionIconWrapperStyle} onPress={this.handleOpenCamera}>
          <Image style={actionIconStyle} source={camera} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...actionIconWrapperStyle, marginLeft: 5 }}
          onPress={this.handleOpenCameraRoll}
        >
          <Image style={actionIconStyle} source={cameraRoll} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { handleSubmit, errors } = this.props;
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <ModalHeader title='New Goal' actionText='Create' />
        <ScrollView style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderUserInfo()}
            {this.renderMedia()}
            {this.renderPost()}
            {this.renderActionIcons()}
          </View>

        </ScrollView>
        {this.renderImageModal()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  inputContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  titleTextStyle: {
    fontSize: 13,
    color: '#a1a1a1',
    padding: 2
  },
  standardInputStyle: {
    flex: 1,
    fontSize: 12,
    padding: 13,
    paddingRight: 14,
    paddingLeft: 14
  },
  goalInputStyle: {
    fontSize: 20,
    padding: 30,
    paddingRight: 20,
    paddingLeft: 20
  },
  cancelIconStyle: {
    height: 13,
    width: 13,
    justifyContent: 'flex-end'
  },
  mediaStyle: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionIconWrapperStyle: {
    backgroundColor: '#fafafa',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  actionIconStyle: {
    tintColor: '#4a4a4a',
    height: 15,
    width: 18
  }
};

CreatePostModal = reduxForm({
  form: 'createPoalModal',
  enableReinitialize: true
})(CreatePostModal);

const mapStateToProps = state => {
  const selector = formValueSelector('createPoalModal');
  const { user } = state.user;
  const { profile } = user;

  return {
    user,
    profile,
    viewableSetting: selector(state, 'viewableSetting'),
    media: selector(state, 'media'),
  };
};

export default connect(
  mapStateToProps,
  {
    openCameraRoll,
    openCamera
  }
)(CreatePostModal);
