import { Actions } from 'react-native-router-flux';
import { Image, Alert } from 'react-native';
import _ from 'lodash';

import ImageUtils from '../Utils/ImageUtils';
import { updateAccount, updateProfile, updatePassword } from '../Utils/ProfileUtils';
import { api as API } from '../redux/middleware/api';
import { queryBuilder } from '../redux/middleware/utils';

import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_FAIL,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_IMAGE_UPLOAD_SUCCESS,
  PROFILE_SWITCH_TAB
} from './types';

import {
  PROFILE_FETCH_FRIEND_COUNT_DONE,
  PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE,
  PROFILE_FETCH_FRIENDSHIP_DONE,
  PROFILE_FETCH_MUTUAL_FRIEND,
  PROFILE_FETCH_MUTUAL_FRIEND_DONE,
  // Profile load tabs constants
  PROFILE_FETCH_TAB_DONE,
  PROFILE_REFRESH_TAB_DONE,
  PROFILE_FETCH_TAB_FAIL,
  PROFILE_REFRESH_TAB_FAIL,
  PROFILE_REFRESH_TAB,
  PROFILE_UPDATE_FILTER,
  PROFILE_GOAL_FILTER_CONST,

  PROFILE_GOAL_DELETE_SUCCESS,
  PROFILE_POST_DELETE_SUCCESS
} from '../reducers/Profile';

const DEBUG_KEY = '[ Action Profile ]';

const prefetchImage = (imageUrl) => {
  if (imageUrl) {
    const fullImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
    Image.prefetch(fullImageUrl);
  }
};

const fetchFriendshipSucceed = (res, dispatch) => {
  console.log(`${DEBUG_KEY} fetchFriendshipSucceed with res: `, res);
  dispatch({
    type: PROFILE_FETCH_FRIENDSHIP_DONE,
    payload: res.data
  });
};

const fetchFriendsCountSucceed = (res, self, dispatch) => {
  console.log(`${DEBUG_KEY} fetchMutualFriendSucceed with res: `, res);
  const type = self ? PROFILE_FETCH_FRIEND_COUNT_DONE : PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE;
  dispatch({
    type,
    payload: res.data
  });
};

const fetchProfileSucceed = (res, dispatch) => {
  console.log(`${DEBUG_KEY} fetch profile succeed`);
  dispatch({
    type: PROFILE_FETCHING_SUCCESS,
    payload: res.data
  });
};

const fetchProfileFail = (res, dispatch) => {
  console.log(`${DEBUG_KEY} fetch profile succeed`);
  dispatch({
    type: PROFILE_FETCHING_FAIL,
    payload: res.message
  });
};

export const openProfile = (userId) => (dispatch, getState) => {
  dispatch({
    type: PROFILE_OPEN_PROFILE,
    payload: userId
  });
  Actions.push('profile');

  const { token, } = getState().user;
  const self = getState().profile.userId.toString() === getState().user.userId.toString();

  const profilePromise =
    API.get(`secure/user/profile?userId=${userId}`, token);

  // If self, fetch friend list. Otherwise, fetch mutual friends
  const friendsCountPromise = self ?
    API.get(`secure/user/friendship/count?userId=${userId}`, token) :
    API.get(`secure/user/friendship/mutual-friends/count?userId=${userId}`, token);
    // new Promise((resolve, reject) => resolve({ data: [] }));

  // If self, fetch nothing. Otherwise, fetch friendship with userId
  const friendshipPromise = self ?
    new Promise((resolve, reject) => resolve({ data: [] })) :
    API.get(`secure/user/friendship/friendship?userId=${userId}`, token);

  Promise
    .all([profilePromise, friendsCountPromise, friendshipPromise])
    .then((res) => {
      const [profileRes, friendsCountRes, friendshipRes] = res;

      if (profileRes.message) {
        /* TODO: error handling */
        return fetchProfileFail(profileRes, dispatch);
      }
      fetchProfileSucceed(profileRes, dispatch);
      // Prefetch profile image
      prefetchImage(profileRes.data.profile.image);

      if (friendsCountRes.message) {
        /* TODO: error handling for failing to fetch friends */
        console.log(`${DEBUG_KEY} fetch friends count fails: `, friendsCountRes.message);
      } else {
        fetchFriendsCountSucceed(res, self, dispatch);
      }


      if (friendshipRes.message) {
        /* TODO: error handling for failing to fetch friends */
        console.log(`${DEBUG_KEY} fetch friendship fails: `, friendshipRes);
      } else {
        fetchFriendshipSucceed(friendshipRes, dispatch);
      }
    })
    .catch((err) => {
      console.log('err in loading user profile', err);
      dispatch({
        type: PROFILE_FETCHING_FAIL,
        payload: `Error loading user profile: ${err}`
      });
      // TODO: show toaster saying loading fail
    });
};

