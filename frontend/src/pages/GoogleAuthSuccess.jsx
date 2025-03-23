import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../context/context";
import { toast } from "react-toastify";
import LoadingScreen from "./LoadingScreen";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(Context);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("Redirect URL:", window.location.href);
    console.log("Parsed token:", token);

    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
      toast.success("Logged in with Google!");

      setTimeout(() => {
        window.history.replaceState({}, document.title, "/");
        navigate("/");
      }, 100);
      
    } else {
      toast.error("Google login failed");
      navigate("/sign-in");
    }
  }, []);

  return <LoadingScreen />;
};

export default GoogleAuthSuccess;
