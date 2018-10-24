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
  POST_NEW_POST_SUBMIT_FAIL
} from './PostReducers';

import {
  openShareDetail
} from './ShareActions';

import { api as API } from '../../../middleware/api';
import { capitalizeWord } from '../../../middleware/utils';
import ImageUtils from '../../../../Utils/ImageUtils';

const DEBUG_KEY = '[ Action Post ]';

/**
 * If post is a share, then open share detail. Otherwise, open post detail
 */
export const openPostDetail = (post) => (dispatch, getState) => {
  // Open share detail if not a general post
  if (post.postType !== 'General') {
    return openShareDetail(post)(dispatch, getState);
  }

  const { tab } = getState().navigation;
  const scene = (!tab || tab === 'homeTab') ? 'post' : `post${capitalizeWord(tab)}`;
  const { pageId } = _.get(getState().postDetail, `${scene}`);

  dispatch({
    type: POST_DETAIL_OPEN,
    payload: {
      post,
      tab,
      pageId
    },
  });

  Actions.push(`${scene}`);
};

// close post detail
export const closePostDetail = () => (dispatch, getState) => {
  Actions.pop();

  const { tab } = getState().navigation;
  const path = (!tab || tab === 'homeTab') ? 'post' : `post${capitalizeWord(tab)}`;
  const { pageId } = _.get(getState().postDetail, `${path}`);

  dispatch({
    type: POST_DETAIL_CLOSE,
    payload: {
      tab,
      pageId
    }
  });
};

// open edit modal for post given post belongs to current user
export const editPost = (post) => (dispatch, getState) => {
  Actions.push('createPostModal', { initializeFromState: true, post });
};

// Submit creating new post
export const submitCreatingPost = (values, needUpload) => (dispatch, getState) => {
    const { userId, token } = getState().user;
    const newPost = newPostAdaptor(values, userId);

    const imageUri = newPost.mediaRef;
    if (!needUpload) {
      // If no mediaRef then directly submit the post
      sendCreatePostRequest(newPost, token, dispatch);
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
          return sendCreatePostRequest({ ...newPost, mediaRef: image }, token, dispatch);
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

    // After request being executed successfully, pop the modal and clear the form
    Actions.pop();
};

/**
 * Call API to send the create post request
 *
 * @param newPost: the new post object to create
 * @param token: current user token
 * @param dispatch: function to update store
 */
const sendCreatePostRequest = (newPost, token, dispatch, onError) => {
  const handleError = onError || (() => {
    Alert.alert(
      'Create post failed',
      'Please try again later.'
    );
    dispatch({
      type: POST_NEW_POST_SUBMIT_FAIL
    });
  });
  API
    .post(
      'secure/feed/post',
      {
        post: JSON.stringify({ ...newPost })
      },
      token
    )
    .then((res) => {
      if (!res.message && res.data) {
        console.log('Creating post succeed with data: ', res.data);
        dispatch({
          type: POST_NEW_POST_SUBMIT_SUCCESS,
          payload: { ...res.data }
        });
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
 * Transform values in CreatePostModal to Server readable format
 */
const newPostAdaptor = (values, userId) => {
  const { viewableSetting, mediaRef, post, belongsToTribe, belongsToEvent } = values;

  return {
    owner: userId,
    privacy: viewableSetting === 'Private' ? 'self' : viewableSetting.toLowerCase(),
    content: {
      text: post,
      tags: [],
      links: []
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