import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text } from "react-native";
import tw, { useDeviceContext } from "twrnc";
import Toast from "react-native-toast-message";

import Home from "./screens/Home";
import ContextProvider from "./context/Context";
import CreatePost from "./screens/CreatePost";
import SignIn from "./screens/SignIn";

// Initialize Drawer Navigator
const Drawer = createDrawerNavigator();

const Profile = () => (
  <View style={tw`flex-1 items-center justify-center bg-gray-900`}>
    <Text style={tw`text-white text-lg`}>Profile Screen</Text>
  </View>
);

const App = () => {
  useDeviceContext(tw);

  return (
    <ContextProvider>
      <NavigationContainer>
        <View style={tw`flex-1 bg-blue-500`}>
          <Drawer.Navigator
            screenOptions={{
              headerStyle: tw`bg-blue-500`,
              headerTintColor: "white",
              drawerStyle: tw`bg-gray-800`,
              drawerLabelStyle: tw`text-white`,
              drawerActiveTintColor: "black",
              drawerItemStyle: tw`rounded-md px-3 py-2`,
            }}
          >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="CreatePost" component={CreatePost} />
            <Drawer.Screen name="SignIn" component={SignIn} />
          </Drawer.Navigator>
          <Toast />
        </View>
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
