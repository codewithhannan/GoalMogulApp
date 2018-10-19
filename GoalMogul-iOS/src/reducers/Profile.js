import _ from 'lodash';

import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_IMAGE_UPLOAD_SUCCESS,
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  SETTING_EMAIL_UPDATE_SUCCESS,
  PROFILE_SWITCH_TAB,
  MEET_UPDATE_FRIENDSHIP_DONE,
  PROFILE_FETCHING_FAIL
} from '../actions/types';

import {
  GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
  GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
  GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
  GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS
} from './GoalDetailReducers';

import {
  USER_LOG_OUT
} from './User';

// Profile action constants
export const PROFILE_FETCH_MUTUAL_FRIEND = 'profile_fetch_mutual_friend';
export const PROFILE_FETCH_MUTUAL_FRIEND_DONE = 'profile_fetch_mutual_friend_done';
export const PROFILE_FETCH_FRIENDSHIP_DONE = 'profile_fetch_friendship_done';
export const PROFILE_FETCH_FRIEND_DONE = 'profile_fetch_friend_done';
export const PROFILE_FETCH_FRIEND_COUNT_DONE = 'profile_fetch_friend_count_done';
// Constants for profile fetching goals and posts
export const PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE = 'profile_fetch_mutual_friend_count_done';
export const PROFILE_FETCH_TAB_DONE = 'profile_fetch_tab_done';
export const PROFILE_FETCH_TAB_FAIL = 'profile_fetch_tab_fail';
export const PROFILE_REFRESH_TAB_FAIL = 'profile_refresh_tab_fail';
export const PROFILE_REFRESH_TAB_DONE = 'profile_refresh_tab_done';
export const PROFILE_REFRESH_TAB = 'profile_refresh_tab';
// Constants for updating filter bar
export const PROFILE_UPDATE_FILTER = 'profile_update_filter';

// Constants related to goals, posts and needs in user page
export const PROFILE_GOAL_DELETE_SUCCESS = 'profile_goal_delete_success';
export const PROFILE_POST_DELETE_SUCCESS = 'profile_post_delete_success';

export const PROFILE_GOAL_FILTER_CONST = {
  sortBy: ['created', 'updated', 'shared', 'priority'],
  orderBy: {
    ascending: 'asc',
    descending: 'desc'
  },
  caterogy: [
    'General',
    'Physical',
    'Learning/Education',
    'Career/Business',
    'Financial',
    'Spiritual',
    'Family/Personal',
    'Charity/Philanthropy',
    'Travel',
    'Things'
  ]
};

