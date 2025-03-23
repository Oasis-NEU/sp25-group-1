import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"

import Home from './pages/Home';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Inbox from './pages/Inbox';
import SearchResults from './pages/SearchResults';
import EditProfile from './pages/EditProfile';
import UserResults from './pages/UserResults';
import Recommended from './pages/Recommended';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess.jsx';

const App = () => {
  const [loadingDone, setLoadingDone] = useState(false);
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false);

  useEffect(() => {
    const hasPlayed = localStorage.getItem('hasPlayedLoading');

    if (hasPlayed) {
      setLoadingDone(true);
      setHasPlayedBefore(true);
    } else {
      setLoadingDone(false);
    }
  }, []);

  const handleLoadingFinish = () => {
    localStorage.setItem('hasPlayedLoading', 'true');
    setLoadingDone(true);
    setHasPlayedBefore(true);
  };

  return (
    <div className="relative w-full">
      {/* Loading screen */}
      {!loadingDone && (
        <div className="fixed inset-0 z-50">
          <LoadingScreen onFinish={handleLoadingFinish} />
        </div>
      )}

      {/* Rest of app */}
      <div
        className={`${hasPlayedBefore ? "" : "transition-opacity duration-1000 ease-in"
          } ${loadingDone ? "opacity-100" : "opacity-0"}`}
      >
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
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/edit" element={<EditProfile />} />
            <Route path="/results" element={<UserResults />} />
            <Route path="/recommended" element={<Recommended />} />
            <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;