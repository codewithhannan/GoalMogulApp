import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

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
  limit: 100,
  hasRequested: undefined,
  // ['Admin', 'Member', 'JoinRequester', 'Invitee']
  membersFilter: 'Member',
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
export const MYTRIBE_MEMBER_REMOVE_SUCCESS = 'mytribe_member_remove_success';
export const MYTRIBE_MEMBER_ACCEPT_SUCCESS = 'mytribe_member_accept_success';
export const MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS = 'mytribe_request_cancel_join_success';
export const MYTRIBE_REQUEST_JOIN_SUCCESS = 'mytribe_request_join_success';
export const MYTRIBE_MEMBER_SELECT_FILTER = 'mytribe_member_select_filter';

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

    case MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'hasRequested', false);
    }

    case MYTRIBE_REQUEST_JOIN_SUCCESS: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'hasRequested', true);
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

    default:
      return { ...state };
  }
};