// Fetch mutual friends
export const fetchMutualFriends = (userId, refresh) => (dispatch, getState) => {
  dispatch({
    type: PROFILE_FETCH_MUTUAL_FRIEND
  });

  const { token } = getState().user;
  const { skip, limit, hasNextPage } = getState().profile.mutualFriends;
  const newSkip = refresh ? 0 : skip;
  if (hasNextPage === undefined || hasNextPage) {
    API
      .get(
        `secure/user/friendship/mutual-friends?userId=${userId}&skip=${skip}&limit=${limit}`,
        token
      )
      .then((res) => {
        console.log(`${DEBUG_KEY} fetch mutual friends with res: `, res);
        if (res.data) {
          const data = res.data;
          dispatch({
            type: PROFILE_FETCH_MUTUAL_FRIEND_DONE,
            payload: {
              skip: newSkip + res.data.length,
              hasNextPage: !(data === undefined || data.length === 0),
              data: data === null || data === undefined ? [] : data,
              refresh
            }
          });
        }
      })
      .catch((err) => {
        console.log(`${DEBUG_KEY} fetch mutual friends error: ${err}`);
        dispatch({
          type: PROFILE_FETCH_MUTUAL_FRIEND_DONE,
          payload: {
            skip,
            hasNextPage,
            data: [],
            refresh: false
          }
        });
      });
  }
};

export const openProfileDetail = () => (dispatch) => {
  dispatch({
    type: ''
  });
  Actions.profileDetail();
};

export const openProfileDetailEditForm = () => {
  return (dispatch) => {
    dispatch({
      type: ''
    });
    Actions.profileDetailEditForm();
  };
};

export const submitUpdatingProfile = ({ values, hasImageModified }) => {
  return (dispatch, getState) => {
    const { headline, name, oldPassword, newPassword } = values;
    const { about, occupation, elevatorPitch } = values.profile;
    const imageUri = values.profile.image;

    const { token } = getState().user;

    // Start updaing process
    dispatch({
      type: PROFILE_SUBMIT_UPDATE
    });

    const updateAccountPromise = updateAccount({ name, headline, token });
    const updateProfilePromise = ImageUtils
      .upload(hasImageModified, imageUri, token, PROFILE_IMAGE_UPLOAD_SUCCESS, dispatch)
      .then(() => {
        const image = getState().profile.user.profile.image;
        return updateProfile({
          image,
          about,
          occupation,
          elevatorPitch,
          token
        });
      });

    let updatePasswordPromise = null;
    if (oldPassword && newPassword) {
      updatePasswordPromise = updatePassword({ oldPassword, newPassword, token });
    }

    Promise
      .all([updateAccountPromise, updateProfilePromise, updatePasswordPromise])
      .then((res) => {
        const [accountUpdateRes, profileUpdateRes, passwordUpdateRes] = res;
        const profile = { ...profileUpdateRes };
        const user = { ...accountUpdateRes, profile };

        dispatch({
          type: PROFILE_UPDATE_SUCCESS,
          payload: user
        });
        Actions.pop();
        console.log('Update profile succeed: ', res);
      })
      .catch((err) => {
        dispatch({
          type: PROFILE_UPDATE_FAIL,
          payload: err
        });
        console.log('error updating profile: ', err);
      });
  };
};

export const selectProfileTab = (index) => (dispatch) => {
  dispatch({
    type: PROFILE_SWITCH_TAB,
    payload: index
  });
};

// User update filter for specific tab
export const changeFilter = (tab, filterType, value) => (dispatch) => {
  dispatch({
    type: PROFILE_UPDATE_FILTER,
    payload: {
      tab,
      type: filterType,
      value
    }
  });
};

/**
 * Handle user profile on refresh
 * NOTE: This is TODO for milestone 2
 * Refresh for profile tab
 * @params tab: one of ['goals', 'posts', 'needs']
 */
