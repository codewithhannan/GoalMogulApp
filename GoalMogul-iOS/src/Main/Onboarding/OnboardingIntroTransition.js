import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import OnboardingHeader from './Common/OnboardingHeader';
import DelayedButton from '../Common/Button/DelayedButton';
import { TEXT_STYLE as textStyle, BUTTON_STYLE as buttonStyle } from '../../styles';
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
                        <Text style={[textStyle.onboardingTitleTextStyle, { marginTop: 50, marginBottom: 30 }]}>
                            Hi, {name ? `${name}` : "Jia"}
                        </Text>
                        <Text style={textStyle.onboardingPharagraphTextStyle}>
                            We are going to ask you
                        </Text>
                        <Text style={textStyle.onboardingPharagraphTextStyle}>
                            three questions to customize
                        </Text>
                        <Text style={textStyle.onboardingPharagraphTextStyle}>
                            your experience
                        </Text>
                    </View>
                    <DelayedButton style={[buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle, { marginTop: 40, marginBottom: 20 }]} onPress={this.onContinue}>
                        <Text style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}>Continue</Text>
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