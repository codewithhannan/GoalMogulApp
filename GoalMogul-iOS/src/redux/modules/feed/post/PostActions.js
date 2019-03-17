// Post Detail Page related Actions
import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import { Alert } from 'react-native';
import _ from 'lodash';
import {
  POST_DETAIL_OPEN,
  POST_DETAIL_CLOSE,
  POST_NEW_POST_UPDATE_MEDIA,
  POST_NEW_POST_SUBMIT_SUCCESS,
  POST_NEW_POST_SUBMIT_FAIL,
  POST_NEW_POST_SUBMIT,
  POST_DETAIL_FETCH,
  POST_DETAIL_FETCH_DONE,
  POST_DETAIL_FETCH_ERROR
} from './PostReducers';

import {
  openShareDetail
} from './ShareActions';

import {
  openProfile,
  handleTabRefresh,
  selectProfileTab
} from '../../../../actions';

// Actions
import {
  refreshComments
} from '../../feed/comment/CommentActions';

import { api as API } from '../../../middleware/api';
import { 
  capitalizeWord, 
  clearTags, 
  constructPageId,
  componentKeyByTab 
} from '../../../middleware/utils';

import ImageUtils from '../../../../Utils/ImageUtils';

const DEBUG_KEY = '[ Action Post ]';
/**
 * Open a post by postId
 * @param {} postId 
 */
export const openPostDetailById = (postId) => (dispatch, getState) => {
  // Open share detail if not a general post
  // Generate pageId on open
  const pageId = constructPageId('post');

  const { tab } = getState().navigation;
  // const scene = (!tab || tab === 'homeTab') ? 'post' : `post${capitalizeWord(tab)}`;
  // const { pageId } = _.get(getState().postDetail, `${scene}`);

  dispatch({
    type: POST_DETAIL_OPEN,
    payload: {
      tab,
      postId,
      pageId
    },
  });

  fetchPostDetail(postId, pageId)(dispatch, getState);
  refreshComments('Post', postId, tab, pageId)(dispatch, getState);

  const componentToOpen = componentKeyByTab(tab, 'post');
  Actions.push(`${componentToOpen}`, { pageId, postId });
};

/**
 * If post is a share, then open share detail. Otherwise, open post detail
 */
export const openPostDetail = (post, initialProps) => (dispatch, getState) => {
  // Open share detail if not a general post
  const postId = post._id;

  // Generate pageId on open
  const pageId = constructPageId('post');
  if (post.postType !== 'General') {
    return openShareDetail(post, pageId, initialProps)(dispatch, getState);
  }

  const { tab } = getState().navigation;
  // const scene = (!tab || tab === 'homeTab') ? 'post' : `post${capitalizeWord(tab)}`;
  // const { pageId } = _.get(getState().postDetail, `${scene}`);

  dispatch({
    type: POST_DETAIL_OPEN,
    payload: {
      post,
      tab,
      postId,
      pageId
    },
  });

  fetchPostDetail(postId, pageId)(dispatch, getState);
  refreshComments('Post', postId, tab, pageId)(dispatch, getState);

  const componentToOpen = componentKeyByTab(tab, 'post');
  // Initial is used to manipulate the post
  Actions.push(`${componentToOpen}`, { pageId, postId, initialProps });
};

