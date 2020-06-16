import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';
// import Decode from 'unescape'; TODO: removed once new decode is good to go

// Asset
import bulb from '../../../asset/utils/bulb.png';
import forward from '../../../asset/utils/forward.png';
import Icons from '../../../asset/base64/Icons';
import back from '../../../asset/utils/back.png';
import menu from '../../../asset/utils/drag_indicator.png';

// Components
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import DelayedButton from '../../Common/Button/DelayedButton';

// Actions
import {
    chooseShareDest
} from '../../../redux/modules/feed/post/ShareActions';

import { updateGoalItems } from '../../../redux/modules/goal/GoalDetailActions';
import { decode } from '../../../redux/middleware/utils';
import { GM_BLUE, DEFAULT_STYLE, BACKGROUND_COLOR } from '../../../styles';


// Constants
const DEBUG_KEY = '[ UI GoalCard.Need/Step SectionCardV2 ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;
const { CheckIcon: checkIcon } = Icons;

// SectionCardV2.defaultPros = {
//   item,
//   goalRef,
//   type,
//   isSelf,
//   onCardPress
// };

class SectionCardV2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInputFocused: false,
            textValue: props.item ? props.item.description : ''
        }
    }

    handleShareOnClick = () => {
        const { item, goalRef, type } = this.props;
        const { _id } = item;
        const shareType = (type === 'need' || type === 'Need') ? 'ShareNeed' : 'ShareStep';

        const shareToSwitchCases = switchByButtonIndex([
            [R.equals(0), () => {
                // User choose to share to feed
                console.log(`${DEBUG_KEY} User choose destination: Feed `);
                this.props.chooseShareDest(shareType, _id, 'feed', item, goalRef._id);
                // TODO: update reducer state
            }],
            [R.equals(1), () => {
                // User choose to share to an event
                console.log(`${DEBUG_KEY} User choose destination: Event `);
                this.props.chooseShareDest(shareType, _id, 'event', item, goalRef._id);
            }],
            [R.equals(2), () => {
                // User choose to share to a tribe
                console.log(`${DEBUG_KEY} User choose destination: Tribe `);
                this.props.chooseShareDest(shareType, _id, 'tribe', item, goalRef._id);
            }],
        ]);

        const shareToActionSheet = actionSheet(
            SHARE_TO_MENU_OPTTIONS,
            CANCEL_INDEX,
            shareToSwitchCases
        );
        return shareToActionSheet();
    };

    // Render Suggestion icon and number of comments
    renderActionIcons() {
        const commentCount = this.props.count === undefined ? 15 : this.props.count;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={bulb} style={{ ...DEFAULT_STYLE.smallIcon_1, tintColor: '#FCB110' }} />
                <Text style={styles.actionTextStyle}>{commentCount} comments</Text>
                <DelayedButton
                    activeOpacity={0.6}
                    style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}
                    onPress={() => this.handleShareOnClick()}
                >
                    <Image style={{ ...DEFAULT_STYLE.smallIcon_1, tintColor: '#828282' }} source={forward} />
                    <Text style={styles.actionTextStyle}>Share</Text>
                </DelayedButton>
            </View>
        );
    }

    renderCheckBox(isCompleted) {
        const { item: { _id }, goalRef, pageId, isFocusedItem, isSelf, type } = this.props;

        const iconContainerStyle = isCompleted
            ? styles.checkIconContainerStyle
            : {
                ...styles.checkIconContainerStyle,
                padding: 0,
                borderWidth: 2,
                borderColor: '#DADADA',
                backgroundColor: isSelf ? 'white' : '#DADADA'
            };

        if (type === 'comment' || isFocusedItem) return;
        else if (isSelf) {
            return (
                <DelayedButton
                    activeOpacity={0.6}
                    style={iconContainerStyle}
                    onPress={() => this.props.updateGoalItems(_id, type, { isCompleted: !isCompleted }, goalRef, pageId)}
                >
                    <Image style={styles.checkIconStyle} source={checkIcon} />
                </DelayedButton>
            );
        } else {
            return (
                <View style={iconContainerStyle}>
                    <Image source={checkIcon} style={styles.checkIconStyle} />
                </View>
            );
        }
    }

    renderBackIcon() {
        const { type, isFocusedItem } = this.props;
        if (!isFocusedItem) return null;
        return (
            <View style={{ justifyContent: type === 'comment' ? 'center' : 'flex-start', marginRight: 10 }}>
                <DelayedButton
                    onPress={this.props.onBackPress}
                    activeOpacity={0.6}
                    style={{
                        padding: 4,
                        backgroundColor: type === 'comment' ? GM_BLUE : '#BFBFBF',
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image source={back} style={{ ...DEFAULT_STYLE.smallIcon_1, tintColor: 'white'}} />
                </DelayedButton>
            </View>
        );
    }

    handleOnLayout = (event) => {
        if (this.props.onContentSizeChange)
            this.props.onContentSizeChange(event);
    }

    renderTextStuff(isCommentFocused, description) {
        const { item: { _id }, goalRef, pageId, isSelf, type } = this.props;

        const sectionText = isCommentFocused ? 'Back to Steps & Needs' : description;
        const hasTextChanged = this.input && this.input.props.value !== description;
        const showSave = hasTextChanged && this.input.props.value !== '';

        const textToDisplay = decode(sectionText === undefined ? 'No content' : sectionText);
        const textStyle = isCommentFocused ? [ DEFAULT_STYLE.smallTitle_1, { color: 'black', marginTop: 4 } ]
            : [ DEFAULT_STYLE.normalText_1, { marginLeft: 4 } ];
        
        return(
            <View style={{
                marginRight: isSelf ? 4 : 0
            }}>
                {isSelf === true && !isCommentFocused ?
                    <TextInput
                        ref={ref => this.input = ref}
                        style={{
                            ...textStyle,
                            padding: 4,
                            backgroundColor: this.state.isInputFocused ? '#F2F2F2' : styles.backgroundColor
                        }}
                        value={this.state.textValue}
                        onFocus={() => this.setState({ isInputFocused: true })}
                        onBlur={() => this.setState({ isInputFocused: false })}
                        onChangeText={text => this.setState({ textValue: text })}
                        multiline
                    />
                    : <Text style={textStyle} ellipsizeMode='tail' >
                        {textToDisplay}
                    </Text>
                }
                {!isCommentFocused &&
                    <View
                        style={{
                            height: isSelf ? 2 : 0,
                            backgroundColor: '#F2F2F2',
                            marginBottom: 10
                        }} 
                    />
                }
                {hasTextChanged &&
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <DelayedButton
                            activeOpacity={0.6}
                            style={{
                                backgroundColor: '#E0E0E0',
                                borderRadius: 3,
                                padding: 2,
                                paddingRight: 8,
                                paddingLeft: 8
                            }}
                            onPress={() => this.setState({ textValue: description })}
                        >
                            <Text style={DEFAULT_STYLE.normalText_2}>Cancel</Text>
                        </DelayedButton>
                        {showSave && <DelayedButton
                            activeOpacity={0.6}
                            style={{
                                backgroundColor: GM_BLUE,
                                borderRadius: 3,
                                padding: 2,
                                paddingRight: 8,
                                paddingLeft: 8,
                                marginLeft: 12
                            }}
                            onPress={() => this.props.updateGoalItems(_id, type, { description: this.state.textValue }, goalRef, pageId)}
                        >
                            <Text style={{ ...DEFAULT_STYLE.normalText_2, color: 'white' }}>Save</Text>
                        </DelayedButton>}
                    </View>
                }
            </View>
        );
    }

    render() {
        // console.log('item for props is: ', this.props.item);
        const { type, item, isActive, drag } = this.props;
        let itemToRender = item;
        const isCommentFocused = type === 'comment';

        // Render empty state
        if (!item && !isCommentFocused) {
            const emptyText = (type === 'need' || type === 'Need') ? 'No needs' : 'No steps';
            itemToRender = { description: `${emptyText}`, isCompleted: false };
            return renderEmptyState(emptyText);
        }

        const { description, isCompleted } = itemToRender;
        const containerStyle = isCommentFocused ? { paddingTop: 0, paddingBottom: 0, minHeight: 40 * DEFAULT_STYLE.uiScale, alignItems: 'center' }
            : { backgroundColor: isActive ? '#F2F2F2' : styles.backgroundColor };

        return (
            <DelayedButton
                activeOpacity={0.6}
                style={[styles.sectionContainerStyle, containerStyle]}
                onPress={this.props.onCardPress || this.props.onBackPress}
                onLayout={this.handleOnLayout}
            >
                {this.renderBackIcon()}
                <View style={{ justifyContent: 'flex-start' }}>
                    {this.renderCheckBox(isCompleted)}
                </View>
                <View style={{ flex: 1 }}>
                    {this.renderTextStuff(isCommentFocused, description)}
                    {!isCommentFocused && this.renderActionIcons()}
                </View>
                {drag && <TouchableOpacity
                    onLongPress={drag}
                    onPressOut={drag}
                    style={styles.gestureHandlerContainer}
                >
                    <Image source={menu} resizeMode="contain" style={{ ...DEFAULT_STYLE.buttonIcon_1, tintColor: '#AAA' }} />
                </TouchableOpacity>}
            </DelayedButton>
        );
    }
}

const renderEmptyState = (text) => {
    return (
        <View
            style={{
                ...styles.sectionContainerStyle,
                height: 66,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    justifyContent: 'center',
                    fontWeight: '700',
                    color: '#909090',
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
            >
                {text}
            </Text>
        </View>
    );
};

const styles = {
    backgroundColor: BACKGROUND_COLOR,
    sectionContainerStyle: {
        padding: 16,
        flexDirection: 'row',

        borderTopWidth: 0.5,
        borderBottomWidth: 1,
        borderTopColor: '#F2F2F2',
        borderBottomColor: '#F2F2F2'
    },
    actionTextStyle: {
        ...DEFAULT_STYLE.normalText_2,
        marginLeft: 6,
        marginTop: 2
    },
    checkIconContainerStyle: {
        padding: 2,
        borderRadius: 100,
        backgroundColor: '#27AE60',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    checkIconStyle: {
        ...DEFAULT_STYLE.normalIcon_1,
        tintColor: 'white'
    },
    gestureHandlerContainer: {
        backgroundColor: '#F5F7FA',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#DFE0E1',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        paddingRight: 6,
        margin: -10,
        marginRight: -18,
        marginLeft: 8
    }
};

export default connect(
    null,
    {
        chooseShareDest,
        updateGoalItems
    }
)(SectionCardV2);
