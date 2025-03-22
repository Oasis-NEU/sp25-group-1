import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import tw, { useDeviceContext } from "twrnc";
import Toast from "react-native-toast-message";

import Home from "./screens/Home";
import ContextProvider from "./context/Context";
import CreatePost from "./screens/CreatePost";
import SignIn from "./screens/SignIn";
import Post from "./screens/Post";
import ProfileScreen from "./screens/Profile";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animationDuration: 100}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen 
      name="Post" 
      component={Post}
      options={{
        animation: "slide_from_right",
        animationDuration: 10,
      }}/>
  </Stack.Navigator>
);

const App = () => {
  useDeviceContext(tw);

  return (
    <ContextProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            headerStyle: tw`bg-[#334871]`,
            headerTintColor: "white",
            drawerStyle: tw`bg-[#334871]`,
            drawerLabelStyle: tw`text-white`,
            drawerActiveTintColor: "black",
            drawerItemStyle: tw`rounded-md px-3 py-2`,
          }}
        >
          <Drawer.Screen name="Home" component={HomeStack} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="CreatePost" component={CreatePost} />
          <Drawer.Screen name="SignIn" component={SignIn} />
        </Drawer.Navigator>
        <Toast />
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
