import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableHighlight,
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
import styles from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome5';

class SettingsView extends React.Component {
    constructor(props) {
        super(props);
    }
  
    
    render() {
        
        return (
            <View style={{flex: 1, backgroundColor: '#fff' }}>
              <View style={styles.topBar}>
                <Text style={styles.heading}>Settings</Text>
                {/* <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() => {
                    this.setModalVisible(true);
                  }}
                >
                  <Icon name={'plus'} size={25} color="#fff" />
                </TouchableHighlight> */}
              </View>
              <View style={styles.hand3dContainer}>
                <Text style={{fontSize: 30}}>Coming soon..</Text>
              </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { device } = state
    // console.log(state)
    return { 
      device
     }
  };
  const mapDispatchToProps = dispatch => {
    return {
      add: (name) => {
        // console.log(name)
        dispatch(addDevice(name))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
