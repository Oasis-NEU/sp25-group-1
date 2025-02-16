import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export const Context = createContext();


const ContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [posts, setPosts] = useState([]);
    const [token, setToken] = useState('');
    const [userInfo, setUserInfo] = useState(undefined);

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

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }, [])

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

    const value = { posts, backendUrl, token, setToken, userInfo };

    return (<Context.Provider value={value}>
        {props.children}
    </Context.Provider>);
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ContextProvider;