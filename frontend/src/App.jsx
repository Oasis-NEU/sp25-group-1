import {Routes, Route} from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';

const App = () => {
    return (
        <div className="w-full min-h-screen">
            <ToastContainer />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/post/:postId" element={<Post />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
    )
};

export default App;