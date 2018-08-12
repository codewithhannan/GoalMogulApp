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
  selectedTab: 'about'
};

export const TRIBE_SWITCH_TAB = 'tribe_switch_tab';

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

    default:
      return { ...state };
  }
};
