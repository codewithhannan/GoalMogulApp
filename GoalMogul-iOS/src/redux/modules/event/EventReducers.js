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
  limit: 20
};

export const EVENT_SWITCH_TAB = 'event_switch_tab';
export const EVENT_DETAIL_OPEN = 'event_detail_open';
export const EVENT_DETAIL_CLOSE = 'event_detail_close';
export const EVENT_FEED_FETCH = 'event_feed_fetch';
export const EVENT_FEED_FETCH_DONE = 'event_feed_fetch_done';
export const EVENT_FEED_REFRESH_DONE = 'event_feed_refresh_done';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EVENT_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    // Fetching feed for an event
    case EVENT_FEED_FETCH: {
      return {
        ...state,
        feedLoading: true
      };
    }

    // Fetching feed done for an event
    case EVENT_FEED_FETCH_DONE: {
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
    case EVENT_FEED_REFRESH_DONE: {
      const { skip, data, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'feedLoading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      return _.set(newState, 'feed', data);
    }

    case EVENT_DETAIL_OPEN: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'item', { ...action.payload });
    }

    case EVENT_DETAIL_CLOSE: {
      return {
        ...INITIAL_STATE
      };
    }

    default:
      return { ...state };
  }
};
