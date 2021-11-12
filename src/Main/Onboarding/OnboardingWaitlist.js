/**
 * Onboarding flow Sync Contact page.
 *
 * @see https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 * @format
 */

import React from 'react'
import {
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    Linking,
    Platform,
} from 'react-native'
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

class OnBoardingWaitlist extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            syncContactInfoModalVisible: false,
            loading: true, // test loading param
            errMessage: undefined,
        }
    }

    renderButtons() {
        return (
            <View style={{ width: '100%', justifyContent: 'center' }}>
                <DelayedButton
                    onPress={() => Actions.pop()}
                    style={
                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle
                    }
                >
                    <Text
                        style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}
                    >
                        I have a Code
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
        const pageID = 391422631718856
        const scheme = Platform.select({
            ios: 'fb://profile/',
            android: 'fb://page/',
        })

        const url = `${scheme}${pageID}`

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
                        <View style={{ width: '100%', marginTop: 70 }}>
                            <Text
                                style={
                                    ([textStyle.title],
                                    {
                                        fontSize: 22,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                        width: '60%',
                                        alignSelf: 'center',
                                    })
                                }
                            >
                                You’ve been added to the Wait List!
                            </Text>
                            {/* <Text style={textStyle.title}>use GoalMogul!</Text> */}
                        </View>
                        <Text
                            style={{
                                fontSize: 16,

                                textAlign: 'center',
                                width: '75%',

                                marginTop: 15,
                                // fontStyle: 'SFProDisplay-Regular',
                            }}
                        >
                            After beta testing is done, we'll email you when
                            your account is ready!
                        </Text>

                        <Text
                            style={{
                                fontSize: 16,

                                textAlign: 'center',
                                width: '75%',
                                marginHorizontal: 80,
                                marginTop: 60,
                                // fontStyle: 'SFProDisplay-Regular',
                            }}
                        >
                            Follow us for updates
                        </Text>

                        <TouchableOpacity
                            onPress={() => Linking.openURL(url)}
                            style={{
                                backgroundColor: 'white',
                                height: 50,
                                width: 132,
                                marginTop: 30,
                                elevation: 1,
                                shadowColor: '#c6c6c6',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 5,
                                shadowRadius: 3,
                                borderRadius: 6,
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{ padding: 10 }}>
                                <Image
                                    source={require('../../asset/utils/FacebookRec.png')}
                                    resizeMode="contain"
                                    style={{
                                        height: 30,
                                        width: 30,
                                        backgroundColor: '#485A95',
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    marginTop: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#485A95',
                                        fontSize: 12,
                                        // fontStyle: 'SFProDisplay-Regular',
                                        fontWeight: '500',
                                    }}
                                >
                                    Follow us
                                </Text>
                                <Text
                                    style={{
                                        color: '#485A95',
                                        fontSize: 12,
                                        // fontStyle: 'SFProDisplay-Regular',
                                        fontWeight: '500',
                                    }}
                                >
                                    on Facebook
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {this.renderButtons()}
                </View>
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

const AnalyticsWrapper = wrapAnalytics(OnBoardingWaitlist, SCREENS.REG_WAITLIST)

export default connect(mapStateToProps, {})(AnalyticsWrapper)
