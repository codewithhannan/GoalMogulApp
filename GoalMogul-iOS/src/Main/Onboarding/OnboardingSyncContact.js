import React from 'react';
import {
    View,
    Text,
    Dimensions,
    Image
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import OnboardingHeader from './Common/OnboardingHeader';
import { GM_FONT_SIZE, GM_BLUE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT, BUTTON_STYLE as buttonStyle } from '../../styles';
import { PRIVACY_POLICY_URL } from '../../Utils/Constants';
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions';
import OnboardingFooter from './Common/OnboardingFooter';
import { REGISTRATION_SYNC_CONTACT_NOTES } from '../../redux/modules/registration/RegistrationReducers';
import DelayedButton from '../Common/Button/DelayedButton';

const screenWidth = Math.round(Dimensions.get('window').width);
/**
 * Onboarding flow Sync Contact page.
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class OnboardingSyncContact extends React.Component {

    onSyncContact = () => {

    }

    onNotNow = () => {

    }

    renderButtons() {
        return (
            <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
                <DelayedButton 
                    onPress={this.onSyncContact}
                    style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle}
                >
                    <Text style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}>Continue</Text>
                </DelayedButton>
                <DelayedButton onPress={this.onNotNow} style={[buttonStyle.GM_WHITE_BG_BLUE_TEXT.containerStyle, { marginTop: 10 }]}>
                    <Text style={buttonStyle.GM_WHITE_BG_BLUE_TEXT.textStyle}>Not Now</Text>
                </DelayedButton>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, padding: 20, marginTop: 20, alignItems: "center" }}>
                    <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
                        <View style={{ height: screenWidth * 0.65, width: screenWidth * 0.65, backgroundColor: "#F2F2F2" }} />
                        <View style={{ marginTop: 40 }}>
                            <Text style={styles.titleTextStyle}>Find friends who</Text>
                            <Text style={styles.titleTextStyle}>already use GoalMogul</Text>
                        </View>
                        {this.renderButtons()}
                    </View>
                    <Text style={styles.noteTextStyle}>
                        {REGISTRATION_SYNC_CONTACT_NOTES}
                        <Text style={{ color: GM_BLUE }} onPress={() => WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL, { showTitle: true })}>
                            {` Learn more`}
                        </Text>
                    </Text>
                    
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
    noteTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_1,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_3_5,
        fontFamily: GM_FONT_FAMILY.GOTHAM,
        color: "#333333",
        alignSelf: "flex-end",
        paddingBottom: 20
    },
    titleTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_4, lineHeight: GM_FONT_LINE_HEIGHT.FONT_4,
        fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
        textAlign: "center"
    }
};

const mapStateToProps = state => {

    return {
        
    };
};

export default connect(
    mapStateToProps,
    {

    }
)(OnboardingSyncContact);