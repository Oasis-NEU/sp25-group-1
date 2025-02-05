import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

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

    const value = {posts, backendUrl, token, setToken};

    return(<Context.Provider value = {value}>
        {props.children}
    </Context.Provider>);
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ContextProvider;