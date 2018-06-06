import _ from 'lodash';
import {
  HOME_SWITCH_TAB,

} from '../actions/types';

export const HOME_MASTERMIND_OPEN_CREATE_OVERLAY = 'home_mastermind_open_create_overlay';
export const HOME_CLOSE_CREATE_OVERLAY = 'home_mastermind_close_create_overlay';

const INITIAL_STATE = {
  tabIndex: 0,
  mastermind: {
    showPlus: true
  },
  activityfeed: {

  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HOME_SWITCH_TAB:
      return { ...state, tabIndex: action.payload };

    case HOME_MASTERMIND_OPEN_CREATE_OVERLAY: {
      let newState = _.cloneDeep(state);
      newState.mastermind.showPlus = false;
      return { ...newState };
    }

    case HOME_CLOSE_CREATE_OVERLAY: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${action.payload}.showPlus`, true);
      return { ...newState };
    }

    default:
      return { ...state };
  }
};
