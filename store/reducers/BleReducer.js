import { combineReducers } from 'redux';
import { ADD_BLE_SERVICES } from '../types';
import Toast from "@remobile/react-native-toast";

const INITIAL_STATE = {
  services: [],
};

const bleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_BLE_SERVICES:
      const {
        services
      } = state;
      Toast.showLongCenter(action.payload)
      const addedServices = action.payload;
      services.push(addedServices);
      // Finally, update our redux state
      const newState = { services };
      return newState;
    default:
      return state
  }
};

export default combineReducers({
  ble: bleReducer,
});