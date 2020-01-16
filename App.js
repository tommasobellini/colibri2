import React, { Component } from 'react';
import {
  View, Text
} from "react-native";
import TabBar from "./components/TabBar";
import DashboardView from "./views/DashboardView";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from './store/index'
import Hand3dView from './views/Hand3dView';

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
          bgNavBar="#4ec5a5"
        >
          <TabBar.Item
            icon="home"
            selectedIcon="home"
            title="Home"
          >
            <DashboardView />
          </TabBar.Item>
          <TabBar.Item
            icon="hand-paper"
            selectedIcon="hand-paper"
            title="Blue"
            screenBackgroundColor={{ backgroundColor: '#F08080' }}
          >
            <Hand3dView />
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
// pantone - aquamarine --> 4ec5a5
// pantone - blue --> 34558b
// pantone - blue light --> 798fa8
// pantone - orange --> fd823e
// pantone - blue marine --> 117893
export default App;
