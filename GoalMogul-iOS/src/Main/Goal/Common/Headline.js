import React from 'react';
import {
  TouchableOpacity,
  View,
  Alert,
  Image,
  Text,
  FlatList,
  Dimensions
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { connect } from 'react-redux';
import _ from 'lodash';

/* Components */
import Name from './Name';
import Category from './Category';
import { UserBanner, openProfile } from '../../../actions';

// Actions
import {
  editGoal,
  shareGoalToMastermind,
  markGoalAsComplete
} from '../../../redux/modules/goal/GoalDetailActions';

/* Asset */
import badge from '../../../asset/utils/badge.png';
import dropDown from '../../../asset/utils/dropDown.png';
import ShareIcon from '../../../asset/utils/forward.png';
import EditIcon from '../../../asset/utils/edit.png';
import CheckIcon from '../../../asset/utils/check.png';
import UndoIcon from '../../../asset/utils/undo.png';
import TrashIcon from '../../../asset/utils/trash.png';

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
    const { _id } = user;
    this.props.openProfile(_id);
  }

  renderDeleteOptionOnly() {
    const caret = MenuFactory(
      [
        { option: 'Delete' },
      ],
      () => this.props.caretOnDelete(),
      '',
      { ...styles.caretContainer },
      () => console.log('Report Modal is opened'),
      false
    );
    return caret;
  }

  renderSelfCaret(item, deleteOnly) {
    if (!item || deleteOnly) return this.renderDeleteOptionOnly();
    const { isCompleted } = item;

    const caret = MenuFactory(
      [
        { option: 'Edit Goal', iconSource: EditIcon },
        { option: 'Share to Goal Feed', iconSource: ShareIcon },
        { option: isCompleted ? 'Unmark as Complete' : 'Mark as Complete',
          iconSource: isCompleted ? UndoIcon : CheckIcon },
        { option: 'Delete', iconSource: TrashIcon },
      ],
      (val) => this.handleSelfCaretOnPress(val),
      '',
      { ...styles.caretContainer },
      () => console.log('Report Modal is opened'),
      true
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
      textStyle
    } = this.props;

    // If item belongs to self, then caret displays delete
    let menu;
    if (caret && !_.isEmpty(caret)) {
      const { options, onPress, shouldExtendOptionLength } = isSelf ? caret.self : caret.others;
      menu = MenuFactory(
        options,
        onPress,
        '',
        { ...styles.caretContainer },
        () => console.log(`${DEBUG_KEY}: menu is opened for options with shouldExtendOptionLength: ${shouldExtendOptionLength}. `, options),
        shouldExtendOptionLength
      );
    } else {
      menu = isSelf === undefined || !isSelf
      ? MenuFactory(
          [
            { option: 'Report' },
          ],
          () => caretOnPress(),
          '',
          { ...styles.caretContainer },
          () => console.log('Report Modal is opened'),
          false
        )
      : this.renderSelfCaret(item, deleteOnly);
    }

    const categoryComponent = category ? <Category text={category} /> : null;

    return (
      <View style={styles.containerStyle}>
        <Name text={name} onPress={() => this.handleNameOnPress(user)} textStyle={textStyle} />
        {/* <Image style={styles.imageStyle} source={badge} /> */}
        <UserBanner user={user} iconStyle={{ marginTop: 1 }} />
        {categoryComponent}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          {hasCaret === null || hasCaret === false ? null : menu}
        </View>
      </View>
    );
  }
}
// <TouchableOpacity activeOpacity={0.85}
//   style={styles.caretContainer}
//   onPress={() => caretOnPress()}
// >
//   <Image source={dropDown} />
// </TouchableOpacity>


// Following is a duplicated code and it should be abstracted out
const { Popover } = renderers;
export const MenuFactory =
(options, callback, triggerText, triggerContainerStyle, animationCallback, shouldExtendOptionLength) => {
  const triggerTextView = triggerText
    ? (
        <Text
          style={{ fontSize: 15, margin: 10, marginLeft: 15, flex: 1 }}
        >
          {triggerText}
        </Text>
      )
    : null;

  // console.log(`${DEBUG_KEY}: shouldExtendOptionLength:`, shouldExtendOptionLength);
  const menuOptionsStyles = shouldExtendOptionLength === true
    ? getUpdatedStyles()
    : styles.menuOptionsStyles;

  // console.log(`${DEBUG_KEY}: styles.menuOptionsStyles is:`, styles.menuOptionsStyles);
  // console.log(`${DEBUG_KEY}: shouldExtendOptionLength: ${shouldExtendOptionLength}, menuOptionsStyles:`, menuOptionsStyles);
  return (
    <Menu
      onSelect={value => callback(value)}
      rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
      renderer={Popover}
      onOpen={animationCallback}
    >
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
        }}
      >
        <View style={triggerContainerStyle}>
          {triggerTextView}
          <Image source={dropDown} style={{ height: 12, width: 12 }} />
        </View>
      </MenuTrigger>
      <MenuOptions customStyles={menuOptionsStyles}>
        <FlatList
          data={options}
          renderItem={({ item }) => {
            const { iconSource, option } = item;
            return (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => callback(option)}
              >
                {
                  iconSource
                    ? (
                      <View
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          paddingLeft: 10,
                          paddingRight: 5
                        }}
                      >
                        <Image source={iconSource} style={styles.iconStyle} />
                      </View>
                    )
                    : null
                }
                <MenuOption value={option} text={option} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          style={{ height: 37 * options.length }}
        />
      </MenuOptions>
    </Menu>
  );
};

const getUpdatedStyles = () => {
  let ret = _.cloneDeep(styles.menuOptionsStyles);
  ret = _.set(ret, 'optionsContainer.width', 200);
  ret = _.set(ret, 'optionsContainer.paddingLeft', 0);
  ret = _.set(ret, 'optionsContainer.paddingRight', 0);
  return ret;
};


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
    },
    optionTouchable: {
      underlayColor: 'lightgray',
      activeOpacity: 10,
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
