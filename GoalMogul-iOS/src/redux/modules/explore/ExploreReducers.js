/*
 * Explore is a main page with several sub tabs including EventTab, TribeTab
 */

import _ from 'lodash';

const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'events', title: 'Events' },
      { key: 'tribes', title: 'Tribes' },
    ]
  },
  selectedTab: 'events'
};

export const EXPLORE_SWITCH_TAB = 'explore_switch_tab';
export const EXPLORE_ON_FOCUS = 'explore_on_focus';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EXPLORE_SWITCH_TAB: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'navigationState.index', action.payload);

      const selectedTab = state.navigationState.routes[action.payload].key;
      return _.set(newState, 'navigationState.selectedTab', selectedTab);
    }

    default: {
      return { ...state };
    }
  }
};
