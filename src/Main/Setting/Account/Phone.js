/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
} from 'react-native'
import Expo from 'expo'
import * as WebBrowser from 'expo-web-browser'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import * as Linking from 'expo-linking'

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import Button from '../Button'

/* Styles */
import Styles from '../Styles'

/* Actions */
import { onVerifyPhoneNumber, verifyPhoneNumberSuccess } from '../../../actions'

/* Assets */
import editImage from '../../../asset/utils/edit.png'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'

class Phone extends Component {
    handleOnAddPhoneNumberPress() {
        console.log('user tries to verify')
        Actions.push('addPhoneNumberForm', { userId: this.props.userId })
    }

    handleOnEditPhonePress() {
        console.log('user tries to edit phone number')
        Actions.push('editPhoneNumberForm', { userId: this.props.userId })
    }

    async handleOnVerifyPress() {
        console.log('user trying to verify phone number')
        alert('Please check your message for a 6 digit verification code.')

        this.props.onVerifyPhoneNumber(this.handleRedirect)
    }

    handleRedirect = (event) => {
        WebBrowser.dismissBrowser()
        // TODO: parse url and determine verification states
        const { path, queryParams } = Linking.parse(event.url)

        if (path === 'status=fail') {
            // TODO: error handling, verification failed
            return
        }
        this.props.verifyPhoneNumberSuccess()
        alert('You have successfully verified your phone number.')
    }

    /* Rendering */
    renderPhoneDetailText() {
        if (!this.props.needAddPhone) {
            if (this.props.phone.isVerified) {
                return (
                    <View>
                        <Text style={Styles.statusTextStyle}>Confirmed</Text>
                    </View>
                )
            }
            return (
                <View>
                    <Text style={Styles.statusTextStyle}>Unverified</Text>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.handleOnVerifyPress.bind(this)}
                    >
                        <Text style={Styles.actionTextStyle}>
                            Verify phone number
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <View>
                <Text style={Styles.statusTextStyle}>Confirmed</Text>
                <TouchableOpacity activeOpacity={0.6}>
                    <Text style={Styles.actionTextStyle}>Make primary</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderBody() {
        if (this.props.needAddPhone) {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.handleOnAddPhoneNumberPress.bind(this)}
                >
                    <Button text="Add phone number" />
                </TouchableOpacity>
            )
        }

        return (
            <View style={Styles.detailCardSection}>
                <TouchableWithoutFeedback
                    onPress={this.handleOnEditPhonePress.bind(this)}
                >
                    <View style={Styles.iconContainerStyle}>
                        <Image
                            style={Styles.editIconStyle}
                            source={editImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Text style={Styles.detailTextStyle}>
                    {this.props.phone.number}
                </Text>
                {this.renderPhoneDetailText()}
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Phone numbers"
                />
                <View style={Styles.titleSectionStyle}>
                    <Text style={Styles.titleTextStyle}>
                        Phone numbers you've added
                    </Text>
                </View>
                {this.renderBody()}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { phone } = state.setting
    const needAddPhone =
        !phone ||
        (Object.keys(phone).length === 0 && phone.constructor === Object)
    const { stack, scene } = state.navigation

    return {
        phone,
        needAddPhone,
        stack,
        scene,
    }
}

export default connect(mapStateToProps, {
    onVerifyPhoneNumber,
    verifyPhoneNumberSuccess,
})(wrapAnalytics(Phone, SCREENS.PHONE_VERIFICATION))
