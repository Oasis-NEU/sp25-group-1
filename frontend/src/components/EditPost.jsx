import { useState, useContext, useEffect } from "react";
import { Context } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";
import fields from "../assets/fields.js";

const EditPost = ({post, setEditMode}) => {
    const { backendUrl, token } = useContext(Context);

    // Set states for post information to be edited
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [lookingFor, setLookingFor] = useState("none");
    const [skillsUsed, setSkillsUsed] = useState("");
    const [preferredExperience, setPreferredExperience] = useState("N/A");
    const [projectType, setProjectType] = useState("Other");

    // Create loading state for submit
    const [sendLoading, setSendLoading] = useState(false);

    useEffect(() => {
        if (!post) return;

        setTitle(post.title);
        setContent(post.content);
        setImages(post.images);
        setFiles(post.files);
        setLookingFor(post.looking_for);
        setSkillsUsed(post.skills_used.join(","));
        setPreferredExperience(post.preferred_experience);
        setProjectType(post.project_type);

    }, [post])

    // Check whether user is logged in
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!token) {
            toast.error("You must be logged in to edit a post.");
            return;
        }

        // Set loader and try to call the create endpoint based on given infomation
        setSendLoading(true);
        try {
            // Sets post type depending on content given
            const currentPostType = files.length !== 0 ? "programmer" : "designer";
            // Set up multipart/form data
            const formData = new FormData();
            formData.append("id", post._id);
            formData.append("title", title);
            formData.append("content", content);
            formData.append("looking_for", lookingFor);
            formData.append("post_type", currentPostType);
            formData.append("token", token);
            formData.append("preferred_experience", preferredExperience);
            formData.append("project_type", projectType);

            // Individually send the images and files
            images.forEach((image) => formData.append("images", image));
            console.log(files)
            files.forEach((file) => formData.append("files", file));
            skillsUsed.split(",").filter(skill => skill.trim() !== "").forEach((skill) => formData.append("skills_used", skill));

            // Axios call to create post
            const response = await axios.put(`${backendUrl}/api/posts/updatePost`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success("Post Updated Successfully!");
                window.location.href = `/post/${post._id}`;
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
        <div className="bg-transparent w-screen h-screen flex items-center justify-center">
            <div className="navbarColor flex w-[70%] h-[70%] rounded-2xl p-[3%] items-center justify-center">
                {/* Collect post information */}
                <form onSubmit={onSubmitHandler} className="w-[95%] h-[95%] rounded-lg flex flex-col items-center gap-y-[5%]">
                    {/* Title Input */}
                    <input
                        type="text"
                        placeholder="Title Of Post"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                        className="bg-white rounded-lg px-[2%] w-full h-[25%] outline-none"
                    />

                    {/* Description Input */}
                    <textarea
                        placeholder="Description of Post"
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        required
                        className="bg-white rounded-lg px-[2%] py-[1%] w-full h-full outline-none resize-none"
                    ></textarea>

                    {/* Looking For Input */}

                    <div className="flex flex-row justify-between w-full">
                        <div className="w-[50%] flex flex-col justify-evenly">
                            <div className="flex flex-col">
                                <label className="text-white font-bold">Looking For:</label>
                                <select
                                    value={lookingFor}
                                    onChange={(e) => setLookingFor(e.target.value)}
                                    className="bg-white rounded-lg p-2 w-[75%] outline-none"
                                    required
                                >
                                    <option value="none">None</option>
                                    <option value="designer">Designer</option>
                                    <option value="programmer">Programmer</option>
                                </select>
                            </div>

                            <div>
                                {/* Allow for image uploads + basic validation (HIDDEN) */}
                                <p className="text-white font-bold">Images:</p>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    multiple
                                    accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                    onChange={(e) => {
                                        const selectedFiles = Array.from(e.target.files);
                                        if (selectedFiles.length + images.length > 5) {
                                            alert(`You can only upload up to ${5 - images.length} images.`);
                                            e.target.value = "";
                                            return;
                                        }
                                        setImages((prevImages) => [...prevImages, ...selectedFiles]);
                                    }}
                                    className="hidden"
                                />

                                {/* Label for the image upload */}
                                <label
                                    htmlFor="imageUpload"
                                    className="p-1.5 border rounded-md cursor-pointer bg-white text-center inline-block"
                                >
                                    Choose up to 5 images (Optional)
                                </label>
                            </div>

                            <div>
                                {/* Allow for file uploads + basic validation (HIDDEN) */}
                                <p className="text-white font-bold">Code:</p>
                                <input
                                    id="codeUpload"
                                    type="file"
                                    multiple
                                    accept=".js,.jsx,.tsx,.ts,.py,.java,.cpp,.c,.cs,.html,.css,.json,.md,.php,.swift,.sql,.go,.rb,.kt,.rs,.sh"
                                    onChange={(e) => {
                                        const selectedFiles = Array.from(e.target.files);
                                        if (selectedFiles.length + files.length > 5) {
                                            alert(`You can only upload up to ${5 - files.length} files.`);
                                            e.target.value = "";
                                            return;
                                        }
                                        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
                                    }}
                                    className="hidden"
                                />

                                {/* Label for the image upload */}
                                <label
                                    htmlFor="codeUpload"
                                    className="p-1.5 border rounded-md cursor-pointer bg-white text-center inline-block"
                                >
                                    Choose up to 5 Code Files (Optional)
                                </label>
                            </div>
                        </div>

                        <div className="w-[50%] flex flex-col justify-evenly">
                            <div className="flex flex-col">
                                <label className="text-white font-bold">Preferred Experience:</label>
                                <select
                                    value={preferredExperience}
                                    onChange={(e) => setPreferredExperience(e.target.value)}
                                    className="bg-white rounded-lg p-2 w-full outline-none"
                                    required
                                >
                                    <option value="N/A">N/A</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white font-bold">Project Type:</label>
                                <select
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                    className="bg-white rounded-lg p-2 w-full outline-none"
                                    required
                                >
                                    {fields.projectType.map((field, index) => (
                                        <option key={index} value={field}>
                                            {field}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white font-bold">Skills Used:</label>
                                <input
                                    type="text"
                                    placeholder="Enter skills (comma separated)"
                                    value={skillsUsed}
                                    onChange={(e) => setSkillsUsed(e.target.value)}
                                    className="bg-white rounded-lg p-2 w-full outline-none"
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    {/* Submit Button, lock when processing */}
                    <div className="flex flex-row gap-x-[5%] w-[50%] items-center justify-center">
                        <button
                            type="submit"
                            disabled={sendLoading}
                            className="postTitleColor rounded-lg px-2 py-1 text-white text-sm cursor-pointer"
                        >
                            {sendLoading ? "Submitting..." : "Submit Edit"}
                        </button>
                        <button
                            className="bg-red-500 rounded-lg px-2 py-1 text-white text-sm cursor-pointer"
                            onClick={() => setEditMode(false)}
                        >
                            Cancel Edit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
