import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import tw from "twrnc";
import React, { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../context/Context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  // States for sign-in page
  const [currentState, setCurrentState] = useState("SignIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_name, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [role, setRole] = useState("");

  const { token, setToken, backendUrl } = useContext(Context);
  const navigation = useNavigation();

  const onSubmitHandler = async () => {
    try {
      if (currentState === "SignIn") {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          AsyncStorage.setItem("token", response.data.token);
          alert("Successful Login!");
          navigation.navigate("Home");
        } else {
          alert(response.data.error);
        }
      } else if (currentState === "Create") {
        const response = await axios.post(`${backendUrl}/api/user/create`, {
          first_name,
          last_name,
          user_name,
          email,
          password,
          role,
        });
        if (response.data.success) {
          setToken(response.data.token);
          AsyncStorage.setItem("token", response.data.token);
          alert("Successfully Created Account!");
          navigation.navigate("Home");
        } else {
          alert(response.data.error);
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-gray-900`}
    >
      <ScrollView
        contentContainerStyle={tw`flex-1 items-center mt-6`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`bg-gray-800 p-6 rounded-lg w-[90%] max-w-[90%] max-h-[60%]`}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={tw`text-white text-2xl font-bold text-center`}>
              {currentState === "SignIn" ? "Sign In" : "Create Account"}
            </Text>

            {currentState === "Create" && (
              <>
                <View style={tw`flex flex-row justify-between gap-4 mt-2`}>
                  {/* First Name */}
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white mb-2`}>First Name</Text>
                    <TextInput
                      style={tw`bg-gray-700 text-white p-2 rounded-lg`}
                      placeholder="First Name"
                      placeholderTextColor="gray"
                      value={first_name}
                      onChangeText={setFirstName}
                    />
                  </View>

                  {/* Last Name */}
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white mb-2`}>Last Name</Text>
                    <TextInput
                      style={tw`bg-gray-700 text-white p-2 rounded-lg`}
                      placeholder="Last Name"
                      placeholderTextColor="gray"
                      value={last_name}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>

                <Text style={tw`text-white mt-4 mb-2`}>Username</Text>
                <TextInput
                  style={tw`bg-gray-700 text-white p-2 rounded-lg`}
                  placeholder="Username"
                  placeholderTextColor="gray"
                  value={user_name}
                  onChangeText={setUsername}
                />

                {/* Role */}
                <Text style={tw`text-white mt-4 mb-2`}>You are a ...</Text>
                <View style={tw`flex-row gap-2`}>
                  <TouchableOpacity
                    style={tw`px-3 py-1.5 rounded-lg ${role === "programmer" ? "bg-indigo-500" : "bg-gray-500"
                      }`}
                    onPress={() => setRole("programmer")}
                  >
                    <Text style={tw`text-white text-xs`}>Programmer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`px-3 py-1.5 rounded-lg ${role === "designer" ? "bg-indigo-500" : "bg-gray-500"
                      }`}
                    onPress={() => setRole("designer")}
                  >
                    <Text style={tw`text-white text-xs`}>Designer</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Text style={tw`text-white mt-4 mb-2`}>Email</Text>
            <TextInput
              style={tw`bg-gray-700 text-white p-2 rounded-lg`}
              placeholder="Email"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={tw`text-white mt-4 mb-2`}>Password</Text>
            <TextInput
              style={tw`bg-gray-700 text-white p-2 rounded-lg`}
              placeholder="Password"
              placeholderTextColor="gray"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={tw`bg-indigo-500 p-2 mt-4 rounded-lg items-center`}
              onPress={onSubmitHandler}
            >
              <Text style={tw`text-white`}>
                {currentState === "SignIn" ? "Sign In" : "Create Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentState(currentState === "SignIn" ? "Create" : "SignIn")}
            >
              <Text style={tw`text-blue-400 text-center mt-3`}>
                {currentState === "SignIn" ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;