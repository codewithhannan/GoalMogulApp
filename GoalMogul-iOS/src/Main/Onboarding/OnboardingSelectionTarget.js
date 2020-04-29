import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
    View,
    Text,
    TextInput,
    Animated,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OnboardingHeader from './Common/OnboardingHeader';
import DelayedButton from '../Common/Button/DelayedButton';
import { GM_FONT_SIZE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT } from '../../styles';
import { registrationTargetSelection } from '../../redux/modules/registration/RegistrationActions';
import OnboardingFooter from './Common/OnboardingFooter';
import { CheckBox } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

/**
 * Page for user to select important things they want to achieve in GM
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class OnboardingSelectionTarget extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            otherSelected: false
        };
        this.animations = {
            checkBoxOpacity: new Animated.Value(1)
        }
    }

    onNext = () => {
        // Sent api request to register targets
        // Transition to next screen
        const screenTransitionCallback = () => { 
            Actions.push("registration_tribe_selection");
        };
        screenTransitionCallback();
    }

    onBack = () => {
        // Go back to the transition intro
        const screenTransitionCallback = () => { 
            Actions.pop();
        };
        screenTransitionCallback();
    }

    onSelect = (title, prevVal, extra) => {
        if (title == "Other") {
            // Set state and animate to expand the input box
            this.setState({
                ...this.state, otherSelected: !prevVal
            });
        }

        return this.props.registrationTargetSelection(title, !prevVal, extra);
    }

    keyExtractor = (item) => item.title;

    renderOtherTextInput = () => {
        const { userTargets } = this.props;
        if (!userTargets) {
            return null;
        }

        const { extra, selected, title } = userTargets[userTargets.length - 1];
        if (!selected) {
            return null;
        }

        return (
            <View style={{ marginTop: 10 }} key="Other TextInput">
                <Text style={{ fontSize: GM_FONT_SIZE.FONT_1, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, fontFamily: GM_FONT_FAMILY.GOTHAM }}>Others</Text>
                <View style={{ padding: 12, borderWidth: 1, borderColor: "#A6AAB4", borderRadius: 3 }}>
                    <TextInput 
                        placeholder="Others placeholder"
                        style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, fontFamily: GM_FONT_FAMILY.GOTHAM }}
                        value={extra}
                        onChangeText={(val) => this.props.registrationTargetSelection(title, selected, val)}
                        minHeight={180}
                        maxHeight={180}
                        multiline
                        autoFocus
                    />
                </View>
            </View>
        );
    }

    renderTargets = () => {
        const { userTargets } = this.props;
        let ret = userTargets.map((item) => {
            const { title, selected, extra } = item;
            return (
                <Animated.View style={{ marginTop: 12, marginBottom: 12, opacity: this.animations.checkBoxOpacity }} key={title}>
                    <DelayedButton 
                        style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                        onPress={() => this.onSelect(title, selected, extra)}
                        activeOpacity={1}
                    >
                        <CheckBox 
                            textStyle={{fontWeight: 'normal'}}
                            checked={selected}
                            checkedIcon={<MaterialIcons
                                name="done"
                                color="#1B63DC"
                                size={21}
                            />}
                            uncheckedIcon={null}
                            containerStyle={styles.checkBoxContainerStyle(selected)}
                            onPress={() => this.onSelect(title, selected, extra)}
                        />
                        <View style={{ flex: 1, flexGrow: "1", paddingRight: 10, paddingLeft: 15 }}>
                            <Text style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, fontFamily: GM_FONT_FAMILY.GOTHAM, flexWrap: "wrap" }}>
                                {title}
                            </Text>
                        </View>
                    </DelayedButton>
                </Animated.View>
            );
        });

        return ret;
    }
 
    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ alignItems: "center", marginTop: 35 }}>
                        <Text style={styles.titleTextStyle}>
                            Which of the following are
                        </Text>
                        <Text style={styles.titleTextStyle}>
                            most important to you?
                        </Text>
                        <Text style={styles.subTitleTextStyle}>(Check all that apply)</Text>
                    </View>
                    <KeyboardAwareScrollView
                        enableAutomaticScroll
                        extraScrollHeight={200}
                        innerRef={ref => { this.scrollview = ref; }}
                        keyExtractor={this.keyExtractor}
                        contentContainerStyle={{
                            padding: 25
                            // backgroundColor: 'white',
                            // flexGrow: 1 // this will fix scrollview scroll issue by passing parent view width and height to it
                        }}
                        onKeyboardWillShow={() => {
                            // this.scrollview.props.scrollToPosition(0, 120)
                            Animated.timing(this.animations.checkBoxOpacity, {
                                toValue: 0.4,
                                duration: 300,
                            }).start();
                        }}
                        onKeyboardWillHide={() => {
                            // this.scrollview.props.scrollToPosition(0, 0);
                            Animated.timing(this.animations.checkBoxOpacity, {
                                toValue: 1,
                                duration: 300,
                            }).start();
                        }}
                    >
                        {this.renderTargets()}
                        {this.renderOtherTextInput()}
                    </KeyboardAwareScrollView>
                </View>
                <OnboardingFooter totalStep={4} currentStep={2} onNext={this.onNext} onPrev={this.onBack} />
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
        fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD
    },
    subTitleTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_1, lineHeight: GM_FONT_LINE_HEIGHT.FONT_1,
        fontFamily: GM_FONT_FAMILY.GOTHAM,
        marginTop: 20,
        marginBottom: 10
    },
    checkBoxContainerStyle: (selected) => ({
        width: 28, height: 28, 
        borderRadius: 3, borderWidth: 1, 
        borderColor: selected ? "#1B63DC" : "#B4BFC9", 
        padding: 0, justifyContent: "center", alignItems: "center", marginLeft: 0, marginRight: 0, margin: 0
    })
};

const mapStateToProps = (state) => {
    const { userTargets } = state.registration;
    return {
        userTargets
    };
};

export default connect(
    mapStateToProps,
    {
        registrationTargetSelection
    }
)(OnboardingSelectionTarget);