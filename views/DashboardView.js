import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  RefreshControl,
  SafeAreaView,
  Switch,
  ActivityIndicator,
  Button,
  Dimensions
} from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import BluetoothSerial, {
    withSubscription
  } from "react-native-bluetooth-serial-next";
import styles from "../styles";
import firebase from '@react-native-firebase/app';
import Toast from "@remobile/react-native-toast";

import '@react-native-firebase/functions';
import { toStatement } from "@babel/types";

import firestore from '@react-native-firebase/firestore';

import { BleManager } from "react-native-ble-plx"
import { connect } from 'react-redux';
import { addMounted } from '../store/actions/BleActions';

// First View (from top)
const TOP_VIEW_MIN_AX = -0.03;
const TOP_VIEW_MIN_AY = -0.03;
const TOP_VIEW_MIN_AZ = 0.9;

const TOP_VIEW_MAX_AX = 0.27;
const TOP_VIEW_MAX_AY = 0.27;
const TOP_VIEW_MAX_AZ = 1;

class DashboardView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          isEnabled: true,
          isAlreadyMounted: false,
          dataList: [],
          ciao: true,
          dataX: [0],
          dataY: [0],
          dataZ: [0]
      };
    }
    componentDidMount() {
        const backUrl = 'http://192.168.1.80:3000/v1/'
        // fetch(backUrl + 'data.json').then(resp => {
        //    resp.json().then(responseJson => {
        //         console.log(responseJson.datas)
        //         this.setState({dataList: responseJson.datas})
        //    })
        // })
        // .catch(err => {
        //     console.log(err)
        // })


        // fetch(backUrl + 'addData', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Accept-Language': 'ru,en;q=0.9',
        //     },
        //     body: '{"ax":"1.555","ay":"1.3343","az":"1.4343","ir":"434323","bpm":"222","pd":"0"}'
        // }).then(resp => {
        //     resp.json().then(responseJson => {
        //         console.log(responseJson)
        //    })
        // })
        // .catch(err => {
        //     console.log(err)
        // })
        if(!this.props.alreadyMounted) {
            console.log('did mount')
            this.props.mounted(true)
            const connected = this.props.device
            const manager = new BleManager()
            let init = false
            let jsonList = ''
            var temporing = 0;
            console.log(connected)
            connected.discoverAllServicesAndCharacteristics().then(async ()=>{
                const not = await manager.monitorCharacteristicForDevice(connected.id, 'dfb0', 'dfb1', async (error, characteristic) => {
                  if (error) {
                      alert(JSON.stringify(error));
                      return
                  };
                  console.log(characteristic)
                  return new Promise(resolve => {
                    // const Buffer = require("buffer").Buffer;
                    // let encodedAuth = new Buffer(characteristic.isNotifying).toString("base64");
                    var base64 = require('base-64');
                    const decodedValue = base64.decode( characteristic.value);
                      if(init == true){
                        jsonList += decodedValue
                        if(decodedValue.indexOf('}', -1) > 0){
                          let completeJson = jsonList
                          console.log(completeJson)
                          let message = JSON.stringify({message: JSON.parse(completeJson)})
                          console.log(message)
                          fetch(backUrl + 'getHandPosition', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Accept-Language': 'ru,en;q=0.9',
                                },
                                body: message
                            }).then(resp => {
                                resp.json().then(responseJson => {
                                    console.log(responseJson)
                            })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                           // restart init json message
                           init = false
                           jsonList = []
                          // check hand position
                        //   var getHandPosition = firebase.functions().httpsCallable('getHandPosition');
                        //   getHandPosition({message: JSON.parse(completeJson)}).then((res)=>{
                        //       Toast.showShortBottom("message is : " + res.data.message)
                        //       if(res.data.position === 'TOP' || res.data.position === 'BOTTOM' || res.data.position === 'SIDE') {
                        //         var tempDataList = [];
                        //         tempDataList.push(completeJson)
                        //         temporing = temporing + 500
                        //         if(temporing >= 3000) {
                        //           if(tempDataList.length > 0) {
                        //             tempDataList.forEach(item => {
                        //               const snap = firestore().collection('devices').add(JSON.parse(item));
                        //             })
                        //             tempDataList = []
                        //           } else {
                        //             const snap = firestore().collection('devices').add(JSON.parse(completeJson));
                        //           }
                        //         }
                        //       } else {
                        //         temporing = 0;
                        //       }
                  
                        //       // Toast.showShortCenter("value is : " + res.data.value)
                        //   }).catch(function(error) {
                        //       // Getting the Error details.
                        //       var code = error.code;
                        //       var message = error.message;
                        //       var details = error.details;
                        //       Toast.showShortBottom("error is : " + message)
                        //       console.log("error is : " + completeJson)
                  
                        //     });
    
                         
                        }
                      }
                      if(decodedValue.indexOf('{', 0) >= 0){
                        init = true
                        jsonList += decodedValue
                      }
                    
                      
                      resolve(characteristic);
                  })
              });
              })
        }
        const min = TOP_VIEW_MIN_AZ;
        const max = TOP_VIEW_MAX_AZ;
        const step = ((max-min)/2)/10;
        console.log(step)
    }

    startButton = () => async () => {
        Toast.showLongTop("starting button...");
        const app = this
        this.read(app)

    }

    read = async (app) => {
        app.setState({ciao: false})
        Toast.showLongTop(app.toString());
        Toast.showShortBottom("ref is...");
        try {
            const dataX = []
            const dataY = []
            const dataZ = []
          setInterval(async function(){
            // new ble function
            const manager = new BleManager()
            const services = this.props.services
            Toast.showLongCenter(services)
            const data = await manager.readCharacteristicForDevice()

            // old bl serial function
            // const data = await BluetoothSerial.readFromDevice();
            try {
                if(dataX.length > 20) {
                    dataX.splice(0,1)
                }
                if(dataY.length > 20) {
                    dataY.splice(0,1)
                }
                if(dataZ.length > 20) {
                    dataZ.splice(0,1)
                }
                Toast.showShortBottom(data);
                dataX.push(JSON.parse(data)['AX'])
                dataY.push(JSON.parse(data)['AY'])
                dataZ.push(JSON.parse(data)['AZ'])
                app.setState({dataX: dataX})
                app.setState({dataY: dataY})
                app.setState({dataZ: dataZ})
            } catch(err) {
                console.log(err)
            }
          }, 500);
        } catch(e){
          Toast.showShortBottom(e.message);
        }
      };

    render() {
        const { isEnabled, dataList } = this.state

        // var getHandPosition = firebase.functions().httpsCallable('getHandPosition');
        // getHandPosition({message: {AX: -0.321045, AY: 0.20, AZ: 1}}).then((res)=>{
        //     Toast.showShortBottom("message is : " + res.data.message)
        //     // Toast.showShortCenter("value is : " + res.data.value)
        // }).catch(function(error) {
        //     // Getting the Error details.
        //     var code = error.code;
        //     var message = error.message;
        //     var details = error.details;
        //     Toast.showShortBottom("error is : " + message)

        //   });

        return (
            <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.topBar}>
              <Text style={styles.heading}>Dashboard</Text>
            </View>
            <View>
                {/* <LineChart
                    data={{
                    labels: ["0", "500", "1000", "1500", "2000", "2500", "3000", "3500", "4000"],
                    datasets: [
                        {
                            data: this.state.dataX,
                            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // optional
                        },
                        {
                            data: this.state.dataY,
                            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // optional
                        },
                        {
                            data: this.state.dataZ,
                            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
                        }
                    ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel={"a: "}
                    yAxisSuffix={"m/s^2"}
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                        fillShadowGradient: '#fff',
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "3",
                            strokeWidth: "0.5",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 16
                    }}
                /> */}
                </View>
                <View style={styles.buttonView}>
                    <Button onPress={this.startButton()} title="Start .." style={styles.buttonRaised}/>
                    <Text>Data example in DB</Text>
                    <View style={{width: 400}}>
                        {
                            dataList.map(item => {
                                return (
                                <Text style={{textAlign: 'center', width: 400}}>{ '' + JSON.stringify(item)}</Text>
                                )
                            })
                        }
                    </View>
                    
                </View>
            </SafeAreaView>
        )
    }
    
}
const mapStateToProps = (state) => {
    console.log(state)

    const { device, alreadyMounted } = state
    return { device, alreadyMounted }
  };

const mapDispatchToProps = dispatch => {
    return {
      mounted: (name) => {
        console.log(name)
        dispatch(addMounted(name))
      }
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