export const fetchPostDetail = (postId, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  const { token } = getState().user;

  dispatch({
    type: POST_DETAIL_FETCH,
    payload: {
      postId,
      tab,
      pageId
    }
  });

  const onError = (err) => {
    console.warn(`${DEBUG_KEY}: refresh post error: `, err);
    if (err.status === 400 || err.status === 404) {
      Alert.alert(
        'Content not found',
        'This post has been removed', 
        [
          { 
            text: 'Cancel', 
            onPress: () => Actions.pop()
          }
        ]
      );
    }
    dispatch({
      type: POST_DETAIL_FETCH_ERROR,
      payload: {
        post: undefined,
        postId,
        pageId,
        tab,
        error: err
      }
    });
  };

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: refresh post done with res: `, res);
    dispatch({
      type: POST_DETAIL_FETCH_DONE,
      payload: {
        post: res.data,
        postId,
        tab,
        pageId
      }
    });
  };

  API
    .get(`secure/feed/post?postId=${postId}`, token)
    .then((res) => {
      if (res.status === 200) {
        return onSuccess(res);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

// close post detail
export const closePostDetail = (postId, pageId) => (dispatch, getState) => {
  Actions.pop();

  const { tab } = getState().navigation;
  // const path = (!tab || tab === 'homeTab') ? 'post' : `post${capitalizeWord(tab)}`;
  // const { pageId } = _.get(getState().postDetail, `${path}`);

  dispatch({
    type: POST_DETAIL_CLOSE,
    payload: {
      tab,
      pageId,
      postId
    }
  });
};

// open edit modal for post given post belongs to current user
export const editPost = (post) => (dispatch, getState) => {
  // We don't need to pass pageId since the pageId is for profile in this case
  console.log(`${DEBUG_KEY}: [ editPost ]: post is:`, post);
  Actions.push('createPostModal', { initializeFromState: true, initialPost: post });
};

// Submit creating new post
/**
 * @param needOpenProfile: if true, then open profile with post tab
 */
export const submitCreatingPost = (
  values, 
  needUpload, 
  { 
    needOpenProfile, 
    needRefreshProfile 
  },
  initializeFromState, // initializeFromState means it's an update
  initialPost,
  callback,
  pageId // TODO: profile reducer redesign to change here
) => (dispatch, getState) => {
    const { userId, token, user } = getState().user;
    const newPost = newPostAdaptor(values, userId);
    console.log(`${DEBUG_KEY}: post to submit is: `, newPost);
    // console.log(`${DEBUG_KEY}: initializeFromState is: `, initializeFromState);
    dispatch({
      type: POST_NEW_POST_SUBMIT
    });

    const onSuccess = (res) => {
      console.log('Creating post succeed with res: ', res);
      dispatch({
        type: POST_NEW_POST_SUBMIT_SUCCESS,
        payload: {
          post: { 
            ...res.data,
            owner: user
          },
          update: initializeFromState
        }
      });

      if (callback) {
        callback();
      }

      if (needOpenProfile) {
        // Open profile and then refresh
        openProfile(userId, 'posts')(dispatch, getState);
        return;
      }

      if (needRefreshProfile) {
        // Change to post tab and then refresh the page
        selectProfileTab(1, userId, pageId)(dispatch, getState);
        handleTabRefresh('posts', userId, pageId)(dispatch, getState);
      }

      Actions.pop();
    };

    const imageUri = newPost.mediaRef;
    if (!needUpload) {
      // If no mediaRef then directly submit the post
      sendCreatePostRequest(newPost, token, dispatch, onSuccess, null, initializeFromState, initialPost);
    } else {
      ImageUtils.getImageSize(imageUri)
        .then(({ width, height }) => {
          // Resize image
          console.log('width, height are: ', width, height);
          return ImageUtils.resizeImage(imageUri, width, height);
        })
        .then((image) => {
          // Upload image to S3 server
          console.log('image to upload is: ', image);
          return ImageUtils.getPresignedUrl(image.uri, token, (objectKey) => {
            // Obtain pre-signed url and store in getState().postDetail.newPost.mediaRef
            dispatch({
              type: POST_NEW_POST_UPDATE_MEDIA,
              payload: objectKey
            });
          }, 'FeedImage');
        })
        .then(({ signedRequest, file }) => {
          return ImageUtils.uploadImage(file, signedRequest);
        })
        .then((res) => {
          if (res instanceof Error) {
            // uploading to s3 failed
            console.log(`${DEBUG_KEY}: error uploading image to s3 with res: `, res);
            throw res;
          }
          return getState().postDetail.newPost.mediaRef;
        })
        .then((image) => {
          // Use the presignedUrl as media string
          console.log('media ref after uploading is: ', image);
          return sendCreatePostRequest(
            { ...newPost, mediaRef: image },
            token,
            dispatch,
            onSuccess,
            null,
            initializeFromState,
            initialPost
          );
        })
        .catch((err) => {
          // TODO: error handling for different kinds of errors.
          /*
          Error Type:
            image getSize
            image Resize
            image upload to S3
            update profile image Id
          */
          console.warn(`${DEBUG_KEY}: Creating post with Error: `, err);
          Alert.alert(
            'Create post failed',
            'Please try again later.'
          );
          dispatch({
            type: POST_NEW_POST_SUBMIT_FAIL
          });
        });
    }
};

/**
 * Call API to send the create post request
 *
 * @param newPost: the new post object to create
 * @param token: current user token
 * @param dispatch: function to update store
 * @param needOpenProfile: if creating post from home page, then open profile post type
 * @param update: if update, use put request
 */
const sendCreatePostRequest = (newPost, token, dispatch, onSuccess, onError, update, initialPost) => {
  const handleError = onError || (() => {
    Alert.alert(
      'Create post failed',
      'Please try again later.'
    );
    dispatch({
      type: POST_NEW_POST_SUBMIT_FAIL
    });
  });

  if (update) {
    API
      .put(
        'secure/feed/post',
        {
          postId: initialPost._id,
          updates: JSON.stringify(postToUpdateAdaptor(newPost))
        },
        token
      )
      .then((res) => {
        if ((!res.message && res.data) || res.status === 200) {
          onSuccess(res);
          return;
        }
        console.log('Creating post failed with message: ', res);
        handleError();
      })
      .catch((err) => {
        console.log(`${DEBUG_KEY}: Error creating post in submitting the values: `, err);
        handleError();
      });
    return;
  }

  API
    .post(
      'secure/feed/post',
      {
        post: JSON.stringify({ ...newPost })
      },
      token
    )
    .then((res) => {
      if ((!res.message && res.data) || res.status === 200) {
        onSuccess(res);
        return;
      }
      console.log('Creating post failed with message: ', res);
      handleError();
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error creating post in submitting the values: `, err);
      handleError();
    });
};

