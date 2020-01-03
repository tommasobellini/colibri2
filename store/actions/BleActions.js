import { ADD_BLE_SERVICES } from '../types';

export const addServices = bleIndex => (
    {
      type: ADD_BLE_SERVICES,
      payload: bleIndex,
    }
  );