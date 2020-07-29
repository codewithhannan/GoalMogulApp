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
import { text } from '../../styles/basic'
import {
    registrationTargetSelection,
    uploadSurvey,
} from '../../redux/modules/registration/RegistrationActions'
import OnboardingFooter from './Common/OnboardingFooter'
import { CheckBox } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'

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
        Actions.push('registration_tribe_selection')

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
            <View style={{ marginTop: 10 }} key="Other TextInput">
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_1,
                        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                    }}
                >
                    Others
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
                        placeholder="Why did you download goalmogul? What would you like to get out of it?"
                        style={{
                            fontSize: text.TEXT_FONT_SIZE.FONT_3,
                            lineHeight: text.TEXT_LINE_HEIGHT.FONT_3,
                            fontFamily: text.FONT_FAMILY.REGULAR,
                            letterSpacing: 0.3,
                        }}
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
                        marginTop: 12,
                        marginBottom: 12,
                        opacity: this.animations.checkBoxOpacity,
                    }}
                    key={title}
                >
                    <DelayedButton
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => this.onSelect(title, selected, extra)}
                        activeOpacity={1}
                    >
                        <CheckBox
                            textStyle={{ fontWeight: 'normal' }}
                            checked={selected}
                            checkedIcon={
                                <MaterialIcons
                                    name="done"
                                    color="#1B63DC"
                                    size={21}
                                />
                            }
                            uncheckedIcon={null}
                            containerStyle={styles.checkBoxContainerStyle(
                                selected
                            )}
                            onPress={() =>
                                this.onSelect(title, selected, extra)
                            }
                        />
                        <View
                            style={{
                                flex: 1,
                                flexGrow: '1',
                                paddingRight: 10,
                                paddingLeft: 15,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: text.TEXT_FONT_SIZE.FONT_3,
                                    lineHeight: text.TEXT_LINE_HEIGHT.FONT_3,
                                    fontFamily: text.FONT_FAMILY.REGULAR,
                                    letterSpacing: 0.6,
                                    flexWrap: 'wrap',
                                    color: '#333333',
                                }}
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
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', marginTop: 35 }}>
                        <Text style={styles.titleTextStyle}>
                            Which of the following are
                        </Text>
                        <Text style={styles.titleTextStyle}>
                            most important to you?
                        </Text>
                        <Text style={styles.subTitleTextStyle}>
                            (Check all that apply)
                        </Text>
                    </View>
                    <KeyboardAwareScrollView
                        enableAutomaticScroll
                        extraScrollHeight={200}
                        innerRef={(ref) => {
                            this.scrollview = ref
                        }}
                        keyExtractor={this.keyExtractor}
                        contentContainerStyle={{
                            padding: 25,
                            // backgroundColor: 'white',
                            // flexGrow: 1 // this will fix scrollview scroll issue by passing parent view width and height to it
                        }}
                        onKeyboardWillShow={() => {
                            // this.scrollview.props.scrollToPosition(0, 120)
                            Animated.timing(this.animations.checkBoxOpacity, {
                                toValue: 0.4,
                                duration: 300,
                            }).start()
                        }}
                        onKeyboardWillHide={() => {
                            // this.scrollview.props.scrollToPosition(0, 0);
                            Animated.timing(this.animations.checkBoxOpacity, {
                                toValue: 1,
                                duration: 300,
                            }).start()
                        }}
                    >
                        {this.renderTargets()}
                        {this.renderOtherTextInput()}
                    </KeyboardAwareScrollView>
                </View>
                <OnboardingFooter
                    totalStep={3}
                    currentStep={1}
                    onNext={this.onNext}
                    onPrev={this.onBack}
                    nextDisabled={disabled}
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
    titleTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_4,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_4,
        fontFamily: text.FONT_FAMILY.BOLD,
        letterSpacing: 0.6,
    },
    subTitleTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_1,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_1,
        fontFamily: text.FONT_FAMILY.REGULAR,
        letterSpacing: 0.4,
        marginTop: 20,
        marginBottom: 10,
    },
    checkBoxContainerStyle: (selected) => ({
        width: 28,
        height: 28,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: selected ? '#1B63DC' : '#B4BFC9',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0,
        margin: 0,
    }),
}

const mapStateToProps = (state) => {
    const { userTargets } = state.registration
    return {
        userTargets,
    }
}

export default connect(mapStateToProps, {
    registrationTargetSelection,
    uploadSurvey,
})(OnboardingSelectionTarget)
