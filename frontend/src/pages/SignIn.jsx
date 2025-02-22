import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import enterIcon from "../assets/enterIcon.png";

const SignIn = () => {
  // Create Navigate Instance
  const navigate = useNavigate();

  // States for sign-in page
  const [currentState, setCurrentState] = useState("SignIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_name, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [role, setRole] = useState("");

  const { token, setToken, backendUrl } = useContext(Context);

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent refresh
    try {
      // If state is sign-in, call login endpoint
      if (currentState === "SignIn") {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Successful Login!");
          navigate("/");
        } else {
          toast.error(response.data.error);
        }

        // If state is create, call create user endpoint
      } else if (currentState === "Create") {
        const response = await axios.post(`${backendUrl}/api/user/create`, {
          first_name,
          last_name,
          user_name,
          email,
          password,
          role,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Successfully Created Account!");
          navigate("/");
        } else {
          toast.error(response.data.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Do not allow user to login if their token exists
  /*
    useEffect(() => {
        if (token) {
          navigate("/");
        }
      },[token])
  */

  return (
    <div className="h-screen backgroundBlue flex items-center justify-center">
      <div className="w-[50%] h-[50%] navbarColor rounded-lg flex flex-col items-center justify-center">
        {/* Sign In Handler */}
        {currentState === "SignIn" ? (
          <form
            onSubmit={onSubmitHandler}
            className="w-[90%] h-[90%] bg-[#131E34] rounded-lg flex flex-col items-center"
          >
            <div className="postTitleColor rounded-lg flex w-[50%] h-[10%] mt-[10%] justify-center items-center">
              <p className="text-white text-xl">Sign In</p>
            </div>
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="bg-white rounded-lg px-[2%] w-[80%] h-[8%] mt-[5%] outline-none"
            ></input>
            {/* Password Input */}
            <div className="bg-white flex justify-between items-center rounded-lg px-[2%] w-[80%] h-[8%] mt-[2%] outline-none">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full outline-none"
              ></input>
              {/* Submit Button Inside the Password Field */}
              <button type="submit" className="cursor-pointer w-[7%]">
                <img src={enterIcon} alt="submit" className="w-full" />
              </button>
            </div>
            {/* Forgot Password/Switch State/Submit */}
            <div className="flex flex-row justify-between w-[80%] mt-[2%]">
              {/* Forgot Password */}
              <Link
                to="/forgot-password"
                className="postTitleColor rounded-lg px-2 py-1 text-white text-sm cursor-pointer"
              >
                Forgot Password?
              </Link>
              {/* Submit Button */}
              <button
                type="submit"
                onClick={() => onSubmitHandler}
                className="postTitleColor rounded-lg px-2 py-1 text-white text-sm cursor-pointer"
              >
                Continue
              </button>
            </div>
            {/* Switch to create account */}
            <div className="p-1.5 bg-blue-500 rounded-lg mt-[8%] cursor-pointer">
              <p
                className="text-white text-sm"
                onClick={() => setCurrentState("Create")}>
                New? Create your account
              </p>
            </div>
          </form>
        ) : (
          <form // Create Account Functionality
            onSubmit={onSubmitHandler}
            className="w-[90%] h-[90%] bg-[#131E34] rounded-lg flex flex-col items-center"
          >
            {/* Page Title */}
            <div className="postTitleColor rounded-lg flex w-[50%] h-[10%] mt-[3%] justify-center items-center">
              <p className="text-white text-xl">Create Account</p>
            </div>
            {/* Names Input */}
            <div className="flex flex-row w-[80%] h-[8%] mt-[3%] gap-x-3">
              <input
                type="name"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                value={first_name}
                required
                className="bg-white rounded-lg px-[2%] w-full h-full outline-none"
              ></input>

              <input
                type="name"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                value={last_name}
                required
                className="bg-white rounded-lg px-[2%] w-full h-full outline-none"
              ></input>
            </div>

            {/* Username Input */}
            <input
              type="name"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={user_name}
              required
              className="bg-white rounded-lg px-[2%] w-[80%] h-[8%] mt-[2%] outline-none"
            ></input>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="bg-white rounded-lg px-[2%] w-[80%] h-[8%] mt-[2%] outline-none"
            ></input>

            {/* Password Input */}
            <div className="bg-white flex justify-between items-center rounded-lg px-[2%] w-[80%] h-[8%] mt-[2%] outline-none">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full outline-none"
              ></input>
              <button type="submit" className="cursor-pointer w-[7%]">
                <img src={enterIcon} alt="submit" className="w-full" />
              </button>
            </div>

            {/* Role Input */}
            <div className="flex flex-row w-[80%] mt-[2%] items-center text-white">
              <p className="font-bold pr-5 underline underline-offset-8">
                Select Role
              </p>
              <div className="flex flex-row gap-x-2">
                {/* programmer option */}
                <div
                  className={`px-3 py-1 rounded-lg cursor-pointer ${role === "programmer" ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  onClick={() => setRole("programmer")}
                >
                  Developer
                </div>

                {/* designer option */}
                <div
                  className={`px-3 py-1 rounded-lg cursor-pointer ${role === "designer" ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  onClick={() => setRole("designer")}
                >
                  Designer
                </div>
              </div>
            </div>
            
            {/* Forgot Password/Submit/Login */}
            <div className="flex flex-row justify-between w-[80%] mt-[4%]">
              <Link
                to="/forgot-password"
                className="postTitleColor rounded-lg px-2 py-1 text-white text-sm cursor-pointer"
              >
                Forgot Password?
              </Link>

              <div className="px-2 py-1 bg-blue-500 rounded-lg cursor-pointer">
                <p
                  className="text-white text-sm"
                  onClick={() => setCurrentState("SignIn")}>
                  Already have an account? Sign in
                </p>
              </div>

              <button
                type="submit"
                onClick={() => onSubmitHandler}
                className="postTitleColor rounded-lg px-2 py-1 text-white text-sm cursor-pointer"
              >
                Continue
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
