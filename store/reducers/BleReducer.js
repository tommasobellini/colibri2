import { combineReducers } from 'redux';
import { ADD_BLE_SERVICES, ADD_BLE_DEVICE, ADD_DASH_MOUNTED } from '../types';
import Toast from "@remobile/react-native-toast";
import { State } from 'react-native-ble-plx';

const INITIAL_STATE = {
  services: [],
  device: 1,
  alreadyMounted: false
};

const bleReducer = (state = INITIAL_STATE, action) => {
  console.log(action.type)
  switch (action.type) {
    case ADD_BLE_DEVICE:
      state.device = action.payload
      return state
    case ADD_DASH_MOUNTED:
      state.alreadyMounted = action.payload

    default:
      return state
  }
};

export default bleReducer;