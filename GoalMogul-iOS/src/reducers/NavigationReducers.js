import { ActionConst, Actions } from 'react-native-router-flux';

const initialState = {
  scene: {},
  stack: [],
  state: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS: {
      return {
        ...state,
        scene: action.scene,
        state: Actions.state
      };
    }

    case ActionConst.POP: {
      const newStack = { ...state.stack };
      newStack.pop();
      return { ...state, stack: newStack, state: Actions.state };
    }

    case ActionConst.PUSH: {
      console.log('push new scene', action);
      const newStack = [...state.stack];
      console.log('new stack is: ', newStack);
      newStack.push(action.routeName);
      return { ...state, stack: newStack };
    }

    default:
      return { ...state };
  }
};
