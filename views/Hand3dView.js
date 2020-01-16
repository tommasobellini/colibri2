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
  Animated, Easing
} from "react-native";
import Toast from "@remobile/react-native-toast";
import { connect } from 'react-redux';
import { addMounted } from '../store/actions/BleActions';
import { addDevice } from '../store/actions/BleActions';

class Hand3dView extends React.Component {
    constructor(props) {
        super(props);
    }
  
    
    render() {
        
        return (
            <View style={{flex: 1, backgroundColor: '#000000' }}>
            </View>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Hand3dView);
