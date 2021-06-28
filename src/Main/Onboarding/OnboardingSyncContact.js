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

import { text, color } from '../../styles/basic'
import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'

import { PRIVACY_POLICY_URL } from '../../Utils/Constants'
import { uploadContacts } from '../../redux/modules/registration/RegistrationActions'
import { REGISTRATION_SYNC_CONTACT_NOTES } from '../../redux/modules/registration/RegistrationReducers'
import DelayedButton from '../Common/Button/DelayedButton'
import SyncContactInfoModal from './SyncContactInfoModal'
import Icons from '../../asset/base64/Icons'
import {
    wrapAnalytics,
    SCREENS,
    trackWithProperties,
    EVENT as E,
} from '../../monitoring/segment'

const screenWidth = Math.round(Dimensions.get('window').width)
const { button: buttonStyle, text: textStyle } = OnboardingStyles

class OnboardingSyncContact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            syncContactInfoModalVisible: false,
            loading: true, // test loading param
            errMessage: undefined,
        }
    }

    openModal = () =>
        this.setState({
            ...this.state,
            syncContactInfoModalVisible: true,
            errMessage: undefined,
            loading: true,
        })

    closeModal = () =>
        this.setState({ ...this.state, syncContactInfoModalVisible: false })

    // Contact member not found. User chose to skip invite from contact
    onModalNotNow = () => {
        trackWithProperties(E.REG_CONTACT_INVITE_SKIPPED, {
            UserId: this.props.userId,
        })
        this.closeModal()
        setTimeout(() => {
            this.onNotNow()
        }, 150)
    }

    onModalInvite = () => {
        this.closeModal()
        setTimeout(() => {
            Actions.push('registration_contact_invite', {
                inviteOnly: true,
                navigateToHome: true,
            })
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
        // trackWithProperties(E.REG_CONTACT_SYNC, {
        //     UserId: this.props.userId,
        // })

        this.openModal()

        // Match is not found
        // Render failure result in modal
        // by setting loading to false
        const onMatchNotFound = () => {
            this.setState({
                ...this.state,
                loading: false,
            })
        }

        // close modal and go to invite page
        const onMatchFound = () => {
            this.closeModal()
            setTimeout(() => {
                Actions.push('registration_contact_invite')
            }, 150)
        }

        const onError = (errType) => {
            let errMessage = ''
            if (errType == 'upload') {
                errMessage =
                    "We're sorry that some error happened. Please try again later."
            }

            this.setState({
                ...this.state,
                errMessage,
                loading: false,
            })
        }

        this.props.uploadContacts({ onMatchFound, onMatchNotFound, onError })
    }

    onNotNow = () => {
        // trackWithProperties(E.REG_CONTACT_SYNC_SKIP, {
        //     UserId: this.props.userId,
        // })
        const screenTransitionCallback = () => {
            Actions.replace('drawer')
        }
        screenTransitionCallback()
    }

    renderButtons() {
        return (
            <View style={{ width: '100%', justifyContent: 'center' }}>
                <DelayedButton
                    onPress={this.onSyncContact}
                    style={
                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle
                    }
                >
                    <Text
                        style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}
                    >
                        Sync Contacts
                    </Text>
                </DelayedButton>
                <DelayedButton
                    onPress={this.onNotNow}
                    style={[
                        buttonStyle.GM_WHITE_BG_GRAY_TEXT.containerStyle,
                        { marginTop: 8 },
                    ]}
                >
                    <Text style={buttonStyle.GM_WHITE_BG_GRAY_TEXT.textStyle}>
                        Skip
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
                        height: screenWidth * 0.76,
                        width: screenWidth * 0.76,
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <View
                style={[
                    OnboardingStyles.container.page,
                    { paddingBottom: getCardBottomOffset() },
                ]}
            >
                <OnboardingHeader />
                <View style={[OnboardingStyles.container.card]}>
                    <View
                        style={{
                            flexGrow: 1,
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {this.renderImage()}
                        <View style={{ width: '100%' }}>
                            <Text
                                style={
                                    ([textStyle.title],
                                    {
                                        fontSize: 22,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    })
                                }
                            >
                                Find friends who already use GoalMogul!
                            </Text>
                            {/* <Text style={textStyle.title}>use GoalMogul!</Text> */}
                        </View>
                        <Text style={styles.noteTextStyle}>
                            {REGISTRATION_SYNC_CONTACT_NOTES}
                            <Text
                                style={{ color: color.GM_BLUE }}
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
                    {this.renderButtons()}
                </View>
                <SyncContactInfoModal
                    isOpen={this.state.syncContactInfoModalVisible}
                    loading={this.state.loading}
                    errMessage={this.state.errMessage}
                    onSyncContact={this.onSyncContact} // Retry upload contacts
                    onNotNow={this.onModalNotNow}
                    onInvite={this.onModalInvite}
                    onCancel={this.closeModal}
                />
            </View>
        )
    }
}

const styles = {
    noteTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_1,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3_5,
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: '#333333',
        alignSelf: 'flex-end',
        marginTop: 8,
        textAlign: 'center',
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return { userId }
}

const AnalyticsWrapper = wrapAnalytics(
    OnboardingSyncContact,
    SCREENS.REG_CONTACTY_SYNC
)

export default connect(mapStateToProps, {
    uploadContacts,
})(AnalyticsWrapper)
