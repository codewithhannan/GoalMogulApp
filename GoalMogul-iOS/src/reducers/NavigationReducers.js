import { ActionConst, Actions } from 'react-native-router-flux';
import _ from 'lodash';

export const initialState = {
  scene: {},
  stack: [],
  state: {},
  tab: undefined
};

// main navigation routes for the application
export const MAIN_NAVIGATION_ROUTES = ['homeTab', 'meetTab', 'notificationTab', 'exploreTab', 'chatTab'];

export default (state = initialState, action = {}) => {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    // case ActionConst.FOCUS: {
    //   return {
    //     ...state,
    //     scene: action.scene,
    //     state: Actions.state
    //   };
    // }
    //
    // case ActionConst.POP: {
    //   const newStack = { ...state.stack };
    //   newStack.pop();
    //   return { ...state, stack: newStack, state: Actions.state };
    // }

    // case ActionConst.PUSH: {
      // console.log('push new scene', action);
      // const newStack = [...state.stack];
      // console.log('new stack is: ', newStack);
      // newStack.push(action.routeName);
      // return { ...state, stack: newStack };
    // }

    case 'Navigation/NAVIGATE': {
      // console.log('navigate to: ', action.routeName);
      const newState = _.cloneDeep(state);
      const { routeName } = action;
      if (!routeName) return newState;

      let route;
      if (routeName === 'mainTabs') route = 'homeTab';
      if (!MAIN_NAVIGATION_ROUTES.some((r) => r === routeName)) {
        return newState;
      }
      route = routeName;
      return _.set(newState, 'tab', route);
    }

    default:
      return { ...state };
  }
};
