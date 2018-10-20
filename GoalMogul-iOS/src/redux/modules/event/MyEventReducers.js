// Reducers for an event that is opened from my event tab
import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'about', title: 'About' },
      { key: 'posts', title: 'Posts' },
      { key: 'attendees', title: 'Attendees' }
    ]
  },
  selectedTab: 'about',
  item: undefined,
  // Feed related vars
  feed: [],
  feedLoading: false,
  hasNextPage: undefined,
  skip: 0,
  limit: 100
};

export const MYEVENT_SWITCH_TAB = 'myevent_switch_tab';
export const MYEVENT_DETAIL_OPEN = 'myevent_detail_open';
export const MYEVENT_DETAIL_CLOSE = 'myevent_detail_close';
export const MYEVENT_FEED_FETCH = 'myevent_feed_fetch';
export const MYEVENT_FEED_FETCH_DONE = 'myevent_feed_fetch_done';
export const MYEVENT_FEED_REFRESH_DONE = 'myevent_feed_refresh_done';
export const MYEVENT_DETAIL_LOAD_SUCCESS = 'myevent_detail_load_success';
export const MYEVENT_DETAIL_LOAD_FAIL = 'myevent_detail_load_fail';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MYEVENT_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    // Fetching feed for an myevent
    case MYEVENT_FEED_FETCH: {
      return {
        ...state,
        feedLoading: true
      };
    }

    // Fetching feed done for an myevent
    case MYEVENT_FEED_FETCH_DONE: {
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

    // Event refresh feed done
    case MYEVENT_FEED_REFRESH_DONE: {
      const { skip, data, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'feedLoading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      return _.set(newState, 'feed', data);
    }

    case MYEVENT_DETAIL_LOAD_SUCCESS:
    case MYEVENT_DETAIL_OPEN: {
      const { event } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, 'item', { ...event });
    }

    case MYEVENT_DETAIL_CLOSE: {
      return {
        ...INITIAL_STATE
      };
    }

    default:
      return { ...state };
  }
};
