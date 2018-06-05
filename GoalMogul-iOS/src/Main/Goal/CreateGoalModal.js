import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

/* Components */
import ModalHeader from '../Common/Header/ModalHeader';

// Actions
import { } from '../../actions';

class CreateGoalModal extends Component {

  renderUserInfo() {

  }

  renderGoalDescription() {

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
          {this.renderUserInfo()}
          {this.renderGoalDescription()}
          {this.renderCategory()}
          {this.renderSteps()}
          {this.renderNeeds()}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  
};


CreateGoalModal = reduxForm({
  form: 'createGoalModal',
  enableReinitialize: true
})(CreateGoalModal);

const mapStateToProps = state => {
  return {
    uploading: state.profile.uploading,
    initialValues: state.profile.user
  };
};

export default connect(
  mapStateToProps,
  null
)(CreateGoalModal);
