import React from 'react';
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import OnboardingHeader from './Common/OnboardingHeader';
import OnboardingFooter from './Common/OnboardingFooter';
import InputBox from './Common/InputBox';
import DelayedButton from '../Common/Button/DelayedButton';
import { GM_FONT_SIZE, GM_BLUE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT } from '../../styles';
import { registrationLogin, registrationNextAddProfile } from '../../actions';
import { registrationTextInputChange } from '../../redux/modules/registration/RegistrationActions';
import PhoneVerificationMoal from './PhoneVerificationModal';

/**
 * Onboarding flow account registration page.
 * Inputs are: Full Name, Email, Phone number, Password
 * Additional actions are: Log In or Next
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class RegistrationAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
    }

    // Open phone verification modal
    openModal() {
        this.setState({ ...this.state, isModalOpen: true });
    }

    // Close phone verification modal
    closeModal() {
        this.setState({ ...this.state, isModalOpen: false });
    }

    // Invoked by the modal
    phoneVerify = (code) => {
        // TODO: verify with endpoint and return the correct value
        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true);
            }, 5000);
        });
    }

    phoneVerifyPass = () => {
        const { phone, countryCode, email, password, name } = this.props;
        this.closeModal();
        setTimeout(() => {
            // TODO: change back. Right now only going to the next page
            
            // this.props.registrationNextAddProfile({ phone, countryCode, email, password, name });
        }, 150);
    }

    phoneVerifyCancel = () => {
        this.closeModal();
    }

    onNext = () => {
        const { phone, countryCode, email, password, name } = this.props;
        // Check if phone field is supplied
        console.log("phone is: ", phone)
        if (!phone) {
            // If not supplied, register and go to next step
            console.log("user didn't add phone number");
            // return this.props.registrationNextAddProfile({ email, password, name });
        }
        // TODO: notify server to send registration code
        // Implement this action in RegistrationAction.js (the one in /src/redux/modules)

        // Display modal
        this.openModal();
    }

    validateEmail(email) {
        const isValid = (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
        };
        if (isValid(email)) {
            // Go to phone number input
            this.refs["phone"].focus();
        } else {
            Alert.alert(
                "Invalid Email",
                "Please make sure your email address is valid.",
                // [{text: 'OK', onPress: () => this.refs["email"].focus()}]
            );
        }
    }

    renderLogin() {
        return (
            <View style={styles.loginBoxStyle}>
                <Text style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, fontWeight: "bold", color: "#BDBDBD", fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD }}>
                    Already user GoalMogul?
                </Text>
                <DelayedButton onPress={this.props.registrationLogin}>
                    <Text style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, textAlign: "center", alignItems: "flex-end",fontWeight: "bold", color: GM_BLUE, fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD }}>{" "}Log In</Text>
                </DelayedButton>
            </View>
        );
    }

    renderInputs() {
        const { phone, email, password, name, countryCode } = this.props;
        return (
            <KeyboardAvoidingView 
                // bounces={false}
                // innerRef={ref => {this.scrollview = ref}}
                // contentContainerStyle={{
                //     flex: 1, marginLeft: 20, marginRight: 20, justifyContent: "center",
                //     backgroundColor: 'transparent',
                //     flexGrow: 1 // this will fix scrollview scroll issue by passing parent view width and height to it
                // }}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{
                    flex: 1, marginLeft: 20, marginRight: 20, justifyContent: "center",
                    backgroundColor: 'transparent',
                    flexGrow: 1 // this will fix scrollview scroll issue by passing parent view width and height to it
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1, justifyContent: "center", paddingBottom: 20 }}>
                        <InputBox 
                            key="name"
                            inputTitle="Full Name"
                            placeholder="Your Full Name"
                            onChangeText={(val) => this.props.registrationTextInputChange("name", val)}
                            value={name}
                            disabled={this.props.loading}
                            returnKeyType="next"
                            onSubmitEditing={() => this.refs["email"].focus()}
                        />
                        <InputBox
                            key="email"
                            inputTitle="Email"
                            ref="email"
                            placeholder="Your Email Address"
                            onChangeText={(val) => this.props.registrationTextInputChange("email", val)}
                            value={email}
                            autoCompleteType="email"
                            keyboardType="email-address"
                            returnKeyType="next"
                            disabled={this.props.loading}
                            onEndEditing={() => this.validateEmail(email)}
                        />
                        <InputBox
                            key="phone"
                            inputTitle="Phone Number"
                            ref="phone"
                            countryCode={countryCode}
                            placeholder="Your Phone Number"
                            onChangeText={(val) => this.props.registrationTextInputChange("phone", val)}
                            onCountryCodeSelected={(val) => this.props.registrationTextInputChange("countryCode", val)}
                            value={phone}
                            autoCompleteType="tel"
                            keyboardType="phone-pad" // iOS specific type
                            optional
                            returnKeyType="next"
                            disabled={this.props.loading}
                            onEndEditing={() => this.refs["password"].focus()}
                        />
                        <InputBox 
                            key="password"
                            inputTitle="Password"
                            ref="password"
                            placeholder="Password"
                            secure
                            onChangeText={(val) => this.props.registrationTextInputChange("password", val)}
                            value={password}
                            textContentType="newPassword"
                            returnKeyType="done"
                            disabled={this.props.loading}
                        />
                        {this.renderLogin()}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                {this.renderInputs()}
                <OnboardingFooter totalStep={4} currentStep={1} onNext={this.onNext} />
                <PhoneVerificationMoal 
                    isOpen={this.state.isModalOpen}
                    phoneVerify={(code) => this.phoneVerify(code)}
                    phoneVerifyCancel={() => this.phoneVerifyCancel()}
                    phoneVerifyPass={() => this.phoneVerifyPass()}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 10
    },
    loginBoxStyle: {
        backgroundColor: "white", 
        width: "100%",
        borderWidth: 1, 
        borderColor: "#BDBDBD", 
        borderRadius: 3, 
        height: 42, 
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: "row",
        marginTop: 40
    }
};

const mapStateToProps = state => {
    const { name, password, email, error, loading, countryCode, phone } = state.registration;
  
    return {
      name,
      email,
      password,
      error,
      loading,
      countryCode,
      phone
    };
  };

export default connect(
    mapStateToProps,
    {
        registrationLogin,
        registrationNextAddProfile,
        registrationTextInputChange
    }
)(RegistrationAccount);
