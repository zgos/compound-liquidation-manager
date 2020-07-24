import { combineReducers } from 'redux';
import userReducer from '../reducer/userReducer';

const createRootReducer = () => combineReducers({
  userReducer
});

export default createRootReducer;