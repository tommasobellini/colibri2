/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  Switch,
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import Toast from "@remobile/react-native-toast";
import BluetoothSerial, {
  withSubscription
} from "react-native-bluetooth-serial-next";
import { Buffer } from "buffer";

import Button from "../components/Button";
import DeviceList from "../components/DeviceList";
import styles from "../styles";
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';
import { BleManager } from "react-native-ble-plx"
// import BleManager from "react-native-ble-manager"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDevice } from '../store/actions/BleActions';
import { requestMTU } from 'react-native-ble-manager';

// TODO(you): import any additional firebase services that you require for your app, e.g for auth:
//    1) install the npm package: `yarn add @react-native-firebase/auth@alpha` - you do not need to
//       run linking commands - this happens automatically at build time now
//    2) rebuild your app via `yarn run run:android` or `yarn run run:ios`
//    3) import the package here in your JavaScript code: `import '@react-native-firebase/auth';`
//    4) The Firebase Auth service is now available to use here: `firebase.auth().currentUser`
global.Buffer = Buffer;
const iconv = require("iconv-lite");
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu',
});

const firebaseCredentials = Platform.select({
  ios: 'https://invertase.link/firebase-ios',
  android: 'https://invertase.link/firebase-android',
});

class BluetoothView extends React.Component {
  constructor(props) {
    super(props);
    this.events = null;
    this.state = {
      isEnabled: false,
      device: 3,
      devices: [],
      scanning: false,
      processing: false,
      temporing: 0,
      services: {},
      payload: null
    };
  }

