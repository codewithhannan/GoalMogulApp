/**
 * Last page in onboarding process to welcome user to GM.
 *
 * @see https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Dimensions, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import OnboardingHeader from './Common/OnboardingHeader'
import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'
import DelayedButton from '../Common/Button/DelayedButton'
import Icons from '../../asset/base64/Icons'
import { markUserAsOnboarded } from '../../redux/modules/registration/RegistrationActions'
import {
    wrapAnalytics,
    SCREENS,
    track,
    EVENT as E,
} from '../../monitoring/segment'

const screenWidth = Math.round(Dimensions.get('window').width)
const { text: textStyle, button: buttonStyle } = OnboardingStyles
class OnboardingWelcome extends React.Component {
    continue = () => {
        Actions.replace('drawer')
        track(E.ONBOARDING_DONE)
    }

    /**
     * Render Mascot
     */
    renderImage = () => {
        return (
            <View>
                <Image
                    source={Icons.LionMascotWelcome}
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
            <View
                style={[
                    OnboardingStyles.container.page,
                    { paddingBottom: getCardBottomOffset() },
                ]}
            >
                <OnboardingHeader />
                <View
                    style={[OnboardingStyles.container.card, { paddingTop: 0 }]}
                >
                    <View
                        style={{
                            flexGrow: 1,
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center',
                        }}
                    >
                        {this.renderImage()}
                        <View style={{ marginTop: 36 }}>
                            <Text
                                style={
                                    ([textStyle.title],
                                    {
                                        fontWeight: '700',
                                        fontSize: 23,
                                        textAlign: 'center',
                                    })
                                }
                            >
                                Welcome to GoalMogul!
                            </Text>
                            <Text
                                style={[
                                    textStyle.paragraph,
                                    {
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        marginTop: 32,
                                    },
                                ]}
                            >
                                Create goals. Invite friends.
                            </Text>
                        </View>
                    </View>
                    <DelayedButton
                        onPress={this.continue}
                        style={[
                            buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                .containerStyle,
                        ]}
                    >
                        <Text
                            style={
                                buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle
                            }
                        >
                            Let's get started!
                        </Text>
                    </DelayedButton>
                </View>
            </View>
        )
    }
}

const AnalyticsWrapper = wrapAnalytics(OnboardingWelcome, SCREENS.REG_WELCOME)

export default connect(null, {
    markUserAsOnboarded,
})(AnalyticsWrapper)
