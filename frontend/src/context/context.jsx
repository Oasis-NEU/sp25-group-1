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
                    const response = await axios.post(`${backendUrl}/api/user/getProfileInformation`, {
                        profileId: userId,
                    });
                    setUserInfo(response.data.profile)
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
                    toast.error("Session expired. Please log in again.");
                } else {
                    // Set a timeout to auto-remove token when it expires
                    const timeUntilExpiration = expirationTime - currentTime;
                    const expirationTimeout = setTimeout(() => {
                        localStorage.removeItem("token");
                        setToken('');
                        setUserInfo(undefined);
                        toast.error("Session expired. Please log in again.");
                    }, timeUntilExpiration);

                    return () => clearTimeout(expirationTimeout);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [token]);

    // "Export" all the values
    const value = { posts, backendUrl, token, setToken, userInfo };

    return (<Context.Provider value={value}>
        {props.children}
    </Context.Provider>);
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ContextProvider;