// __mocks__/redux-mock-store.js
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.unmock('redux-mock-store');
jest.unmock('redux-thunk');
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

export default mockStore;