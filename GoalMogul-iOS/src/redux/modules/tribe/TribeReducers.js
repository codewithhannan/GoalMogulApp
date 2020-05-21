import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

import {
  LIKE_POST,
  UNLIKE_POST,
} from '../like/LikeReducers';

const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'about', title: 'About' },
      { key: 'posts', title: 'Posts' },
      { key: 'members', title: 'Participants' }
    ],
  },
  defaultRoutes: [
    { key: 'about', title: 'About' },
    { key: 'members', title: 'Participants' }
  ],
  selectedTab: 'about',
  item: undefined,
  feed: [],
  feedLoading: false,
  hasNextPage: undefined,
  skip: 0,
  limit: 10,
  hasRequested: undefined,
  updating: false, // boolean indicator for joining / leaving tribe
  // ['Admin', 'Member', 'JoinRequester', 'Invitee']
  membersFilter: 'Admin',
  memberNavigationState: {
    index: 0,
    routes: [
      { key: 'Admin', title: 'Admin' },
      { key: 'Member', title: 'Member' },
      { key: 'JoinRequester', title: 'Requested' },
      { key: 'Invitee', title: 'Invited' }
    ]
  },
  memberDefaultRoutes: [
    { key: 'Admin', title: 'Admin' },
    { key: 'Member', title: 'Member' }
  ],
  memberCanInviteRoutes: [
    { key: 'Admin', title: 'Admin' },
    { key: 'Member', title: 'Member' },
    { key: 'Invitee', title: 'Invited' }
  ]
};

export const TRIBE_DELETE_SUCCESS = 'tribe_delete_success';
export const TRIBE_SWITCH_TAB = 'tribe_switch_tab';
export const TRIBE_DETAIL_OPEN = 'tribe_detail_open';
export const TRIBE_DETAIL_CLOSE = 'tribe_detail_close';
export const TRIBE_FEED_FETCH = 'tribe_feed_fetch';
export const TRIBE_FEED_FETCH_DONE = 'tribe_feed_fetch_done';
export const TRIBE_FEED_REFRESH_DONE = 'tribe_feed_refresh_done';
export const TRIBE_REQUEST_JOIN = 'tribe_request_join';
export const TRIBE_REQUEST_JOIN_SUCCESS = 'tribe_request_join_success';
export const TRIBE_REQUEST_JOIN_ERROR = 'tribe_request_join_error';
export const TRIBE_REQUEST_CANCEL_JOIN_SUCCESS = 'tribe_request_cancel_join_success';
export const TRIBE_REQUEST_CANCEL_JOIN_ERROR = 'tribe_request_cancel_join_error';
export const TRIBE_REQUEST_CANCEL_JOIN = 'tribe_request_cancel_join';
export const TRIBE_MEMBER_SELECT_FILTER = 'tribe_member_select_filter';
export const TRIBE_MEMBER_INVITE_SUCCESS = 'tribe_member_invite_success';
export const TRIBE_MEMBER_INVITE_FAIL = 'tribe_member_invite_fail';
export const TRIBE_MEMBER_REMOVE_SUCCESS = 'tribe_member_remove_success';
export const TRIBE_MEMBER_ACCEPT_SUCCESS = 'tribe_member_accept_succes';
export const TRIBE_DETAIL_LOAD_SUCCESS = 'tribe_detail_load_success';
export const TRIBE_DETAIL_LOAD_FAIL = 'tribe_detail_load_fail';

export const TRIBE_RESET = 'tribe_reset';


