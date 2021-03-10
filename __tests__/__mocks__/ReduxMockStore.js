/** @format */

// __mocks__/redux-mock-store.js
import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { reducers } from '../../src/reducers'

// jest.unmock('redux-mock-store');
// jest.unmock('redux-thunk');
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

/**
 * Creates a real redux store from initial state of the reducers
 * @param {Object} reducers a map between reducer key and its initial state, e.g. { users: { token: 'token'}, goals: {} }
 */
export const createStoreWithReducers = (initialState) => {
    return createStore(reducers, initialState, applyMiddleware(thunk))
}

/**
 * HOC to provide a real redux environment for the test
 * @param {Object} store redux store
 */
export const componentWrapperWithStore = (store) => ({ children }) => {
    return <Provider store={store}>{children}</Provider>
}

export default mockStore
