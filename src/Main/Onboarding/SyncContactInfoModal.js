/** @format */

import React from 'react'
import _ from 'ramda'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import DelayedButton from '../Common/Button/DelayedButton'

import { color, text } from '../../styles/basic'
import OnboardingStyles from '../../styles/Onboarding'
import { DotIndicator } from 'react-native-indicators'

const { button: buttonStyle } = OnboardingStyles

class SyncContactInfoModal extends React.Component {
    onNotNow = () => {
        // Close modal and go to welcome page
        if (this.props.onNotNow) {
            this.props.onNotNow()
        }
    }

    onInvite = () => {
        if (this.props.onInvite) {
            this.props.onInvite()
        }
    }

    onSyncContact = () => {
        this.props.onSyncContact && this.props.onSyncContact()
    }

    renderUploading = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_3_5,
                        fontFamily: text.FONT_FAMILY.BOLD,
                    }}
                >
                    Uploading Contacts
                </Text>
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_2,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                        marginTop: 8,
                        marginBottom: 36,
                    }}
                >
                    This might take a few minutes
                </Text>
                <DotIndicator size={10} color={color.GM_BLUE} />
                <DelayedButton
                    onPress={() => this.props.onCancel()}
                    style={[
                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle,
                        { marginTop: 36 },
                    ]}
                >
                    <Text
                        style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}
                    >
                        Cancel
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    renderFailureResult = () => {
        const { errMessage } = this.props
        return (
            <View>
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_3_5,
                        fontFamily: text.FONT_FAMILY.BOLD,
                        textAlign: 'center',
                        marginBottom: 20,
                    }}
                >
                    {errMessage
                        ? errMessage
                        : "We couldn't find any of your contacts that are already on GoalMogul."}
                </Text>
                <DelayedButton
                    onPress={errMessage ? this.onSyncContact : this.onInvite}
                    style={
                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle
                    }
                >
                    <Text
                        style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}
                    >
                        {errMessage ? 'Try again' : 'Invite'}
                    </Text>
                </DelayedButton>
                <DelayedButton
                    onPress={errMessage ? this.onInvite : this.onNotNow}
                    style={[
                        buttonStyle.GM_WHITE_BG_BLUE_TEXT.containerStyle,
                        { marginTop: 10 },
                    ]}
                >
                    <Text style={buttonStyle.GM_WHITE_BG_BLUE_TEXT.textStyle}>
                        {errMessage ? 'Invite Contacts' : 'Not Now'}
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    render() {
        return (
            <Modal
                swipeToClose={false}
                isVisible={this.props.isOpen}
                backdropOpacity={0.5}
                onClosed={() => this.onClosed()}
                hideModalContentWhileAnimating={true}
                useNativeDriver
                avoidKeyboard
            >
                <View
                    style={{
                        borderRadius: 14,
                        padding: 23,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                    }}
                >
                    {this.props.loading
                        ? this.renderUploading()
                        : this.renderFailureResult()}
                </View>
            </Modal>
        )
    }
}

export default SyncContactInfoModal
