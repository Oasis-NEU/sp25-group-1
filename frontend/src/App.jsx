import {Routes, Route} from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Inbox from './pages/Inbox';
import Recommended from './pages/Recommended';

const App = () => {
    return (
        <div className="w-full min-h-screen backgroundBlue">
            <ToastContainer />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/post/:postId" element={<Post />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/recommended" element={<Recommended />} />
            </Routes>
        </div>
    )
};

export default App;