/** @format */

import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { View, Text, TextInput, Animated } from 'react-native'
/**
 * Page for user to select important things they want to achieve in GM
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 * @format
 */

import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import OnboardingHeader from './Common/OnboardingHeader'
import DelayedButton from '../Common/Button/DelayedButton'

import { text, color } from '../../styles/basic'
import OnboardingStyles from '../../styles/Onboarding'

import {
    registrationTargetSelection,
    uploadSurvey,
} from '../../redux/modules/registration/RegistrationActions'
import OnboardingFooter from './Common/OnboardingFooter'
import { CheckBox } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'
import { Icon } from '@ui-kitten/components'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

class OnboardingSelectionTarget extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            otherSelected: false,
        }
        this.animations = {
            checkBoxOpacity: new Animated.Value(1),
        }
    }

    onNext = () => {
        // Transition to next screen
        Actions.replace('drawer')

        // Sent api request to upload survey
        this.props.uploadSurvey()
    }

    onBack = () => {
        // Go back to the transition intro
        const screenTransitionCallback = () => {
            Actions.pop()
        }
        screenTransitionCallback()
    }

    onSelect = (title, prevVal, extra) => {
        if (title == 'Other') {
            // Set state and animate to expand the input box
            this.setState({
                ...this.state,
                otherSelected: !prevVal,
            })
        }

        return this.props.registrationTargetSelection(title, !prevVal, extra)
    }

    keyExtractor = (item) => item.title

    renderOtherTextInput = () => {
        const { userTargets } = this.props
        if (!userTargets) {
            return null
        }

        const { extra, selected, title } = userTargets[userTargets.length - 1]
        if (!selected) {
            return null
        }

        return (
            <View style={{ marginTop: 12 }} key="Other TextInput">
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_1,
                        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                        marginBottom: 4,
                    }}
                >
                    Why did you download GoalMogul?
                </Text>
                <View
                    style={{
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#A6AAB4',
                        borderRadius: 3,
                    }}
                >
                    <TextInput
                        placeholder="What would you like to get out of this app?"
                        style={[
                            OnboardingStyles.input.text,
                            { textAlignVertical: 'top' },
                        ]}
                        value={extra}
                        onChangeText={(val) =>
                            this.props.registrationTargetSelection(
                                title,
                                selected,
                                val
                            )
                        }
                        minHeight={180}
                        maxHeight={180}
                        multiline
                        autoFocus
                    />
                </View>
            </View>
        )
    }

    renderTargets = () => {
        const { userTargets } = this.props
        let ret = userTargets.map((item) => {
            const { title, selected, extra } = item
            return (
                <Animated.View
                    style={{
                        marginTop: 20,
                        marginBottom: 20,
                        opacity: this.animations.checkBoxOpacity,
                    }}
                    key={Math.random().toString(36).substr(2, 9)}
                >
                    <DelayedButton
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                        onPress={() => this.onSelect(title, selected, extra)}
                        activeOpacity={1}
                    >
                        <View
                            style={{
                                borderRadius: 12,
                                height: 24,
                                width: 24,
                                borderWidth: 1,
                                backgroundColor: selected
                                    ? color.GM_BLUE
                                    : color.GM_CARD_BACKGROUND,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: selected
                                    ? color.GM_BLUE
                                    : '#8C8C8C',
                            }}
                        >
                            <Icon
                                name="check"
                                pack="material-community"
                                style={{
                                    tintColor: selected
                                        ? color.GM_CARD_BACKGROUND
                                        : '#8C8C8C',
                                    height: 20,
                                    width: 20,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                paddingLeft: 15,
                            }}
                        >
                            <Text
                                style={[
                                    OnboardingStyles.text.paragraph,
                                    {
                                        flexWrap: 'wrap',
                                    },
                                ]}
                            >
                                {title}
                            </Text>
                        </View>
                    </DelayedButton>
                </Animated.View>
            )
        })

        return ret
    }

    render() {
        const { userTargets } = this.props
        const selectedTargets = userTargets.filter((i) => i.selected)
        // Disabled next when no selection is made
        // Or when other is selected with empty input
        const disabled =
            selectedTargets.length == 0 ||
            (selectedTargets.length == 1 &&
                selectedTargets[0].title == 'Other' &&
                !selectedTargets[0].extra.trim())

        return (
            <View
                style={[OnboardingStyles.container.page, { paddingBottom: 0 }]}
            >
                <OnboardingHeader />
                <KeyboardAwareScrollView
                    enableAutomaticScroll
                    extraScrollHeight={100}
                    innerRef={(ref) => {
                        this.scrollview = ref
                    }}
                    keyExtractor={this.keyExtractor}
                    contentContainerStyle={[
                        OnboardingStyles.container.card,
                        { padding: 16, justifyContent: null, alignItems: null },
                    ]}
                    onKeyboardWillShow={() => {
                        // this.scrollview.props.scrollToPosition(0, 120)
                        Animated.timing(this.animations.checkBoxOpacity, {
                            useNativeDriver: true,
                            toValue: 0.4,
                            duration: 300,
                        }).start()
                    }}
                    onKeyboardWillHide={() => {
                        // this.scrollview.props.scrollToPosition(0, 0);
                        Animated.timing(this.animations.checkBoxOpacity, {
                            useNativeDriver: true,
                            toValue: 1,
                            duration: 300,
                        }).start()
                    }}
                >
                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                        <Text
                            style={
                                ([OnboardingStyles.text.title],
                                { fontWeight: '700', fontSize: 23 })
                            }
                        >
                            Which of the following are
                        </Text>
                        <Text
                            style={
                                ([OnboardingStyles.text.title],
                                { fontWeight: '700', fontSize: 23 })
                            }
                        >
                            most important to you?
                        </Text>
                        <Text
                            style={[
                                OnboardingStyles.input.title,
                                { marginTop: 20, marginBottom: 10 },
                            ]}
                        >
                            (Check all that apply)
                        </Text>
                    </View>
                    {this.renderTargets()}
                    {this.renderOtherTextInput()}
                </KeyboardAwareScrollView>
                <OnboardingFooter
                    // totalStep={3}
                    // currentStep={1}
                    onNext={this.onNext}
                    onPrev={this.onBack}
                    nextDisabled={disabled}
                    hideProgressDots={true}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { userTargets } = state.registration
    return {
        userTargets,
    }
}

const AnalyticsWrapper = wrapAnalytics(
    OnboardingSelectionTarget,
    SCREENS.REG_SURVEY
)

export default connect(mapStateToProps, {
    registrationTargetSelection,
    uploadSurvey,
})(AnalyticsWrapper)
