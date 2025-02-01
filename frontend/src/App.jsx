import {Routes, Route} from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from './pages/Home';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <div className="w-full min-h-screen">
            <ToastContainer />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    )
};

export default App;