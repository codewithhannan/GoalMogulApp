/*
 * Explore is a main page with several sub tabs including EventTab, TribeTab
 */

import _ from 'lodash';
import { arrayUnique } from '../../../reducers/MeetReducers';

const INITIAL_EXPLORE_CHAT_STATE = {
  data: [], // a list of user ids
  skip: 0,
  limit: 10,
  hasNextPage: undefined,
  refreshing: false, // Boolean to determine refreshing status
  loading: false // Boolean to determine loading more status
};

/**
 * Note: Currently. event and tribe have separated reducer due to previous design choice. 
 * Starting from people, we are standardizing the way we store data
 */
const INITIAL_STATE = {
  navigationState: {
    index: 0,
    routes: [
      { key: 'people', title: 'People' },
      { key: 'tribes', title: 'Tribes' },
      { key: 'events', title: 'Events' }
    ]
  },
  selectedTab: 'events',
  people: {
    data: [], // a list of user ids
    skip: 0,
    limit: 10,
    hasNextPage: undefined,
    refreshing: false, // Boolean to determine refreshing status
    loading: false // Boolean to determine loading more status
  },
  chatRooms: { ...INITIAL_EXPLORE_CHAT_STATE },
  showPlus: true // This is no longer being used
};

export const EXPLORE_SWITCH_TAB = 'explore_switch_tab';
export const EXPLORE_ON_FOCUS = 'explore_on_focus';

export const EXPLORE_PEOPLE_REFRESH = 'explore_people_refresh';
export const EXPLORE_PEOPLE_REFRESH_DONE = 'explore_people_refresh_done';
export const EXPLORE_PEOPLE_LOAD_MORE = 'explore_people_load_more';
export const EXPLORE_PEOPLE_LOAD_MORE_DONE = 'explore_people_load_more_done';

export const EXPLORE_CHAT_REFRESH = 'explore_chat_refresh';
export const EXPLORE_CHAT_REFRESH_DONE = 'explore_chat_refresh_done';
export const EXPLORE_CHAT_LOAD_MORE = 'explore_chat_load_more';
export const EXPLORE_CHAT_LOAD_MORE_DONE = 'explore_chat_load_more_done';

export const EXPLORE_REFRENCE_KEY = 'explore';

export const EXPLORE_PLUS_PRESSED = 'explore_press_pressed';
export const EXPLORE_PLUS_UNPRESSED = 'explore_press_unpressed';


// Note: Search has different route map than SuggestionSearch
const BASE_ROUTE = 'secure';
export const RecommendationRouteMap = {
  people: {
    route: `${BASE_ROUTE}/user/friendship/recommendations`,
    actions: {
      refresh: EXPLORE_PEOPLE_REFRESH,
      refresh_done: EXPLORE_PEOPLE_REFRESH_DONE,
      load_more: EXPLORE_PEOPLE_LOAD_MORE,
      load_more_done: EXPLORE_PEOPLE_LOAD_MORE_DONE
    }
  },
  events: {
    route: `${BASE_ROUTE}/event/recommendations`
  },
  tribes: {
    route: `${BASE_ROUTE}/tribe/recommendations`
  },
  chatRooms: {
    route: `${BASE_ROUTE}/chat/room/recommendations`,
    actions: {
      refresh: EXPLORE_CHAT_REFRESH,
      refresh_done: EXPLORE_CHAT_REFRESH_DONE,
      load_more: EXPLORE_CHAT_LOAD_MORE,
      load_more_done: EXPLORE_CHAT_LOAD_MORE_DONE
    }
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EXPLORE_SWITCH_TAB: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'navigationState.index', action.payload);

      const selectedTab = state.navigationState.routes[action.payload].key;
      return _.set(newState, 'navigationState.selectedTab', selectedTab);
    }

    case EXPLORE_PEOPLE_REFRESH: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'people.refreshing', true);
      return newState;
    }

    case EXPLORE_PEOPLE_REFRESH_DONE: {
      let newState = _.cloneDeep(state);

      // Old data is used by Users.js to tentatively remove 
      // unused reference
      const { data, oldData, skip, hasNextPage } = action.payload;
      const dataToStore = data.map((d) => d._id);

      // Replace the old user ids
      newState = _.set(newState, 'people.data', dataToStore);

      newState = _.set(newState, 'people.skip', skip);
      newState = _.set(newState, 'people.hasNextPage', hasNextPage);
      newState = _.set(newState, 'people.refreshing', false);

      // For each old id that is not in the new id list, we attempt to clear in Users.post
      // Currently we don't handle the clean up at this stage. But this needs to be added
      // otherwise there will be dangling user
      return newState;
    }

    case EXPLORE_PEOPLE_LOAD_MORE: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'people.loading', true);
      return newState;
    }

    case EXPLORE_PEOPLE_LOAD_MORE_DONE: {
      let newState = _.cloneDeep(state);
      const { data, oldData, skip, hasNextPage } = action.payload;

      // Get prev list of user ids
      const prevData = _.get(newState, 'people.data');
      // Transform new data to only keep user id
      const transformedNewData = data.map((d) => d._id);
      // Concat old and new user ids and dedup
      const dataToStore = _.uniq(prevData.concat(transformedNewData));

      newState = _.set(newState, 'people.data', dataToStore);
      newState = _.set(newState, 'people.skip', skip);
      newState = _.set(newState, 'people.hasNextPage', hasNextPage);
      newState = _.set(newState, 'people.loading', false);

      return newState;
    }

    /* Chat related reducers */
    case EXPLORE_CHAT_REFRESH: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'chatRooms.refreshing', true);
      return newState;
    }
    
    case EXPLORE_CHAT_REFRESH_DONE: {
      const { data, hasNextPage, skip } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'chatRooms.refreshing', false);
      newState = _.set(newState, 'chatRooms.data', data);
      newState = _.set(newState, 'chatRooms.hasNextPage', hasNextPage);
      newState = _.set(newState, 'chatRooms.skip', skip);
      return newState;
    }

    case EXPLORE_CHAT_LOAD_MORE: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'chatRooms.loading', true);
      return newState;
    }

    case EXPLORE_CHAT_LOAD_MORE_DONE: {
      let newState = _.cloneDeep(state);
      const { data, hasNextPage, skip } = action.payload;
      newState = _.set(newState, 'chatRooms.loading', false);

      // TODO: de-duplicate of chat rooms
      newState = _.set(newState, 'chatRooms.data', data);
      newState = _.set(newState, 'chatRooms.hasNextPage', hasNextPage);
      newState = _.set(newState, 'chatRooms.skip', skip);
      return newState;
    }

    case EXPLORE_PLUS_PRESSED: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'showPlus', false);
    }

    case EXPLORE_PLUS_UNPRESSED: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'showPlus', true);
    }

    default: {
      return { ...state };
    }
  }
};
