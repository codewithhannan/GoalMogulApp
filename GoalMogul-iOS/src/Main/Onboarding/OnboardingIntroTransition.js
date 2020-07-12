/**
 * Transition page from user registration to onboarding intro. Displaying text
 * to explain the following few pages
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * @format
 */

import React from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'
import DelayedButton from '../Common/Button/DelayedButton'
import {
    TEXT_STYLE as textStyle,
    BUTTON_STYLE as buttonStyle,
} from '../../styles'
import Icons from '../../asset/base64/Icons'

const { width } = Dimensions.get('window')
class OnboardingIntroTransition extends React.Component {
    onContinue = () => {
        const screenTransitionCallback = () => {
            Actions.push('registration_target_selection')
        }

        screenTransitionCallback()
    }

    renderImage() {
        return (
            <View style={styles.imageContainerStyle}>
                <Image
                    source={Icons.LionMascotStars}
                    style={[styles.imageStyle]}
                />
            </View>
        )
    }

    render() {
        const { name } = this.props

        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View
                    style={{
                        flex: 1,
                        paddingLeft: 25,
                        paddingRight: 25,
                        marginBottom: 30,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {this.renderImage()}
                        <Text
                            style={[
                                textStyle.onboardingTitleTextStyle,
                                {
                                    marginTop: 50,
                                    marginBottom: 30,
                                    fontSize: 35,
                                    lineHeight: 40,
                                },
                            ]}
                        >
                            Hi, {name ? `${name}` : 'Jia'}
                        </Text>
                        <Text style={textStyle.onboardingPharagraphTextStyle}>
                            We are going to ask you three questions
                        </Text>
                        <Text style={textStyle.onboardingPharagraphTextStyle}>
                            to tailor your experience!
                        </Text>
                    </View>
                    <DelayedButton
                        style={[
                            buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                .containerStyle,
                            { marginTop: 40, marginBottom: 20 },
                        ]}
                        onPress={this.onContinue}
                    >
                        <Text
                            style={
                                buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle
                            }
                        >
                            Continue
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
    imageContainerStyle: {
        height: (width * 4 * 1.5) / 7,
        width: (width * 4) / 7,
    },
    imageStyle: {
        height: (width * 4 * 1.5) / 7,
        width: (width * 4) / 7,
    },
}

const mapStateToProps = (state) => {
    const { name } = state.registration
    return {
        name,
    }
}

export default connect(mapStateToProps, {})(OnboardingIntroTransition)
