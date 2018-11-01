/*
 * Chat Tab is a main page with two sub tabs including ChatRoomTab, MessageTab
 */

import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'messages', title: 'MESSAGES' },
      { key: 'chatrooms', title: 'CHATROOMS' },
    ]
  },
  selectedTab: 'messages',
  messages: {
    data: [],
    hasNextPage: undefined,
    limit: 20,
    skip: 0,
    loading: false,
    filter: {

    }
  },
  chatrooms: {
    data: [],
    hasNextPage: undefined,
    limit: 20,
    skip: 0,
    loading: false,
    filter: {

    }
  }
};

export const CHATTAB_SWITCH_TAB = 'chattab_switch_tab';
export const CHATTAB_ON_FOCUS = 'chattab_on_focus';
export const CHATTAB_LOAD = 'chattab_load';
export const CHATTAB_FRESH_DONE = 'chattab_refresh_done';
export const CHATTAB_LOAD_DONE = 'chattab_load_done';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHATTAB_SWITCH_TAB: {
      const { index } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'navigationState.index', index);

      const selectedTab = state.navigationState.routes[index].key;
      return _.set(newState, 'navigationState.selectedTab', selectedTab);
    }

    case CHATTAB_LOAD: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, true);
    }

    /**
     * @param type: ['messages', 'chatrooms']
     */
    case CHATTAB_FRESH_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      return _.set(newState, `${type}.data`, data);
    }

    case CHATTAB_LOAD_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      const oldData = _.get(newState, `${type}.data`);
      return _.set(newState, `${type}.data`, arrayUnique(oldData.concat(data)));
    }

    default: {
      return { ...state };
    }
  }
};
