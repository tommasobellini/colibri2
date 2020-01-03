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
          ciao: true,
          dataX: [0],
          dataY: [0],
          dataZ: [0]
      };
    }
    componentDidMount() {
        const min = TOP_VIEW_MIN_AZ;
        const max = TOP_VIEW_MAX_AZ;
        const step = ((max-min)/2)/10;
        Toast.showLongTop("step is: " + step);

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
        const { isEnabled } = this.state

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
                </View>
            </SafeAreaView>
        )
    }
    
}
const mapStateToProps = (state) => {
    const { services } = state
    return { services }
  };
  
export default connect(mapStateToProps)(DashboardView);
