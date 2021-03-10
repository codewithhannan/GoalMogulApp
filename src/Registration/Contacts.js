/** @format */

import React, { Component } from 'react'
import { View, Text, Alert } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { connect } from 'react-redux'

/* Components */
import Header from './Common/Header'
import Button from './Common/Button'
import Divider from './Common/Divider'
import DelayedButton from '../Main/Common/Button/DelayedButton'

/* Styles */
import Styles from './Styles'

/* Actions */
import { registrationNextContactSync } from '../actions'
import { PRIVACY_POLICY_URL } from '../Utils/Constants'

class Contacts extends Component {
    handleNextOnPressed() {
        const skip = false
        Alert.alert(
            'Upload your contacts',
            'Your contacts will be used to help you find your friends on GoalMogul.',
            [
                {
                    text: 'Privacy Policy',
                    onPress: async () =>
                        await WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL, {
                            showTitle: true,
                        }),
                },
                {
                    text: 'Continue',
                    onPress: () =>
                        this.props.registrationNextContactSync({ skip }),
                    style: 'default',
                },
            ]
        )
    }

    handleSkipOnPressed() {
        const skip = true
        this.props.registrationNextContactSync({ skip })
    }

    render() {
        return (
            <View style={Styles.containerStyle}>
                <Header name={this.props.name || 'John Doe'} type="contact" />
                <View style={Styles.bodyContainerStyle}>
                    <Text style={Styles.titleTextStyle}>Find your friends</Text>
                    <View style={{ alignSelf: 'center' }}>
                        <Divider
                            horizontal
                            width={250}
                            borderBottomWidth={2}
                            color="#f4f4f4"
                        />
                    </View>

                    <View style={{ marginTop: 15 }} />

                    <Text style={Styles.contactSyncPromptingText}>
                        Syncing your contacts can help
                    </Text>

                    <Text style={Styles.contactSyncPromptingText}>
                        you find your friends on GoalMogul.
                    </Text>

                    <Text style={Styles.contactNoteText}>
                        Note: we do not collect or share contact data.
                    </Text>

                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={this.handleNextOnPressed.bind(this)}
                    >
                        <View>
                            <Button text="Sync" />
                        </View>
                    </DelayedButton>

                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={this.handleSkipOnPressed.bind(this)}
                    >
                        <View>
                            <Button text="Skip" arrow />
                        </View>
                    </DelayedButton>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { name } = state.registration
    return {
        name,
    }
}

export default connect(mapStateToProps, { registrationNextContactSync })(
    Contacts
)
