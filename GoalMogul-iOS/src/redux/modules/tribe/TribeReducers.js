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
  selectedTab: 'about',
  item: undefined,
  feed: [],
  feedLoading: false,
  hasNextPage: undefined,
  skip: 0,
  limit: 20
};

export const TRIBE_SWITCH_TAB = 'tribe_switch_tab';
export const TRIBE_DETAIL_OPEN = 'tribe_detail_open';
export const TRIBE_DETAIL_CLOSE = 'tribe_detail_close';
export const TRIBE_FEED_FETCH = 'tribe_feed_fetch';
export const TRIBE_FEED_FETCH_DONE = 'tribe_feed_fetch_done';
export const TRIBE_FEED_REFRESH_DONE = 'tribe_feed_refresh_done';

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

    case TRIBE_DETAIL_OPEN: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'item', { ...action.payload });
    }

    case TRIBE_DETAIL_CLOSE: {
      return {
        ...INITIAL_STATE
      };
    }

    default:
      return { ...state };
  }
};
