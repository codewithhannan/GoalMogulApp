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
import { default_style, text } from '../../styles/basic'
import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'
import { fetchAppUserProfile } from '../../actions'
import { refreshGoalFeed } from '../../redux/modules/home/mastermind/actions'
import { refreshActivityFeed } from '../../redux/modules/home/feed/actions'
import ProfileImage from '../Common/ProfileImage'

const { width } = Dimensions.get('window')
const { text: textStyle, button: buttonStyle } = OnboardingStyles

class OnboardingIntroTransition extends React.Component {
    componentDidMount() {
        // We try to prefetch user profile at this step of onboarding
        this.props.fetchAppUserProfile()
    }

    onContinue = () => {
        const screenTransitionCallback = () => {
            Actions.push('registration_target_selection')
        }

        screenTransitionCallback()
    }

    renderImage = () => {
        const { image } = this.props // user profile image
        return (
            <ProfileImage
                imageStyle={{
                    height: (width * 3.5 * default_style.uiScale) / 7,
                    width: (width * 3.5 * default_style.uiScale) / 7,
                    borderRadius: 200,
                }}
                imageUrl={image}
                imageContainerStyle={{
                    borderRadius: 200,
                }}
            />
        )
    }

    render() {
        const { name } = this.props

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
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {this.renderImage()}
                        <Text
                            style={[
                                textStyle.title,
                                {
                                    marginTop: 56,
                                    fontSize: 35,
                                    lineHeight: 40,
                                },
                            ]}
                        >
                            Hi {name}
                        </Text>
                        <Text
                            style={[
                                textStyle.paragraph,
                                { marginVertical: 24, textAlign: 'center' },
                            ]}
                        >
                            Please answer this one question so we can tailor
                            your experience. Thank you
                        </Text>
                    </View>
                    <DelayedButton
                        style={[
                            buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                .containerStyle,
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
        height: (width * 4 * 1.5) / 10,
        width: (width * 4) / 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        height: (width * 4 * 1.5) / 10,
        width: (width * 4) / 10,
    },
}

const mapStateToProps = (state) => {
    const { name } = state.registration
    const { user } = state.user
    let nameToUse = name

    // User entered through login rather account registration
    if (!name && user && user.name) {
        nameToUse = user.name
    }

    return {
        name: nameToUse,
        image: (user && user.profile && user.profile.image) || undefined,
    }
}

export default connect(mapStateToProps, {
    fetchAppUserProfile,
    refreshGoalFeed,
    refreshActivityFeed,
})(OnboardingIntroTransition)
