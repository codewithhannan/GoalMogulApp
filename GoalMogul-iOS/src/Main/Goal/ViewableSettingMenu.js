import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm';

// Component
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';

// Asset
import dropDown from '../../asset/utils/dropDown.png';
import profilePeople from '../../asset/utils/profile_people.png';

// Actions
import { DEFAULT_STYLE } from '../../styles';


const VIEWABLE_SETTING_MENU_OPTTIONS = ['Friends', 'Public', 'Private', 'Cancel'];
const CANCEL_INDEX = 3;
const DEBUG_KEY = '[ ViewableSettingMenu Component ]';
const WalkableView = walkthroughable(View);

class ViewableSettingMenu extends Component {

    handleInfoIcon = () => {
        Alert.alert(
            'Share to goals feed',
            'Choosing this will make your goal appear on your friends’ home feed'
        );
    }

    handleOnClick = () => {
        const viewableSettingSwitchCases = switchByButtonIndex([
            [R.equals(0), () => {
                // User choose Friends
                console.log(`${DEBUG_KEY} User choose setting: Friends `);
                this.props.callback('Friends');
                // TODO: update reducer state
            }],
            [R.equals(1), () => {
                // User choose Public
                console.log(`${DEBUG_KEY} User choose setting: Public `);
                this.props.callback('Public');
            }],
            [R.equals(2), () => {
                // User choose Public
                console.log(`${DEBUG_KEY} User choose setting: Self `);
                this.props.callback('Private');
            }]
        ]);

        const viewableSettingActionSheet = actionSheet(
            VIEWABLE_SETTING_MENU_OPTTIONS,
            CANCEL_INDEX,
            viewableSettingSwitchCases
        );
        return viewableSettingActionSheet();
    }

    render() {
        const { belongsToTribe, belongsToEvent } = this.props;

        const settingDisabled = belongsToTribe !== undefined || belongsToEvent !== undefined;

        // Don't show caret if belongs to event or tribe
        const caret = settingDisabled
            ? null
            : (
                <View style={{ padding: 5 }}>
                    <Image style={styles.caretStyle} source={dropDown} />
                </View>
            );

        let tutorialComponent = null;
        if (this.props.tutorialOn && this.props.tutorialOn.shareToMastermind) {
            const { tutorialText, order, name } = this.props.tutorialOn.shareToMastermind;
            tutorialComponent = (
                <CopilotStep text={tutorialText} order={order} name={name}>
                    <WalkableView style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
                </CopilotStep>
            );
        }

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={DEFAULT_STYLE.smallText_1}>Share To: </Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        ...styles.containerStyle,
                        opacity: settingDisabled ? 0 : 95,
                        marginLeft: 5
                    }}
                    onPress={this.handleOnClick}
                    disabled={settingDisabled}
                >
                    <Image
                        resizeMode="contain"
                        style={{
                            ...DEFAULT_STYLE.smallIcon_1,
                            margin: 5,
                            tintColor: 'rgb(155,155,155)'
                        }}
                        source={profilePeople}
                    />
                    <Text style={{ ...DEFAULT_STYLE.smallText_1, marginTop: 2 }}>
                        {this.props.viewableSetting}
                    </Text>
                    {caret}
                    {tutorialComponent}
                </TouchableOpacity>
            </View>

        );
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        borderColor: '#e9e9e9',
        borderWidth: 1,
        borderRadius: 3
    },
    caretStyle: {
        tintColor: '#20485f',
    },
    informationIconStyle: {
        ...DEFAULT_STYLE.smallIcon_1
    },
    profileIconStyle: {
        ...DEFAULT_STYLE.smallIcon_1,
        margin: 3,
        marginLeft: 6,
        tintColor: 'rgb(155,155,155)'
    }
};

export default connect(
    null,
    null
)(ViewableSettingMenu);
