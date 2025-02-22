import { createContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { jwtDecode } from "jwt-decode";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(undefined);

  // Get all posts
  const getPosts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/posts/getAllPosts`);
      setPosts(response.data.documents || []);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Failed to fetch posts",
      });
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  // Set token from AsyncStorage if it exists
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };
    loadToken();
  }, []);

  // Fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken?.sub;
          const response = await axios.post(
            `${backendUrl}/api/user/getProfileInformation`,
            { profileId: userId }
          );
          setUserInfo(response.data.profile);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token]);

  // Auto-remove token when expired
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const expirationTime = decodedToken.exp * 1000;
          const currentTime = Date.now();

          if (currentTime >= expirationTime) {
            await AsyncStorage.removeItem("token");
            setToken("");
            setUserInfo(undefined);
            Toast.show({
              type: "error",
              text1: "Session expired. Please log in again.",
            });
          } else {
            const timeUntilExpiration = expirationTime - currentTime;
            setTimeout(async () => {
              await AsyncStorage.removeItem("token");
              setToken("");
              setUserInfo(undefined);
              Toast.show({
                type: "error",
                text1: "Session expired. Please log in again.",
              });
            }, timeUntilExpiration);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    checkTokenExpiration();
  }, [token]);

  const value = { posts, backendUrl, token, setToken, userInfo };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
