// __mocks__/redux-mock-store.js
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { reducers } from '../../src/reducers';

// jest.unmock('redux-mock-store');
// jest.unmock('redux-thunk');
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

/**
 * Creates a real redux store from initial state of the reducers
 * @param {Object} reducers a map between reducer key and its initial state, e.g. { users: { token: 'token'}, goals: {} }
 */
export const createStoreWithReducers = (initialState) => {
    return createStore(reducers, initialState, applyMiddleware(thunk));
};

export default mockStore;