/**
 * This suggestion modal is decided on ms2 polish notes.
 * Changes:
 * 1. It has only 6 categories
 * 2. Goal preview is on top
 * 3. Options are obfuscated on select with animation and then show relevant page
 *    on below
 */
import React, { Component } from 'react';
import {
  View,
  Modal,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader';
import SearchSuggestion from './Suggestion/SearchSuggestion';
import GeneralSuggestion from './Suggestion/GeneralSuggestion';
import NeedStepSuggestion from './Suggestion/NeedStepSuggestion';
import SuggestionGoalPreview from './Suggestion/SuggestionGoalPreview';

// Asset
import Book from '../../../asset/suggestion/book.png';
import Chat from '../../../asset/suggestion/chat.png';
import Event from '../../../asset/suggestion/event.png';
import Flag from '../../../asset/suggestion/flag.png';
import Friend from '../../../asset/suggestion/friend.png';
import Group from '../../../asset/suggestion/group.png';
import Link from '../../../asset/suggestion/link.png';
import Other from '../../../asset/suggestion/other.png';
import HelpIcon from '../../../asset/utils/help.png';
import StepIcon from '../../../asset/utils/steps.png';

// Actions
import {
  updateSuggestionType
} from '../../../redux/modules/feed/comment/CommentActions';

import {
  getNewCommentByTab
} from '../../../redux/modules/feed/comment/CommentSelector';

// Utils function
import { capitalizeWord } from '../../../redux/middleware/utils';

const OPTIONS_HEIGHT = 120;
const OPTIONS_OPACITY = 0.001;

class SuggestionModal extends Component {
  constructor(props) {
    super(props);
    this.fadeHeight = new Animated.Value(OPTIONS_HEIGHT);
    this.fadeOpacity = new Animated.Value(1);
    this.suggestionOpacity = new Animated.Value(0.001);
    this.state = {
      query: '',
      iconMapRight: [...IconMapRight],
      iconMapLeft: [...IconMapLeft],
      optionsCollapsed: false,
      optionsHeight: 150
    };
  }

  handleExpand = () => {
    Animated.parallel([
      Animated.timing(this.fadeHeight, {
        duration: 100,
        toValue: OPTIONS_HEIGHT,
      }),
      Animated.timing(this.fadeOpacity, {
        duration: 100,
        toValue: 1,
      }),
      Animated.timing(this.suggestionOpacity, {
        duration: 100,
        toValue: 0.001,
      }),
    ]).start(() => {
      this.setState({
        ...this.state,
        optionsCollapsed: false
      });
    });
  }

  handleCollapse = () => {
    Animated.parallel([
      Animated.timing(this.fadeHeight, {
        duration: 100,
        toValue: 0,
      }),
      Animated.timing(this.fadeOpacity, {
        duration: 100,
        toValue: OPTIONS_OPACITY,
      }),
      Animated.timing(this.suggestionOpacity, {
        duration: 100,
        toValue: 1,
      }),
    ]).start(() => {
      this.setState({
        ...this.state,
        optionsCollapsed: true
      });
    });
  }

  // On modal dismiss, reset iconmap state
  resetIconMap = () => {
    this.handleExpand();
    this.setState({
      ...this.state,
      iconMapRight: [...IconMapRight],
      iconMapLeft: [...IconMapLeft]
    });
  }

  // Update icon map with selected options
  updateIconMap = (suggestionType) => {
    this.props.updateSuggestionType(suggestionType, this.props.pageId);
    const { iconMapRight, iconMapLeft } = this.state;
    const newIconMapRight = updateIconMap(suggestionType, iconMapRight);
    const newIconMapLeft = updateIconMap(suggestionType, iconMapLeft);

    this.setState({
      ...this.state,
      iconMapRight: newIconMapRight,
      iconMapLeft: newIconMapLeft
    });
    this.handleCollapse();
  }

  renderGoalPreview(item) {
    return <SuggestionGoalPreview item={item} />;
  }

  renderSuggestionFor(newComment, goal) {
    const { suggestionFor, suggestionForRef } = newComment.tmpSuggestion;
    return (
      <SuggestedItem
        type={suggestionFor}
        suggestionForRef={suggestionForRef}
        goal={goal}
      />
    );
  }

  renderOptions(newComment) {
    const { suggestionType } = newComment.tmpSuggestion;
    const { iconMapRight, iconMapLeft, optionsCollapsed } = this.state;

    const optionsRight = (
      <Options iconMap={iconMapRight} onPress={this.updateIconMap} />
    );

    const optionsLeft = (
      <Options iconMap={iconMapLeft} onPress={this.updateIconMap} />
    );

    const optionsCollapsedText = optionsCollapsed
      ? (
        <TouchableOpacity activeOpacity={0.85}
          style={{ width: 50, justifyContent: 'center' }}
          onPress={this.handleExpand}
        >
          <Text style={styles.optionsCollapsedTextStyle}>Back</Text>
        </TouchableOpacity>
      )
      : '';
      // (
      //   <TouchableOpacity activeOpacity={0.85}
      //     style={{ width: 50, justifyContent: 'center' }}
      //     onPress={this.handleCollapse}
      //   >
      //     <Text style={styles.optionsCollapsedTextStyle}>Collapse</Text>
      //   </TouchableOpacity>
      // );

    return (
      <View
        style={styles.optionsContainerStyle}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {optionsCollapsedText}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                alignSelf: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 10
              }}
            >
              Suggest a...
            </Text>
          </View>
          {optionsCollapsed ? <View style={{ width: 50 }} /> : ''}
        </View>

        <Animated.View
          style={{ flexDirection: 'row', height: this.fadeHeight, opacity: this.fadeOpacity }}
        >
          {optionsLeft}
          {optionsRight}
        </Animated.View>
      </View>
    );
  }

  renderSuggestionBody(newComment) {
    const { suggestionType } = newComment.tmpSuggestion;
    if (!this.state.optionsCollapsed) return '';
    if (suggestionType === 'User' || suggestionType === 'Friend' ||
      suggestionType === 'Event' || suggestionType === 'Tribe' ||
      suggestionType === 'ChatConvoRoom'
    ) {
      return (
        <SearchSuggestion pageId={this.props.pageId} opacity={this.suggestionOpacity} />
      );
    }
    if (suggestionType === 'Need' || suggestionType === 'Step') {
      return (
        <NeedStepSuggestion pageId={this.props.pageId} opacity={this.suggestionOpacity} />
      );
    }
    if (suggestionType === 'Custom') {
      return (
        <GeneralSuggestion pageId={this.props.pageId} opacity={this.suggestionOpacity} />
      );
    }
    return '';
  }

  render() {
    const { newComment, item } = this.props;
    if (!newComment || !item) return '';

    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.visible}
        onDismiss={this.resetIconMap}
      >
        <ModalHeader
          title='Suggestion'
          actionText='Attach'
          onCancel={this.props.onCancel}
          onAction={() => this.props.onAttach()}
        />
        <ScrollView>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
            <View style={{ flex: 1 }}>
              {this.renderGoalPreview(item)}
              {this.renderSuggestionFor(newComment, item)}
              {this.renderOptions(newComment)}
              {this.renderSuggestionBody(newComment)}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Modal>
    );
  }
}

