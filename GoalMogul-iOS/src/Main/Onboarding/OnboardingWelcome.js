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
import {
    BUTTON_STYLE as buttonStyle,
    TEXT_STYLE as textStyle,
} from '../../styles'
import DelayedButton from '../Common/Button/DelayedButton'
import Icons from '../../asset/base64/Icons'
import { markUserAsOnboarded } from '../../redux/modules/registration/RegistrationActions'

const screenWidth = Math.round(Dimensions.get('window').width)
class OnboardingWelcome extends React.Component {
    continue = () => {
        Actions.replace('drawer')
        this.props.markUserAsOnboarded()
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
                                Welcome to GoalMogul!
                            </Text>
                            <Text
                                style={[
                                    textStyle.onboardingPharagraphTextStyle,
                                    {
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        marginTop: 30,
                                    },
                                ]}
                            >
                                Here you'll forget deeper & more meaningful
                                connections, based on goals & dreams that are
                                truly important to you in life!
                            </Text>
                        </View>
                    </View>
                    <DelayedButton
                        onPress={this.continue}
                        style={[
                            buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                .containerStyle,
                            { marginBottom: 30 },
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

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
}

export default connect(null, {
    markUserAsOnboarded,
})(OnboardingWelcome)
