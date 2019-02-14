import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { CheckBox } from 'react-native-elements';
import {
  Field,
  reduxForm,
  formValueSelector,
  SubmissionError
} from 'redux-form';
import R from 'ramda';
import {
  MenuProvider,
} from 'react-native-popup-menu';

// Components
import ModalHeader from '../Common/Header/ModalHeader';
import ImageModal from '../Common/ImageModal';

// Actions
import {
  cancelCreateOrUpdateChatroom,
  createOrUpdateChatroom,
  chatroomToFormAdapter
} from '../../redux/modules/chat/CreateChatroomActions';
import { openCameraRoll, openCamera } from '../../actions';

// assets
import cancel from '../../asset/utils/cancel_no_background.png';
import camera from '../../asset/utils/camera.png';
import cameraRoll from '../../asset/utils/cameraRoll.png';
import imageOverlay from '../../asset/utils/imageOverlay.png';
import expand from '../../asset/utils/expand.png';


class CreateChatroomModal extends React.Component {
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
    const defaulVals = {
      name: undefined,
      membersCanInvite: false,
      isPubliclyVisible: false,
      membershipLimit: undefined,
      description: '',
      picture: undefined,
    };

    // Initialize based on the props, if it's opened through edit button
    const { initializeFromState, chat } = this.props;
    const initialVals = initializeFromState
      ? { ...chatroomToFormAdapter(chat) }
      : { ...defaulVals };