export const handleTabRefresh = (tab) => (dispatch, getState) => {
  const { token, userId } = getState().user;
  const { filter, limit } = _.get(getState().profile, tab);

  dispatch({
    type: PROFILE_REFRESH_TAB,
    payload: {
      type: tab
    }
  });

  const onSuccess = (data) => {
    dispatch({
      type: PROFILE_REFRESH_TAB_DONE,
      payload: {
        type: tab,
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  };

  const onError = (err) => {
    dispatch({
      type: PROFILE_REFRESH_TAB_FAIL,
      payload: {
        type: tab
      }
    });
    console.log(`${DEBUG_KEY}: refresh tab: ${tab} failed with err: `, err);
  };

  loadOneTab(tab, 0, limit, { ...profileFilterAdapter(filter), userId },
    token, onSuccess, onError);
};

/**
 * Load more for profile tab
 * @params tab: one of ['goals', 'posts', 'needs']
 */
export const handleProfileTabOnLoadMore = (tab) => (dispatch, getState) => {
  const { token, userId } = getState().user;
  const { filter, skip, limit, hasNextPage } = _.get(getState().profile, tab);

  if (!hasNextPage && hasNextPage !== undefined) {
    return;
  }

  const onSuccess = (data) => {
    dispatch({
      type: PROFILE_FETCH_TAB_DONE,
      payload: {
        type: tab,
        data,
        skip: skip + data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  };

  const onError = (err) => {
    dispatch({
      type: PROFILE_FETCH_TAB_FAIL,
      payload: {
        type: tab
      }
    });
    console.log(`${DEBUG_KEY}: tab: ${tab} on load more fail with err: `, err);
  };

  loadOneTab(tab, skip, limit, { ...profileFilterAdapter(filter), userId },
    token, onSuccess, onError);
};

/**
 * Original field for orderBy should be ['ascending', 'descending'],
 * server accpeted types are ['asc', 'desc']
 */
const profileFilterAdapter = (filter) => {
  const newFilter = _.cloneDeep(filter);
  // const sortOrder = _.clone(newFilter.orderBy);
  const sortOrder = PROFILE_GOAL_FILTER_CONST.orderBy[filter.orderBy];
  // const categories = filter.catergory;
  // console.log('categories are: ', categories);
  if (newFilter.categories === 'All') {
    delete newFilter.categories;
  }
  delete newFilter.orderBy;
  // delete newFilter.catergory;
  delete newFilter.completedOnly;
  return {
    ...newFilter,
    sortOrder,
    // categories
  };
};

/**
 * Basic API to load one tab based on params
 * @param tab:
 * @param skip:
 * @param limit:
 * @param filter:
 * @param token:
 * @param callback:
 */
const loadOneTab = (tab, skip, limit, filter, token, onSuccess, onError) => {
  // Todo: base route depends on tab selection
  const BASE_ROUTE = 'secure/goal';
  API
    .get(
      `${BASE_ROUTE}/user?${queryBuilder(skip, limit, filter)}`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY}: res for fetching for tab: ${tab}, is: `, res);
      if (res && res.data) {
        // TODO: change this
        return onSuccess([]);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

/**
 * Delete a goal in profile tab
 */
export const deleteGoal = (goalId) => (dispatch, getState) =>
  deleteItem(
    {
      param: { goalId },
      route: `secure/goal?goalId=${goalId}`
    },
    dispatch,
    getState,
    // onSuccess
    () => {
      dispatch({
        type: PROFILE_GOAL_DELETE_SUCCESS,
        payload: goalId
      });
    },
    // onError
    ({ message }) => {
      Alert.alert(
        'Deleting goal failed',
        `${message}`,
        [
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  );
/**
 * Delete a post in profile tab
 */

export const deletePost = (postId) => (dispatch, getState) =>
  deleteItem(
    {
      param: { postId },
      route: `secure/feed/post?postId=${postId}`
    },
    dispatch,
    getState,
    () => {
      dispatch({
        type: PROFILE_POST_DELETE_SUCCESS,
        payload: postId
      });
    },
    ({ message }) => {
      Alert.alert(
        'Deleting post failed',
        `${message}`,
        [
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  );


const deleteItem = (item, dispatch, getState, onSuccess, onError) => {
  const { token } = getState().user;
  API
    .delete(item.route, { ...item.param }, token)
    .then((res) => {
      if (res.isSuccess) {
        return onSuccess();
      }
      console.warn('Delete item fail in profile err with res: ', res);
      return onError({ message: res.message });
    })
    .catch((err) => {
      console.warn('Delete item fail in profile with exception: ', err);
      return onError({ message: err });
    });
};
