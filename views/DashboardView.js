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
  Dimensions,
  Image,
  Alert,
  TouchableOpacity
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
import Icon from 'react-native-vector-icons/FontAwesome5';
import BluetoothView from "./BluetoothView";
import Modal from "react-native-modal";

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
      modalVisible: false,
      isEnabled: true,
      isAlreadyMounted: false,
      vibes: 0,
      vibesList: [0,0,0,0,0,0,0,0,0],   
      newVibesAverage: [],   
      dataX: [0],
      dataY: [0],
      dataZ: [0],
      isShowRing: true,
      isTestRunning: false,
      timeoutTest: null,
      iconsStats: [
        {id: 1, name: 'vibes', path: require('../assets/Vibes.png'), value: 55},
        {id: 2, name: 'bpm', path: require('../assets/BPM.png'), value: 100},
        {id: 3, name: 'ir', path: require('../assets/IR.png'), value: 10},
      ]
    };
  }
  setModalVisible(visible) {
    this.setState({ modalVisible:visible });
  }
  animationBlinkRings() {
    let dataList = []
    const timeoutTest = setInterval(() => {
      this.setState({isShowRing: !this.state.isShowRing})
      dataList.push(Math.random() * 100)
      this.setState(
        {
          dataList: [
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
          ]
        })
    }, 250)
    this.setState({timeoutTest: timeoutTest})
  }
  startTest() {
    if(this.state.isTestRunning) {
      Toast.showLongCenter('Test is stopping')
      clearInterval(this.state.timeoutTest)
      this.setState({isTestRunning: false})
      this.setState({isShowRing: true})
    } else {
      Toast.showLongCenter('Test is starting')
      this.animationBlinkRings()
      this.setState({isTestRunning: true})
      const app = this
      this.read(app)
    }
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
    if (!this.props.alreadyMounted){
      console.log('did mount')
      this.props.mounted(true)
      const connected = this.props.device
      const manager = new BleManager()
      let init = false
      let jsonList = ''
      let vibesList = []
      var temporing = 0;
      let conne_type = typeof connected
      // console.log(typeof conne_type.toString())
      if (typeof connected === 'object') {
        connected.discoverAllServicesAndCharacteristics().then(async () => {
          const not = await manager.monitorCharacteristicForDevice(connected.id, 'dfb0', 'dfb1', async (error, characteristic) => {
            if (error) {
              alert(JSON.stringify(error));
              return
            };
            // console.log(characteristic)
            return new Promise(resolve => {
              // const Buffer = require("buffer").Buffer;
              // let encodedAuth = new Buffer(characteristic.isNotifying).toString("base64");
              var base64 = require('base-64');
              const decodedValue = base64.decode(characteristic.value);
              if (init == true) {
                jsonList += decodedValue
                if (decodedValue.indexOf('}', -1) > 0) {
                  let completeJson = jsonList
                  // console.log(completeJson)
                  let message = JSON.stringify({ message: JSON.parse(completeJson) })

                  const AZ = JSON.parse(completeJson)['AZ']
                  const min = TOP_VIEW_MIN_AZ;
                  const max = TOP_VIEW_MAX_AZ;
                  const step = ((max - min) / 2) / 10;
                  const average = min + ((max - min) / 2);

                  let percentageValue = 0
                  const percent_100 = [average - step * 10, average + step * 10]
                  if (AZ >= percent_100[0] && AZ <= percent_100[1]) {
                    percentageValue = 100
                  }
                  const percent_90 = [average - step * 9, average + step * 9]
                  if (AZ >= percent_90[0] && AZ <= percent_90[1]) {
                    percentageValue = 90

                  }

                  const percent_80 = [average - step * 8, average + step * 8]
                  if (AZ >= percent_80[0] && AZ <= percent_80[1]) {
                    percentageValue = 80

                  }
                  const percent_70 = [average - step * 7, average + step * 7]
                  if (AZ >= percent_70[0] && AZ <= percent_70[1]) {
                    percentageValue = 70

                  }
                  const percent_60 = [average - step * 6, average + step * 6]
                  if (AZ >= percent_60[0] && AZ <= percent_60[1]) {
                    percentageValue = 60

                  }
                  const percent_50 = [average - step * 5, average + step * 5]
                  if (AZ >= percent_50[0] && AZ <= percent_50[1]) {
                    percentageValue = 50

                  }
                  const percent_40 = [average - step * 4, average + step * 4]
                  if (AZ >= percent_40[0] && AZ <= percent_40[1]) {
                    percentageValue = 40

                  }
                  const percent_30 = [average - step * 3, average + step * 3]
                  if (AZ >= percent_30[0] && AZ <= percent_30[1]) {
                    percentageValue = 30

                  }
                  const percent_20 = [average - step * 2, average + step * 2]
                  if (AZ >= percent_20[0] && AZ <= percent_20[1]) {
                    percentageValue = 20

                  }

                  const percent_10 = [average - step, average + step]
                  if (AZ >= percent_10[0] && AZ <= percent_10[1]) {
                    percentageValue = 10
                  }



                  if (vibesList.length > 20) {
                    vibesList.splice(0, 1)
                  }
                  console.log('percetuage is: ' + percentageValue)
                  vibesList.push(percentageValue)
                  this.setState({vibesList:vibesList})
                  
                  // console.log('Percentage vibes: ' + percentageValue)
                  // console.log(message)
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
              if (decodedValue.indexOf('{', 0) >= 0) {
                init = true
                jsonList += decodedValue
              }


              resolve(characteristic);
            })
          });
        })
      } else {
        console.log('no reading..')
      }

    }
  }
  
  averageVibes = (oldPercentVibes) => {
    let newVibesAverage = this.state.newVibesAverage
    let average = 0
    console.log("                                  ----------------------------                   average START!")

    if (newVibesAverage.length < 6){
      newVibesAverage.push(oldPercentVibes);
      this.setState({newVibesAverage: newVibesAverage})
      console.log("                                  ----------------------------                   average PUSH!"+ newVibesAverage.length)

    }
    else {
      console.log("                                  ----------------------------                   average ELSE!")
      let sum = 0
      newVibesAverage.forEach(item => {
        sum += item
      })
      average = sum/newVibesAverage.length
      this.setState({newVibesAverage: []})
      console.log("                                  ----------------------------                   average DONE!" + average)
      return average
    }
    return average
  }

  read = () => {
    console.log("read is starting!")
    const connected = this.props.device
    console.log(connected)
    const manager = new BleManager()
    let init = false
    let jsonList = ''
    var temporing = 0;
    let completeJson = [];
    let vibesList = [];
    let conne_type = typeof connected
    const backUrl = 'http://192.168.1.80:3000/v1/'
    if (typeof connected === 'object') {
      connected.discoverAllServicesAndCharacteristics().then(async () => {
        const not = await manager.monitorCharacteristicForDevice(connected.id, 'dfb0', 'dfb1', async (error, characteristic) => {
          if (error) {
            alert(JSON.stringify(error));
            return
          };
          // console.log(characteristic)
          return new Promise(resolve => {
            // const Buffer = require("buffer").Buffer;
            // let encodedAuth = new Buffer(characteristic.isNotifying).toString("base64");
            var base64 = require('base-64');
            const decodedValue = base64.decode(characteristic.value);
            console.log(decodedValue)
            if (init == true) {
              jsonList += decodedValue
              if (decodedValue.indexOf('}', -1) > 0 || (decodedValue === '}')) {
                let completeJson = jsonList
                let message = JSON.stringify({ message: JSON.parse(completeJson)})
                console.log(message)
                const AZ = JSON.parse(completeJson)['AZ']
                completeJson = ''
                jsonList = ''
                const min = TOP_VIEW_MIN_AZ;
                const max = TOP_VIEW_MAX_AZ;
                const step = ((max - min) / 2) / 10;
                const average = min + ((max - min) / 2);

                let percentageValueVibes = 0
                const percent_100 = [average - step * 10, average + step * 10]
                if (AZ >= percent_100[0] && AZ <= percent_100[1]) {
                  percentageValueVibes = 100
                }
                const percent_90 = [average - step * 9, average + step * 9]
                if (AZ >= percent_90[0] && AZ <= percent_90[1]) {
                  percentageValueVibes = 90

                }

                const percent_80 = [average - step * 8, average + step * 8]
                if (AZ >= percent_80[0] && AZ <= percent_80[1]) {
                  percentageValueVibes = 80

                }
                const percent_70 = [average - step * 7, average + step * 7]
                if (AZ >= percent_70[0] && AZ <= percent_70[1]) {
                  percentageValueVibes = 70

                }
                const percent_60 = [average - step * 6, average + step * 6]
                if (AZ >= percent_60[0] && AZ <= percent_60[1]) {
                  percentageValueVibes = 60

                }
                const percent_50 = [average - step * 5, average + step * 5]
                if (AZ >= percent_50[0] && AZ <= percent_50[1]) {
                  percentageValueVibes = 50

                }
                const percent_40 = [average - step * 4, average + step * 4]
                if (AZ >= percent_40[0] && AZ <= percent_40[1]) {
                  percentageValueVibes = 40

                }
                const percent_30 = [average - step * 3, average + step * 3]
                if (AZ >= percent_30[0] && AZ <= percent_30[1]) {
                  percentageValueVibes = 30

                }
                const percent_20 = [average - step * 2, average + step * 2]
                if (AZ >= percent_20[0] && AZ <= percent_20[1]) {
                  percentageValueVibes = 20

                }

                const percent_10 = [average - step, average + step]
                if (AZ >= percent_10[0] && AZ <= percent_10[1]) {
                  percentageValueVibes = 10
                }
                // console.log('Percentage vibes: ' + percentageValueVibes)
                if (vibesList.length > 20) {
                  vibesList.splice(0, 1)
                }
                console.log('percetuage is: ' + percentageValueVibes)
                let newAverage = this.averageVibes(percentageValueVibes)
                if (newAverage != 0){
                vibesList.push(newAverage)
                this.setState({vibesList:vibesList})
                }
                
                // console.log(message)
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
            if (decodedValue.indexOf('{', 0) >= 0) {
              init = true
              jsonList += decodedValue
            }


            resolve(characteristic);
          })
        });
      })
   }
  }
  startButton = () => {
    console.log('CLICK ON TEST')
    this.setState({isTestRunning: !this.state.isTestRunning})
    if (!this.state.isTestRunning) {
      console.log("test running");
      const app = this
      this.read(app)
    } else {
      console.log('test stopped')
      this.stopRead()
    }

  }
  openConnectionPage = () => {
    Toast.showLongTop('connection page clicked')
  }
  stopRead = async () => {
    const connected = this.props.device
    console.log(connected)
    this.subscriptionMonitor = connected.monitorCharacteristicForService()
    if(this.subscriptionMonitor) {
      this.subscriptionMonitor.remove()
    }
  }
  // read = async (app) => {
  //   app.setState({ ciao: false })
  //   Toast.showLongTop(app.toString());
  //   Toast.showShortBottom("ref is...");
  //   try {
  //     const dataX = []
  //     const dataY = []
  //     const dataZ = []
  //     setInterval(async function () {
  //       // new ble function
  //       const manager = new BleManager()
  //       const services = this.props.services
  //       Toast.showLongCenter(services)
  //       const data = await manager.readCharacteristicForDevice()

  //       // old bl serial function
  //       // const data = await BluetoothSerial.readFromDevice();
  //       try {
  //         if (dataX.length > 20) {
  //           dataX.splice(0, 1)
  //         }
  //         if (dataY.length > 20) {
  //           dataY.splice(0, 1)
  //         }
  //         if (dataZ.length > 20) {
  //           dataZ.splice(0, 1)
  //         }
  //         Toast.showShortBottom(data);
  //         dataX.push(JSON.parse(data)['AX'])
  //         dataY.push(JSON.parse(data)['AY'])
  //         dataZ.push(JSON.parse(data)['AZ'])
  //         app.setState({ dataX: dataX })
  //         app.setState({ dataY: dataY })
  //         app.setState({ dataZ: dataZ })
  //       } catch (err) {
  //         console.log(err)
  //       }
  //     }, 500);
  //   } catch (e) {
  //     Toast.showShortBottom(e.message);
  //   }
  // };

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
      <ScrollView style={styles.scrollView}>
        <Modal
          isVisible={this.state.modalVisible}
        >
          <TouchableHighlight
            underlayColor={'transparent'}
          >
            <Button title="Close" color='#4ec5a5' onPress={() => {
              this.setModalVisible(false);
            }} />
          </TouchableHighlight>

          <View style={{ flex: 1 }}>
            <BluetoothView />
          </View>
        </Modal>
        <View style={styles.topBar}>
          <Text style={styles.heading}>Dashboard</Text>
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Icon name={'plus'} size={25} color="#fff" />
          </TouchableHighlight>
        </View>
        <View style={styles.cyclesSection}>
          <TouchableOpacity onPress={() => this.startTest()}>
            <View style={[styles.borderOutsideRingCyclesSection, this.state.isShowRing ? styles.showColor : styles.hideColor]}>
              <View style={[styles.outsideRingCyclesSection]}>
                <View style={styles.insideRingsContainerCyclesSection}>
                  <View style={[styles.insideRingCyclesSection, this.state.isShowRing ? styles.showRing : styles.hideRing]}></View>
                  <View style={[styles.insideRingWithOpacityCyclesSection ]}></View>
                  <View style={[styles.insideRingCyclesSection, this.state.isShowRing ? styles.showRing : styles.hideRing]}></View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.testSection}>
          <View style={styles.testContainerSection}>
            <TouchableOpacity
              style={styles.buttonTestSection}
              onPress={() => this.startButton()}
            >
              <Text>{this.state.isTestRunning ? 'STOP' : 'TEST'}</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <View>
              <LineChart
                  data={{
                    labels: ["0", "500", "1000", "1500", "2000", "2500", "3000", "3500", "4000"],
                    datasets: [
                      {
                        data: this.state.vibesList
                      }
                    ]
                  }}
                  withDots={false}
                  withInnerLines={false}
                  width={Dimensions.get("window").width} // from react-native
                  height={220}
                  // yAxisLabel={"a: "}
                  // yAxisSuffix={"m/s^2"}
                  chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: 'transparent',
                    backgroundGradientTo: 'transparent',
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `#117893`, // optional
                      fillShadowGradient: '#f5fcff',
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
                    borderRadius: 50
                  }}
                    /> 
          </View> 
        <View style={styles.statsSection}>
          <View style={styles.stressStatsSection}>
            <View style={styles.centerView}>
              <Image source={require('../assets/Stress.png')} style={styles.imageStressStatsSection} />
              <Text style={ styles.textStressStatsSection }>Stress : <Text style={{ color: '#fbb03b' }}>300</Text> </Text>
            </View>
            <View>
            </View>
          </View>
          <View style={styles.othersStatsSection}>
            <View style={ styles.iconsContainer }>
              { this.state.iconsStats.map(iconStat => {
                return (
                  <View style={styles.centerIcons}>
                    <Image source={ iconStat.path } style={ styles.imageIcon } />
                    <Text style={ styles.centerTextIcon }>{iconStat.name}: <Text>{iconStat.value}</Text></Text>
                  </View>
                )
              })}
              {/* <View style={styles.centerIcons}>
                <Image source={require('../assets/Vibes.png')} style={ styles.imageIcon } />
                <Text style={ styles.centerTextIcon }>VIBES: <Text>55</Text></Text>
              </View>
              <View style={styles.centerIcons}>
                <Image source={require('../assets/BPM.png')} style={ styles.imageIcon } />
                <Text style={ styles.centerTextIcon }>BPM: <Text>75</Text></Text>
              </View>
              <View style={styles.centerIcons}>
                <Image source={require('../assets/IR.png')} style={ styles.imageIcon } />
                <Text style={ styles.centerTextIcon }>IR: <Text>300</Text></Text>
              </View> */}
            </View>
          </View>
        </View>
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
        {/* </View> */}
      </ScrollView>
    )
  }

}
const mapStateToProps = (state) => {

  const { device, alreadyMounted, vibes} = state
  return { device, alreadyMounted, vibes}
};

const mapDispatchToProps = dispatch => {
  return {
    mounted: (name) => {
      // console.log(name)
      dispatch(addMounted(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
