import React, { Component } from 'react';
import {
  View,
  Modal,
  Text
} from 'react-native';
import { connect } from 'react-redux';

// Actions
import {
  updateReportDetails,
  cancelReport,
  postingReport
} from '../../redux/modules/report/ReportActions';

class Report extends Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.showing}
      >
        <Text>Hi</Text>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const { showingModal } = state.report;

  return {
    showingModal
  }
};

export default connect(
  null,
  {
    updateReportDetails,
    cancelReport,
    postingReport
  }
)(Report);
