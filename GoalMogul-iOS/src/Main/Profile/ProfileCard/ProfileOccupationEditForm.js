import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'react-native-material-textfield';

/* Component */
import FormHeader from '../../Common/Header/FormHeader';

class ProfileOccupationEditForm extends Component {

  onFieldSubmit = fieldType => {
    // TODO: link to onFocus for next field
  }

  submit = values => {
    console.log('submitting form: ');
  };

  renderInput = ({
    input: { onChange, ...restInput },
    label,
    meta: { touched, error },
    ...custom
  }) => {
    return (
      <TextField
        label={label}
        autoCapitalize={'none'}
        autoCorrect={false}
        string={restInput}
        onChangeText={onChange}
        keyboardType='email-address'
        error={error}
        enablesReturnKeyAutomatically
        returnKeyType='next'
        characterRestriction={50}
        {...custom}
      />
    );
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }} >
        <FormHeader title='Occupation' onSubmit={handleSubmit(this.submit)} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.inputContainerStyle}>
            <Field name='occupation' label='occupation' component={this.renderInput} />
          </View>
          <View style={styles.inputContainerStyle}>
            <Field name='elevator pitch' label='elevator pitch' component={this.renderInput} />
          </View>
        </ScrollView>
      </View>
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
    paddingTop: 10
  },
  inputContainerStyle: {
    paddingLeft: 15,
    paddingRight: 15
  }
};

export default reduxForm({
  form: 'profileOccupationEditForm'
})(ProfileOccupationEditForm);