const INITIAL_STATE = {
  userId: '',
  // User model for profile
  user: {
    profile: {
      image: undefined
    },
    email: {

    }
  },
  // Me Page mutual friends count
  mutualFriends: {
    loading: false,
    count: 0,
    data: [],
    skip: 0,
    limit: 20,
    hasNextPage: undefined
  },
  // Overall loading status
  loading: false,
/**
  * Friendship between current user and current profile fetched
  * Ignore if it's self
  */
  friendship: {
    _id: undefined,
    initiator_id: undefined,
    status: undefined // one of [undefined, 'Invited', 'Accepted']
  },

  uploading: false,
  // navigation state
  selectedTab: 'suggested',
  navigationState: {
    index: 0,
    routes: [
      { key: 'goals', title: 'Goals' },
      { key: 'posts', title: 'Posts' },
      { key: 'needs', title: 'Needs' }
    ]
  },
  // Individual tab state
  goals: {
    filter: {
      sortBy: 'created',
      orderBy: 'ascending',
      categories: 'General',
      completedOnly: 'false',
      priorities: ''
    },
    limit: 20,
    skip: 0,
    hasNextPage: undefined,
    data: [],
    loading: false
  },
  needs: {
    filter: {
      sortBy: 'created',
      orderBy: 'ascending',
      categories: 'General',
      completedOnly: 'false',
      priorities: ''
    },
    limit: 20,
    skip: 0,
    hasNextPage: undefined,
    data: [],
    loading: false
  },
  posts: {
    filter: {
      sortBy: 'created',
      orderBy: 'ascending',
      categories: 'General',
      completedOnly: 'false',
      priorities: ''
    },
    limit: 20,
    skip: 0,
    hasNextPage: undefined,
    data: [],
    loading: false
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_OPEN_PROFILE:
      return { ...state, userId: action.payload, loading: true };

    case PROFILE_FETCHING_FAIL:
      return { ...state, loading: false };

    case PROFILE_FETCHING_SUCCESS:
      return { ...state, user: action.payload, loading: false };

    case PROFILE_IMAGE_UPLOAD_SUCCESS: {
      let user = _.cloneDeep(state.user);
      user.profile.image = action.payload;
      return { ...state, user };
    }

    case PROFILE_SUBMIT_UPDATE:
      return { ...state, uploading: true };

    case PROFILE_UPDATE_SUCCESS: {
      return { ...state, user: action.payload, uploading: false };
    }

    // Update navigation state when new tab is selected
    case PROFILE_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    case PROFILE_FETCH_MUTUAL_FRIEND: {
      let newState = _.cloneDeep(state);
      newState.mutualFriends.loading = true;
      return { ...newState };
    }

    // profile fetch mutual friend request done
    case PROFILE_FETCH_MUTUAL_FRIEND_DONE: {
      const { skip, hasNextPage, data, refresh } = action.payload;
      let newMutualFriends = _.cloneDeep(state.mutualFriends);
      if (refresh) {
        newMutualFriends.data = data;
      } else {
        newMutualFriends.data = newMutualFriends.data.concat(data);
      }
      newMutualFriends.hasNextPage = hasNextPage;
      newMutualFriends.skip = skip;
      return { ...state, mutualFriends: newMutualFriends };
    }

    case PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE: {
      let newMutualFriends = _.cloneDeep(state.mutualFriends);
      newMutualFriends.count = action.payload;
      return { ...state, mutualFriends: newMutualFriends };
    }

    // profile fetch friendship request done
    case PROFILE_FETCH_FRIENDSHIP_DONE: {
      let newFriendship = _.cloneDeep(state.friendship);
      if (action.payload !== undefined && action.payload !== null) {
        newFriendship = action.payload;
      }
      return { ...state, friendship: newFriendship };
    }

    /**
    payload: {
      type: ['acceptFriend', 'deleteFriend', 'requestFriend']
      tab: ['requests.outgoing', 'requests.incoming', 'friends', 'suggested']
      data: if 'deleteFriend' or 'acceptFriend', then friendshipId. Otherwise, userId
    }
    */
    case MEET_UPDATE_FRIENDSHIP_DONE: {
      // If updating current profile's friendship, then update the status
      const { type, data, message } = action.payload;
      const { userId, friendshipId } = data;
      const resData = data.data;
      let newFriendship = _.cloneDeep(state.friendship);
      if (!message) {
        // If no message, upate succeed
        if (type === 'requestFriend' && userId === state.userId) {
          if (resData) {
            newFriendship = _.cloneDeep(resData);
          } else {
            newFriendship.status = 'Invited';
          }
        } else if (type === 'deleteFriend' && friendshipId === state.friendship._id) {
          newFriendship.status = undefined;
        } else if (type === 'acceptFriend' && friendshipId === state.friendship._id) {
          newFriendship.status = 'Accepted';
        }
      }

      return { ...state, friendship: newFriendship };
    }

    /**
     * Cases when loading/refreshing profile tabs
     * TODO: refactor the following three cases to abstract logic
     * Right now,
     * 1. MeetReducers
     * 2. Profile
     * 3. Home tabs
     * Share the same patterns
     */
    case PROFILE_FETCH_TAB_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      const oldData = _.get(newState, `${type}.data`);
      return _.set(newState, `${type}.data`, arrayUnique(oldData.concat(data)));
    }

    case PROFILE_FETCH_TAB_FAIL: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, false);
    }

    case PROFILE_REFRESH_TAB_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      return _.set(newState, `${type}.data`, data);
    }

    case PROFILE_REFRESH_TAB: {
      const { type } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, true);
    }

    case PROFILE_REFRESH_TAB_FAIL: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, false);
    }

    // Update one of filter within tab
    case PROFILE_UPDATE_FILTER: {
      const { tab, type, value } = action.payload;
      const newState = _.cloneDeep(state);
      if (type === 'priorities') {
        const oldPriorities = _.get(newState, `${tab}.filter.priorities`);
        const newPriorities = updatePriorities(oldPriorities, value);
        return _.set(newState, `${tab}.filter.priorities`, newPriorities);
      }
      return _.set(newState, `${tab}.filter.${type}`, value);
    }

    // Clean up actions
    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    // Find and update the goal that current user marks as complete
    case GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS: {
      const { goalId } = action.payload;
      const newState = _.cloneDeep(state);
      const oldGoals = newState.goals.data;
      return _.set(
        newState,
        'goals.data',
        findAndUpdate(goalId, oldGoals, { isCompleted: true })
      );
    }

    // Find and upate the goal that current user shared to mastermind
    case GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS: {
      const { goalId } = action.payload;
      const newState = _.cloneDeep(state);
      const oldGoals = newState.goals.data;
      return _.set(
        newState,
        'goals.data',
        findAndUpdate(goalId, oldGoals, { shareToGoalFeed: true })
      );
    }

    // When a goal or a post is deleted by user
    case PROFILE_GOAL_DELETE_SUCCESS: {
      const newState = _.cloneDeep(state);
      const oldData = newState.goals.data;
      return _.set(newState, 'goals.data', removeItem(action.payload, oldData));
    }

    case PROFILE_POST_DELETE_SUCCESS: {
      const newState = _.cloneDeep(state);
      const oldData = newState.posts.data;
      return _.set(newState, 'posts.data', removeItem(action.payload, oldData));
    }

    // Update the status of a step within a goal
    case GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS: {
      const { goalId, id, isCompleted } = action.payload;
      const newState = _.cloneDeep(state);
      const oldDate = newState.goals.data;
      return _.set(
        newState,
        'goals.data',
        updateNeedsOrSteps(
          goalId,
          id,
          { isCompleted },
          oldDate,
          'steps'
        )
      );
    }

    // Update the status of a need within a goal
    case GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS: {
      const { goalId, id, isCompleted } = action.payload;
      const newState = _.cloneDeep(state);
      const oldDate = newState.goals.data;
      return _.set(
        newState,
        'goals.data',
        updateNeedsOrSteps(
          goalId,
          id,
          { isCompleted },
          oldDate,
          'needs'
        )
      );
    }

    default:
      return { ...state };
  }
};

