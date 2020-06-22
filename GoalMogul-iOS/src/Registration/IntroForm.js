/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native'
import { connect } from 'react-redux'

/* Components */
import Header from './Common/Header'
import Button from './Common/Button'
import Divider from './Common/Divider'
import FormContainer from './Common/FormContainer'
import InputField from './Common/InputField'
import DelayedButton from '../Main/Common/Button/DelayedButton'

/* Styles */
import Styles from './Styles'

/* Actions */
import { registrationNextContact, handleOnHeadlineChanged } from '../actions'

class IntroForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headline: '',
        }
    }

    handleContainerOnPressed() {
        Keyboard.dismiss()
    }

    handleNextOnPressed() {
        const headline = this.props.headline
        this.props.registrationNextContact(headline, false)
    }

    handleSkipOnPressed() {
        this.props.registrationNextContact(this.props.headline, true)
    }

    handleOnHeadlineChanged(headline) {
        this.props.handleOnHeadlineChanged(headline)
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="never"
                    overScrollMode="never"
                    bounces={false}
                >
                    <DelayedButton
                        onPress={this.handleContainerOnPressed.bind(this)}
                        touchableWithoutFeedback
                    >
                        <View style={Styles.containerStyle}>
                            <Header name={this.props.name} type="intro" />
                            <View style={Styles.bodyContainerStyle}>
                                <Text style={Styles.titleTextStyle}>
                                    A brief intro...
                                </Text>
                                <View style={{ alignSelf: 'center' }}>
                                    <Divider
                                        horizontal
                                        width={250}
                                        borderBottomWidth={2}
                                        color="#f4f4f4"
                                    />
                                </View>

                                <View style={{ marginTop: 15 }} />

                                <Text style={Styles.explanationTextStyle}>
                                    Your headline:
                                </Text>

                                <InputField
                                    placeholder="Ex: 'CEO of Wayne Enterprises'"
                                    value={this.props.headline}
                                    onChange={this.handleOnHeadlineChanged.bind(
                                        this
                                    )}
                                    error={
                                        this.props.error &&
                                        this.props.error.headline
                                            ? this.props.error.headline
                                            : undefined
                                    }
                                />

                                <DelayedButton
                                    onPress={this.handleNextOnPressed.bind(
                                        this
                                    )}
                                    touchableWithoutFeedback
                                >
                                    <View>
                                        <Button text="Next" />
                                    </View>
                                </DelayedButton>
                                <DelayedButton
                                    activeOpacity={0.6}
                                    onPress={this.handleSkipOnPressed.bind(
                                        this
                                    )}
                                >
                                    <View>
                                        <Button text="Skip" arrow />
                                    </View>
                                </DelayedButton>
                            </View>
                        </View>
                    </DelayedButton>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = (state) => {
    const { error, headline, name } = state.registration

    return {
        error,
        headline,
        name,
    }
}

export default connect(mapStateToProps, {
    registrationNextContact,
    handleOnHeadlineChanged,
})(IntroForm)
