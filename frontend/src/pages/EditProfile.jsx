import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import fields from "../assets/fields";

const EditProfile = () => {
    // Create Navigate Instance
    const navigate = useNavigate();


    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [role, setRole] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("Beginner");
    const [interests, setInterests] = useState("");
    const [availability, setAvailability] = useState("No Availability");
    const [colab, setColab] = useState("No");
    const [location, setLocation] = useState("");

    const { backendUrl, userInfo, userId } = useContext(Context);

    useEffect(() => {
        console.log(userInfo)
        setFirstName(userInfo.first_name);
        setLastName(userInfo.last_name);
        setBio(userInfo.bio);
        setRole(userInfo.role);
        setSkills(userInfo.skills.join(", "));
        setExperience(userInfo.experience_level);
        setInterests(userInfo.interests.join(", "))
        setAvailability(userInfo.availability);
        setColab(userInfo.looking_for_collab);
        setLocation(userInfo.location);
    }, [userInfo]);

    const onSubmitHandler = async (event) => {
        event.preventDefault(); // Prevent refresh
        try {
            const formattedSkills = skills
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill !== "");

            const formattedInterests = interests
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill !== "");

            console.log(experience);

            const response = await axios.post(`${backendUrl}/api/user/edit`, {
                user_id: userId,
                first_name,
                last_name,
                bio,
                role,
                skills: formattedSkills,
                experience_level: experience,
                interests: formattedInterests,
                availability,
                looking_for_collab: colab,
                location,
            });
            if (response.data.success) {
                toast.success("Successfully Edited Account!");
                navigate("/");
            } else {
                toast.error(response.data.error);
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

    if (!userInfo) {
        return (
            <div className="backgroundBlue flex items-center justify-center h-screen">
                <p className="text-white text-xl">Log in to edit profile!</p>
            </div>
        );
    }

    return (
        <div className="h-screen backgroundBlue flex items-center justify-center">
            <div className="w-[70%] h-[70%] navbarColor rounded-lg flex flex-col items-center justify-center">
                <form // Edit Account Functionality
                    onSubmit={onSubmitHandler}
                    className="w-[90%] h-[90%] bg-[#131E34] rounded-lg flex flex-col items-center"
                >
                    {/* Page Title */}
                    <div className="postTitleColor rounded-lg flex w-[50%] h-[10%] mt-[3%] justify-center items-center">
                        <p className="text-white text-xl font-bold">Edit Account</p>
                    </div>
                    {/* Names Input */}
                    <div className="flex flex-row w-[80%] h-[6%] mt-[3%] gap-x-3">
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

                    <div className="bg-white rounded-lg px-[1.5%] py-[1%] w-[80%] h-[15%] mt-[3%] outline-none overflow-auto">
                        <textarea
                            placeholder="Write about yourself ..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="bg-white w-full h-full outline-none resize-none"
                            required
                        />
                    </div>

                    <div className="bg-white rounded-lg px-[2%] w-[80%] h-[6%] mt-[3%] outline-none">
                        <input
                            type="text"
                            placeholder="Enter your skills (comma separated)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            className="bg-white rounded-lg w-full h-full outline-none"
                            required
                        />
                    </div>


                    <div className="bg-white rounded-lg px-[2%] w-[80%] h-[6%] mt-[2%] outline-none">
                        <input
                            type="text"
                            placeholder="Enter your interests (comma separated)"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            className="bg-white rounded-lg w-full h-full outline-none"
                            required
                        />
                    </div>

                    <div className="flex flex-row w-[80%] mt-[2%] items-center justify-between">
                        <div className="flex flex-col items-center">
                            <label className="text-white font-bold">Experience:</label>
                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="bg-white rounded-lg p-1 w-full outline-none"
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>


                        <div className="flex flex-col items-center">
                            <label className="text-white font-bold">Availability:</label>
                            <select
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                className="bg-white rounded-lg p-1 w-full outline-none"
                                required
                            >
                                {fields.availability.map((field, index) => (
                                    <option key={index} value={field}>
                                        {field}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col items-center">
                            <label className="text-white font-bold">Collaboration?:</label>
                            <select
                                value={colab}
                                onChange={(e) => setColab(e.target.value)}
                                className="bg-white rounded-lg p-1 w-full outline-none"
                                required
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Contact Me">Contact Me</option>
                            </select>
                        </div>

                        <div className="flex flex-col items-center">
                            <label className="text-white font-bold">Country:</label>
                            <input
                                type="text"
                                placeholder="Country"
                                onChange={(e) => setLocation(e.target.value)}
                                value={location}
                                required
                                className="bg-white rounded-lg py-0.5 outline-none px-2"
                            ></input>
                        </div>

                    </div>

                    {/* Role Input */}
                    <div className="flex flex-row w-[80%] mt-[3%] items-center text-white">
                        <p className="font-bold pr-5 underline underline-offset-8">
                            Select Role
                        </p>
                        <div className="flex flex-row gap-x-2">
                            {/* programmer option */}
                            <div
                                className={`px-3 py-1 rounded-lg cursor-pointer ${role === "programmer" ? "bg-indigo-500" : "bg-gray-500"
                                    }`}
                                onClick={() => setRole("programmer")}
                            >
                                Developer
                            </div>

                            {/* designer option */}
                            <div
                                className={`px-3 py-1 rounded-lg cursor-pointer ${role === "designer" ? "bg-indigo-500" : "bg-gray-500"
                                    }`}
                                onClick={() => setRole("designer")}
                            >
                                Designer
                            </div>
                        </div>
                    </div>

                    {/* Forgot Password/Submit/Login */}
                    <div className="flex flex-row justify-end w-[80%]">
                        <button
                            type="submit"
                            onClick={() => onSubmitHandler}
                            className="postTitleColor rounded-lg px-8 py-2 text-white text-sm cursor-pointer"
                        >
                            Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
