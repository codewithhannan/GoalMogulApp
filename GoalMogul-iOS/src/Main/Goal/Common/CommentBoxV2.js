// This is new implementation of CommentBox to include tagging
import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  TextInput,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Keyboard,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import R from 'ramda';

// Components
import MentionsTextInput from './MentionsTextInput';
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
import DefaultUserProfile from '../../../asset/utils/defaultUserProfile.png';

// Consts
const maxHeight = 120;
const { height, width } = Dimensions.get('window');
const DEBUG_KEY = '[ UI CommentBoxV2 ]';

class CommentBoxV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
      height: 34,
      defaultValue: 'Write a Comment...',
      keyword: '',
      testTaggingSuggestionData: [
        {
          name: 'Jay Patel',
          _id: '123'
        },
        {
          name: 'Jia Zeng',
          _id: '1234'
        }
      ]
      // position: 'absolute'
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

  onTaggingSuggestionTap(name, hidePanel) {
    hidePanel();
    const { contentText, pageId } = this.props.newComment;
    console.log(`${DEBUG_KEY}: contentText is: `, contentText);
    const comment = contentText.slice(0, -this.state.keyword.length);
    const newContentText = `${comment} @${name} `;
    console.log(`${DEBUG_KEY}: newContentText is: `, newContentText);
    this.props.newCommentOnTextChange(newContentText, pageId);
  }

  callback(keyword) {
    if (this.reqTimer) {
      clearTimeout(this.reqTimer);
    }

    this.reqTimer = setTimeout(() => {
      // TODO: send search request
      console.log(`${DEBUG_KEY}: requesting for keyword: `, keyword);
    }, 200);
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
    const { resetCommentType } = this.props;
    const { contentText, tmpSuggestion } = newComment;
    // On Blur if no content then set default value to comment the goal / post
    if ((contentText === undefined || contentText === '' || contentText.trim() === '')) {
      this.setState({
        ...this.state,
        defaultValue: 'Write a Comment...'
      });
      if (resetCommentType) {
        resetCommentType();
      }
    }
  }

  handleOnSubmitEditing = (newComment) => {
    const { onSubmitEditing } = this.props;
    if (onSubmitEditing) onSubmitEditing();
    this.handleOnBlur(newComment);
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
    const { mediaRef, commentType } = newComment;
    const disableButton = mediaRef !== undefined && mediaRef !== '';
    if (commentType === 'Reply') return '';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.iconContainerStyle}
        onPress={() => {
          console.log('suggestion on click in comment box');
          Keyboard.dismiss();
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

  renderLeftIcons(newComment, pageId, hasSuggestion) {
    const suggestionIcon = hasSuggestion
      ? this.renderSuggestionIcon(newComment, pageId)
      : '';
    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5
        }}
      >
        {suggestionIcon}
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
        activeOpacity={0.85}
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
      <TouchableOpacity activeOpacity={0.85} style={styles.mediaContainerStyle} onPress={onPress}>
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

    const color = '#17B3EC';
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.postContainerStyle}
        onPress={() => this.handleOnPost(uploading)}
        disabled={disable}
      >
        <Text
          style={{ color, fontSize: 14, fontWeight: '700', padding: 13, letterSpacing: 0.5 }}
        >
          Post
        </Text>
      </TouchableOpacity>
    );
  }

  renderSuggestionPreview(newComment, pageId) {
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

  /**
   * This is to render tagging suggestion row
   * @param hidePanel: lib passed in funct to close suggestion panel
   * @param item: suggestion item to render
   */
  renderSuggestionsRow({ item }, hidePanel) {
    const { name, profile } = item;
    return (
      <TouchableOpacity
        onPress={() => this.onTaggingSuggestionTap(name, hidePanel)}
        style={{
          height: 50,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white'
        }}
      >
        <ProfileImage
          imageContainerStyle={styles.imageContainerStyle}
          imageUrl={profile && profile.image ? profile.image : undefined}
          imageStyle={{ height: 27, width: 25, borderRadius: 3 }}
          defaultImageSource={DefaultUserProfile}
        />
        <Text style={{ fontSize: 15, color: 'darkgray' }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { pageId, newComment, hasSuggestion } = this.props;
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
          shadowOpacity: 0.5,
          shadowRadius: 1,
          elevation: 0.3
        }}
      >
        <MentionsTextInput
          ref="textInput"
          placeholder={this.state.defaultValue}
          onChangeText={(val) => this.props.newCommentOnTextChange(val, pageId)}
          editable={!uploading}
          maxHeight={maxHeight}
          multiline
          value={newComment.contentText}
          defaultValue={this.state.defaultValue}
          onBlur={() => this.handleOnBlur(newComment)}
          onSubmitEditing={() => this.handleOnSubmitEditing(newComment)}
          renderSuggestionPreview={() => this.renderSuggestionPreview(newComment, pageId)}
          renderMedia={() => this.renderMedia(newComment)}
          renderLeftIcons={() => this.renderLeftIcons(newComment, pageId, hasSuggestion)}
          renderPost={() => this.renderPost(newComment)}

          textInputContainerStyle={inputContainerStyle}
          textInputStyle={inputStyle}

          suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
          loadingComponent={() => (
            <View style={{ flex: 1, width, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator />
            </View>)}
          textInputMinHeight={30}
          textInputMaxHeight={80}
          trigger={'@'}
          triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
          triggerCallback={this.callback.bind(this)}
          renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
          suggestionsData={this.state.testTaggingSuggestionData} // array of objects
          keyExtractor={(item, index) => item._id}
          suggestionRowHeight={50}
          horizontal={false} // defaut is true, change the orientation of the list
          MaxVisibleRowCount={4} // this is required if horizontal={false}
        />
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
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 3,
    alignSelf: 'center',
    backgroundColor: 'white',
    margin: 10
  },
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
)(CommentBoxV2);
