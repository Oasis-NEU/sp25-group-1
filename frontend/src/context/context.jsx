import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export const Context = createContext();

const ContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend url from env
    const [posts, setPosts] = useState([]); // all posts
    const [token, setToken] = useState(''); // current login token
    const [userInfo, setUserInfo] = useState(undefined); // current user info
    const [userId, setUserId] = useState(undefined); // current userId

    // Gets all posts using the getAllPosts endpoint
    const getPosts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/posts/getAllPosts`);
            setPosts(response.data.documents || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch posts");
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    // Set the token if it exists
    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }, [])

    // Fetch this user details
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken?.sub;
                    setUserId(userId)
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

    // Auto Remove Token when expired
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp * 1000;
                const currentTime = Date.now();

                if (currentTime >= expirationTime) {
                    localStorage.removeItem("token");
                    setToken('');
                    setUserInfo(undefined);
                    setUserId(undefined);
                    toast.error("Session expired. Please log in again.");
                } else {
                    // Set a timeout to auto-remove token when it expires
                    const timeUntilExpiration = expirationTime - currentTime;
                    const expirationTimeout = setTimeout(() => {
                        localStorage.removeItem("token");
                        setToken('');
                        setUserInfo(undefined);
                        setUserId(undefined);
                        toast.error("Session expired. Please log in again.");
                    }, timeUntilExpiration);

                    return () => clearTimeout(expirationTimeout);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [token]);

    const updatePostReaction = async (postId, reactionType) => {
        if (!userId) {
            toast.error("You must be logged in to react to a post.");
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/posts/react`, {
                post_id: postId,
                user_id: userId,
                reaction_type: reactionType,
            });

            return response.data.likes
            
        } catch (error) {
            console.error("Error updating post reaction:", error);
            toast.error("Failed to update reaction.");
        }
    };

    const favorite = async (postId) => {
        if (!userId) {
            toast.error("You must be logged in to favorite!");
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/posts/favoritePost`, {
                postId: postId,
                userId: userId,
            });

            console.log(response)

            if (response.data.success) {
                toast.success(response.data.message)
            }
            
        } catch (error) {
            console.error("Error updating post reaction:", error);
            toast.error("Failed to update reaction.");
        }
    };


    // "Export" all the values
    const value = { posts, backendUrl, token, setToken, userInfo, userId, updatePostReaction, favorite};

    return (<Context.Provider value={value}>
        {props.children}
    </Context.Provider>);
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ContextProvider;