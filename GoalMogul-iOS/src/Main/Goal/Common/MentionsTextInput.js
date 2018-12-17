import React, { Component } from 'react';
import {
  Text,
  View,
  Animated,
  TextInput,
  FlatList,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

const DEBUG_KEY = '[ UI MentionsTextInput ]';

export default class MentionsTextInput extends Component {
  constructor() {
    super();
    this.state = {
      textInputHeight: '',
      isTrackingStarted: false,
      suggestionRowHeight: new Animated.Value(0),

    };
    this.isTrackingStarted = false;
    this.previousChar = ' ';
  }

  componentWillMount() {
    this.setState({
      textInputHeight: this.props.textInputMinHeight
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value) {
      this.resetTextbox();
    } else if (this.isTrackingStarted && !nextProps.horizontal && nextProps.suggestionsData.length !== 0) {
      const numOfRows = (
        nextProps.MaxVisibleRowCount >= nextProps.suggestionsData.length
        ? nextProps.suggestionsData.length
        : nextProps.MaxVisibleRowCount
      );
      const height = numOfRows * nextProps.suggestionRowHeight;
      this.openSuggestionsPanel(height);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if last deleted is a trigger (@), if so, then update the
    this.checkTriggerDeleted(prevProps);

    const prevContentTagsReg = prevProps.contentTagsReg;
    const nextContentTagsReg = this.props.contentTagsReg;
    if (!_.isEqual(prevContentTagsReg.sort(), nextContentTagsReg.sort())) {
      // Update the tags to match
    }
  }

  onChangeText(val) {
    this.props.onChangeText(val); // pass changed text back
    // TODO: Update the logic to start tracking
    const lastChar = val.substr(val.length - 1);
    const wordBoundry = (this.props.triggerLocation === 'new-word-only')
      ? this.previousChar.trim().length === 0
      : true;

    // Or the cursor is at one of the tags
    if ((lastChar === this.props.trigger && wordBoundry) || this.checkIfOnLastTag(val)) {
      // console.log(`${DEBUG_KEY}: start tracking`);
      this.startTracking();
    } else if ((lastChar === ' ' && this.state.isTrackingStarted) || val === "") {
      this.stopTracking();
    }
    this.previousChar = lastChar;
    this.identifyKeyword(val);
  }

  // Check if the last group is a tag.
  checkIfOnLastTag(val) {
    const { contentTags } = this.props;
    const lastTriggerIndex = val.lastIndexOf(this.props.trigger);
    const lastTag = val.slice(lastTriggerIndex);
    // console.log(`${DEBUG_KEY}: lastTag:`, lastTag);
    // console.log(`${DEBUG_KEY}: lastTag:`, 1);
    return contentTags.some((tag) => {
      // console.log(`${DEBUG_KEY}: lastTriggerIndex: ${lastTriggerIndex} vs tag: ${tag.startIndex}`);
      // console.log(`${DEBUG_KEY}: lastTag: ${lastTag} vs tag: ${tag.tagText}`);
      return (
        tag.tagText === lastTag && tag.startIndex === lastTriggerIndex
      );
    });
  }

  // If last deleted is trigger, user callback to clear the content tags and
  // Content tags reg
  checkTriggerDeleted(prevProps) {
    const prevVal = prevProps.value;
    const curVal = this.props.value;
    if (prevVal && !!prevVal.length && curVal &&
      prevVal.length > curVal.length && prevVal[prevVal.length - 1] === '@') {
        this.props.validateTags();
    }
  }

  updateSuggestions(lastKeyword) {
    this.props.triggerCallback(lastKeyword);
  }

  identifyKeyword(val) {
    if (this.isTrackingStarted) {
      const boundary = this.props.triggerLocation === 'new-word-only' ? 'B' : '';
      let tagsReg = '';
      this.props.contentTagsReg.forEach((reg) => {
        tagsReg = `${reg}|${tagsReg}`;
      });
      const pattern = new RegExp(
        `${tagsReg}\\${boundary}${this.props.trigger}[a-z0-9_-]+|\\${boundary}${this.props.trigger}`,
        `gi`
      );
      const keywordArray = val.match(pattern);
      console.log(`${DEBUG_KEY}: pattern is: `, pattern);
      console.log(`${DEBUG_KEY}: tagsReg is: `, tagsReg);
      console.log(`${DEBUG_KEY}: val is: `, val);
      console.log(`${DEBUG_KEY}: keywordArray is: `, keywordArray);

      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1];
        this.updateSuggestions(lastKeyword);
      }
    }
  }

  openSuggestionsPanel(height) {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: height ? height : this.props.suggestionRowHeight,
      duration: 100,
    }).start();
  }

  closeSuggestionsPanel() {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: 0,
      duration: 100,
    }).start();
  }

  startTracking() {
    this.isTrackingStarted = true;
    this.openSuggestionsPanel();
    this.setState({
      isTrackingStarted: true
    });
  }

  stopTracking() {
    this.isTrackingStarted = false;
    this.closeSuggestionsPanel();
    this.setState({
      isTrackingStarted: false
    });
  }

  resetTextbox() {
    this.previousChar = " ";
    this.stopTracking();
    this.setState({ textInputHeight: this.props.textInputMinHeight });
  }

  focus() {
    this._textInput.focus();
  }

  renderItemSeparator = () => {
    return (
      <View
        style={{ width: '100%', height: 0.5, backgroundColor: 'lightgray' }}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[{
            ...this.props.suggestionsPanelStyle },
            {
              height: this.state.suggestionRowHeight,
              borderBottomWidth: 0.5,
              borderBottomColor: 'lightgray'
            }
          ]}
        >
          <FlatList
            keyboardShouldPersistTaps={'always'}
            horizontal={this.props.horizontal}
            ListEmptyComponent={this.props.loadingComponent}
            ItemSeparatorComponent={this.renderItemSeparator}
            enableEmptySections
            data={this.props.suggestionsData}
            keyExtractor={this.props.keyExtractor}
            renderItem={(rowData) => {
              return this.props.renderSuggestionsRow(rowData, this.stopTracking.bind(this));
            }}
          />
        </Animated.View>
        {this.props.renderSuggestionPreview() || ''}
        {this.props.renderMedia() || ''}
        <View style={{ flexDirection: 'row' }}>
          {this.props.renderLeftIcons() || ''}
          <View style={{ ...this.props.textInputContainerStyle }}>
            <TextInput
              {...this.props}
              onContentSizeChange={(event) => {
                this.setState({
                  textInputHeight: (
                    this.props.textInputMinHeight >= event.nativeEvent.contentSize.height
                    ? this.props.textInputMinHeight
                    : event.nativeEvent.contentSize.height + 10
                  ),
                });
              }}
              ref={component => this._textInput = component}
              onChangeText={this.onChangeText.bind(this)}
              multiline={true}
              value={this.props.value}
              style={
                [
                  { ...this.props.textInputStyle },
                  { height: Math.min(this.props.textInputMaxHeight, this.state.textInputHeight) }
                ]
              }
              placeholder={this.props.placeholder ? this.props.placeholder : 'Write a comment...'}
            />
          </View>
          {this.props.renderPost() || ''}
        </View>
      </View>
    );
  }
}

