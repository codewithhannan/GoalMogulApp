/** @format */

import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { persistStore } from 'redux-persist'
import reducers from '../reducers' // the value from combineReducers
import { composeWithDevTools } from 'redux-devtools-extension'

export const store = createStore(
    reducers,
    {},
    composeWithDevTools(applyMiddleware(ReduxThunk))
)
export const persistor = persistStore(store)
