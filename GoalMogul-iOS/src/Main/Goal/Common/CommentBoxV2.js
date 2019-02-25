// This is new implementation of CommentBox to include tagging
import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
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
import EmptyResult from '../../Common/Text/EmptyResult';

// Actions
import {
  openCurrentSuggestion,
  removeSuggestion,
  createSuggestion,
  postComment,
  newCommentOnMediaRefChange,
  newCommentOnTextChange,
  newCommentOnTagsChange,
  newCommentOnTagsRegChange,
} from '../../../redux/modules/feed/comment/CommentActions';

import { searchUser } from '../../../redux/modules/search/SearchActions';

import {
  openCamera,
  openCameraRoll
} from '../../../actions';

// Selectors
import {
  getNewCommentByTab
} from '../../../redux/modules/feed/comment/CommentSelector';

// Utils
import { arrayUnique, clearTags } from '../../../redux/middleware/utils';

// Assets
import PhotoIcon from '../../../asset/utils/photoIcon.png';
import LightBulb from '../../../asset/utils/makeSuggestion.png';
import DefaultUserProfile from '../../../asset/utils/defaultUserProfile.png';

// Consts
const maxHeight = 120;
const { height, width } = Dimensions.get('window');
const DEBUG_KEY = '[ UI CommentBoxV2 ]';

const INITIAL_TAG_SEARCH = {
  data: [],
  skip: 0,
  limit: 10,
  loading: false
};

