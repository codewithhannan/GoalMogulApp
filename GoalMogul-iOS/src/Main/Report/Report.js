import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import ModalHeader from '../../Main/Common/Header/ModalHeader';

// Actions
import {
  updateReportDetails,
  cancelReport,
  postingReport
} from '../../redux/modules/report/ReportActions';

class Report extends Component {
  renderInputField() {
    const { loading, details } = this.props;

    return (
      <View>
        <TextInput
          title='title'
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={this.props.updateReportDetails}
          numberOfLines={10}
          returnKeyType='done'
          multiline
          editable={!loading}
          placeholder='Your description here...'
          value={_.isEmpty(details) ? '' : details}
        />
      </View>
    );
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.showing}
      >
        <ModalHeader
          title='Report'
          actionText='Submit'
          onCancel={() => this.props.cancelReport()}
          onAction={() =>
            this.props.postingReport(() => {
              console.log('posting report and change this to alert');
              // alert('You have successfully created a report');
            })
          }
        />
        <Text>description</Text>
        {this.renderInputField()}
      </Modal>
    );
  }
}

// const {
//   input: { onFocus, value, ...restInput },
//   multiline,
//   editable,
//   numberOfLines,
//   placeholder,
//   style,
//   iconSource,
//   iconStyle,
//   iconOnPress,
//   meta: { touched, error },
//   ...custom
// } = this.props;

const mapStateToProps = state => {
  const { showingModal, details, loading } = state.report;

  return {
    showingModal,
    details,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    updateReportDetails,
    cancelReport,
    postingReport
  }
)(Report);
