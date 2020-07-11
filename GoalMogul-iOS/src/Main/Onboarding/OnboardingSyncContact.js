/**
 * Onboarding flow Sync Contact page.
 *
 * @see https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 * @format
 */

import React from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'
import {
    GM_FONT_SIZE,
    GM_BLUE,
    GM_FONT_FAMILY,
    GM_FONT_LINE_HEIGHT,
    BUTTON_STYLE as buttonStyle,
    TEXT_STYLE as textStyle,
} from '../../styles'
import { PRIVACY_POLICY_URL } from '../../Utils/Constants'
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions'
import { REGISTRATION_SYNC_CONTACT_NOTES } from '../../redux/modules/registration/RegistrationReducers'
import DelayedButton from '../Common/Button/DelayedButton'
import SyncContactInfoModal from './SyncContactInfoModal'
import Icons from '../../asset/base64/Icons'

const screenWidth = Math.round(Dimensions.get('window').width)

class OnboardingSyncContact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            syncContactInfoModalVisible: false,
            loading: true, // test loading param
        }
    }

    openModal = () =>
        this.setState({ ...this.state, syncContactInfoModalVisible: true })

    closeModal = () =>
        this.setState({ ...this.state, syncContactInfoModalVisible: false })

    onModalNotNow = () => {
        this.closeModal()
        setTimeout(() => {
            this.onNotNow()
        }, 150)
    }

    onModalInvite = () => {
        this.closeModal()
        setTimeout(() => {
            Actions.push('registration_contact_invite', { inviteOnly: true })
        }, 150)
    }

    /**
     * TODO:
     * 1. Show uploading overlay / modal
     * 2. If not found say, show not found modal
     *    - If invite, then go to invite page with only 1 tab
     *    - otherwise, go to welcome page
     * 3. If found, go to invite page with 2 tabs
     */
    onSyncContact = () => {
        this.openModal()
        setTimeout(() => {
            this.setState({ ...this.state, loading: false })
        }, 6000)
    }

    onNotNow = () => {
        const screenTransitionCallback = () => {
            Actions.push('registration_transition')
        }
        screenTransitionCallback()
    }

    renderButtons() {
        return (
            <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                <DelayedButton
                    onPress={this.onSyncContact}
                    style={
                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle
                    }
                >
                    <Text
                        style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}
                    >
                        Continue
                    </Text>
                </DelayedButton>
                <DelayedButton
                    onPress={this.onNotNow}
                    style={[
                        buttonStyle.GM_WHITE_BG_BLUE_TEXT.containerStyle,
                        { marginTop: 10 },
                    ]}
                >
                    <Text style={buttonStyle.GM_WHITE_BG_BLUE_TEXT.textStyle}>
                        Not Now
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    /**
     * Render image impression for sync contact
     */
    renderImage = () => {
        return (
            <View>
                <Image
                    source={Icons.ContactBook}
                    style={{
                        height: screenWidth * 0.7,
                        width: screenWidth * 0.7,
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View
                    style={{
                        flex: 1,
                        padding: 20,
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{ flex: 1, alignItems: 'center', width: '100%' }}
                    >
                        {this.renderImage()}
                        <View style={{ marginTop: 40 }}>
                            <Text style={textStyle.onboardingTitleTextStyle}>
                                Find friends who
                            </Text>
                            <Text style={textStyle.onboardingTitleTextStyle}>
                                already use GoalMogul!
                            </Text>
                        </View>
                        {this.renderButtons()}
                    </View>
                    <Text style={styles.noteTextStyle}>
                        {REGISTRATION_SYNC_CONTACT_NOTES}
                        <Text
                            style={{ color: GM_BLUE }}
                            onPress={() =>
                                WebBrowser.openBrowserAsync(
                                    PRIVACY_POLICY_URL,
                                    {
                                        showTitle: true,
                                    }
                                )
                            }
                        >
                            {` Learn more`}
                        </Text>
                    </Text>
                </View>
                <SyncContactInfoModal
                    isOpen={this.state.syncContactInfoModalVisible}
                    loading={this.state.loading}
                    onNotNow={this.onModalNotNow}
                    onInvite={this.onModalInvite}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    noteTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_1,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_3_5,
        fontFamily: GM_FONT_FAMILY.GOTHAM,
        color: '#333333',
        alignSelf: 'flex-end',
        paddingBottom: 20,
    },
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps, {})(OnboardingSyncContact)