class CommentBoxV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
      height: 34,
      defaultValue: 'Write a Comment...',
      keyword: '',
      tagSearchData: { ...INITIAL_TAG_SEARCH },
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
    this.updateSearchRes = this.updateSearchRes.bind(this);
    this.focus = this.focus.bind(this);
    this.focusForReply = this.focusForReply.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }

    const { initial } = this.props;
    if (initial && initial.commentBox) {
      this.focus();
    }

    this.setState({
      ...this.state,
      defaultValue: 'Write a Comment...'
    });
    // console.log(`${DEBUG_KEY}: this.textInput in componentDidMount: `, this.textInput);
  }

  onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
    hidePanel();
    const { name } = item;
    const { pageId, newComment } = this.props;
    const { contentText, contentTags } = newComment;
    // console.log(`${DEBUG_KEY}: contentText is: `, contentText);

    const postCursorContent = contentText.slice(cursorPosition);
    const prevCursorContent = contentText.slice(0, cursorPosition);
    const comment = prevCursorContent.slice(0, -this.state.keyword.length);
    const newContentText = `${comment}@${name} ${postCursorContent.replace(/^\s+/g, '')}`;
    // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
    // console.log(`${DEBUG_KEY}: newContentText is: `, newContentText);
    this.props.newCommentOnTextChange(newContentText, pageId);

    const newContentTag = {
      user: item,
      startIndex: comment.length, // `${comment}@${name} `
      endIndex: comment.length + 1 + name.length, // `${comment}@${name} `
      tagReg: `\\B@${name}`,
      tagText: `@${name}`
    };

    // Clean up tags position before comparing
    const newTags = clearTags(newContentText, newContentTag, contentTags);

    // Check if this tags is already in the array
    const containsTag = newTags.some((t) => (
      t.tagReg === `\\B@${name}` && t.startIndex === comment.length + 1
    ));

    const needReplceOldTag = newTags.some((t) => (
      t.startIndex === comment.length
    ));

    // Update comment contentTags regex and contentTags
    if (!containsTag) {
      let newContentTags;
      if (needReplceOldTag) {
        newContentTags = newTags.map((t) => {
          if (t.startIndex === newContentTag.startIndex) {
            return newContentTag;
          }
          return t;
        });
      } else {
        newContentTags = [...newTags, newContentTag];
      }

      this.props.newCommentOnTagsChange(
        newContentTags.sort((a, b) => a.startIndex - b.startIndex),
        pageId
      );
    }

    // Clear tag search data state
    this.setState({
      ...this.state,
      tagSearchData: { ...INITIAL_TAG_SEARCH }
    });
  }

  // This is triggered when a trigger (@) is removed. Verify if all tags
  // are still valid.
  validateContentTags = () => {
    const { pageId, newComment } = this.props;
    const { contentText, contentTags } = newComment;
    const newContentTags = contentTags.filter((tag) => {
      const { startIndex, endIndex, tagText } = tag;

      const actualTag = contentText.slice(startIndex, endIndex);
      // Verify if with the same startIndex and endIndex, we can still get the
      // tag. If not, then we remove the tag.
      return actualTag === tagText;
    });
    this.props.newCommentOnTagsChange(newContentTags, pageId);
  }

  updateSearchRes(res, searchContent) {
    if (searchContent !== this.state.keyword) return '';
    this.setState({
      ...this.state,
      // keyword,
      tagSearchData: {
        ...this.state.tagSearchData,
        skip: res.data.length, //TODO: new skip
        data: res.data,
        loading: false
      }
    });
  }

  callback(keyword) {
    if (this.reqTimer) {
      clearTimeout(this.reqTimer);
    }

    this.reqTimer = setTimeout(() => {
      // TODO: send search request
      console.log(`${DEBUG_KEY}: requesting for keyword: `, keyword);
      this.setState({
        ...this.state,
        keyword,
        tagSearchData: {
          ...this.state.tagSearchData,
          loading: true
        }
      });
      const { limit } = this.state.tagSearchData;
      this.props.searchUser(keyword, 0, limit, (res, searchContent) => {
        this.updateSearchRes(res, searchContent);
      });
    }, 150);
  }

  handleTagSearchLoadMore = () => {
    const { tagSearchData, keyword } = this.state;
    const { skip, limit, data, loading } = tagSearchData;

    if (loading) return;
    this.setState({
      ...this.state,
      tagSearchData: {
        ...this.state.tagSearchData,
        loading: true
      }
    });

    this.props.searchUser(keyword, skip, limit, (res) => {
      this.setState({
        ...this.state,
        keyword,
        tagSearchData: {
          ...this.state.tagSearchData,
          skip: skip + res.data.length, //TODO: new skip
          data: arrayUnique([...data, ...res.data]),
          loading: false
        }
      });
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

  focusForReply(type) {
    console.log(`${DEBUG_KEY}: focused for replay`);
    this.textInput.focus();

    // Only update the defaultValue if comment button is clicked through comment card / child comment card
    if (type === 'Reply') {
      this.setState({
        ...this.state,
        defaultValue: 'Reply to...'
      });
    }
  }

  focus() {
    this.textInput.focus();
  }

  updateSize = (height) => {
    this.setState({
      height: Math.min(height, maxHeight)
    });
  }

  //tintColor: '#f5d573'
  renderSuggestionIcon(newComment, pageId, goalId) {
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
          this.props.createSuggestion(goalId, pageId);
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

  renderLeftIcons(newComment, pageId, hasSuggestion, goalId) {
    const suggestionIcon = hasSuggestion
      ? this.renderSuggestionIcon(newComment, pageId, goalId)
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
    const { uploading, contentText, tmpSuggestion, suggestion, commentType } = newComment;

    const isInValidComment = commentType === 'Comment' && 
      (contentText === undefined || contentText === '' || contentText.trim() === '');

    const isValidSuggestion = validSuggestion(newComment);

    // const disable = uploading ||
    //   ((contentText === undefined || contentText === '' || contentText.trim() === '')
    //   && _.isEmpty(tmpSuggestion) && _.isEmpty(suggestion));
    const disable = uploading || isInValidComment || !isValidSuggestion;

    const color = disable ? '#cbd6d8' : '#17B3EC';
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
  renderSuggestionsRow({ item }, hidePanel, cursorPosition) {
    const { name, profile } = item;
    return (
      <TouchableOpacity
        onPress={() => this.onTaggingSuggestionTap(item, hidePanel, cursorPosition)}
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
          imageStyle={{ height: 31, width: 30, borderRadius: 3 }}
          defaultImageSource={DefaultUserProfile}
        />
        <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { pageId, newComment, hasSuggestion, goalId } = this.props;
    // console.log(`${DEBUG_KEY}: new comment in commentbox: `, newComment);
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
          ref={r => (this.textInput = r)}
          placeholder={this.state.defaultValue}
          onChangeText={(val) => this.props.newCommentOnTextChange(val, pageId)}
          editable={!uploading}
          maxHeight={maxHeight}
          multiline
          value={newComment.contentText}
          contentTags={newComment.contentTags}
          contentTagsReg={newComment.contentTags.map((t) => t.tagReg)}
          tagSearchRes={this.state.tagSearchData.data}
          defaultValue={this.state.defaultValue}
          onBlur={() => this.handleOnBlur(newComment)}
          onSubmitEditing={() => this.handleOnSubmitEditing(newComment)}
          renderSuggestionPreview={() => this.renderSuggestionPreview(newComment, pageId)}
          renderMedia={() => this.renderMedia(newComment)}
          renderLeftIcons={() => this.renderLeftIcons(newComment, pageId, hasSuggestion, goalId)}
          renderPost={() => this.renderPost(newComment)}

          textInputContainerStyle={inputContainerStyle}
          textInputStyle={inputStyle}
          validateTags={() => this.validateContentTags()}

          suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
          loadingComponent={() => {
            if (this.state.tagSearchData.loading) {
              return (
                <View
                  style={{ flex: 1, height: 50, width, justifyContent: 'center', alignItems: 'center' }}
                >
                  <ActivityIndicator />
                </View>
              );
            }
            return <EmptyResult text={'No User Found'} textStyle={{ paddingTop: 15, height: 50 }} />;
          }}
          textInputMinHeight={30}
          textInputMaxHeight={80}
          trigger={'@'}
          triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
          triggerCallback={this.callback.bind(this)}
          triggerLoadMore={this.handleTagSearchLoadMore}
          renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
          suggestionsData={this.state.tagSearchData.data} // array of objects
          keyExtractor={(item, index) => item._id}
          suggestionRowHeight={50}
          horizontal={false} // defaut is true, change the orientation of the list
          MaxVisibleRowCount={7} // this is required if horizontal={false}
        />
      </SafeAreaView>
    );
  }
}

const validSuggestion = (newComment) => {
  const { commentType, suggestion } = newComment;
  if (commentType === 'Comment') return true;
  if (isInvalidObject(suggestion)) return false;
  const { 
    suggestionFor, 
    suggestionForRef, 
    suggestionType, 
    suggestionText, 
    suggestionLink,
    selectedItem
  } = suggestion;
  // console.log(`${DEBUG_KEY}: suggestion is:`, suggestion);
  if (isInvalidObject(suggestionFor) || isInvalidObject(suggestionForRef) || isInvalidObject(suggestionType)) {
    return false;
  }

  if (suggestionType !== 'Custom' && isInvalidObject(selectedItem)) {
    return false;
  }

  if (suggestionType === 'Custom') {
    if (isInvalidObject(suggestionText) && isInvalidObject(suggestionLink)) {
      return false;
    }
  }
  return true;
};


const isInvalidObject = (o) => {
  if (o === null) return true;
  if (typeof o === 'object') {
    return _.isEmpty(o) || o === undefined;
  }
  if (typeof o === 'string') {
    return o === '' || o.trim() === '';
  }
  return false;
};
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
    padding: 1,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 3,
    alignSelf: 'center',
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    margin: 5
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
    searchUser,
    newCommentOnTextChange,
    openCurrentSuggestion,
    removeSuggestion,
    createSuggestion,
    postComment,
    openCamera,
    openCameraRoll,
    newCommentOnMediaRefChange,
    newCommentOnTagsRegChange,
    newCommentOnTagsChange
  }
)(CommentBoxV2);
