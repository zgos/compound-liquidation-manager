import { configureStore } from "@reduxjs/toolkit";
import sagaMiddleware from './rootSaga';
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer()
const store = configureStore({
  middleware: [ sagaMiddleware ],
  reducer: rootReducer
});

export default store;
