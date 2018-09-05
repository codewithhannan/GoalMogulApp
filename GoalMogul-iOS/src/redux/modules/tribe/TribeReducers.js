import _ from 'lodash';

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
  feed: []
};

export const TRIBE_SWITCH_TAB = 'tribe_switch_tab';
export const TRIBE_DETAIL_OPEN = 'tribe_detail_open';
export const TRIBE_DETAIL_CLOSE = 'tribe_detail_close';
export const TRIBE_FEED_FETCH = 'tribe_feed_fetch';
export const TRIBE_FEED_FETCH_DONE = 'tribe_feed_fetch_done';

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
