
import { createStore, combineReducers } from 'redux';
import bleReducer from './reducers/BleReducer';

const configureStore = () => {
  return createStore(bleReducer);
}

export default configureStore;