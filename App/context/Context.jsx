import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import jwtDecode from "jwt-decode";
import PropTypes from "prop-types";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [trending, setTrending] = useState(false);

  const showToast = (type, text1, text2 = "") => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const getPosts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/posts/getAllPosts`);
      setPosts(response.data.documents || []);
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to fetch posts");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      if (!token) {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
        }
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken?.sub;
          setUserId(userId);
          const response = await axios.post(`${backendUrl}/api/user/getProfileInformation`, {
            profileId: userId,
          });
          setUserInfo(response.data.profile);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    const manageTokenExpiration = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const expirationTime = decodedToken.exp * 1000;
          const currentTime = Date.now();

          if (currentTime >= expirationTime) {
            await AsyncStorage.removeItem("token");
            setToken("");
            setUserInfo(undefined);
            setUserId(undefined);
            showToast("error", "Session expired", "Please log in again.");
          } else {
            const timeUntilExpiration = expirationTime - currentTime;
            const timeoutId = setTimeout(async () => {
              await AsyncStorage.removeItem("token");
              setToken("");
              setUserInfo(undefined);
              setUserId(undefined);
              showToast("error", "Session expired", "Please log in again.");
            }, timeUntilExpiration);

            return () => clearTimeout(timeoutId);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    manageTokenExpiration();
  }, [token]);

  const updatePostReaction = async (postId, reactionType) => {
    if (!userId) {
      showToast("error", "Login required", "You must be logged in to react.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/posts/react`, {
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType,
      });

      return response.data.likes;
    } catch (error) {
      console.error("Error updating post reaction:", error);
      showToast("error", "Failed to update reaction.");
    }
  };

  const favorite = async (postId) => {
    if (!userId) {
      showToast("error", "Login required", "You must be logged in to favorite!");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/posts/favoritePost`, {
        postId,
        userId,
      });

      if (response.data.success) {
        showToast("success", response.data.message);
      }
    } catch (error) {
      console.error("Error favoriting post:", error);
      showToast("error", "Failed to update reaction.");
    }
  };

  const createChat = async (otherId) => {
    if (!userId) {
      showToast("error", "Login required", "You must be logged in to message!");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/chat/createChat`, {
        user1_id: userId,
        user2_id: otherId,
      });

      console.log(response);
    } catch (error) {
      console.error("Error creating chat:", error);
      showToast("error", "Error creating chat!");
    }
  };

  const follow = async (otherId) => {
    if (!token) {
      showToast("error", "Login required", "You must be logged in to follow!");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/follow`, {
        target_id: otherId,
        token,
      });

      if (response.data.success) {
        showToast("success", response.data.message);
      } else {
        showToast("error", response.data.error || "Follow failed.");
      }
    } catch (error) {
      console.error("Error following:", error);
      showToast("error", "Error while following user.");
    }
  };

  const value = {
    posts,
    backendUrl,
    token,
    setToken,
    userInfo,
    userId,
    updatePostReaction,
    favorite,
    follow,
    createChat,
    trending,
    setTrending,
    setPosts,
    getPosts,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