MentionsTextInput.propTypes = {
  textInputStyle: TextInput.propTypes.style,
  suggestionsPanelStyle: ViewPropTypes.style,
  loadingComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  textInputMinHeight: PropTypes.number,
  textInputMaxHeight: PropTypes.number,
  trigger: PropTypes.string.isRequired,
  triggerLocation: PropTypes.oneOf(['new-word-only', 'anywhere']).isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  triggerCallback: PropTypes.func.isRequired,
  renderSuggestionsRow: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]).isRequired,
  suggestionsData: PropTypes.array.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  horizontal: PropTypes.bool,
  suggestionRowHeight: PropTypes.number.isRequired,
  MaxVisibleRowCount: function(props, propName, componentName) {
    if(!props.horizontal && !props.MaxVisibleRowCount) {
      return new Error(
        `Prop 'MaxVisibleRowCount' is required if horizontal is set to false.`
      );
    }
  }
};

MentionsTextInput.defaultProps = {
  textInputStyle: { borderColor: '#ebebeb', borderWidth: 1, fontSize: 15 },
  suggestionsPanelStyle: { backgroundColor: 'rgba(100,100,100,0.1)' },
  loadingComponent: () => <Text>Loading...</Text>,
  textInputMinHeight: 30,
  textInputMaxHeight: 80,
  horizontal: true,
}