    this.props.initialize({
      // ...initialVals
      ...initialVals
    });
  }

  handleSubmit = values => {
    const { initializeFromState, chat, picture } = this.props;
    const chatId = chat ? chat._id : undefined;
    const needUpload =
      (initializeFromState && chat.picture && chat.picture !== picture)
      || (!initializeFromState && picture);

    this.props.createOrUpdateChatroom(
      this.props.formVals.values,
      needUpload,
      initializeFromState, // isEdit
      chatId // chatId
    );
  }

  handleOpenCamera = () => {
    this.props.openCamera((result) => {
      this.props.change('picture', result.uri);
    });
  }

  handleOpenCameraRoll = () => {
    const callback = R.curry((result) => {
      this.props.change('picture', result.uri);
    });
    this.props.openCameraRoll(callback);
  }

  renderInput = ({
    input: { onChange, onFocus, value, ...restInput },
    editable,
    numberOfLines,
    meta: { touched, error },
    placeholder,
    keyboardType,
    ...custom
  }) => {
    const inputStyle = {
      ...styles.inputStyle,
    };

    let multiline = true;
    if (numberOfLines && numberOfLines === 1) {
      multiline = false;
    }
    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 0.5,
          margin: 5,
          borderColor: 'lightgray'
        }}
      >
        <TextInput
          placeholder={placeholder}
          onChangeText={onChange}
          style={inputStyle}
          editable={editable}
          maxHeight={150}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          value={value}
        />
      </SafeAreaView>
    );
  }

  renderActionIcons() {
    const actionIconStyle = { ...styles.actionIconStyle };
    const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle };
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
        <TouchableOpacity activeOpacity={0.85} style={actionIconWrapperStyle} onPress={this.handleOpenCamera}>
          <Image style={actionIconStyle} source={camera} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85}
          style={{ ...actionIconWrapperStyle, marginLeft: 5 }}
          onPress={this.handleOpenCameraRoll}
        >
          <Image style={actionIconStyle} source={cameraRoll} />
        </TouchableOpacity>
      </View>
    );
  }

  // Current media type is only picture
  renderMedia() {
    const { initializeFromState, chat, picture } = this.props;
    let imageUrl = picture;
    if (initializeFromState && picture) {
      const hasImageModified = chat.picture && chat.picture !== picture;
      if (!hasImageModified) {
        // If editing a tribe and image hasn't changed, then image source should
        // be from server
        imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${picture}`;
      }
    }

    if (this.props.picture) {
      return (
        <View style={{ backgroundColor: 'gray' }}>
          <ImageBackground
            style={styles.mediaStyle}
            source={{ uri: imageUrl }}
            imageStyle={{ borderRadius: 8, opacity: 0.7, resizeMode: 'cover' }}
          >
            <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
              <Image
                source={imageOverlay}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 50,
                  tintColor: '#fafafa'
                }}
              />
            </View>

            <TouchableOpacity activeOpacity={0.85}
              onPress={() => this.setState({ mediaModal: true })}
              style={{
                position: 'absolute',
                top: 10,
                right: 15,
                width: 24,
                height: 24,
                borderRadius: 12,
                padding: 2,
                backgroundColor: 'rgba(0,0,0,0.3)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                source={expand}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: '#fafafa',
                  borderRadius: 4,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85}
              onPress={() => this.props.change('picture', false)}
              style={{
                position: 'absolute',
                top: 10,
                left: 15,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: 'rgba(0,0,0,0.3)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                source={cancel}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: '#fafafa',
                  borderRadius: 8,
                  padding: 2
                }}
              />
            </TouchableOpacity>
          </ImageBackground>
          {this.renderImageModal(imageUrl)}
        </View>
      );
    }
    return '';
  }

  renderImageModal(imageUrl) {
    return (
      <ImageModal 
        mediaRef={imageUrl}
        mediaModal={this.state.mediaModal}
        closeModal={() => this.setState({ mediaModal: false })}
      />
    );
  }

  renderChatroomName() {
    const titleText = <Text style={styles.titleTextStyle}>Chatroom Name</Text>;
    return (
      <View style={{ marginBottom: 5 }}>
        {titleText}
        <Field
          name='name'
          label='name'
          component={this.renderInput}
          editable={!this.props.uploading}
          numberOfLines={1}
          multiline
          style={styles.goalInputStyle}
          placeholder='Enter the name...'
        />
      </View>
    );
  }

  renderTribeMemberLimit() {
    const titleText = <Text style={styles.titleTextStyle}>Member Limit (Optional)</Text>;
    return (
      <View style={{ marginBottom: 5 }}>
        {titleText}
        <Field
          name='membershipLimit'
          label='membershipLimit'
          component={this.renderInput}
          editable={!this.props.uploading}
          numberOfLines={1}
          keyboardType='number-pad'
          style={styles.goalInputStyle}
          placeholder='Enter a number...'
        />
      </View>
    );
  }

  renderTribeDescription() {
    const titleText = <Text style={styles.titleTextStyle}>Description</Text>;
    return (
      <View style={{ marginBottom: 5 }}>
        {titleText}
        <Field
          name='description'
          label='description'
          component={this.renderInput}
          editable={!this.props.uploading}
          numberOfLines={5}
          style={styles.goalInputStyle}
          placeholder='Describe your tribe...'
        />
      </View>
    );
  }

  renderOptions() {
    return (
      <View>
        <CheckBox
          title='Members can invite new members'
          checked={this.props.membersCanInvite}
          onPress={() => this.props.change('membersCanInvite', !this.props.membersCanInvite)}
        />
        <CheckBox
          title='Publicly visible'
          checked={this.props.isPubliclyVisible}
          onPress={() => this.props.change('isPubliclyVisible', !this.props.isPubliclyVisible)}
        />
      </View>
    );
  }

  // Render field to select an image for tribe
  renderImageSelection() {
    const titleText = <Text style={styles.titleTextStyle}>Select a photo</Text>;
    return (
      <View style={{ marginTop: 4 }}>
        {titleText}
        {this.renderMedia()}
        {this.renderActionIcons()}
      </View>
    );
  }

  render() {
    const { handleSubmit, errors } = this.props;
    const actionText = this.props.initializeFromState ? 'Update' : 'Create';
    const titleText = this.props.initializeFromState ? 'Edit Chatroom' : 'New Chatroom';

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1, backgroundColor: '#ffffff' }}
        >
          <ModalHeader
            title={titleText}
            actionText={actionText}
            onCancel={() => this.props.cancelCreateOrUpdateChatroom()}
            onAction={handleSubmit(this.handleSubmit)}
          />
          <ScrollView
            style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
          >
            <View style={{ flex: 1, padding: 20 }}>
              {this.renderTribeName()}
              {this.renderTribeDescription()}
              {this.renderTribeMemberLimit()}
              {this.renderOptions()}
              {this.renderImageSelection()}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </MenuProvider>
    );
  }
}

CreateChatroomModal = reduxForm({
  form: 'createChatroomModal',
  enableReinitialize: true
})(CreateChatroomModal);

const mapStateToProps = state => {
  const selector = formValueSelector('createChatroomModal');
  const { user } = state.user;
  const { uploading } = state.newTribe;

  return {
    user,
    name: selector(state, 'name'),
    membersCanInvite: selector(state, 'membersCanInvite'),
    isPubliclyVisible: selector(state, 'isPubliclyVisible'),
    membershipLimit: selector(state, 'membershipLimit'),
    description: selector(state, 'description'),
    picture: selector(state, 'picture'),
    formVals: state.form.CreateChatroomModal,
    uploading
  };
};

export default connect(
  mapStateToProps,
  {
    cancelCreateOrUpdateChatroom,
    createOrUpdateChatroom,
    openCameraRoll,
    openCamera
  }
)(CreateChatroomModal);

const styles = {
  sectionMargin: {
    marginTop: 20
  },
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
    fontSize: 11,
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
    padding: 20,
    paddingRight: 15,
    paddingLeft: 15
  },
  inputStyle: {
    paddingTop: 6,
    paddingBottom: 6,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 22,
  },
  cancelIconStyle: {
    height: 20,
    width: 20,
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
  },
  borderStyle: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  // Menu related style
  backdrop: {
    backgroundColor: 'transparent'
  }
};
