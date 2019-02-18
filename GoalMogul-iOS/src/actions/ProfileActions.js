import { Actions } from 'react-native-router-flux';
import React from 'react';
import { Image, Alert } from 'react-native';
import _ from 'lodash';

import ImageUtils from '../Utils/ImageUtils';
import { updateAccount, updateProfile, updatePassword } from '../Utils/ProfileUtils';
import { api as API } from '../redux/middleware/api';
import { queryBuilder, constructPageId } from '../redux/middleware/utils';

import BronzeBanner from '../asset/banner/bronze.png';
import GreenBanner from '../asset/banner/green.png';
import PurpleBanner from '../asset/banner/purple.png';
import SilverBanner from '../asset/banner/silver.png';
import IronBanner from '../asset/banner/iron.png';
import GoldBanner from '../asset/banner/gold.png';

import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_FAIL,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_IMAGE_UPLOAD_SUCCESS,
  PROFILE_SWITCH_TAB,
  PROFILE_CLOSE_PROFILE,
  PROFILE_OPEN_PROFILE_DETAIL,
  PROFILE_CLOSE_PROFILE_DETAIL
} from './types';

import {
  PROFILE_FETCH_FRIEND_COUNT_DONE,
  PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE,
  PROFILE_FETCH_FRIENDSHIP_DONE,
  PROFILE_FETCH_MUTUAL_FRIEND,
  PROFILE_FETCH_MUTUAL_FRIEND_DONE,
  // Profile load tabs constants
  PROFILE_FETCH_TAB,
  PROFILE_FETCH_TAB_DONE,
  PROFILE_REFRESH_TAB_DONE,
  PROFILE_FETCH_TAB_FAIL,
  PROFILE_REFRESH_TAB_FAIL,
  PROFILE_REFRESH_TAB,
  PROFILE_UPDATE_FILTER,
  PROFILE_RESET_FILTER,
  PROFILE_GOAL_FILTER_CONST,

  PROFILE_GOAL_DELETE_SUCCESS,
  PROFILE_POST_DELETE_SUCCESS,
  // Profile Create overlay
  PROFILE_OPEN_CREATE_OVERLAY,
  PROFILE_CLOSE_CREATE_OVERLAY
} from '../reducers/Profile';

const DEBUG_KEY = '[ Action Profile ]';

const prefetchImage = (imageUrl) => {
  if (imageUrl) {
    const fullImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
    Image.prefetch(fullImageUrl);
  }
};

const fetchFriendshipSucceed = (userId, res, dispatch) => {
  console.log(`${DEBUG_KEY} fetchFriendshipSucceed with res: `, res);
  dispatch({
    type: PROFILE_FETCH_FRIENDSHIP_DONE,
    payload: {
      data: res.data,
      userId
    }
  });
};

const fetchFriendsCountSucceed = (userId, res, self, dispatch) => {
  console.log(`${DEBUG_KEY} fetchMutualFriendSucceed with res: `, res);
  const type = self ? PROFILE_FETCH_FRIEND_COUNT_DONE : PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE;
  dispatch({
    type,
    payload: {
      data: self ? res.count : res.data,
      userId
    }
  });
};

const fetchProfileSucceed = (pageId, res, dispatch) => {
  console.log(`${DEBUG_KEY} fetch profile succeed with res: `, res);
  dispatch({
    type: PROFILE_FETCHING_SUCCESS,
    payload: {
      user: res.data,
      pageId
    }
  });
};

const fetchProfileFail = (pageId, userId, res, dispatch) => {
  console.log(`${DEBUG_KEY} fetch profile failed with res: `, res);
  dispatch({
    type: PROFILE_FETCHING_FAIL,
    payload: {
      res,
      pageId
    }
  });
};

/**
 * This method only fetches user profile. It is primarily used after user updates
 * the profile. Need to update the profile page
 */
export const fetchUserProfile = (userId, pageId) => (dispatch, getState) => {
  const { token } = getState().user;
  API
    .get(`secure/user/profile?userId=${userId}`, token)
    .then((res) => {
      if (res.status === 200) {
        fetchProfileSucceed(pageId, res, dispatch);
        // Prefetch profile image
        prefetchImage(res.data.profile.image);
        return;
      }
      fetchProfileFail(pageId, userId, res, dispatch);
    })
    .catch((err) => {
      fetchProfileFail(pageId, userId, err, dispatch);
    });
};

export const closeProfile = (userId, pageId) => (dispatch, getState) => {
  Actions.pop();
  dispatch({
    type: PROFILE_CLOSE_PROFILE,
    payload: {
      userId,
      pageId
    }
  });
};

