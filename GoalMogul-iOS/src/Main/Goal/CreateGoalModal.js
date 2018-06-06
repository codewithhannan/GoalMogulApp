import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TextInput,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { FieldArray, Field, reduxForm } from 'redux-form';

/* Components */
import ModalHeader from '../Common/Header/ModalHeader';
import Button from './Button';

// assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';
import plus from '../../asset/utils/plus.png';
import cancel_no_background from '../../asset/utils/cancel_no_background.png';


// Actions
import { } from '../../actions';

class CreateGoalModal extends Component {

  renderInput = ({
    input: { onChange, onFocus, ...restInput },
    multiline,
    editable,
    numberOfLines,
    placeholder,
    style,
    meta: { touched, error },
    ...custom
  }) => {
    console.log('custom areL ', restInput);
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
          onFocus={onFocus}
          editable={editable}
          placeholder={placeholder}
          style={style}
          {...restInput}
          {...custom}
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

  renderGoal() {
    const titleText = <Text style={styles.titleTextStyle}>Your Goal</Text>;
    return (
      <View>
        {titleText}
        <Field
          name='goal'
          label='goal'
          component={this.renderInput}
          editable={this.props.uploading}
          numberOfLines={4}
          style={styles.goalInputStyle}
          placeholder='What are you trying to achieve?'
        />
      </View>
    );
  }

  renderGoalDescription = ({ fields, meta: { error, submitFailed } }) => {
    const button = fields.length > 0 ?
      <Button text='remove description' source={cancel_no_background} onPress={() => fields.remove(0)} />
      :
      <Button text='detailed description' source={plus} onPress={() => fields.push({})} />;
    return (
      <View style={{ marginTop: 10 }}>
        {
          fields.map((description, index) => {
            return (
              <Field
                name={`description.${index}`}
                component={this.renderInput}
                editable
                numberOfLines={4}
                style={styles.standardInputStyle}
              />
            );
          })
        }
        {button}
      </View>
    );
  }

  renderCategory() {

  }

  renderSteps = ({ fields, meta: { error, submitFailed } }) => {
    const button = fields.length > 0 ?
      <Button text='remove step' source={cancel_no_background} onPress={() => fields.remove(0)} />
      :
      <Button text='step' source={plus} onPress={() => fields.push({})} />;
    return (
      <View style={{ marginTop: 10 }}>
        <Field
          name='step.0'
          component={this.renderInput}
          editable
          numberOfLines={4}
          style={styles.standardInputStyle}
          placeholder='Add an important step to achieving your goal...'
        />
        {
          fields.map((description, index) => {
            return (
              <Field
                name={`step.${index + 1}`}
                component={this.renderInput}
                editable
                numberOfLines={4}
                style={styles.standardInputStyle}
              />
            );
          })
        }
        {button}
      </View>
    );
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
        <ScrollView style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderUserInfo()}
            {this.renderGoal()}
            <FieldArray name="description" component={this.renderGoalDescription} />
            {this.renderCategory()}
            <FieldArray name="steps" component={this.renderSteps} />
            {this.renderNeeds()}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  inputContainerStyle: {
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
    fontSize: 15,
    padding: 15,
    paddingRight: 18,
    paddingLeft: 18
  },
  goalInputStyle: {
    fontSize: 20,
    padding: 30,
    paddingRight: 20,
    paddingLeft: 20
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
