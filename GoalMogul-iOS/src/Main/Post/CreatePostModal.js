import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TextInput,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

/* Components */
import ModalHeader from '../Common/Header/ModalHeader';
import Button from '../Goal/Button';
import InputField from '../Common/TextInput/InputField';

// assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';
import plus from '../../asset/utils/plus.png';
import cancel from '../../asset/utils/cancel_no_background.png';


// Actions
import { } from '../../actions';

const STEP_PLACE_HOLDER = 'Add an important step to achieving your goal...';
const NEED_PLACE_HOLDER = 'Something you\'re specifically looking for help with';

class CreatePostModal extends Component {

  componentDidMount() {
    this.initializeForm();
  }

  initializeForm() {
    const values = [{}];

    this.props.initialize({
      steps: [...values],
      needs: [...values]
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
    let profileImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    return (
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        {profileImage}
        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
          <Text style={{ fontSize: 18 }}>
            Jordan Gardener
          </Text>
        </View>
      </View>
    );
  }

  renderPost() {
    const titleText = <Text style={styles.titleTextStyle}>Your Goal</Text>;
    return (
      <View>
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
            {this.renderPost()}
          </View>

        </ScrollView>
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
  }
};

CreatePostModal = reduxForm({
  form: 'createPoalModal',
  enableReinitialize: true
})(CreatePostModal);

const mapStateToProps = state => {
  const { user } = state.user;
  const { profile } = user;

  return {
    user,
    profile
  };
};

export default connect(
  mapStateToProps,
  null
)(CreatePostModal);
