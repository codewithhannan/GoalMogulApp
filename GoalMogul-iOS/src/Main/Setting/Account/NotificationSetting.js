/**
 * This page is used in user account setting for notification preferenes
 *
 * Enable push notification
 * Enable email notification
 *
 * Header right action is Save
 * Header left action is back button
 *
 * @format
 */

import React from 'react'
import { View, Text } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { MaterialIcons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { DotIndicator } from 'react-native-indicators'

import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import LoadingModal from '../../Common/Modal/LoadingModal'

import { saveNotificationSetting } from '../../../actions/SettingActions'
import { Logger } from '../../../redux/middleware/utils/Logger'

/* Styles */
import Styles from '../Styles'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

const DEBUG_KEY = '[ UI NotificationSetting ]'
class NotificationSetting extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillUnmount() {
        this.handleSubmit()
    }

    componentDidMount() {
        this.initializeForm()
    }

    initializeForm() {
        const defaulVals = {
            pushNotiPref: undefined,
            emailNotiPref: undefined,
        }

        // Initialize based on the props, if it's opened through edit button
        const { initializeFromState, notificationPreferences } = this.props

        const initialVals = initializeFromState
            ? { ...initializeNotificationSetting(notificationPreferences) }
            : { ...defaulVals }

        this.props.initialize({
            ...initialVals,
        })
    }

    handleSubmit = () => {
        const { updateAccountSetting, formVals } = this.props
        if (updateAccountSetting) return

        Logger.log(`${DEBUG_KEY}: [ handleSubmit ]: formVals are:`, formVals, 2)
        this.props.saveNotificationSetting(formVals.values)
    }

    renderCheckBoxes() {
        return (
            <View style={{ marginTop: 15 }}>
                <CheckBox
                    title="Enable Push Notifications"
                    textStyle={{ fontWeight: 'normal' }}
                    checked={this.props.pushNotiPref}
                    checkedIcon={
                        <MaterialIcons name="done" color="#111" size={21} />
                    }
                    uncheckedIcon={
                        <MaterialIcons name="done" color="#CCC" size={21} />
                    }
                    onPress={() =>
                        this.props.change(
                            'pushNotiPref',
                            !this.props.pushNotiPref
                        )
                    }
                />
                <CheckBox
                    title="Enable Email Notifications"
                    textStyle={{ fontWeight: 'normal' }}
                    checked={this.props.emailNotiPref}
                    checkedIcon={
                        <MaterialIcons name="done" color="#111" size={21} />
                    }
                    uncheckedIcon={
                        <MaterialIcons name="done" color="#CCC" size={21} />
                    }
                    onPress={() =>
                        this.props.change(
                            'emailNotiPref',
                            !this.props.emailNotiPref
                        )
                    }
                />
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {/* <LoadingModal 
                    visible={this.props.updateAccountSetting} 
                    customIndicator={<DotIndicator size={12} color='white' />}  
                /> */}
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Notifications"
                />
                <View style={Styles.titleSectionStyle}>
                    <Text style={Styles.titleTextStyle}>
                        Your notification preferences
                    </Text>
                </View>
                {this.renderCheckBoxes()}
            </View>
        )
    }
}

const initializeNotificationSetting = (notificationPreferences) => {
    const { pushDisabled, emailDisabled } = notificationPreferences

    return {
        pushNotiPref: !pushDisabled,
        emailNotiPref: !emailDisabled,
    }
}

const mapStateToProps = (state, props) => {
    const selector = formValueSelector('notificationSetting')
    const { updateAccountSetting } = state.user

    return {
        emailNotiPref: selector(state, 'emailNotiPref'),
        pushNotiPref: selector(state, 'pushNotiPref'),
        formVals: state.form.notificationSetting,
        updateAccountSetting,
    }
}

// Analytics must be the inner most wrapper
const AnalyticsWrapper = wrapAnalytics(
    NotificationSetting,
    SCREENS.NOTIFICATION_SETTING
)

const ReduxWrapper = reduxForm({
    form: 'notificationSetting',
    enableReinitialize: true,
})(AnalyticsWrapper)

export default connect(mapStateToProps, {
    saveNotificationSetting,
})(ReduxWrapper)
