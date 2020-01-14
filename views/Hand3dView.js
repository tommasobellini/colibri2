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
import ModelView from 'react-native-3d-model-view'

class Hand3dView extends React.Component {
    constructor(props) {
        super(props);
    }
  
    
    render() {
        
        return (
            <View style={{flex: 1, backgroundColor: '#000000' }}>
                <ModelView
                    source={{
                        model: 'https://github.com/BonnierNews/react-native-3d-model-view/blob/master/example/obj/Hamburger.obj?raw=true',
                        texture: 'https://github.com/BonnierNews/react-native-3d-model-view/blob/master/example/obj/Hamburger.png?raw=true'
                    }}
                    onLoadModelStart={this.onLoadModelStart}
                    onLoadModelSuccess={this.onLoadModelSuccess}
                    onLoadModelError={this.onLoadModelError} />
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
