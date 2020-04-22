import React from 'react';
import _ from "ramda";
import {
    View,
    Image,
    TextInput,
    Text
} from 'react-native';
import Modal from 'react-native-modal';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import DelayedButton from '../Common/Button/DelayedButton';
import { GM_BLUE, GM_FONT_2, GM_FONT_3, GM_FONT_3_5, GM_FONT_1 } from '../../styles';

class PhoneVerificationMoal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: undefined
        };
    }

    onCodeFilled = (code) => {
        console.log("Code is:", code);
        this.setState({ ...this.state, code });
    }

    onClosed() {
        this.props.onClosed && this.props.onClosed();
    }

    // TODO
    renderContinue() {

    }

    // TODO
    renderCancel() {

    }

    render() {
        return (
            <Modal
                swipeToClose={false}
                isVisible={this.props.isOpen}
                backdropOpacity={0.5}
                onOpened={() => this.onModalShow()}
                onClosed={() => this.onClosed()}
                useNativeDriver
                avoidKeyboard
            >
                <View style={{ 
                    alignItems: "center", 
                    borderRadius: 14,
                    padding: 23,
                    backgroundColor: 'white',
                    alignItems: "center" 
                }}>
                    <Text style={{ fontSize: GM_FONT_3, lineHeight: GM_FONT_3_5, fontWeight: "bold", textAlign: "center" }}>Verify Phone Number</Text>
                    <Text style={{ fontSize: GM_FONT_1, lineHeight: GM_FONT_3_5, fontWeight: "500", marginTop: 20, textAlign: "center" }}>Please enter the verification code</Text>
                    <Text style={{ fontSize: GM_FONT_1, lineHeight: GM_FONT_3_5, fontWeight: "500", textAlign: "center" }}>we sent to your phone number.</Text>

                    <OTPInputView
                        style={{width: '80%', height: 50, marginTop: 25, marginBottom: 25 }}
                        pinCount={4}
                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        // onCodeChanged = {code => { this.setState({code})}}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.digitInputContainerStyle}
                        
                        onCodeFilled = {this.onCodeFilled}
                        placeholderCharacter={"-"}
                        placeholderTextColor={"black"}
                    />
                    <DelayedButton onPress={this.props.continue} style={styles.continueTextContainerStyle}>
                        <Text style={styles.continueTextStyle}>Continue</Text>
                    </DelayedButton>

                    <DelayedButton onPress={this.props.cancel} style={styles.cancelTextContainerStyle}>
                        <Text style={styles.cancelTextStyle}>Cancel</Text>
                    </DelayedButton>
                </View>
            </Modal>
        )
    }
}

const styles = {
    titleTextStyle: {

    },
    detailTextStyle: {

    },
    digitInputContainerStyle: {
        height: 50,
        width: 49,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        color: "black"
    },
    continueTextContainerStyle: {
        height: 40,
        width: 221,
        backgroundColor: GM_BLUE,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center"
    },
    continueTextStyle: {
        fontSize: GM_FONT_3,
        fontWeight: "bold",
        lineHeight: GM_FONT_3_5,
        color: "white"
    },
    cancelTextContainerStyle: {
        justifyContent: "center",
        marginTop: 18,
        padding: 5
    },
    cancelTextStyle: {
        fontSize: GM_FONT_1,
        color: "#828282",
        fontWeight: "500"
    }
};

export default PhoneVerificationMoal;