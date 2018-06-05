import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

/* Components */
import ModalHeader from '../Common/Header/ModalHeader';

// assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';

// Actions
import { } from '../../actions';

class CreateGoalModal extends Component {

  renderInput = ({
    input: { onChange, onFocus, ...restInput },
    multiline,
    editable,
    clearButtonMode,
    numberOfLines,
    placeholder,
    meta: { touched, error },
    ...custom
  }) => {
    // TODO: placeholderTextColor
    return (
      <View style={styles.inputContainerStyle}>
        <TextInput
          title={custom.title}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={onChange}
          numberOfLines={1 || numberOfLines}
          returnKeyType='done'
          multiline={multiline}
          clearButtonMode={clearButtonMode}
          onFocus={onFocus}
          editable={editable}
          placeholder={placeholder}
          {...custom}
          {...restInput}
        />
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
    return profileImage;
  }

  renderGoalDescription() {
    const titleText = <Text style={styles.titleTextStyle}>Your Goal</Text>;
    const field = (
      <Field
        name='description'
        component={this.renderInput}
        editable={this.props.uploading}
        numberOfLines={}
      />
    );
  }

  renderCategory() {

  }

  renderSteps() {

  }

  renderNeeds() {

  }

  render() {
    const { handleSubmit, errors } = this.props;
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <ModalHeader title='New Goal' actionText='Create' />
        <ScrollView>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderUserInfo()}
            {this.renderGoalDescription()}
            {this.renderCategory()}
            {this.renderSteps()}
            {this.renderNeeds()}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  inputContainerStyle: {
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 0.5
  }
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  titleTextStyle: {
    fontSize: 10,
    color: '#a1a1a1'
  }
};


CreateGoalModal = reduxForm({
  form: 'createGoalModal',
  enableReinitialize: true
})(CreateGoalModal);

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
)(CreateGoalModal);
