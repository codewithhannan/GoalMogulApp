import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'react-native-material-textfield';

/* Components */
import SearchBarHeader from '../../Common/SearchBarHeader';
import Button from '../Button';

/* Styles */
import Styles from '../Styles';

/* Actions */
/* TODO: update actions needed */
import { onUpdatePhoneNumberSubmit } from '../../../actions';

class AddPhoneNumberForm extends Component {

  handleOnAddPress = values => {
    // TODO: validate phone number
    // update actions imported and used in connect()
    console.log('phone number is: ', values);
    return this.props.onUpdatePhoneNumberSubmit(values);
  }

  renderInput = ({
    input: { onChange, ...restInput },
    label,
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
          enablesReturnKeyAutomatically={false}
          returnKeyType='done'
          keyboardType='phone-pad'
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
        style={{ flex: 1 }}
      >
        <SearchBarHeader backButton rightIcon='empty' title="Phone numbers" />
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }}
        >

          <View style={Styles.titleSectionStyle}>
            <Text style={Styles.titleTextStyle}>
              Add a new phone number
            </Text>
            <Text style={{ paddingBottom: 10 }}>
              We'll send a verification code to this number.
              You'll need it for the next step.
            </Text>
          </View>

          <Field name='phone' label='Phone number' component={this.renderInput} />

          <TouchableOpacity onPress={handleSubmit(this.handleOnAddPress)}>
            <Button text="Add" />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  contentContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  inputContainerStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
  }
};

const mapStateToProps = state => {
  const { user } = state.profile;
  const { email } = user;

  return {
    email
  };
};

AddPhoneNumberForm = reduxForm({
  form: 'addPhoneNumberForm',
  enableReinitialize: true
})(AddPhoneNumberForm);

export default connect(
  mapStateToProps,
  { onUpdatePhoneNumberSubmit }
)(AddPhoneNumberForm);
