import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

import {
  LIKE_POST,
  UNLIKE_POST,
} from '../like/LikeReducers';

import {
  TRIBE_EDIT_SUCCESS,
  updateTribe
} from './TribeReducers';

const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'about', title: 'About' },
      { key: 'posts', title: 'Posts' },
      { key: 'members', title: 'Members' }
    ]
  },
  defaultRoutes: [
    { key: 'about', title: 'About' },
    { key: 'members', title: 'Members' }
  ],
  selectedTab: 'about',
  item: undefined,
  feed: [],
  feedLoading: false,
  tribeLoading: false,
  hasNextPage: undefined,
  skip: 0,
  limit: 10,
  hasRequested: undefined,
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

export const MYTRIBE_SWITCH_TAB = 'mytribe_switch_tab';
export const MYTRIBE_DETAIL_OPEN = 'mytribe_detail_open';
export const MYTRIBE_DETAIL_LOAD = 'mytribe_detail_load';
// Successfully load tribe detail
export const MYTRIBE_DETAIL_LOAD_SUCCESS = 'mytribe_detail_load_success';
// Failed to load tribe detail
export const MYTRIBE_DETAIL_LOAD_FAIL = 'mytribe_detail_load_fail';
export const MYTRIBE_DETAIL_CLOSE = 'mytribe_detail_close';
export const MYTRIBE_FEED_FETCH = 'mytribe_feed_fetch';
export const MYTRIBE_FEED_FETCH_DONE = 'mytribe_feed_fetch_done';
export const MYTRIBE_FEED_REFRESH_DONE = 'mytribe_feed_refresh_done';
export const MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS = 'mytribe_request_cancel_join_success';
export const MYTRIBE_REQUEST_JOIN_SUCCESS = 'mytribe_request_join_success';
export const MYTRIBE_MEMBER_SELECT_FILTER = 'mytribe_member_select_filter';

