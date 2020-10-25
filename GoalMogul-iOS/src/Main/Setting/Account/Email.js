/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'

/* Assets */
import editImage from '../../../asset/utils/edit.png'

/* Styles */
import Styles from '../Styles'

/* Actions */
import { onResendEmailPress } from '../../../actions'

/* Utils */
import { componentKeyByTab } from '../../../redux/middleware/utils'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

class Email extends Component {
    handleOnResendPress() {
        console.log('user tries to resend email')
        this.props.onResendEmailPress(
            (message) => alert(message),
            this.props.userId
        )
    }

    handleOnEditEmailPress() {
        const { tab } = this.props
        const componentKeyToOpen = componentKeyByTab(tab, 'editEmailForm')
        Actions.push(`${componentKeyToOpen}`, { userId: this.props.userId })
    }

    renderEmailDetailText() {
        if (this.props.email.isVerified) {
            return <Text style={Styles.statusTextStyle}>Primary email</Text>
        }
        return (
            <View>
                <Text style={Styles.statusTextStyle}>Unverified</Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.handleOnResendPress.bind(this)}
                >
                    <Text style={Styles.actionTextStyle}>
                        Resend verification link
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderEmail() {
        if (this.props.email.address) {
            return (
                <Text style={Styles.detailTextStyle}>
                    {this.props.email.address}
                </Text>
            )
        }
        return null
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Email Addresses"
                />
                <View style={Styles.titleSectionStyle}>
                    <Text style={Styles.titleTextStyle}>
                        Emails you've added
                    </Text>
                </View>
                <View style={Styles.detailCardSection}>
                    <TouchableWithoutFeedback
                        onPress={this.handleOnEditEmailPress.bind(this)}
                    >
                        <View style={Styles.iconContainerStyle}>
                            <Image
                                style={Styles.editIconStyle}
                                source={editImage}
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    {this.renderEmail()}
                    {this.renderEmailDetailText()}
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { email } = state.setting
    const { tab } = state.navigation

    return {
        email,
        tab,
    }
}

export default connect(mapStateToProps, { onResendEmailPress })(
    wrapAnalytics(Email, SCREENS.EMAIL)
)
