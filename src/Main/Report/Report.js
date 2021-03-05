/**
 * This report modal is used in Home and Goal Detail
 *
 * @format
 */

import React, { Component } from 'react'
import {
    View,
    Modal,
    Text,
    TextInput,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

// Components
import ModalHeader from '../../Main/Common/Header/ModalHeader'

// Actions
import {
    updateReportDetails,
    cancelReport,
    postingReport,
} from '../../redux/modules/report/ReportActions'

class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            postingSucceed: undefined,
        }
    }

    renderInputField() {
        const { loading, details } = this.props

        return (
            <View style={styles.inputContainerStyle}>
                <TextInput
                    title="title"
                    autoCapitalize={'none'}
                    autoCorrect
                    onChangeText={this.props.updateReportDetails}
                    returnKeyType="done"
                    multiline
                    numberOfLines={5}
                    editable={!loading}
                    style={{ height: 150, padding: 15, paddingTop: 15 }}
                    placeholder="Your description here..."
                    value={_.isEmpty(details) ? '' : details}
                />
            </View>
        )
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.showing}
                onDismiss={() => {
                    if (this.state.postingSucceed) {
                        Alert.alert(
                            'Success',
                            'You have successfully submitted your report.'
                        )
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <TouchableWithoutFeedback
                        onPress={() => Keyboard.dismiss()}
                    >
                        <View style={{ flex: 1 }}>
                            <ModalHeader
                                title="Report"
                                actionText="Submit"
                                onCancel={() => {
                                    this.setState({ postingSucceed: false })
                                    this.props.cancelReport()
                                }}
                                onAction={() => {
                                    this.props.postingReport(() =>
                                        this.setState({ postingSucceed: true })
                                    )
                                }}
                            />
                            <Text style={styles.subTitleTextStyle}>
                                Description
                            </Text>
                            {this.renderInputField()}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        )
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
        fontSize: 15,
    },
}

const mapStateToProps = (state) => {
    const { showingModal, details, loading } = state.report

    return {
        showingModal,
        details,
        loading,
    }
}

export default connect(mapStateToProps, {
    updateReportDetails,
    cancelReport,
    postingReport,
})(Report)
