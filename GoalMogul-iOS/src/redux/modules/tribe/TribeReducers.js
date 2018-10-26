import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'about', title: 'About' },
      { key: 'posts', title: 'Posts' },
      { key: 'members', title: 'Members' }
    ],
  },
  defaultRoutes: [
    { key: 'about', title: 'About' },
    { key: 'members', title: 'Members' }
  ],
  selectedTab: 'about',
  item: undefined,
  feed: [],
  feedLoading: false,
  hasNextPage: undefined,
  skip: 0,
  limit: 100,
  hasRequested: undefined,
  // ['Admin', 'Member', 'JoinRequester', 'Invitee']
  membersFilter: 'Member'
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
export const TRIBE_REQUEST_JOIN_FAIL = 'tribe_request_join_fail';
export const TRIBE_REQUEST_CANCEL_JOIN_SUCCESS = 'tribe_request_cancel_join_success';
export const TRIBE_MEMBER_SELECT_FILTER = 'tribe_member_select_filter';
export const TRIBE_MEMBER_INVITE_SUCCESS = 'tribe_member_invite_success';
export const TRIBE_MEMBER_INVITE_FAIL = 'tribe_member_invite_fail';
export const TRIBE_MEMBER_REMOVE_SUCCESS = 'tribe_member_remove_success';
export const TRIBE_MEMBER_ACCEPT_SUCCESS = 'tribe_member_accept_succes';
export const TRIBE_DETAIL_LOAD_SUCCESS = 'tribe_detail_load_success';
export const TRIBE_DETAIL_LOAD_FAIL = 'tribe_detail_load_fail';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
      return {
        ...state,
        feedLoading: true
      };
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

    case TRIBE_REQUEST_JOIN_SUCCESS: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'hasRequested', true);
    }

    case TRIBE_REQUEST_CANCEL_JOIN_SUCCESS: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'hasRequested', false);
    }

    case TRIBE_MEMBER_SELECT_FILTER: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'membersFilter', action.payload);
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

    default:
      return { ...state };
  }
};
