import _ from 'lodash';

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
  item: undefined
};

export const EVENT_SWITCH_TAB = 'event_switch_tab';
export const EVENT_DETAIL_OPEN = 'event_detail_open';
export const EVENT_DETAIL_CLOSE = 'event_detail_close';

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
