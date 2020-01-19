<template>
  <view class="container">
    <text class="text-color-primary">My Vue Native App</text>
    <app-navigator></app-navigator>
     <!-- <TabBar
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
          >
            <Hand3dView />
          </TabBar.Item>
          <TabBar.Item
            icon="sliders-h"
            selectedIcon="sliders-h"
            title="Settings"
          >
            <SettingsView/>
          </TabBar.Item>
        </TabBar> -->
  </view>
</template>

<script>
import {
  createAppContainer,
  createStackNavigator,
} from "vue-native-router";

import Dashboard from "./screens/DashboardScreen";
import Hand3d from "./screens/Hand3dScreen";
import Settings from "./screens/SettingsScreen";

const StackNavigator = createStackNavigator(
  {
    Dashboard: Dashboard,
    Hand3d: Hand3d,
    Settings: Settings,
  },
  {
    initialRouteName: 'Dashboard',
  }
);

const AppNavigator = createAppContainer(StackNavigator);

export default {
  components: { AppNavigator },
  data: function() {
    return {
    };
  }
};
</script>
<style>
.container {
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.text-container {
  color: blue;
  padding: 2;
  font-size: 22;
}
.text-input-container {
  width: 300;
  height: 40;
  font-size: 22;
  border-color: gray;
}
</style>