  async componentDidMount() {
    const manager = new BleManager()
    manager.state().then(resp1 => {
      console.log('blestate ' + resp1)
      if (resp1 === 'PoweredOn') {
          this.listDevices().then(list => {
            console.log(list)
            this.setState(({ devices }) => ({
              devices: devices.map(device => {
                const found = list.find(v => v.id === device.id);
                console.log(found)
                if (found) {
                  return {
                    ...found,
                    paired: true,
                    connected: false
                  };
                }
                console.log(device)
                return device;
              })
            }));
            console.log(this.state.devices)

          })
         
      }
    })
    this.events = this.props.events;
    console.log(this.events);
    // BleManager.start()
    try {
      const [isEnabled, devices] = await Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ]);
      this.setState({
        isEnabled,
        devices: devices.map(device => ({
          ...device,
          paired: true,
          connected: false
        }))
      });
    } catch (e) {
      Toast.showShortBottom(e.message);
    }

    this.events.on("bluetoothEnabled", () => {
      Toast.showShortBottom("Bluetooth enabled");
      this.setState({ isEnabled: true });
    });

    this.events.on("bluetoothDisabled", () => {
      Toast.showShortBottom("Bluetooth disabled");
      this.setState({ isEnabled: false });
    });

    this.events.on("connectionSuccess", ({ device }) => {
      if (device) {
        Toast.showShortBottom(
          `Device ${device.name}<${device.id}> has been connected`
        );
      }
    });

    this.events.on("connectionFailed", ({ device }) => {
      if (device) {
        Toast.showShortBottom(
          `Failed to connect with device ${device.name}<${device.id}>`
        );
      }
    });

    this.events.on("connectionLost", ({ device }) => {
      if (device) {
        Toast.showShortBottom(
          `Device ${device.name}<${device.id}> connection has been lost`
        );
      }
    });

    this.events.on("data", result => {
      if (result) {
        const { id, data } = result;
        console.log(`Data from device ${id} : ${data}`);
      }
    });

    this.events.on("error", e => {
      if (e) {
        console.log(`Error: ${e.message}`);
        Toast.showShortBottom(e.message);
      }
    });
  }

  requestEnable = () => async () => {
    try {
      await BluetoothSerial.requestEnable();
      this.setState({ isEnabled: true });
    } catch (e) {
      Toast.showShortBottom(e.message);
    }
  };

  toggleBluetooth = async value => {
    try {
      if (value) {
        await BluetoothSerial.enable();
      } else {
        await BluetoothSerial.disable();
      }
    } catch (e) {
      Toast.showShortBottom(e.message);
    }
  };

  listDevices = async () => {
    try {
      console.log('ciaooo')
      const list = await BluetoothSerial.list();
      console.log(list)
      return list
      
      console.log(this.devices)

    } catch (e) {
      Toast.showShortBottom(e.message);
    }
  };

  discoverUnpairedDevices = async () => {
    this.setState({ scanning: true });

    try {
      const unpairedDevices = await BluetoothSerial.listUnpaired();

      this.setState(({ devices }) => ({
        scanning: false,
        devices: devices
          .map(device => {
            const found = unpairedDevices.find(d => d.id === device.id);

            if (found) {
              return {
                ...device,
                ...found,
                connected: false,
                paired: false
              };
            }

            return device.paired || device.connected ? device : null;
          })
          .map(v => v)
      }));
    } catch (e) {
      Toast.showShortBottom(e.message);

      this.setState(({ devices }) => ({
        scanning: false,
        devices: devices.filter(device => device.paired || device.connected)
      }));
    }
  };

  cancelDiscovery = () => async () => {
    try {
      await BluetoothSerial.cancelDiscovery();
      this.setState({ scanning: false });
    } catch (e) {
      Toast.showShortBottom(e.message);
    }
  };

  toggleDevicePairing = async ({ id, paired }) => {
    if (paired) {
      await this.unpairDevice(id);
    } else {
      await this.pairDevice(id);
    }
  };

  pairDevice = async id => {
    this.setState({ processing: true });

    try {
      const paired = await BluetoothSerial.pairDevice(id);

      if (paired) {
        Toast.showShortBottom(
          `Device ${paired.name}<${paired.id}> paired successfully`
        );

        this.setState(({ devices, device }) => ({
          processing: false,
          device: {
            ...device,
            ...paired,
            paired: true
          },
          devices: devices.map(v => {
            if (v.id === paired.id) {
              return {
                ...v,
                ...paired,
                paired: true
              };
            }

            return v;
          })
        }));
      } else {
        Toast.showShortBottom(`Device <${id}> pairing failed`);
        this.setState({ processing: false });
      }
    } catch (e) {
      Toast.showShortBottom(e.message);
      this.setState({ processing: false });
    }
  };

  unpairDevice = async id => {
    this.setState({ processing: true });

    try {
      const unpaired = await BluetoothSerial.unpairDevice(id);

      if (unpaired) {
        Toast.showShortBottom(
          `Device ${unpaired.name}<${unpaired.id}> unpaired successfully`
        );

        this.setState(({ devices, device }) => ({
          processing: false,
          device: {
            ...device,
            ...unpaired,
            connected: false,
            paired: false
          },
          devices: devices.map(v => {
            if (v.id === unpaired.id) {
              return {
                ...v,
                ...unpaired,
                connected: false,
                paired: false
              };
            }

            return v;
          })
        }));
      } else {
        Toast.showShortBottom(`Device <${id}> unpairing failed`);
        this.setState({ processing: false });
      }
    } catch (e) {
      Toast.showShortBottom(e.message);
      this.setState({ processing: false });
    }
  };

  toggleDeviceConnection = async ({ id, connected }) => {
    if (connected) {
      await this.disconnect(id);
    } else {
      await this.connect(id);
    }
  };

  connect = async id => {
    this.setState({ processing: true });
    console.log(this.props)
    try {
      let init = false
      let jsonList = ''
      var temporing = 0;

      let completeJson = ''
      const manager = new BleManager()
      manager.connectToDevice(id, { requestMTU: 100, refreshGatt: true }).then(async (connected) => {
        this.setState({device: connected})
        this.props.add(connected);

        Toast.showShortTop('' + connected.mtu)  
          
         
        //   const all = await manager.servicesForDevice(id)
        //   Toast.showLongBottom(all)
        //   manager.readCharacteristicForDevice(id, 'dfb0', 'dfb1').then(value => {
        //     Toast.showLongCenter(JSON.stringify(value))
        //   })
        //   .catch((error) => {
        //     // Handle errors
        //     Toast.showLongTop('error: ' + error)
        // });
        })
        .catch((error) => {
          // Handle errors
          Toast.showLongTop('error: ' + error)
      });
        // .then((device) => {
        //   const services = device.services()
        //   Toast.showLongTop(JSON.stringify(services))
        //   // Do work on device with services and characteristics
        // })
        // ----------------------
        // const connected = BleManager.connect(id).then(() => {
        //   setInterval(async ()=>{
        //     // const data = await BleManager.read(id,'dfb0', 'dfb1')
        //     BleManager.read(id, 'dfb0', 'dfb1').then(data=>{
        //       Toast.showLongBottom(JSON.stringify(data[0]))
        //     })
        //   },500)
        //   BleManager.retrieveServices(id).then(async (peripheralInfo) => {
            
            
        //     this.setState({payload: JSON.stringify(peripheralInfo)})
        //     // var service = peripheralInfo['characteristics'][3]['service'];
        //     // var crustCharacteristic = peripheralInfo['characteristics'][1]['characteristic'];
        //     //   const data = await BleManager.read(id, service, '2a00')
        //   })
        // })
       

        if (connected) {
          
          this.setState(({ devices, device }) => ({
            processing: false,
            device: {
              ...device,
              ...connected,
              connected: true
            },
            devices: devices.map(v => {
              if (v.id === connected.id) {
                return {
                  ...v,
                  ...connected,
                  connected: true
                };
              }
  
              return v;
            })
          }));
        } else {
          Toast.showShortBottom(`Failed to connect to device <${id}>`);
          this.setState({ processing: false });
        }
        // return device.discoverAllServicesAndCharacteristics()
      // }).then(device2 => {
      //   return device2.services()
      // }).then(services => {
      //   const service = {}
      //   Toast.showShortCenter(services.map(x=>x.uuid).toString())
      //   service['UUIDS'] = services
      //   service['ID'] = id;
      //   Toast.showLongTop(service.toString())

      // })

      // const all = await manager.discoverAllServicesAndCharacteristicsForDevice(connected.id)
      // Toast.showLongCenter(all.services)
      // service['serviceUUID'] = connected.serviceUUIDs;
      // service['characteristicUUID'] = connected.characteristicsForService(service['serviceUUID']).characteristicUUID
      // this.setState({services: service})
      // this.props.addServices(service);
      // const myDevice = BluetoothSerial.device(id);
      // Toast.showShortTop("" + myDevice.name);
      // const connected = await myDevice.connect(id);
      
    } catch (e) {
      Toast.showShortBottom(e.message);
      this.setState({ processing: false });
    }
  };

  disconnect = async id => {
    this.setState({ processing: true });

    try {
      await BluetoothSerial.device(id).disconnect();

      this.setState(({ devices, device }) => ({
        processing: false,
        device: {
          ...device,
          connected: false
        },
        devices: devices.map(v => {
          if (v.id === id) {
            return {
              ...v,
              connected: false
            };
          }

          return v;
        })
      }));
    } catch (e) {
      Toast.showShortBottom(e.message);
      this.setState({ processing: false });
    }
  };
  read = async (id) => {
    Toast.showShortBottom("ref is...");
    var temporing = 0;
    try {
      console.log(id)
      setInterval(async function(){
        const data = await BluetoothSerial.readFromDevice();
        Toast.showShortTop(data);
        console.log(typeof data)
        

        var getHandPosition = firebase.functions().httpsCallable('getHandPosition');
        getHandPosition({message: JSON.parse(data)}).then((res)=>{
            Toast.showShortBottom("message is : " + res.data.message)
            if(res.data.position === 'TOP' || res.data.position === 'BOTTOM' || res.data.position === 'SIDE') {
              var tempDataList = [];
              tempDataList.push(data)
              temporing = temporing + 500
              if(temporing >= 3000) {
                if(tempDataList.length > 0) {
                  tempDataList.forEach(item => {
                    const snap = firestore().collection('devices').add(JSON.parse(item));
                  })
                  tempDataList = []
                } else {
                  const snap = firestore().collection('devices').add(JSON.parse(data));
                }
              }
            } else {
              temporing = 0;
            }

            // Toast.showShortCenter("value is : " + res.data.value)
        }).catch(function(error) {
            // Getting the Error details.
            var code = error.code;
            var message = error.message;
            var details = error.details;
            Toast.showShortBottom("error is : " + message)

          });
          
      }, 500);
    } catch(e){
      Toast.showShortBottom(e.message);
    }
  };
  // write = async (id, message) => {
  //   try {
  //     await BluetoothSerial.device(id).write(message);
  //     Toast.showShortBottom("Successfuly wrote to device");
  //   } catch (e) {
  //     Toast.showShortBottom(e.message);
  //   }
  // };

  // writePackets = async (id, message, packetSize = 64) => {
  //   try {
  //     const device = BluetoothSerial.device(id);
  //     const toWrite = iconv.encode(message, "cp852");
  //     const writePromises = [];
  //     const packetCount = Math.ceil(toWrite.length / packetSize);

  //     for (var i = 0; i < packetCount; i++) {
  //       const packet = new Buffer(packetSize);
  //       packet.fill(" ");
  //       toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
  //       writePromises.push(device.write(packet));
  //     }

  //     await Promise.all(writePromises).then(() =>
  //       Toast.showShortBottom("Writed packets")
  //     );
  //   } catch (e) {
  //     Toast.showShortBottom(e.message);
  //   }
  // };

  // renderModal = (device, processing) => {
  //   if (!device) return null;

  //   const { id, name, paired, connected } = device;

  //   return (
  //     <Modal
  //       animationType="fade"
  //       transparent={false}
  //       visible={true}
  //       onRequestClose={() => {}}
  //     >
  //       {device ? (
  //         <View
  //           style={{
  //             flex: 1,
  //             justifyContent: "center",
  //             alignItems: "center"
  //           }}
  //         >
  //           <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
  //           <Text style={{ fontSize: 14 }}>{`<${id}>`}</Text>

  //           {processing && (
  //             <ActivityIndicator
  //               style={{ marginTop: 15 }}
  //               size={Platform.OS === "ios" ? 1 : 60}
  //             />
  //           )}

  //           {/* {!processing && (
  //             <View style={{ marginTop: 20, width: "50%" }}>
  //               {Platform.OS !== "ios" && (
  //                 <Button
  //                   title={paired ? "Unpair" : "Pair"}
  //                   style={{
  //                     backgroundColor: "#22509d"
  //                   }}
  //                   textStyle={{ color: "#fff" }}
  //                   onPress={() => this.toggleDevicePairing(device)}
  //                 />
  //               )}
  //               <Button
  //                 title={connected ? "Disconnect" : "Connect"}
  //                 style={{
  //                   backgroundColor: "#22509d"
  //                 }}
  //                 textStyle={{ color: "#fff" }}
  //                 onPress={() => this.toggleDeviceConnection(device)}
  //               />
  //               {connected && (
  //                 <React.Fragment>
  //                   <Button
  //                     title="Read"
  //                     style={{
  //                       backgroundColor: "#22509d"
  //                     }}
  //                     textStyle={{ color: "#fff" }}
  //                     onPress={() =>
  //                       this.read(
  //                         id                          
  //                       )
  //                     }
  //                   />
  //                   <Button
  //                     title="Write"
  //                     style={{
  //                       backgroundColor: "#22509d"
  //                     }}
  //                     textStyle={{ color: "#fff" }}
  //                     onPress={() =>
  //                       this.write(
  //                         id,
  //                         "This is the test message\r\nDoes it work?\r\nTell me it works!\r\n"
  //                       )
  //                     }
  //                   />
  //                   <Button
  //                     title="Write packets"
  //                     style={{
  //                       backgroundColor: "#22509d"
  //                     }}
  //                     textStyle={{ color: "#fff" }}
  //                     onPress={() =>
  //                       this.writePackets(
  //                         id,
  //                         "This is the test message\r\nDoes it work?\r\nTell me it works!\r\n"
  //                       )
  //                     }
  //                   />
  //                 </React.Fragment>
  //               )}
  //               <Button
  //                 title="Close"
  //                 onPress={() => this.setState({ device: null })}
  //               />
  //             </View>
  //           )} */}
  //         </View>
  //       ) : null}
  //     </Modal>
  //   );
  // };

  render() {
    const { isEnabled, device, devices, scanning, processing } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#4ec5a5' }}>
        <View style={styles.topBar}>
          <Text style={styles.heading}>Device</Text>
          <View style={styles.enableInfoWrapper}>
            <Text style={{ fontSize: 14, color: "#fff", paddingRight: 10 }}>
              {isEnabled ? "ON" : "OFF"}
            </Text>
            <Switch onValueChange={this.toggleBluetooth} value={isEnabled} />
          </View>
        </View>
        {scanning ? (
          isEnabled && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                
              }}
            >
              <ActivityIndicator
                style={{ marginBottom: 15 }}
                size={Platform.OS === "ios" ? 1 : 60}
              />
              <Button
                textStyle={{ color: "#fff" }}
                style={styles.buttonRaised}
                title="Cancel Discovery"
                onPress={this.cancelDiscovery}
              />
            </View>
          )
        ) : (
          <React.Fragment>
            {/* {this.renderModal(device, processing)} */}
            <DeviceList
              devices={devices}
              onDevicePressed={device => this.toggleDeviceConnection(device)}
              onRefresh={this.listDevices}
            />
          </React.Fragment>
        )}

        
      </SafeAreaView>
    );
  }
}


const mapStateToProps = (state) => {
  const { device } = state
  console.log(state)
  return { 
    device
   }
};
const mapDispatchToProps = dispatch => {
  return {
    add: (name) => {
      console.log(name)
      dispatch(addDevice(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothView);


// export default connect(mapStateToProps)(BluetoothView);



// export default withSubscription({ subscriptionName: "events" })(BluetoothView);
