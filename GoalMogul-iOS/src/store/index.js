import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { persistStore } from "redux-persist";
import reducers from "../reducers"; // the value from combineReducers

export const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
export const persistor = persistStore(store);
