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
import DelayedButton from '../Common/Button/DelayedButton';
import { GM_FONT_SIZE, GM_BLUE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT } from '../../styles';
import { registrationTextInputChange } from '../../redux/modules/registration/RegistrationActions';

/**
 * Transition page from user registration to onboarding intro. Displaying text
 * to explain the following few pages
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class OnboardingIntroTransition extends React.Component {

    onContinue = () => {

    }

    renderProfileImage() {
        return (
            <View style={styles.imageContainerStyle}>
                {/* <Image /> */}
            </View>
        )
    }
 
    render() {
        const { name } = this.props;

        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, paddingLeft: 25, paddingRight: 25, marginBottom: 30 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        {this.renderProfileImage()}
                        <Text style={styles.titleTextStyle}>
                            Hi, {name ? `${name}` : "Jia"}
                        </Text>
                        <Text style={styles.subTitleTextStyle}>
                            We are going to ask you
                        </Text>
                        <Text style={styles.subTitleTextStyle}>
                            three questions to customize
                        </Text>
                        <Text style={styles.subTitleTextStyle}>
                            your experience
                        </Text>
                    </View>
                    <DelayedButton style={styles.continueContainerStyle} onPress={this.onContinue}>
                        <Text style={styles.continueTextStyle}>Continue</Text>
                    </DelayedButton>
                </View>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: "white"
    },
    imageContainerStyle: {
        height: 250,
        width: 250,
        backgroundColor: "lightgray"
    },
    imageStyle: {

    },
    continueContainerStyle: {
        height: 45,
        width: "100%",  
        backgroundColor: GM_BLUE,
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginTop: 40,
        marginBottom: 20
    },
    continueTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_3,
        fontWeight: "bold",
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
        color: "white",
        fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD
    },
    subTitleTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_3,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_4,
        fontFamily: GM_FONT_FAMILY.GOTHAM,
        fontWeight: "500",
        textAlign: "center"
    },
    titleTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_4,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_4,
        fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
        textAlign: "center",
        marginTop: 50,
        marginBottom: 30
    }
};

const mapStateToProps = (state) => {
    const { name } = state.registration;
    return {
        name
    };
};

export default connect(
    mapStateToProps,
    {}
)(OnboardingIntroTransition);