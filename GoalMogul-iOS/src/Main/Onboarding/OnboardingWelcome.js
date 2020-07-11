import React from 'react';
import {
    View,
    Text,
    Dimensions,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import OnboardingHeader from './Common/OnboardingHeader';
import { BUTTON_STYLE as buttonStyle, TEXT_STYLE as textStyle } from '../../styles';
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions';
import DelayedButton from '../Common/Button/DelayedButton';

const screenWidth = Math.round(Dimensions.get('window').width);
/**
 * Last page in onboarding process to welcome user to GM.
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class OnboardingWelcome extends React.Component {

    continue = () => {
        const screenTransitionCallback = () => { 
            Actions.replace('drawer');
        };
        screenTransitionCallback();
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, padding: 20, marginTop: 20, alignItems: "center" }}>
                    <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
                    {/** Image placeholder */}
                    <View style={{ height: screenWidth * 0.65, width: screenWidth * 0.65, backgroundColor: "#F2F2F2" }} />
                        <View style={{ marginTop: 40 }}>
                            <Text style={textStyle.onboardingTitleTextStyle}>Welcome to GoalMogul!</Text>
                            <Text style={[textStyle.onboardingPharagraphTextStyle, { paddingLeft: 20, paddingRight: 20, marginTop: 30 }]}>
                                Here you'll forget deeper & more meaningful connections, based on goals & dreams that are truly important to you in life!
                            </Text>
                    
                        </View>
                    </View>
                    <DelayedButton 
                        onPress={this.continue}
                        style={[buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle, { marginBottom: 20 }]}
                    >
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
    }
    
};

const mapStateToProps = state => {

    return {};
};

export default connect(
    mapStateToProps,
    {

    }
)(OnboardingWelcome);