export const openProfile = (userId, tab) => (dispatch, getState) => {
  const pageId = constructPageId('user');
  dispatch({
    type: PROFILE_OPEN_PROFILE,
    payload: {
      userId,
      pageId
    }
  });

  // Refresh goals on open
  if (tab) {
    selectProfileTabByName(`${tab}`)(dispatch, getState);
    resetFilterType(`${tab}`, userId, pageId)(dispatch, getState);
  }

  // console.log(`${DEBUG_KEY}: pre for request`);
  const mainNavigationTab = getState().navigation.tab;
  let componentKeyToOpen = 'profile';
  if (mainNavigationTab !== 'homeTab') {
    componentKeyToOpen = `${mainNavigationTab}_profile`;
  }
  console.log(`${DEBUG_KEY}: componentKeyToOpen is: ${componentKeyToOpen}`);
  Actions.push(`${componentKeyToOpen}`, { pageId, userId });
  // Actions[`${componentKeyToOpen}`].call({ pageId, userId });

  const { token } = getState().user;
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
        return fetchProfileFail(pageId, userId, profileRes, dispatch);
      }
      fetchProfileSucceed(pageId, profileRes, dispatch);
      handleCurrentTabRefresh({ userId, pageId })(dispatch, getState);
      // Prefetch profile image
      prefetchImage(profileRes.data.profile.image);

      if (friendsCountRes.message) {
        /* TODO: error handling for failing to fetch friends */
        console.log(`${DEBUG_KEY} fetch friends count fails: `, friendsCountRes.message);
      } else {
        fetchFriendsCountSucceed(userId, friendsCountRes, self, dispatch);
      }


      if (friendshipRes.message) {
        /* TODO: error handling for failing to fetch friends */
        console.log(`${DEBUG_KEY} fetch friendship fails: `, friendshipRes);
      } else {
        fetchFriendshipSucceed(userId, friendshipRes, dispatch);
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
  const { token } = getState().user;
  const { skip, limit, hasNextPage, loading } = getState().profile.mutualFriends;
  const newSkip = refresh ? 0 : skip;
  if ((hasNextPage === undefined || hasNextPage) && !loading) {
    dispatch({
      type: PROFILE_FETCH_MUTUAL_FRIEND,
      payload: {
        userId
      }
    });

    API
      .get(
        `secure/user/friendship/mutual-friends?userId=${userId}&skip=${skip}&limit=${limit}`,
        token
      )
      .then((res) => {
        console.log(`${DEBUG_KEY} fetch mutual friends with res: `, res);
        if (res.status === 200 || res.data) {
          const data = res.data;
          dispatch({
            type: PROFILE_FETCH_MUTUAL_FRIEND_DONE,
            payload: {
              skip: newSkip + res.data.length,
              hasNextPage: !(data === undefined || data.length === 0 || data.length < skip),
              data: data === null || data === undefined ? [] : data,
              refresh,
              userId
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
            refresh: false,
            userId
          }
        });
      });
  }
};

export const openProfileDetail = (userId, pageId) => (dispatch, getState) => {
  // pageId here should be created when a profile component is opened.
  // We append the detail to the end of pageId to create a new one
  const newPageId = `${pageId}_DETAIL`;
  dispatch({
    type: PROFILE_OPEN_PROFILE_DETAIL,
    payload: {
      userId,
      pageId: newPageId
    }
  });
  // Whether a new pageId or reuse the one that is generated when user opens the 
  // Profile component doesn't seem to be much of a difference. 
  // Go with appending to create a new pageId first
  const { tab } = getState().navigation;
  const componentKeyToOpen = `${tab}_profileDetail`;
  Actions.push(`${componentKeyToOpen}`, { userId, pageId: newPageId });
};

export const closeProfileDetail = (userId, pageId) => (dispatch) => {
  // Pop the profile detail page
  Actions.pop();

  // Clear related component reference
  dispatch({
    type: PROFILE_CLOSE_PROFILE_DETAIL,
    payload: {
      userId,
      pageId
    }
  });
};

export const openProfileDetailEditForm = () => {
  return (dispatch) => {
    dispatch({
      type: ''
    });
    Actions.profileDetailEditForm();
  };
};

// TODO: profile reducer redesign to change here. The method signature. Search for usage
export const submitUpdatingProfile = ({ values, hasImageModified }, pageId) => {
  return (dispatch, getState) => {
    const { headline, name, oldPassword, newPassword } = values;
    const { about, occupation, elevatorPitch } = values.profile;
    const imageUri = values.profile.image;

    const { token, userId } = getState().user;

    // Start updaing process
    dispatch({
      type: PROFILE_SUBMIT_UPDATE,
      payload: {
        userId,
        pageId
      }
    });

    const updateAccountPromise = updateAccount({ name, headline, token });
    const updateProfilePromise = ImageUtils
      .upload(hasImageModified, imageUri, token, PROFILE_IMAGE_UPLOAD_SUCCESS, dispatch, userId)
      .then(() => {
        // TODO: profile reducer redesign to change here
        const image = getState().profile.user.profile.tmpImage;
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
          payload: {
            user,
            userId,
            pageId
          }
        });
        Actions.pop();
        fetchUserProfile(userId, pageId)(dispatch, getState);
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

/**
 * select a tab by tab name
 */
// TODO: profile reducer redesign to change here
export const selectProfileTabByName = (tab, userId, pageId) => (dispatch, getState) => {
  // TODO: profile reducer redesign to change here
  const routes = getState().profile.navigationState.routes;
  let index = 0;
  routes.forEach((route, i) => {
    if (route.key === tab) {
      index = i;
    }
  });
  selectProfileTab(index, userId, pageId)(dispatch, getState);
};

/**
 * Select a tab by index
 */
// TODO: profile reducer redesign to change here
export const selectProfileTab = (index, userId, pageId) => (dispatch, getState) => {
  dispatch({
    type: PROFILE_SWITCH_TAB,
    payload: {
      index,
      userId,
      pageId
    }
  });

  const tab = getState().profile.navigationState.routes[index].key;
  const { data } = _.get(getState().profile, tab);

  // Only attempt to load if there is no data
  if (!data || data.length === 0) {
    handleTabRefresh(tab, userId, pageId)(dispatch, getState);
  }
};

// Reset filter state for a tab to have All for categories
export const resetFilterType = (tab, userId, pageId) => (dispatch, getState) => {
  dispatch({
    type: PROFILE_RESET_FILTER,
    payload: {
      tab,
      userId,
      pageId
    }
  });
};

// User update filter for specific tab
export const changeFilter = (tab, filterType, value, { userId, pageId }) => 
(dispatch, getState) => {
  dispatch({
    type: PROFILE_UPDATE_FILTER,
    payload: {
      tab,
      type: filterType,
      value,
      pageId,
      userId
    }
  });
  handleTabRefresh(tab, userId, pageId)(dispatch, getState);
};

export const handleCurrentTabRefresh = ({ userId, pageId }) => (dispatch, getState) => {
  const { navigationState } = getState().profile;
  const { routes, index } = navigationState;
  handleTabRefresh(routes[index].key, userId, pageId)(dispatch, getState);
};

/**
 * Handle user profile on refresh
 * NOTE: This is TODO for milestone 2
 * Refresh for profile tab
 * @params tab: one of ['goals', 'posts', 'needs']
 */
// TODO: profile reducer redesign to change here
export const handleTabRefresh = (tab, userId, pageId) => (dispatch, getState) => {
  const { token } = getState().user;
  const profile = getState().profile; // TODO: profile reducer redesign to change here
  const { user } = profile; // TODO: profile reducer redesign to change here
  const { filter, limit, refreshing } = _.get(profile, tab);
  console.log(`${DEBUG_KEY}: refresh tab for user: `, user);

  if (!user || !user._id || refreshing) return;
  const userIdToUser = user._id; // TODO: profile reducer redesign to change here. Replace with userId 

  dispatch({
    type: PROFILE_REFRESH_TAB,
    payload: {
      type: tab,
      pageId,
      userId
    }
  });

  const onSuccess = (data) => {
    console.log(`${DEBUG_KEY}: ${tab} refresh succeed with data length: `, data.length);
    dispatch({
      type: PROFILE_REFRESH_TAB_DONE,
      payload: {
        type: tab,
        data,
        skip: data.length,
        limit,
        userId: userIdToUser,
        hasNextPage: !(data === undefined || data.length === 0),
        pageId
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: ${tab} refresh failed with err: `, err);
    dispatch({
      type: PROFILE_REFRESH_TAB_FAIL,
      payload: {
        type: tab
      }
    });
    console.log(`${DEBUG_KEY}: refresh tab: ${tab} failed with err: `, err);
  };

  loadOneTab(tab, 0, limit, { ...profileFilterAdapter(filter), userId: userIdToUser },
    token, onSuccess, onError);
};

/**
 * Load more for profile tab
 * @params tab: one of ['goals', 'posts', 'needs']
 */
// TODO: profile reducer redesign to change here
export const handleProfileTabOnLoadMore = (tab, userId, pageId) => (dispatch, getState) => {
  const { token } = getState().user;
  const { user } = getState().profile;
  if (!user || _.isEmpty(user)) return;
  const { _id } = user;

  const { 
    filter, 
    skip, 
    limit, 
    hasNextPage, 
    refreshing, 
    loading 
  } = _.get(getState().profile, tab);

  if (hasNextPage === false || refreshing || loading) {
    return;
  }

  dispatch({
    type: PROFILE_FETCH_TAB,
    payload: {
      type: tab,
      userId,
      pageId
    }
  });

  const onSuccess = (data) => {
    console.log(`${DEBUG_KEY}: ${tab} load more succeed with data length: `, data.length);
    dispatch({
      type: PROFILE_FETCH_TAB_DONE,
      payload: {
        type: tab,
        data,
        skip: skip + data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0),
        pageId,
        userId
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: ${tab} load more failed with err: `, err);
    dispatch({
      type: PROFILE_FETCH_TAB_FAIL,
      payload: {
        type: tab,
        pageId,
        userId
      }
    });
    console.log(`${DEBUG_KEY}: tab: ${tab} on load more fail with err: `, err);
  };

  loadOneTab(tab, skip, limit, { ...profileFilterAdapter(filter), userId: _id }, // TODO: profile reducer redesign to change here _id ==> userId
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
  const route = tab === 'posts'
    ? `secure/feed/post/user?${queryBuilder(skip, limit, { userId: filter.userId })}`
    : `secure/goal/user?${queryBuilder(skip, limit, filter)}`;
  API
    .get(route, token)
    .then((res) => {
      // console.log(`${DEBUG_KEY}: res for fetching for tab: ${tab}, is: `, res);
      if (res.status === 200 || (res && res.data)) {
        // TODO: change this
        return onSuccess(res.data);
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
// TODO: profile reducer redesign to change here
export const deleteGoal = (goalId) => (dispatch, getState) => {
  const { userId } = getState().user;
  deleteItem(
    {
      param: { goalId },
      route: `secure/goal?goalId=${goalId}`
    },
    dispatch,
    getState,
    // onSuccess
    () => {
      console.log(`${DEBUG_KEY}: delete goal succeed.`);
      dispatch({
        type: PROFILE_GOAL_DELETE_SUCCESS,
        payload: {
          goalId,
          userId
        }
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
};

/**
 * Delete a post in profile tab
 */

export const deletePost = (postId) => (dispatch, getState) => {
  const { userId } = getState().user;
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
        payload: {
          postId,
          userId
        }
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
};

// By pass in user object, return corresponding banner
export const UserBanner = (props) => {
  const { user, iconStyle } = props;

  if (!user || !user.profile || user.profile.pointsEarned === undefined) return '';
  const { profile } = user;
  const { pointsEarned } = profile;
  const source = switchCaseBannerSource(pointsEarned);

  const defaultIconStyle = {
    alignSelf: 'center',
    marginLeft: 4,
    marginRight: 4,
    height: 14,
    width: 10
  };
  return (
    <Image source={source} style={{ ...defaultIconStyle, ...iconStyle }} />
  );
};

export const openCreateOverlay = (userId, pageId) => (dispatch) => {
  dispatch({
    type: PROFILE_OPEN_CREATE_OVERLAY,
    payload: {
      userId, pageId
    }
  });
};


export const closeCreateOverlay = (userId, pageId) => (dispatch) => {
  dispatch({
    type: PROFILE_CLOSE_CREATE_OVERLAY,
    payload: {
      userId, pageId
    }
  });
};

const switchCaseBannerSource = (points) => {
  let source;
  if (!points || points < 49) {
    source = GreenBanner;
  } else if (points < 249) {
    source = BronzeBanner;
  } else if (points < 499) {
    source = IronBanner;
  } else if (points < 2499) {
    source = SilverBanner;
  } else if (points < 4999) {
    source = GoldBanner;
  } else if (points < 9999) {
    source = PurpleBanner;
  }

  return source;
};


const deleteItem = (item, dispatch, getState, onSuccess, onError) => {
  const { token } = getState().user;
  API
    .delete(item.route, { ...item.param }, token)
    .then((res) => {
      if (res.status === 200 || res.isSuccess) {
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
