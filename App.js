import React, { Component } from 'react';
import {
  View, Text
} from "react-native";
import TabBar from "./components/TabBar";
import BluetoothView from "./views/BluetoothView";
import DashboardView from "./views/DashboardView";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from './store/index'

const store = configureStore()

class App extends React.Component {
  constructor(props) {
    super(props);
    this.events = null;
    this.state = {
    };
  }

  render() {
    return (
      <Provider store={store}>
        <TabBar
          bgNavBar="#e91e63"
        >
          <TabBar.Item
            icon="home"
            selectedIcon="home"
            title="Home"
          >
            <DashboardView />
          </TabBar.Item>
          <TabBar.Item
            icon="broadcast-tower"
            selectedIcon="broadcast-tower"
            title="Blue"
            screenBackgroundColor={{ backgroundColor: '#F08080' }}
          >
            <BluetoothView />
          </TabBar.Item>
          <TabBar.Item
            icon="sliders-h"
            selectedIcon="sliders-h"
            title="Settings"
            screenBackgroundColor={{ backgroundColor: '#485d72' }}
          >
            <View>
              {/*Page Content*/}
            </View>
          </TabBar.Item>
        </TabBar>
      </Provider>
    );
  }
}

export default App;
