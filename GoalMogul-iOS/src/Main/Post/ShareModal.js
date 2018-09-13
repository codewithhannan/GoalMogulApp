import React from 'react';
import {
  View
} from 'react-native';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

// Components


// Actions

// Constants
const DEBUG_KEY = '[ UI ShareModal ]';

class ShareModal extends React.Component {

  render() {
    return (
      <View />
    );
  }
}

const mapStateToProps = state => {
  return {

  };
};

ShareModal = reduxForm({
  form: 'shareModal',
  enableReinitialize: true
})(ShareModal);

export default connect(
  mapStateToProps,
  null
)(ShareModal);
