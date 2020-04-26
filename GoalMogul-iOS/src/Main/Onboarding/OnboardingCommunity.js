import React from 'react';
import {
    View,
    Text,
    FlatList,
    Animated,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import right_arrow_icon from '../../asset/utils/right_arrow.png';
import OnboardingHeader from './Common/OnboardingHeader';
import DelayedButton from '../Common/Button/DelayedButton';
import { GM_FONT_SIZE, GM_BLUE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT } from '../../styles';
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions';
import OnboardingFooter from './Common/OnboardingFooter';

/**
 * Fanout page for community guideline during onboard
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class OnboardingCommunity extends React.Component {


    render() {
        return (
            <View>
                <OnboardingHeader />
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ alignItems: "center", marginTop: 35 }}>
                        <Text style={styles.titleTextStyle}>You are here to share</Text>
                        <Text style={styles.titleTextStyle}>your goals with others</Text>
                    </View>
        
                </View>
                <OnboardingFooter buttonText="Continue" onButtonPress={() => console.log("continue")} />
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: "white"
    },
    titleTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_4, lineHeight: GM_FONT_LINE_HEIGHT.FONT_4,
        fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
        marginBottom: 20
    },
};

export default OnboardingCommunity;