/*
 * Chat Tab is a main page with two sub tabs including ChatRoomTab, MessageTab
 */

import _ from 'lodash';

const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'messages', title: 'MESSAGES' },
      { key: 'chatrooms', title: 'CHATROOMS' },
    ]
  },
  selectedTab: 'messages'
};

export const CHATTAB_SWITCH_TAB = 'chattab_switch_tab';
export const CHATTAB_ON_FOCUS = 'chattab_on_focus';
export const CHATTAB_LOAD = 'chattab_load';
export const CHATTAB_FRESH_DONE = 'chattab_refresh_done';
export const CHATTAB_LOAD_DONE = 'chattab_load_done';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHATTAB_SWITCH_TAB: {
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