function removeItem(id, data) {
  return data.filter((item) => item._id !== id);
}

// Find the object with id and update the object with the newValsMap
function findAndUpdate(id, data, newValsMap) {
  return data.map((item) => {
    let newItem = _.cloneDeep(item);
    if (item._id === id) {
      Object.keys(newValsMap).forEach(key => {
        if (newValsMap[key] !== null) {
          newItem = _.set(newItem, `${key}`, newValsMap[key]);
        }
      });
    }
    return newItem;
  });
}

// Find the corresponding goal to update needs and steps
function updateNeedsOrSteps(goalId, id, fields, data, type) {
  return data.map((item) => {
    let newItem = _.cloneDeep(item);
    if (item._id === goalId) {
      const oldList = _.get(newItem, `${type}`);
      newItem = _.set(newItem, `${type}`, findAndUpdate(id, oldList, { ...fields }));
    }
    return newItem;
  });
}

function arrayUnique(array) {
  let a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i]._id === a[j]._id) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
}

function updatePriorities(priorities, newPriority) {
  let newPriorities = [];
  const oldPriorities = priorities === '' ? [] : priorities.split(',').sort();

  if (newPriority === 'All') {
    if (oldPriorities.join() === '1,2,3,4,5,6,7,8,9') {
      return '';
    }
    return '1,2,3,4,5,6,7,8,9';
  }

  if (oldPriorities.indexOf(`${newPriority}`) < 0) {
    // Add the new priority to the string
    newPriorities = [...oldPriorities, newPriority];
  } else {
    // Remove the new priority from the string
    newPriorities = oldPriorities.filter((p) => p !== newPriority);
  }

  return newPriorities.join();
}
