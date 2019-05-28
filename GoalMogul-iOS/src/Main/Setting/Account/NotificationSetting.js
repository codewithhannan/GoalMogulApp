/**
 * This page is used in user account setting for notification preferenes
 * 
 * Enable push notification
 * Enable email notification
 * 
 * Header right action is Save
 * Header left action is back button
 */
import React from 'react';
import { View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { DotIndicator } from 'react-native-indicators';

import ModalHeader from '../../Common/Header/ModalHeader';
import LoadingModal from '../../Common/Modal/LoadingModal';

import {
    saveNotificationSetting
} from '../../../actions/SettingActions';
import { Logger } from '../../../redux/middleware/utils/Logger';

const DEBUG_KEY = '[ UI NotificationSetting ]';
class NotificationSetting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        this.handleSubmit();
    }

    componentDidMount() {
        this.initializeForm();
    }
    
    initializeForm() {
        const defaulVals = {
            pushNotiPref: undefined,
            emailNotiPref: undefined
        };
    
        // Initialize based on the props, if it's opened through edit button
        const { initializeFromState, notificationPreferences } = this.props;

        const initialVals = initializeFromState
            ? { ...initializeNotificationSetting(notificationPreferences) }
            : { ...defaulVals };
    
        this.props.initialize({
            ...initialVals
        });
    }

    handleSubmit = () => {
		const { updateAccountSetting, formVals } = this.props;
		if (updateAccountSetting) return;
        
        Logger.log(`${DEBUG_KEY}: [ handleSubmit ]: formVals are:`, formVals, 2);
		this.props.saveNotificationSetting(formVals.values);
	}

    renderCheckBoxes() {
        return (
            <View>
				<CheckBox
					title='Enable push notification'
					textStyle={{fontWeight: 'normal'}}
					checked={this.props.pushNotiPref}
					checkedIcon={<MaterialIcons
						name="done"
						color="#111"
						size={21}
					/>}
					uncheckedIcon={<MaterialIcons
						name="done"
						color="#CCC"
						size={21}
					/>}
					onPress={() => this.props.change('pushNotiPref', !this.props.pushNotiPref)}
				/>
				<CheckBox
					title='Enable email notification'
					textStyle={{fontWeight: 'normal'}}
					checked={this.props.emailNotiPref}
					checkedIcon={<MaterialIcons
						name="done"
						color="#111"
						size={21}
					/>}
					uncheckedIcon={<MaterialIcons
						name="done"
						color="#CCC"
						size={21}
					/>}
					onPress={() => this.props.change('emailNotiPref', !this.props.emailNotiPref)}
				/>
			</View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {/* <LoadingModal 
                    visible={this.props.updateAccountSetting} 
                    customIndicator={<DotIndicator size={12} color='white' />}  
                /> */}
                <ModalHeader
                    back
                    title="Notification preferences" 
                    actionDisabled={this.props.updateAccountSetting}
                />
                {this.renderCheckBoxes()}
            </View>
        );
    }
}

const initializeNotificationSetting = (notificationPreferences) => {
    const { pushDisabled, emailDisabled } = notificationPreferences;

    return {
        pushNotiPref: !pushDisabled,
        emailNotiPref: !emailDisabled
    };
};

const mapStateToProps = (state, props) => {
    const selector = formValueSelector('notificationSetting');
    const { updateAccountSetting } = state.user;

    return {
        emailNotiPref: selector(state, 'emailNotiPref'),
        pushNotiPref: selector(state, 'pushNotiPref'),
        formVals: state.form.notificationSetting,
        updateAccountSetting
    };
};

NotificationSetting = reduxForm({
    form: 'notificationSetting',
    enableReinitialize: true
})(NotificationSetting);

export default connect(
    mapStateToProps,
    {
        saveNotificationSetting
    }
)(NotificationSetting);