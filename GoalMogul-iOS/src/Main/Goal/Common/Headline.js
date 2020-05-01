/**
 * On version 0.3.9, MenuFactory is refactored out to Menu.js under the same path. Please read more for information.
 */
import React from 'react';
import {
    View,
    Alert,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

/* Components */
import Name from './Name';
import Category from './Category';
import { UserBanner, openProfile } from '../../../actions';
import MenuFactory from './Menu';

// Actions
import {
    editGoal,
    shareGoalToMastermind,
    markGoalAsComplete
} from '../../../redux/modules/goal/GoalDetailActions';

/* Asset */
import ShareIcon from '../../../asset/utils/forward.png';
import EditIcon from '../../../asset/utils/edit.png';
import UndoIcon from '../../../asset/utils/undo.png';
import TrashIcon from '../../../asset/utils/trash.png';
import Icons from '../../../asset/base64/Icons';

const { CheckIcon } = Icons;
const { width } = Dimensions.get('window');
const DEBUG_KEY = '[ UI Headline ]';
/**
 * category:
 * name:
 * caretOnPress:
 * caretOnDelete:
 * isSelf:
 * hasCaret: if null, show no caret
 */
class Headline extends React.PureComponent {
    componentDidMount() {
        if (this.props.onRef !== null && this.props.onRef !== undefined) {
            this.props.onRef(this);
        }
    }

    openMenu() {
        if (this.headlineMenu !== undefined) {
            console.log(`${DEBUG_KEY}: [ openMenu ]`);
            this.headlineMenu.openMenu();
        }
    }

    handleSelfCaretOnPress = (val) => {
        const { item } = this.props;
        if (!item) return null;

        const { isCompleted, _id } = item;
        const markCompleteOnPress = isCompleted
            ? () => {
                Alert.alert(
                    'Confirmation',
                    'Are you sure to mark this goal as incomplete?',
                    [
                        { text: 'Cancel', onPress: () => console.log('user cancel unmark') },
                        {
                            text: 'Confirm',
                            onPress: () => this.props.markGoalAsComplete(_id, false, this.props.pageId)
                        }
                    ]
                );
            }
            : () => this.props.markGoalAsComplete(_id, true, this.props.pageId);

        if (val === 'Delete') return this.props.caretOnDelete();
        if (val === 'Edit Goal') return this.props.editGoal(item);
        if (val === 'Share to Goal Feed') return this.props.shareGoalToMastermind(_id, this.props.pageId);
        if (val === 'Unmark as Complete' || val === 'Mark as Complete') {
            markCompleteOnPress();
        }
    }

    handleNameOnPress = (user) => {
        if (!user || !user._id) return;

        const { disabled } = this.props;
        if (disabled) return;

        const { _id } = user;
        if (this.props.actionDecorator) {
            this.props.actionDecorator(() => this.props.openProfile(_id));
        } else {
            this.props.openProfile(_id);
        }
    }

    renderDeleteOptionOnly(menuName) {
        const caret = (
            <MenuFactory
                ref={(ref) => { this.headlineMenu = ref; }}
                options={
                    [
                        { option: 'Delete' }
                    ]
                }
                callback={() => this.props.caretOnDelete()}
                triggerText={''}
                triggerContainerStyle={styles.caretContainer}
                animationCallback={() => console.log('Report Modal is opened')}
                shouldExtendOptionLength={false}
                menuName={menuName}
            />
        );
        return caret;
    }

    renderSelfCaret(item, deleteOnly, menuName) {
        if (!item || deleteOnly) return this.renderDeleteOptionOnly(menuName);
        const { isCompleted } = item;

        const caret = (
            <MenuFactory
                ref={(ref) => { this.headlineMenu = ref; }}
                options={
                    [
                        { option: 'Edit Goal', iconSource: EditIcon },
                        { option: 'Share to Goal Feed', iconSource: ShareIcon },
                        {
                            option: isCompleted ? 'Unmark as Complete' : 'Mark as Complete',
                            iconSource: isCompleted ? UndoIcon : CheckIcon
                        },
                        { option: 'Delete', iconSource: TrashIcon },
                    ]
                }
                callback={(val) => this.handleSelfCaretOnPress(val)}
                triggerText={''}
                triggerContainerStyle={styles.caretContainer}
                animationCallback={() => console.log('Report Modal is opened')}
                shouldExtendOptionLength
                menuName={menuName}
            />
        );
        return caret;
    }

    render() {
        const {
            category,
            name,
            caretOnPress,
            isSelf,
            hasCaret,
            user,
            item,
            deleteOnly,
            caret,
            textStyle,
            menuName
        } = this.props;

        // If item belongs to self, then caret displays delete
        let menu;
        if (caret && !_.isEmpty(caret)) {
            const { options, onPress, shouldExtendOptionLength } = isSelf ? caret.self : caret.others;
            menu = (
                <MenuFactory
                    ref={(ref) => { this.headlineMenu = ref; }}
                    options={options}
                    callback={onPress}
                    triggerText={''}
                    triggerContainerStyle={styles.caretContainer}
                    animationCallback={() => console.log(`${DEBUG_KEY}: menu is opened for options with shouldExtendOptionLength: ${shouldExtendOptionLength}. `)}
                    shouldExtendOptionLength={shouldExtendOptionLength}
                    menuName={menuName}
                />
            )
        } else {
            menu = isSelf === undefined || !isSelf ? (
                <MenuFactory
                    ref={(ref) => { this.headlineMenu = ref; }}
                    options={[{ option: 'Report' }]}
                    callback={() => caretOnPress()}
                    triggerText={''}
                    triggerContainerStyle={styles.caretContainer}
                    animationCallback={() => console.log('Report Modal is opened')}
                    shouldExtendOptionLength={false}
                    menuName={menuName}
                />
            ) : this.renderSelfCaret(item, deleteOnly, menuName);
        }

        const categoryComponent = category ? <Category text={category} /> : <View style={{ flex: 1 }} />;

        return (
            <View style={styles.containerStyle}>
                <Name text={name} onPress={() => this.handleNameOnPress(user)} textStyle={textStyle} />
                {/* <Image style={styles.imageStyle} source={badge} /> */}
                <UserBanner user={user} iconStyle={{ marginTop: 1 }} />
                {categoryComponent}
                <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                    {hasCaret === null || hasCaret === false ? null : menu}
                </View>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    caretContainer: {
        paddingBottom: 8,
        paddingRight: 8,
        paddingLeft: 10,
        paddingTop: 1
    },
    imageStyle: {
        alignSelf: 'center',
        marginLeft: 3,
        marginRight: 3
    },
    iconStyle: {
        height: 17,
        width: 17,
        tintColor: '#555'
    },
    // Menu related style
    triggerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#e9e9e9',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 1,
    },
    anchorStyle: {
        backgroundColor: 'white'
    },
    menuOptionsStyles: {
        optionsContainer: {
            width: width / 3,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10
        },
        optionsWrapper: {

        },
        optionWrapper: {
            flex: 1,
            width: '100%'
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
            flex: 1
        },
        optionText: {
            paddingTop: 5,
            paddingBottom: 5,
            color: '#555'
        },
    }
};

export default connect(
    null,
    {
        openProfile,
        editGoal,
        shareGoalToMastermind,
        markGoalAsComplete
    }
)(Headline);