// If a tribe is edited successfully and its _id is the same as the item._id
// Replace the event with information updated. TribeTab, MyTribeTab should also listen to the change
export const TRIBE_EDIT_SUCCESS = 'tribe_edit_success';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRIBE_RESET: {
      return { ...INITIAL_STATE };
    }
    
    case TRIBE_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    // Fetching feed for a tribe
    case TRIBE_FEED_FETCH: {
      let newState = _.cloneDeep(state);
      return _.set(newState, "feedLoading", true);
    }

    // Fetching feed done for a tribe
    case TRIBE_FEED_FETCH_DONE: {
      const { skip, data, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'feedLoading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      const oldData = _.get(newState, 'feed');
      return _.set(newState, 'feed', arrayUnique(oldData.concat(data)));
    }

    // Tribe refresh feed done
    case TRIBE_FEED_REFRESH_DONE: {
      const { skip, data, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'feedLoading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      return _.set(newState, 'feed', data);
    }

    case TRIBE_DETAIL_LOAD_SUCCESS:
    case TRIBE_DETAIL_OPEN: {
      const { tribe } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, 'item', { ...tribe });
    }

    case TRIBE_DELETE_SUCCESS:
    case TRIBE_DETAIL_CLOSE: {
      return {
        ...INITIAL_STATE
      };
    }

    case TRIBE_REQUEST_CANCEL_JOIN_ERROR:
    case TRIBE_REQUEST_JOIN_ERROR: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'updating', false);
    }

    case TRIBE_REQUEST_CANCEL_JOIN:
    case TRIBE_REQUEST_JOIN: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'updating', true);
    }

    case TRIBE_REQUEST_JOIN_SUCCESS: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'updating', false);
      return _.set(newState, 'hasRequested', true);
    }

    case TRIBE_REQUEST_CANCEL_JOIN_SUCCESS: {
      let newState = _.cloneDeep(state);
      const { userId, tribeId } = action.payload;

      // Only updating the corresponding item
      if (!newState.item || newState.item._id !== tribeId) return newState;
      const oldMembers = _.get(newState, 'item.members');
      const newMembers = oldMembers.filter((member) => member.memberRef._id !== userId);

      newState = _.set(newState, 'hasRequested', false);
      newState = _.set(newState, 'updating', false);
      newState = _.set(newState, 'item.members', newMembers);

      return newState;
    }

    case TRIBE_MEMBER_SELECT_FILTER: {
      const { option, index } = action.payload;
      let newState = _.cloneDeep(state);
      if (option) {
        newState = _.set(newState, 'membersFilter', option);
      }
      if (index || index === 0) {
        newState = _.set(newState, 'memberNavigationState.index', index);
      }

      return newState;
    }

    case TRIBE_MEMBER_REMOVE_SUCCESS: {
      const { userId } = action.payload;
      let newState = _.cloneDeep(state);
      let newItem = _.cloneDeep(newState.item);
      if (newItem) {
        newItem = newItem.members.filter((member) => member.memberRef._id !== userId);
      }
      // After removal, user resets his/her relationship with the tribe
      newState = _.set(newState, 'hasRequested', undefined);
      return _.set(newState, 'item', newItem);
    }

    case TRIBE_EDIT_SUCCESS: {
      const { newTribe } = action.payload;
      const newState = _.cloneDeep(state);
      const oldTribe = _.get(newState, 'item');
      if (!oldTribe || oldTribe._id !== oldTribe._id) return newState;
      const updatedEvent = updateTribe(oldTribe, newTribe);
      return _.set(newState, 'item', updatedEvent);
    }

    // Currently for a post like update, it will iterator through the feed to
    // Update the post
    case LIKE_POST:
    case UNLIKE_POST: {
      const { id, likeId, tab, undo } = action.payload;
      let newState = _.cloneDeep(state);

      const oldTribeFeed = _.get(newState, 'feed');
      const newTribeFeed = oldTribeFeed.map((post) => {
        if (post._id === id) {
          const oldLikeCount = _.get(post, 'likeCount');
          let newLikeCount = oldLikeCount;
          if (action.type === LIKE_POST) {
            if (undo) {
              newLikeCount = oldLikeCount - 1;
            } else if (likeId === 'testId') {
              newLikeCount = oldLikeCount + 1;
            }
          } else if (action.type === UNLIKE_POST) {
            if (undo) {
              newLikeCount = oldLikeCount + 1;
            } else if (likeId === undefined) {
              newLikeCount = oldLikeCount - 1;
            }
          }

          return {
            ...post,
            maybeLikeRef: likeId,
            likeCount: newLikeCount
          };
        }
        return post;
      });

      return _.set(newState, 'feed', newTribeFeed);
    }

    default:
      return { ...state };
  }
};

export const updateTribe = (oldTribe, newTribe) => {
  let updatedTribe = _.cloneDeep(oldTribe);
  Object.keys(newTribe).forEach((key) => {
    // oldEvent doesn't have the field
    if (!oldTribe[key] || oldTribe[key] !== newTribe[key]) {
      updatedTribe = _.set(updatedTribe, `${key}`, newTribe[key]);
    }
  });
  return updatedTribe;
};
