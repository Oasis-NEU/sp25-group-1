import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import axios from "axios";
import fields from "../assets/fields.js";

const CreatePost = () => {
    // Set states for post information to be created
    const [lookingFor, setLookingFor] = useState("Designer");
    const [skills, setSkills] = useState("");
    const [availability, setAvailability] = useState("");
    const [preferredExperience, setPreferredExperience] = useState("N/A");

    // Backend url and token to verify login
    const { backendUrl, token } = useContext(Context)
    // Create loading state for submit
    const [sendLoading, setSendLoading] = useState(false);

    // Check whether user is logged in
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!token) {
            toast.error("You must be logged in to find recommendations.");
            return;
        }

        // Set loader and try to call the create endpoint based on given infomation
        setSendLoading(true);
        try {
            // Set up multipart/form data
            const formData = new FormData();
            formData.append("looking_for", lookingFor);
            formData.append("availability", availability);
            formData.append("preferred_experience", preferredExperience);
            
            // Individually send the skills
            skills.split(",").filter(skill => skill.trim() !== "").forEach((skill) => formData.append("skills_used", skill));

            // Axios call to create post
            const response = await axios.post(`${backendUrl}/api/posts/createPost`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success("Successful Recommendation!");
                window.location.href = "/";
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setSendLoading(false);
        }
    }

    return (
        <div className="backgroundBlue w-screen h-screen flex items-center justify-center">
            <div className="navbarColor flex flex-col w-[50%] h-[50%] rounded-2xl p-[3%] items-center justify-center">
                <div className="postTitleColor w-1/3 rounded-md flex items-center justify-center px-[2%] mb-[5%] font-bold">
                    <p className="text-white text-[175%]">Find Partners</p>
                </div>
                    {/* Collect post information */}
                    <form onSubmit={onSubmitHandler} className="w-[95%] h-[95%] rounded-lg flex flex-col items-center gap-y-[5%]">
                        <div className="flex gap-x-[10%]">
                            {/* Looking For Input */}
                            <div className="flex flex-col items-center">
                                    <label className="text-white font-bold">Looking For:</label>
                                    <select
                                        value={lookingFor}
                                        onChange={(e) => setLookingFor(e.target.value)}
                                        className="bg-white rounded-lg p-2 w-[125%] outline-none"
                                        required
                                    >
                                        <option value="designer">Designer</option>
                                        <option value="programmer">Programmer</option>
                                    </select>
                            </div>
                            {/* Availability Input */}
                            <div className="flex flex-col items-center">
                            <label className="text-white font-bold">Availability:</label>
                                <select
                                    value={availability}
                                    onChange={(e) => setAvailability(e.target.value)}
                                    className="bg-white rounded-lg p-2 w-[125%] outline-none"
                                    required
                                >
                                {fields.availability.map((field, index) => (
                                    <option key={index} value={field}>
                                    {field}
                                    </option>
                                ))}
                                </select>
                            </div>
                            {/* Preferred Experience Input */}
                            <div className="flex flex-col items-center">
                                <label className="text-white font-bold">Experience:</label>
                                    <select
                                        value={preferredExperience}
                                        onChange={(e) => setPreferredExperience(e.target.value)}
                                        className="bg-white rounded-lg p-2 w-[125%] outline-none"
                                        required
                                    >           
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                            </div>
                        </div>
                        {/* Skills Input */}
                        <div className="flex flex-col items-center">
                                <label className="text-white font-bold">Skills Used:</label>
                                <input
                                    type="text"
                                    placeholder="Enter skills (comma separated)"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="bg-white rounded-lg p-2 w-[175%] outline-none"
                                    required
                                />
                        </div>

                        {/* Submit Button, lock when processing */}
                        <button
                            type="submit"
                            disabled={sendLoading}
                            className="postTitleColor rounded-lg mt-[5%] px-2 py-1 text-white text-sm cursor-pointer"
                        >
                            {sendLoading ? "Submitting..." : "Continue"}
                        </button>
                    </form>
            </div>
        </div>
    );
};

export default CreatePost;