/**
 * Transform a post to only update
 * @param {} post 
 */
const postToUpdateAdaptor = (post) => {
  const { content, privacy } = post;
  return {
    content,
    privacy
  };
};

/**
 * Transform values in CreatePostModal to Server readable format
 */
const newPostAdaptor = (values, userId) => {
  const { viewableSetting, mediaRef, post, belongsToTribe, belongsToEvent, tags } = values;
  const tagsToUser = clearTags(post, {}, tags); // Update the index before submitting

  const shouldBePublic = belongsToTribe !== undefined || belongsToEvent !== undefined;
  let privacySetting;
  if (shouldBePublic) {
    privacySetting = 'public';
  } else {
    privacySetting = viewableSetting === 'Private' ? 'self' : viewableSetting.toLowerCase();
  }
  return {
    owner: userId,
    privacy: privacySetting,
    content: {
      text: post,
      tags: tagsToUser.map((t) => {
        const { user, startIndex, endIndex } = t;
        return { user, startIndex, endIndex };
      }),
      // links: [] no link is needed for now
    },
    mediaRef,
    postType: 'General',
    belongsToTribe,
    belongsToEvent
  };
};
/**
 * Transform a post to CreatePostModal initial values
 */
export const postToFormAdapter = (values) => {
  console.log(`${DEBUG_KEY}: values are:`, values);
  const {
    privacy,
    content,
    mediaRef
  } = values;

  return {
    post: content.text,
    viewableSetting: privacy === 'self' ? 'Private' : capitalizeWord(privacy),
    mediaRef
  };
};
