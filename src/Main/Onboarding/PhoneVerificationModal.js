/** @format */

import React from 'react'
import _ from 'ramda'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import DelayedButton from '../Common/Button/DelayedButton'
import { color, text } from '../../styles/basic'

class PhoneVerificationMoal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            code: undefined,
            hasFilled: false,
        }
    }

    onCodeFilled = (code) => {
        this.setState({ ...this.state, code, hasFilled: true })
    }

    onCodeChanged = (code) => {
        if (code && code.length < 4) {
            this.setState({ ...this.state, hasFilled: false })
        }
    }

    onClosed() {
        this.props.onClosed && this.props.onClosed()
    }

    continue = async () => {
        // If there is no inputs or string length < 4, continue would be disabled.

        // this.props.phoneVerify(this.state.code);
        let verified = await this.props.phoneVerify(this.state.code)

        if (verified) {
            // If good, then call this.props.phoneVerifyPass();
            this.props.phoneVerifyPass()
        } else {
            // TODO: Otherwise, clear the input and show the input
        }
    }

    render() {
        const continueTextContainerStyle = this.state.hasFilled
            ? { ...styles.continueTextContainerStyle }
            : {
                  ...styles.continueTextContainerStyle,
                  backgroundColor: '#E0E0E0',
              }

        return (
            <Modal
                swipeToClose={false}
                isVisible={true}
                backdropOpacity={0.5}
                onClosed={() => this.onClosed()}
                hideModalContentWhileAnimating={true}
                useNativeDriver
                avoidKeyboard
            >
                <View
                    style={{
                        borderRadius: 14,
                        padding: 23,
                        backgroundColor: 'white',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: text.TEXT_FONT_SIZE.FONT_3,
                            lineHeight: text.TEXT_LINE_HEIGHT.FONT_3,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontFamily: text.FONT_FAMILY.BOLD,
                        }}
                    >
                        Verify Phone Number
                    </Text>
                    <Text
                        style={{
                            fontSize: text.TEXT_FONT_SIZE.FONT_1,
                            lineHeight: text.TEXT_LINE_HEIGHT.FONT_3_5,
                            fontWeight: '500',
                            marginTop: 20,
                            textAlign: 'center',
                            fontFamily: text.FONT_FAMILY.REGULAR,
                        }}
                    >
                        Please enter the verification code
                    </Text>
                    <Text
                        style={{
                            fontSize: text.TEXT_FONT_SIZE.FONT_1,
                            lineHeight: text.TEXT_LINE_HEIGHT.FONT_3_5,
                            fontWeight: '500',
                            textAlign: 'center',
                            fontFamily: text.FONT_FAMILY.REGULAR,
                        }}
                    >
                        we sent to your phone number.
                    </Text>

                    <OTPInputView
                        style={{
                            width: '80%',
                            height: 50,
                            marginTop: 25,
                            marginBottom: 25,
                        }}
                        pinCount={4}
                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        // onCodeChanged = {code => { this.setState({code})}}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.digitInputContainerStyle}
                        onCodeFilled={this.onCodeFilled}
                        placeholderCharacter={'-'}
                        placeholderTextColor={'black'}
                    />
                    <DelayedButton
                        onPress={() => this.continue()}
                        style={continueTextContainerStyle}
                    >
                        <Text style={styles.continueTextStyle}>Continue</Text>
                    </DelayedButton>

                    <DelayedButton
                        onPress={this.props.phoneVerifyCancel}
                        style={styles.cancelTextContainerStyle}
                    >
                        <Text style={styles.cancelTextStyle}>Cancel</Text>
                    </DelayedButton>
                </View>
            </Modal>
        )
    }
}

const styles = {
    titleTextStyle: {},
    detailTextStyle: {},
    digitInputContainerStyle: {
        height: 50,
        width: 49,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: 'black',
    },
    continueTextContainerStyle: {
        height: 40,
        width: 221,
        backgroundColor: color.GM_BLUE,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_3,
        fontWeight: 'bold',
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3,
        color: 'white',
        fontFamily: text.FONT_FAMILY.BOLD,
    },
    cancelTextContainerStyle: {
        justifyContent: 'center',
        marginTop: 18,
        padding: 5,
    },
    cancelTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_1,
        color: '#828282',
        fontWeight: '500',
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_1,
        fontFamily: text.FONT_FAMILY.REGULAR,
    },
}

export default PhoneVerificationMoal
