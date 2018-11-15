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
import R from 'ramda';

// Components
import SuggestionPreview, { RemoveComponent } from '../GoalDetailCard/SuggestionPreview';
import ProfileImage from '../../Common/ProfileImage';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';

// Actions
import {
  newCommentOnTextChange,
  openCurrentSuggestion,
  removeSuggestion,
  createSuggestion,
  postComment,
  newCommentOnMediaRefChange
} from '../../../redux/modules/feed/comment/CommentActions';

import {
  openCamera,
  openCameraRoll
} from '../../../actions';

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

  handleOpenCamera = () => {
    this.props.openCamera((result) => {
      this.props.newCommentOnMediaRefChange(result.uri, this.props.pageId);
    });
  }

  handleOpenCameraRoll = () => {
    const callback = R.curry((result) => {
      this.props.newCommentOnMediaRefChange(result.uri, this.props.pageId);
    });
    this.props.openCameraRoll(callback);
  }

  /**
   * Open IOS menu to show two options ['Open Camera Roll', 'Take photo']
   * When image icon on the comment box is clicked
   */
  handleImageIconOnClick = () => {
    const mediaRefCases = switchByButtonIndex([
      [R.equals(0), () => {
        this.handleOpenCameraRoll();
      }],
      [R.equals(1), () => {
        this.handleOpenCamera();
      }],
    ]);

    const addMediaRefActionSheet = actionSheet(
      ['Open Camera Roll', 'Take Photo', 'Cancel'],
      2,
      mediaRefCases
    );
    return addMediaRefActionSheet();
  }

  handleOnBlur = (newComment) => {
    const { contentText, tmpSuggestion } = newComment;
    // On Blur if no content then set default value to comment the goal / post
    if ((contentText === undefined || contentText === '' || contentText.trim() === '')
    && _.isEmpty(tmpSuggestion)) {
      this.setState({
        ...this.state,
        defaultValue: 'Write a Comment...'
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
  renderSuggestionIcon(newComment, pageId) {
    const { mediaRef } = newComment;
    const disableButton = mediaRef !== undefined && mediaRef !== '';
    return (
      <TouchableOpacity
        style={styles.iconContainerStyle}
        onPress={() => {
          console.log('suggestion on click in comment box');
          this.props.createSuggestion(pageId);
        }}
        disabled={disableButton}
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

  renderLeftIcons(newComment, pageId) {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5
        }}
      >
        {this.renderSuggestionIcon(newComment, pageId)}
        {this.renderImageIcon(newComment)}
      </View>
    );
  }

  renderImageIcon(newComment) {
    const { suggestion } = newComment;
    const disableButton =
      (suggestion !== undefined && suggestion.suggestionFor !== undefined);
    return (
      <TouchableOpacity
        style={styles.iconContainerStyle}
        onPress={this.handleImageIconOnClick}
        disabled={disableButton}
      >
        <Image
          source={PhotoIcon}
          style={{
            ...styles.iconStyle,
            tintColor: '#cbd6d8'
          }}
        />
      </TouchableOpacity>
    );
  }

  renderMedia(newComment) {
    const { mediaRef } = newComment;
    if (!mediaRef) return '';
    const onPress = () => console.log('Media on Pressed');
    const onRemove = () => this.props.newCommentOnMediaRefChange(undefined, this.props.pageId);

    return (
      <TouchableOpacity style={styles.mediaContainerStyle} onPress={onPress}>
        <ProfileImage
          imageStyle={{ width: 50, height: 50 }}
          defaultImageSource={{ uri: mediaRef }}
          imageContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
        />
        <View style={{ flex: 1, marginLeft: 12, marginRight: 12, justifyContent: 'center' }}>
          <Text
            style={styles.headingTextStyle}
            numberOfLines={2}
            ellipsizeMode='tail'
          >
            Attached image
          </Text>
        </View>
        <RemoveComponent onRemove={onRemove} />
      </TouchableOpacity>
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
    if (!newComment || !newComment.parentRef) return '';

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
        {this.renderMedia(newComment)}
        <View style={{ flexDirection: 'row' }}>
          {this.renderLeftIcons(newComment, pageId)}
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
  },
  // Media preview styles
  mediaContainerStyle: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1
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
    postComment,
    openCamera,
    openCameraRoll,
    newCommentOnMediaRefChange
  }
)(CommentBox);
