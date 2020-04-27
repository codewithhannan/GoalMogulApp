import React from 'react';
import {
    View,
    Text,
    Dimensions,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import OnboardingHeader from './Common/OnboardingHeader';
import { GM_FONT_SIZE, GM_BLUE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT, TEXT_STYLE as textStyle } from '../../styles';
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions';
import OnboardingFooter from './Common/OnboardingFooter';

const screenWidth = Math.round(Dimensions.get('window').width);
/**
 * Fanout page for community guideline during onboard
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class OnboardingCommunity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            swipeAll: false
        };
    }

    onSwipedAll = (index) => {
        if (index == this.props.communityGuidelines.length - 1) {
            this.setState({ ...this.state, swipeAll: true });
        }
    }

    renderCard = ({ index, item }) => {
        const { title, subTitle, picture } = item;
        return (
            <View style={{ flex: 1, backgroundColor: "white", paddingTop: 0, paddingBottom: 30, alignItems: "center", margin: 10 ,borderWidth: 1, borderColor: "lightgray", borderRadius: 10, ...styles.shadow }}>
                <View style={{ flex: 1 }}>
                    {/* <Image source={picture} style={{ width: "100%", height: 280 }} resizeMode="cover" /> */}
                    <View style={{ width: screenWidth - 32 - 10 - 10, height: screenWidth - 32 - 10, backgroundColor: "gray", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}/>
                </View>
                
                <View style={{ width: "90%" }}>
                    <Text style={{ fontSize: GM_FONT_SIZE.FONT_3_5, lineHeight: GM_FONT_LINE_HEIGHT.FONT_4, fontFamily: GM_FONT_FAMILY.GOTHAM, marginTop: 14, marginBottom: 14, textAlign: "center" }}>{title}</Text>
                    {
                        subTitle 
                        ? (
                            <Text style={{ fontSize: GM_FONT_SIZE.FONT_1, fontFamily: GM_FONT_FAMILY.GOTHAM, textAlign: "center" }}>
                                {subTitle}
                            </Text>) 
                        : null
                    }
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, paddingBottom: 20, paddingRight: 20, paddingLeft: 20  }}>
                    <View style={{ alignItems: "center", marginTop: 35 }}>
                        <Text style={textStyle.onboardingTitleTextStyle}>You are here to share</Text>
                        <Text style={textStyle.onboardingTitleTextStyle}>your goals with others</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.props.communityGuidelines}
                            renderItem={this.renderCard}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth - 32}
                            layout={'stack'} layoutCardOffset={10}
                            onSnapToItem={this.onSwipedAll}
                        />
                    </View>
                    <View style={{ opacity: this.state.swipeAll ? 1 : 0 }}>
                        <OnboardingFooter buttonText="Continue" onButtonPress={() => console.log("continue")} />
                    </View>
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
    shadow: {
        shadowOffset: {
            width: 0,
            height: 0
        },
        elevation: 6,
        shadowRadius: 6,
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.06)'
    }
};

const mapStateToProps = state => {
    const { communityGuidelines } = state.registration;
    return {
        communityGuidelines
    };
};

export default connect(
    mapStateToProps, 
    {

    }
)(OnboardingCommunity);