const styles = {
  // Options style
  selectedSuggestionIconStyle: {
    tintColor: '#46C8F5',
    height: 20,
    width: 20
  },
  suggestionIconStyle: {
    tintColor: '#b8c7cb',
    height: 20,
    width: 20
  },
  selectedSuggestionTextStyle: {
    color: 'black',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 15
  },
  suggestionTextStyle: {
    color: '#b8c7cb',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 15
  },
  optionsCollapsedTextStyle: {
    color: '#46C8F5',
    fontSize: 12,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  optionsContainerStyle: {
    backgroundColor: 'white',
    marginTop: 0.5,
    marginLeft: 15,
    marginRight: 15,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.5,
    paddingBottom: 5,
  }
};

// IconMapLeft: ["Person", "ChatConvoRoom", "Step or Need"],
// IconMapRight: ["Event", "Tribe", "Custom"]
const IconMapLeft = [
  {
    key: 'User',
    text: 'User',
    value: {
      iconSource: Friend,
      iconStyle: {

      }
    },
    selected: undefined
  },
  {
    key: 'ChatConvoRoom',
    text: 'Chatroom',
    value: {
      iconSource: Chat,
      iconStyle: {

      }
    },
    selected: undefined
  },
  {
    key: 'Need',
    text: 'Step or Need',
    value: {
      iconSource: StepIcon,
      iconStyle: {

      }
    },
    selected: undefined
  }
];

const IconMapRight = [
  {
    key: 'Event',
    text: 'Event',
    value: {
      iconSource: Event,
      iconStyle: {

      }
    },
    selected: undefined
  },
  {
    key: 'Tribe',
    text: 'Tribe',
    value: {
      iconSource: Flag,
      iconStyle: {

      }
    },
    selected: undefined
  },
  {
    key: 'Custom',
    text: 'Custom',
    value: {
      iconSource: Other,
      iconStyle: {

      }
    },
    selected: undefined
  },
];

const updateIconMap = (suggestionType, iconMap) => iconMap.map((item) => {
  const newItem = _.cloneDeep(item);
  newItem.selected = suggestionType === item.key;
  return newItem;
});

/**
 * Render one column of options
 */
const Options = (props) => {
  const { iconMap, onPress } = props;
  const options = iconMap.map((icon) => {
    const { text, value, key, selected } = icon;
    const { iconSource, iconStyle } = value;
    // Update Icon style if selected
    const style = selected ?
      {
        ...styles.selectedSuggestionIconStyle,
        ...iconStyle
      } : {
        ...styles.suggestionIconStyle,
        ...iconStyle
      };

    // Update text style if selected
    const textStyle = selected
      ? { ...styles.selectedSuggestionTextStyle }
      : { ...styles.suggestionTextStyle };

    return (
      <TouchableOpacity activeOpacity={0.85}
        onPress={() => onPress(key)}
        key={key}
        style={{ marginTop: 15, marginLeft: 30, alignItems: 'flex-start' }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={iconSource} style={style} />
          <Text style={textStyle}>{text.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <View style={{ flex: 1 }}>
      {options}
    </View>
  );
};

/**
 * If suggest for need or step, show a summary of
 * Step 3: Find a reading buddy
 */
const SuggestedItem = (props) => {
  const { goal, type, suggestionForRef } = props;

  let items = [];
  if (type === 'Step') {
    items = _.get(goal, 'steps');
  }
  if (type === 'Need') {
    items = _.get(goal, 'needs');
  }

  if (!items || _.isEmpty(items)) return '';
  const index = items.findIndex((temp) => temp._id === suggestionForRef);

  if (index === -1) return '';
  const item = items.find((temp) => temp._id === suggestionForRef);

  return (
    <View
      style={{
        flexDirection: 'row',
        margin: 15,
        marginBottom: 5,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 0.5,
        paddingBottom: 10
      }}
    >
      <Text
        style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
        numberOfLines={2}
        ellipsizeMode='tail'
      >
        {`${type} ${item.order}: ${item.description}`}
      </Text>
    </View>
  );
};

const mapStateToProps = (state, props) => {
  const newComment = getNewCommentByTab(state, props.pageId);

  return {
    newComment,
  };
};

export default connect(
  mapStateToProps,
  {
    updateSuggestionType
  }
)(SuggestionModal);
