/**
 * This report modal is used in router
 *
 * @format
 */

import React, { Component } from 'react'
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import _ from 'lodash'
import { DotIndicator } from 'react-native-indicators'

// Components
import ModalHeader from '../Common/Header/ModalHeader'
import LoadingModal from '../Common/Modal/LoadingModal'

// Actions
import {
    updateReportDetails,
    cancelReport,
    postingReport,
    updateReportTitle,
} from '../../redux/modules/report/ReportActions'

class ReportModal extends Component {
    renderTitleInput() {
        const { loading, title } = this.props

        return (
            <View style={styles.inputContainerStyle}>
                <TextInput
                    title="title"
                    autoCapitalize={'none'}
                    autoCorrect
                    onChangeText={this.props.updateReportTitle}
                    returnKeyType="done"
                    editable={!loading}
                    style={{
                        height: 60,
                        padding: 12,
                        paddingTop: 12,
                        fontSize: 18,
                    }}
                    placeholder="Title of the report..."
                    value={_.isEmpty(title) ? '' : title}
                    onEndEditing={() => {
                        if (!title || title.length < 5)
                            Alert.alert('Title must be at least 5 characters')
                        if (title.length > 70)
                            Alert.alert(
                                'Title cannot be longer than 70 characters'
                            )
                        if (title.trim() == '')
                            Alert.alert('Enter the title here...')
                    }}
                />
            </View>
        )
    }

    renderInputField() {
        const { loading, details } = this.props

        return (
            <View style={styles.inputContainerStyle}>
                <TextInput
                    title="description"
                    autoCapitalize={'none'}
                    autoCorrect
                    onChangeText={this.props.updateReportDetails}
                    returnKeyType="done"
                    multiline
                    numberOfLines={5}
                    editable={!loading}
                    style={{
                        height: 150,
                        padding: 12,
                        paddingTop: 12,
                        fontSize: 16,
                    }}
                    placeholder="Your description here..."
                    value={_.isEmpty(details) ? '' : details}
                    onEndEditing={() => {
                        if (details.trim() == '')
                            Alert.alert('Enter the description here...')
                    }}
                />
            </View>
        )
    }

    render() {
        const { title, details, loading } = this.props
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
                style={{ flex: 1, backgroundColor: '#ffffff' }}
            >
                <LoadingModal
                    visible={this.props.loading}
                    customIndicator={<DotIndicator size={12} color="white" />}
                />
                <ModalHeader
                    title="Report abuse"
                    actionText="Submit"
                    onCancel={() => {
                        Actions.pop()
                        this.props.cancelReport()
                    }}
                    onAction={() => {
                        this.props.postingReport()
                    }}
                    actionDisabled={
                        !(title && details && title.length >= 5 && !loading)
                    }
                />
                <ScrollView
                    style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
                >
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <TouchableWithoutFeedback
                            onPress={() => Keyboard.dismiss()}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.subTitleTextStyle}>
                                    Title
                                </Text>
                                {this.renderTitleInput()}
                                <Text style={styles.subTitleTextStyle}>
                                    Description
                                </Text>
                                {this.renderInputField()}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    const { showingModal, details, loading, title } = state.report

    return {
        showingModal,
        details,
        title,
        loading,
    }
}

export default connect(mapStateToProps, {
    updateReportDetails,
    updateReportTitle,
    cancelReport,
    postingReport,
})(ReportModal)
