import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';
import R from 'ramda';
import { Actions } from 'react-native-router-flux';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Modal from 'react-native-modal';

/* Components */
import ModalHeader from '../Common/Header/ModalHeader';
import ViewableSettingMenu from '../Goal/ViewableSettingMenu';
import ImageModal from '../Common/ImageModal';
import EmptyResult from '../Common/Text/EmptyResult';
import ProfileImage from '../Common/ProfileImage';
import MentionsTextInput from '../Goal/Common/MentionsTextInput';

// assets
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';
import cancel from '../../asset/utils/cancel_no_background.png';
import camera from '../../asset/utils/camera.png';
import cameraRoll from '../../asset/utils/cameraRoll.png';
import imageOverlay from '../../asset/utils/imageOverlay.png';
import expand from '../../asset/utils/expand.png';

// Utils
import { arrayUnique, clearTags } from '../../redux/middleware/utils';

// Actions
import { openCameraRoll, openCamera } from '../../actions';
import {
  submitCreatingPost,
  postToFormAdapter
} from '../../redux/modules/feed/post/PostActions';
import { searchUser } from '../../redux/modules/search/SearchActions';

const { width } = Dimensions.get('window');
const DEBUG_KEY = '[ UI CreatePostModal ]';
const INITIAL_TAG_SEARCH = {
  data: [],
  skip: 0,
  limit: 10,
  loading: false
};

class CreatePostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaModal: false,
      keyword: '',
      tagSearchData: { ...INITIAL_TAG_SEARCH },
    };
    this.updateSearchRes = this.updateSearchRes.bind(this);
  }

  componentDidMount() {
    this.initializeForm();
  }

  /**
   * Tag related functions
   */
  onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
    hidePanel();
    const { name } = item;
    const { post, tags } = this.props;

    const postCursorContent = post.slice(cursorPosition);
    const prevCursorContent = post.slice(0, cursorPosition);
    const content = prevCursorContent.slice(0, -this.state.keyword.length);
    const newContent = `${content}@${name} ${postCursorContent.replace(/^\s+/g, '')}`;
    // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
    // console.log(`${DEBUG_KEY}: newContentText is: `, newContentText);
    this.props.change('post', newContent);

    const newContentTag = {
      user: item,
      startIndex: content.length, // `${comment}@${name} `
      endIndex: content.length + 1 + name.length, // `${comment}@${name} `
      tagReg: `\\B@${name}`,
      tagText: `@${name}`
    };

    // Clean up tags position before comparing
    const newTags = clearTags(newContent, newContentTag, tags);

    // Check if this tags is already in the array
    const containsTag = newTags.some((t) => (
      t.tagReg === `\\B@${name}` && t.startIndex === content.length + 1
    ));

    const needReplceOldTag = newTags.some((t) => (
      t.startIndex === content.length
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
      // TODO: sort newContentTags by startIndex
      this.props.change(
        'tags',
        newContentTags.sort((a, b) => a.startIndex - b.startIndex)
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
  validateContentTags = (change) => {
    const { tags, post } = this.props;
    const newContentTags = tags.filter((tag) => {
      const { startIndex, endIndex, tagText } = tag;

      const actualTag = post.slice(startIndex, endIndex);
      // Verify if with the same startIndex and endIndex, we can still get the
      // tag. If not, then we remove the tag.
      return actualTag === tagText;
    });
    change('tags', newContentTags);
  }

  updateSearchRes(res, searchContent) {
    if (searchContent !== this.state.keyword) return;
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

  triggerCallback(keyword) {
    if (this.reqTimer) {
      clearTimeout(this.reqTimer);
    }

    this.reqTimer = setTimeout(() => {
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
      // Use the customized search if there is one
      if (this.props.tagSearch) {
        this.props.tagSearch(keyword, (res, searchContent) => {
          this.updateSearchRes(res, searchContent);
        });
        return;
      }

      this.props.searchUser(keyword, 0, limit, (res, searchContent) => {
        this.updateSearchRes(res, searchContent);
      });
    }, 150);
  }

  handleTagSearchLoadMore = () => {
    const { tagSearchData, keyword } = this.state;
    const { skip, limit, data, loading } = tagSearchData;

    // Disable load more if customized search is provided
    if (this.props.tagSearch) {
      return;
    }

    if (loading) return;
    this.setState({
      ...this.state,
      keyword,
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
  /* Tagging related function ends */

  initializeForm() {
    const { belongsToTribe, belongsToEvent } = this.props;
    const defaulVals = {
      viewableSetting: 'Friends',
      mediaRef: undefined,
      post: '',
      tags: [],
      belongsToTribe,
      belongsToEvent
    };

    // Initialize based on the props, if it's opened through edit button
    const { initializeFromState, initialPost } = this.props;
    const initialVals = initializeFromState
      ? { ...postToFormAdapter(initialPost) }
      : { ...defaulVals };

    this.props.initialize({
      // ...initialVals
      ...initialVals
    });
  }

  handleOpenCamera = () => {
    this.props.openCamera((result) => {
      this.props.change('mediaRef', result.uri);
    });
  }

  handleOpenCameraRoll = () => {
    const callback = R.curry((result) => {
      this.props.change('mediaRef', result.uri);
    });
    this.props.openCameraRoll(callback);
  }

  /**
   * This is a hacky solution due to the fact that redux-form
   * handleSubmit values differ from the values actually stored.
   * NOTE:
   * Verify by comparing
   * console.log('handleSubmit passed in values are: ', values);
   * console.log('form state values: ', this.props.formVals);
   *
   * Synchronize validate form values, contains simple check
   */
  handleCreate = (values) => {
    const { initializeFromState, post, mediaRef, belongsToTribe, belongsToEvent, openProfile, initialPost } = this.props;
    const needUpload =
      (initializeFromState && post.mediaRef && post.mediaRef !== mediaRef)
      || (!initializeFromState && mediaRef);

    const needOpenProfile = (belongsToTribe === undefined && belongsToEvent === undefined) &&
      (openProfile === undefined || openProfile === true) && !initializeFromState;

    const needRefreshProfile = openProfile === false;
    return this.props.submitCreatingPost(
      this.props.formVals.values,
      needUpload,
      { 
        needOpenProfile, // Open user profile page and refresh the profile
        needRefreshProfile // Only refresh the profile page with given tab and filter
      },
      initializeFromState,
      initialPost,
      this.props.callback,
      this.props.pageId
    );
  }

  renderTagSearchLoadingComponent(loading) {
    if (loading) {
      return (
        <View style={styles.activityIndicatorStyle}>
          <ActivityIndicator />
        </View>
      );
    }
    return <EmptyResult text={'No User Found'} textStyle={{ paddingTop: 15, height: 50 }} />;
  }

  /**
   * This is added on ms2 polish as a new way to render textinput for post
   */
  renderInput = (props) => {
    const {
      input: { onFocus, value, onChange, ...restInput },
      editable,
      placeholder,
      style,
      meta: { touched, error },
      loading,
      tagData,
      change,
      ...custom
    } = props;

    const { tags } = this.props;

    return (
      <View style={{ zIndex: 3 }}>
        <MentionsTextInput
          placeholder={placeholder}
          onChangeText={(val) => onChange(val)}
          editable={editable}
          value={_.isEmpty(value) ? '' : value}
          contentTags={tags || []}
          contentTagsReg={tags ? tags.map((t) => t.tagReg) : []}
          tagSearchRes={this.state.tagSearchData.data}
          flexGrowDirection='bottom'
          suggestionPosition='bottom'
          textInputContainerStyle={{ ...styles.inputContainerStyle }}
          textInputStyle={style}
          validateTags={() => this.validateContentTags(change)}
          autoCorrect
          suggestionsPanelStyle={{ backgroundColor: '#f8f8f8' }}
          loadingComponent={() => this.renderTagSearchLoadingComponent(loading)}
          textInputMinHeight={80}
          textInputMaxHeight={200}
          trigger={'@'}
          triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
          triggerCallback={(keyword) => this.triggerCallback(keyword)}
          triggerLoadMore={this.handleTagSearchLoadMore.bind(this)}
          renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
          suggestionsData={tagData} // array of objects
          keyExtractor={(item, index) => item._id}
          suggestionRowHeight={50}
          horizontal={false} // defaut is true, change the orientation of the list
          MaxVisibleRowCount={4} // this is required if horizontal={false}
        />
      </View>
    );
  }

  /*
    <View style={styles.inputContainerStyle}>
      <TextInput
        placeholder={placeholder}
        onChangeText={(val) => onChange(val)}
        style={style}
        editable={editable}
        multiline={multiline}
        value={_.isEmpty(value) ? '' : value}
        autoCorrect
      />
    </View>
  */

  // renderInput = ({
  //   input: { onChange, onFocus, value, ...restInput },
  //   multiline,
  //   editable,
  //   numberOfLines,
  //   placeholder,
  //   style,
  //   iconSource,
  //   iconStyle,
  //   iconOnPress,
  //   meta: { touched, error },
  //   ...custom
  // }) => {
  //   const icon = iconSource ?
  //     <Image source={iconSource} style={{ ...iconStyle }} />
  //     :
  //     '';
  //   return (
  //     <View style={styles.inputContainerStyle}>
  //       <TextInput
  //         ref={input => { this.textInput = input; }}
  //         title={custom.title}
  //         autoCapitalize={'none'}
  //         autoCorrect={false}
  //         onChangeText={onChange}
  //         numberOfLines={1 || numberOfLines}
  //         returnKeyType='done'
  //         multiline={multiline}
  //         onFocus={onFocus}
  //         editable={editable}
  //         placeholder={placeholder}
  //         style={style}
  //         value={_.isEmpty(value) ? '' : value}
  //         {...restInput}
  //         {...custom}
  //       />
  //       <TouchableOpacity activeOpacity={0.85}
  //         style={{ padding: 15, alignItems: 'flex-end', alignSelf: 'center' }}
  //         onPress={iconOnPress}
  //       >
  //         {icon}
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
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
          defaultImageSource={defaultUserProfile}
        />
        <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  renderUserInfo() {
    const { belongsToTribe, belongsToEvent, user } = this.props;
    const { profile, name } = user;
    let imageUrl = profile.image;
    let profileImage = (
      <Image style={styles.imageStyle} resizeMode='cover' source={defaultUserProfile} />
    );
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }

    const callback = R.curry((value) => this.props.change('viewableSetting', value));

    return (
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        {profileImage}
        <View style={{ flexDirection: 'column', marginLeft: 15 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            {name}
          </Text>
          <ViewableSettingMenu
            viewableSetting={this.props.viewableSetting}
            callback={callback}
            shareToMastermind={null}
            belongsToTribe={belongsToTribe}
            belongsToEvent={belongsToEvent}
          />
        </View>
      </View>
    );
  }

  // Current media type is only picture
  renderMedia() {
    const { initializeFromState, post, mediaRef } = this.props;
    let imageUrl = mediaRef;
    if (initializeFromState && mediaRef) {
      const hasImageModified = post.mediaRef && post.mediaRef !== mediaRef;
      if (!hasImageModified) {
        // If editing a tribe and image hasn't changed, then image source should
        // be from server
        imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${mediaRef}`;
      }
    }

    // Do not render cancel button if editing since we 
    // don't allow editing image
    const cancelButton = initializeFromState ? null : (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => this.props.change('mediaRef', false)}
        style={{ position: 'absolute', top: 10, left: 15 }}
      >
        <Image
          source={cancel}
          style={{ width: 15, height: 15, tintColor: '#fafafa' }}
        />
      </TouchableOpacity>
    );

    if (this.props.mediaRef) {
      return (
        <View style={{ backgroundColor: 'gray', borderRadius: 8 }}>
          <ImageBackground
            style={styles.mediaStyle}
            source={{ uri: imageUrl }}
            imageStyle={{ borderRadius: 8, opacity: 0.7, resizeMode: 'cover' }}
          >
            <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
              <Image
                source={imageOverlay}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  height: 45,
                  width: 50,
                  tintColor: '#fafafa'
                }}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => this.setState({ mediaModal: true })}
              style={{ position: 'absolute', top: 10, right: 15 }}
            >
              <Image
                source={expand}
                style={{ width: 15, height: 15, tintColor: '#fafafa' }}
              />
            </TouchableOpacity>

            {cancelButton}
          </ImageBackground>
        </View>
      );
    }
    return null;
  }

  renderImageModal() {
    return (
      <ImageModal
        mediaRef={this.props.mediaRef}
        mediaModal={this.state.mediaModal}
        closeModal={() => this.setState({ mediaModal: false })}
      />
    );
  }

  renderPost() {
    const titleText = <Text style={styles.titleTextStyle}>Your thoughts</Text>;
    return (
      <View style={{ marginTop: 15 }}>
        {titleText}
        <Field
          name='post'
          label='post'
          component={this.renderInput}
          editable={!this.props.uploading}
          multiline
          style={styles.goalInputStyle}
          placeholder='What do you have in mind?'
          loading={this.state.tagSearchData.loading}
          tagData={this.state.tagSearchData.data}
          keyword={this.state.keyword}
          change={(type, val) => this.props.change(type, val)}
        />
      </View>
    );
  }

  renderActionIcons() {
    // If user already has the image, they need to delete the image and then
    // these icons would show up to attach another image
    if (this.props.mediaRef) return null;
    const actionIconStyle = { ...styles.actionIconStyle };
    const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle };
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={actionIconWrapperStyle}
          onPress={this.handleOpenCamera}
        >
          <Image style={actionIconStyle} source={camera} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ ...actionIconWrapperStyle, marginLeft: 5 }}
          onPress={this.handleOpenCameraRoll}
        >
          <Image style={actionIconStyle} source={cameraRoll} />
        </TouchableOpacity>
      </View>
    );
  }

  // render() {
  //   const { handleSubmit, errors } = this.props;
  //   return (
  //     <SafeAreaView
  //       forceInset={{ bottom: 'always' }}
  //       style={{ flex: 1, backgroundColor: '#6f6f6f' }}
  //       onPress={() => {
  //         Keyboard.dismiss()
  //       }}
  //     >
  //       <KeyboardAwareScrollView
  //         ref='scrollView'
  //         keyboardShouldPersistTaps={'always'}
  //         contentContainerStyle={{
  //           flexGrow: 1 // this will fix scrollview scroll issue by passing parent view width and height to it
  //         }}
  //       >
  //       <ModalHeader
  //         title='New Post'
  //         actionText='Create'
  //         onCancel={() => Actions.pop()}
  //         onAction={handleSubmit(this.handleCreate)}
  //       />
  //         <View style={{ flex: 1, padding: 20 }}>
  //           {this.renderUserInfo()}
  //           {this.renderMedia()}
  //           {this.renderPost()}
  //           {this.renderActionIcons()}
  //         </View>
  //
  //       {this.renderImageModal()}
  //       </KeyboardAwareScrollView>
  //     </SafeAreaView>
  //   );
  // }

  render() {
    const { handleSubmit, errors, initializeFromState } = this.props;
    const modalActionText = initializeFromState ? 'Update' : 'Create';

    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1, backgroundColor: '#ffffff' }}
      >
        <ModalHeader
          title='New Post'
          actionText={modalActionText}
          onCancel={() => {
            if (this.props.onClose) {
              this.props.onClose();
            }
            Actions.pop();
          }}
          onAction={handleSubmit(this.handleCreate)}
          actionDisabled={this.props.uploading}
        />
        <ScrollView style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            {this.renderUserInfo()}
            {this.renderMedia()}
            {this.renderPost()}
            {this.renderActionIcons()}
          </View>

        </ScrollView>
        {this.renderImageModal()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  inputContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  },
  goalInputStyle: {
    fontSize: 17,
    paddingTop: 20,
    padding: 20,
    width: '100%',
    // textAlign: 'justify',
    height: 'auto',
    maxHeight: 200,
    minHeight: 80
  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  titleTextStyle: {
    fontSize: 13,
    color: '#a1a1a1',
    padding: 2
  },
  standardInputStyle: {
    flex: 1,
    fontSize: 12,
    padding: 13,
    paddingRight: 14,
    paddingLeft: 14
  },
  cancelIconStyle: {
    height: 20,
    width: 20,
    justifyContent: 'flex-end'
  },
  mediaStyle: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionIconWrapperStyle: {
    backgroundColor: '#fafafa',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  actionIconStyle: {
    tintColor: '#4a4a4a',
    height: 15,
    width: 18
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
  activityIndicatorStyle: {
    flex: 1, height: 50, width: '100%', justifyContent: 'center', alignItems: 'center'
  }
};

CreatePostModal = reduxForm({
  form: 'createPostModal',
  enableReinitialize: true
})(CreatePostModal);

const mapStateToProps = state => {
  const selector = formValueSelector('createPostModal');
  const { user } = state.user;
  const { profile } = user;

  return {
    user,
    profile,
    viewableSetting: selector(state, 'viewableSetting'),
    post: selector(state, 'post'),
    tags: selector(state, 'tags'),
    mediaRef: selector(state, 'mediaRef'),
    formVals: state.form.createPostModal,
    uploading: state.posts.newPost.uploading
  };
};

export default connect(
  mapStateToProps,
  {
    searchUser,
    openCameraRoll,
    openCamera,
    submitCreatingPost
  }
)(CreatePostModal);