// Either reject user join request or remove user from tribe
export const MYTRIBE_MEMBER_REMOVE_SUCCESS = 'mytribe_member_remove_success';
export const MYTRIBE_DEMOTE_MEMBER_SUCCESS = 'mytribe_demote_member_success';
export const MYTRIBE_PROMOTE_MEMBER_SUCCESS = 'mytribe_promote_member_success';
// admin accept join request
export const MYTRIBE_ACCEPT_MEMBER_SUCCESS = 'mytribe_accept_member_success';
// user accept invitation
export const MYTRIBE_MEMBER_ACCEPT_SUCCESS = 'mytribe_member_accept_success';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MYTRIBE_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    // Fetching feed for a mytribe
    case MYTRIBE_FEED_FETCH: {
      return {
        ...state,
        feedLoading: true
      };
    }

    case MYTRIBE_DETAIL_LOAD: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'tribeLoading', true);
    }

    // Fetching feed done for a mytribe
    case MYTRIBE_FEED_FETCH_DONE: {
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
    case MYTRIBE_FEED_REFRESH_DONE: {
      const { skip, data, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'feedLoading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      return _.set(newState, 'feed', data);
    }

    case MYTRIBE_DETAIL_LOAD_SUCCESS: {
      const { tribe } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'item', { ...tribe });
      return _.set(newState, 'tribeLoading', false);
    }

    case MYTRIBE_DETAIL_OPEN: {
      const { tribe } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, 'item', { ...tribe });
    }

    case MYTRIBE_DETAIL_CLOSE: {
      return {
        ...INITIAL_STATE
      };
    }

    case MYTRIBE_MEMBER_REMOVE_SUCCESS: {
      const { userId, tribeId } = action.payload;
      let newState = _.cloneDeep(state);
      if (!newState.item || newState.item._id !== tribeId) return newState;
      const oldMembers = _.get(newState, 'item.members');
      const newMembers = oldMembers.filter((member) => member.memberRef._id !== userId);

      // After removal, user resets his/her relationship with the tribe
      newState = _.set(newState, 'hasRequested', undefined);
      return _.set(newState, 'item.members', newMembers);
    }

    // Set hasRequested to false and remove user from the members
    case MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS: {
      const { userId, tribeId } = action.payload;
      let newState = _.cloneDeep(state);
      if (!newState.item || newState.item._id !== tribeId) return newState;
      const oldMembers = _.get(newState, 'item.members');
      const newMembers = oldMembers.filter((member) => member.memberRef._id !== userId);

      newState = _.set(newState, 'hasRequested', false);
      return _.set(newState, 'item.members', newMembers);
    }

    case MYTRIBE_REQUEST_JOIN_SUCCESS: {
      // const newState = _.cloneDeep(state);
      // return _.set(newState, 'hasRequested', true);
      const { userId, tribeId, member } = action.payload;
      let newState = _.cloneDeep(state);
      if (!newState.item || newState.item._id !== tribeId) return newState;
      const oldMembers = _.get(newState, 'item.members');
      let newMembers = oldMembers.filter((m) => m.memberRef._id !== userId);
      newMembers = newMembers.concat(member);

      newState = _.set(newState, 'hasRequested', true);
      return _.set(newState, 'item.members', newMembers);
    }

    case MYTRIBE_MEMBER_SELECT_FILTER: {
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

    case TRIBE_EDIT_SUCCESS: {
      const { newTribe } = action.payload;
      const newState = _.cloneDeep(state);
      const oldTribe = _.get(newState, 'item');
      if (!oldTribe || oldTribe._id !== oldTribe._id) return newState;
      const updatedEvent = updateTribe(oldTribe, newTribe);
      return _.set(newState, 'item', updatedEvent);
    }

    // Current user as admin accept joinerId's request or user accepts tribe invit
    case MYTRIBE_MEMBER_ACCEPT_SUCCESS:
    case MYTRIBE_ACCEPT_MEMBER_SUCCESS: {
      const { tribeId, joinerId } = action.payload;
      const newState = _.cloneDeep(state);
      if (!newState.item || newState.item._id !== tribeId) return newState;
      const oldMembers = _.get(newState, 'item.members');
      const newMembers = updateMemberStatus(oldMembers, joinerId, 'Member');
      return _.set(newState, 'item.members', newMembers);
    }

    case MYTRIBE_DEMOTE_MEMBER_SUCCESS: {
      const { demoteeId, tribeId } = action.payload;
      const newState = _.cloneDeep(state);
      if (!newState.item || newState.item._id !== tribeId) return newState;
      const oldMembers = _.get(newState, 'item.members');
      const newMembers = updateMemberStatus(oldMembers, demoteeId, 'Member');
      return _.set(newState, 'item.members', newMembers);
    }

    case MYTRIBE_PROMOTE_MEMBER_SUCCESS: {
      const { promoteeId, tribeId } = action.payload;
      const newState = _.cloneDeep(state);
      if (!newState.item || newState.item._id !== tribeId) return newState;
      const oldMembers = _.get(newState, 'item.members');
      const newMembers = updateMemberStatus(oldMembers, promoteeId, 'Admin');
      return _.set(newState, 'item.members', newMembers);
    }

    // Currently for a post like update, it will iterator through the feed to
    // Update the post
    case LIKE_POST:
    case UNLIKE_POST: {
      const { id, likeId, tab } = action.payload;
      let newState = _.cloneDeep(state);

      const oldTribeFeed = _.get(newState, 'feed');
      const newTribeFeed = oldTribeFeed.map((post) => {
        if (post._id === id) {
          if (likeId === 'testId') {
            return {
              ...post,
              maybeLikeRef: likeId,
              likeCount: post.likeCount + 1
            };
          }
          if (likeId === undefined) {
            return {
              ...post,
              maybeLikeRef: likeId,
              likeCount: post.likeCount - 1
            };
          }
        }
        return post;
      });

      return _.set(newState, 'feed', newTribeFeed);
    }

    default:
      return { ...state };
  }
};

const updateMemberStatus = (members, memberIdToUpdate, newCategory) => {
  const newMembers = members.map((member) => {
    if (member.memberRef._id === memberIdToUpdate) {
      return _.set(member, 'category', newCategory);
    }
    return member;
  });
  return newMembers;
};
