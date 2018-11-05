import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import SuggestionPreview from '../GoalDetailCard/SuggestionPreview';

// Actions
import {
  newCommentOnTextChange,
  openCurrentSuggestion,
  removeSuggestion,
  createSuggestion,
  postComment
} from '../../../redux/modules/feed/comment/CommentActions';

// Selectors
import {
  getNewCommentByTab
} from '../../../redux/modules/feed/comment/CommentSelector';

// Assets
import PhotoIcon from '../../../asset/utils/photoIcon.png';
import LightBulb from '../../../asset/utils/makeSuggestion.png';

// Consts
const maxHeight = 120;

class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
      height: 34,
      defaultValue: 'Write a Comment...'
    };
  }

  componentDidMount() {
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }
    this.setState({
      ...this.state,
      defaultValue: 'Write a Comment...'
    });
  }

  handleOnPost = (uploading) => {
    // Ensure we only create comment once
    if (uploading) return;
    this.props.postComment(this.props.pageId);
  }

  handleOnBlur = (newComment) => {
    const { contentText, tmpSuggestion } = newComment;
    // On Blur if no content then set default value to comment the goal / post
    if ((contentText === undefined || contentText === '' || contentText.trim() === '')
    && _.isEmpty(tmpSuggestion)) {
      this.setState({
        ...this.state,
        defaultValue: 'Comment'
      });
    }
  }

  focusForReply() {
    this.refs['textInput'].focus();
    this.setState({
      ...this.state,
      defaultValue: 'Reply to...'
    });
  }

  focus() {
    this.refs['textInput'].focus();
  }

  updateSize = (height) => {
    this.setState({
      height: Math.min(height, maxHeight)
    });
  }

  //tintColor: '#f5d573'
  renderSuggestionIcon() {
    return (
      <TouchableOpacity
        style={styles.iconContainerStyle}
        onPress={() => {
          console.log('suggestion on click in comment box');
          this.props.createSuggestion();
        }}
      >
        <Image
          source={LightBulb}
          style={{
            height: 28,
            width: 28,
            margin: 4
          }}
        />
      </TouchableOpacity>
    );
  }

  renderLeftIcons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5
        }}
      >
        {this.renderSuggestionIcon()}
        {this.renderImageIcon()}
      </View>
    );
  }

  renderImageIcon() {
    return (
      <View style={styles.iconContainerStyle}>
        <Image
          source={PhotoIcon}
          style={{
            ...styles.iconStyle,
            tintColor: '#cbd6d8'
          }}
        />
      </View>
    );
  }

  renderPost(newComment) {
    const { uploading, contentText, tmpSuggestion } = newComment;
    const disable = uploading ||
      ((contentText === undefined || contentText === '' || contentText.trim() === '')
      && _.isEmpty(tmpSuggestion));

    const color = '#45C9F6';
    return (
      <TouchableOpacity
        style={styles.postContainerStyle}
        onPress={() => this.handleOnPost(uploading)}
        disabled={disable}
      >
        <Text style={{ color, fontSize: 13, fontWeight: '500', padding: 6, margin: 6 }}>Post</Text>
      </TouchableOpacity>
    );
  }

  renderSuggestionPreview() {
    const { pageId, newComment } = this.props;
    const { showAttachedSuggestion, suggestion } = newComment;

    if (showAttachedSuggestion) {
      return (
        <SuggestionPreview
          item={suggestion}
          onRemove={() => {
            this.props.removeSuggestion(pageId);
          }}
          onPress={() => {
            this.props.openCurrentSuggestion(pageId);
          }}
        />
      );
    }

    return '';
  }

  render() {
    const { pageId, newComment } = this.props;
    if (!newComment) return '';

    const { uploading } = newComment;

    const inputContainerStyle = {
      ...styles.inputContainerStyle,
      // height: Math.max(36, height + 6)
    };

    const inputStyle = {
      ...styles.inputStyle,
      // height: Math.max(30, height)
    };

    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.7,
          shadowRadius: 1,
          elevation: 0.5
        }}
      >
        {this.renderSuggestionPreview()}
        <View style={{ flexDirection: 'row' }}>
          {this.renderLeftIcons()}
          <View style={inputContainerStyle}>
            <TextInput
              ref="textInput"
              placeholder={this.state.defaultValue}
              onChangeText={(val) => this.props.newCommentOnTextChange(val, pageId)}
              style={inputStyle}
              editable={!uploading}
              maxHeight={maxHeight}
              multiline
              value={newComment.contentText}
              defaultValue={this.state.defaultValue}
              onBlur={() => this.handleOnBlur(newComment)}
            />
          </View>
          {this.renderPost(newComment)}
        </View>
      </SafeAreaView>
    );
  }
}
// onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}

const styles = {
  inputContainerStyle: {
    justifyContent: 'center',
    borderRadius: 18,
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#cbd6d8',
    borderWidth: 1,
    flex: 1
  },
  inputStyle: {
    paddingTop: 7,
    paddingBottom: 7,
    padding: 13,
    backgroundColor: 'white',
    borderRadius: 22,
  },
  postContainerStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  iconStyle: {
    height: 24,
    width: 24,
    margin: 5
  },
  iconContainerStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
};

const mapStateToProps = (state, props) => {

  return {
    newComment: getNewCommentByTab(state, props.pageId)
  };
};

export default connect(
  mapStateToProps,
  {
    newCommentOnTextChange,
    openCurrentSuggestion,
    removeSuggestion,
    createSuggestion,
    postComment
  }
)(CommentBox);
