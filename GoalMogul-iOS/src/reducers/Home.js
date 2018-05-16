import {
  HOME_SWITCH_TAB,

} from '../actions/types';

const INITIAL_STATE = {
  tabIndex: 0,

};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HOME_SWITCH_TAB:
      return { ...state, tabIndex: action.payload };
    default:
      return { ...state };
  }
};
