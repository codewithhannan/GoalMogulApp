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
  selectedTab: 'about'
};

export const EVENT_SWITCH_TAB = 'event_switch_tab';

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

    default:
      return { ...state };
  }
};
