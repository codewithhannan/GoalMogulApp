import React from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  Text,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';

// Actions
import {
  onSuggestionTextChange,
  updateSuggestionType
} from '../../../../redux/modules/feed/comment/CommentActions';

import {
  getNewCommentByTab
} from '../../../../redux/modules/feed/comment/CommentSelector';

class NeedStepSuggestion extends React.Component {
  renderCheckBox() {
    const { suggestionType, pageId } = this.props;
    return (
      <View>
        <CheckBox
          title='Need'
          checked={suggestionType === 'Need'}
          onPress={() =>
            this.props.updateSuggestionType('Need', pageId)
          }
        />
        <CheckBox
          title='Step'
          checked={suggestionType === 'Step'}
          onPress={() =>
            this.props.updateSuggestionType('Step', pageId)
          }
        />
      </View>
    );
  }

  renderInputField() {
    const { suggestionText } = this.props;
    const titleText = <Text style={styles.titleTextStyle}>Your Suggestion</Text>;

    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          borderBottomWidth: 0.5,
          marginTop: 10,
          borderColor: 'lightgray'
        }}
      >
        {titleText}
        <TextInput
          placeholder='Your thoughts'
          onChangeText={(val) => this.props.onSuggestionTextChange(val)}
          style={styles.inputStyle}
          maxHeight={100}
          keyboardType={'default'}
          multiline
          value={suggestionText}
        />
      </SafeAreaView>
    );
  }

  render() {
    const { opacity } = this.props;
    return (
      <Animated.View style={{ marginLeft: 15, marginRight: 15, opacity }}>
        {this.renderCheckBox()}
        {this.renderInputField()}
      </Animated.View>
    );
  }
}

const styles = {
  inputStyle: {
    fontSize: 15,
    padding: 8,
    paddingRight: 15,
    paddingLeft: 15
  },
  titleTextStyle: {
    fontSize: 11,
    color: '#a1a1a1',
    padding: 2
  }
};

const mapStateToProps = (state, props) => {
  const {
    suggestionLink,
    suggestionText,
    suggestionType
  } = getNewCommentByTab(state, props.pageId).tmpSuggestion;

  return {
    suggestionLink,
    suggestionText,
    suggestionType
  };
};

export default connect(
  mapStateToProps,
  {
    onSuggestionTextChange,
    updateSuggestionType
  }
)(NeedStepSuggestion);
