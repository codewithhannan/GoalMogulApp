/**
 * This report modal is used in router
 */
import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import ModalHeader from '../../Main/Common/Header/ModalHeader';

// Actions
import {
  updateReportDetails,
  cancelReport,
  postingReport,
  updateReportTitle
} from '../../redux/modules/report/ReportActions';

class ReportModal extends Component {
  renderTitleInput() {
    const { loading, title } = this.props;

    return (
      <View style={styles.inputContainerStyle}>
        <TextInput
          title='title'
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={this.props.updateReportTitle}
          returnKeyType='done'
          multiline
          numberOfLines={5}
          editable={!loading}
          style={{ height: 150, padding: 15, paddingTop: 15 }}
          placeholder='Title of the report...'
          value={_.isEmpty(title) ? '' : title}
        />
      </View>
    );
  }

  renderInputField() {
    const { loading, details } = this.props;

    return (
      <View style={styles.inputContainerStyle}>
        <TextInput
          title='description'
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={this.props.updateReportDetails}
          returnKeyType='done'
          multiline
          numberOfLines={5}
          editable={!loading}
          style={{ height: 150, padding: 15, paddingTop: 15 }}
          placeholder='Your description here...'
          value={_.isEmpty(details) ? '' : details}
        />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <ScrollView
          style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
        >
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ flex: 1 }}>
                <ModalHeader
                  title='Report'
                  actionText='Submit'
                  onCancel={() => {
                    Actions.pop();
                    this.props.cancelReport();
                  }}
                  onAction={() => {
                    this.props.postingReport();
                  }}
                />
                <Text style={styles.subTitleTextStyle}>Title</Text>
                {this.renderTitleInput()}
                <Text style={styles.subTitleTextStyle}>Description</Text>
                {this.renderInputField()}

              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

const styles = {
  inputContainerStyle: {
    margin: 20,
    borderRadius: 5,
    borderColor: 'lightgray',
    borderWidth: 1,
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  subTitleTextStyle: {
    padding: 20,
    paddingBottom: 0,
    fontSize: 15
  }
};

const mapStateToProps = state => {
  const { showingModal, details, loading, title } = state.report;

  return {
    showingModal,
    details,
    title,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    updateReportDetails,
    updateReportTitle,
    cancelReport,
    postingReport
  }
)(ReportModal);
