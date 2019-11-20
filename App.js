import React, { Component } from 'react';
import {
  View, Text
} from "react-native";
import TabBar from "./components/TabBar";
import BluetoothView from "./views/BluetoothView";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.events = null;
    this.state = {
    };
  }

  render() {
    return (
      <TabBar
        bgNavBar="#e91e63"
      >
            <TabBar.Item
                icon="home"
                selectedIcon="home"
                title="Home"
                screenBackgroundColor={{ backgroundColor: '#008080' }}
            >
              <View>
              </View>
            </TabBar.Item>
            <TabBar.Item
                icon="broadcast-tower"
                selectedIcon="broadcast-tower"
                title="Blue"
                screenBackgroundColor={{ backgroundColor: '#F08080' }}
            >
                  <BluetoothView/>
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
    );
  }
}

export default App;
