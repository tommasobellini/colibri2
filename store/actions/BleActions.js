import { ADD_BLE_SERVICES, ADD_BLE_DEVICE, ADD_DASH_MOUNTED, ADD_VIBES} from '../types';

export const addServices = bleIndex => (
    {
      type: ADD_BLE_SERVICES,
      payload: bleIndex,
    }
  );

  export const addDevice = device => {
    // console.log(device)
    return {
      type: ADD_BLE_DEVICE,
      payload: device,
    }
  }
  export const addVibes = vibes => {
    return {
      type: ADD_VIBES,
      payload: vibes
    }
  }

  export const addMounted = bool => {
    // console.log(bool)
    return {
      type: ADD_DASH_MOUNTED,
      payload: bool,
    }
  }