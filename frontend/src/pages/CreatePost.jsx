import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import axios from "axios";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [lookingFor, setLookingFor] = useState("programmer");
    const { backendUrl, token } = useContext(Context)
    const [sendLoading, setSendLoading] = useState(false);


    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!token) {
            toast.error("You must be logged in to create a post.");
            return;
        }

        setSendLoading(true);
        try {

            const currentPostType = files.length !== 0 ? "programmer" : "designer";

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("looking_for", lookingFor);
            formData.append("post_type", currentPostType);
            formData.append("token", token);
            images.forEach((image) => formData.append("images", image));
            files.forEach((file) => formData.append("files", file));

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
                toast.success("Successful Post!");
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
            <div className="navbarColor flex w-[70%] h-[70%] rounded-2xl p-[3%] items-center justify-center">
                <form onSubmit={onSubmitHandler} className="w-[95%] h-[95%] rounded-lg flex flex-col items-center gap-y-[5%]">
                    <input
                        type="text"
                        placeholder="Title Of Post"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                        className="bg-white rounded-lg px-[2%] w-full h-[15%] outline-none"
                    />

                    <textarea
                        placeholder="Description of Post"
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        required
                        className="bg-white rounded-lg px-[2%] py-[1%] w-full h-full outline-none resize-none"
                    ></textarea>

                    {/* Looking For Input */}
                    <div className="flex flex-row mt-[2%] items-center text-white">
                        <p className="font-bold pr-5 underline underline-offset-8">
                            Looking For:
                        </p>
                        <div className="flex flex-row gap-x-2">
                            {/* programmer option */}
                            <div
                                className={`px-3 py-1 rounded-lg cursor-pointer ${lookingFor === "programmer" ? "bg-blue-500" : "bg-gray-500"
                                    }`}
                                onClick={() => setLookingFor("programmer")}
                            >
                                Developer
                            </div>

                            {/* designer option */}
                            <div
                                className={`px-3 py-1 rounded-lg cursor-pointer ${lookingFor === "designer" ? "bg-blue-500" : "bg-gray-500"
                                    }`}
                                onClick={() => setLookingFor("designer")}
                            >
                                Designer
                            </div>
                        </div>
                    </div>

                    <div>
                        <input
                            id="imageUpload"
                            type="file"
                            multiple
                            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                            onChange={(e) => {
                                const selectedFiles = Array.from(e.target.files);
                                if (selectedFiles.length > 5) {
                                    alert("You can only upload up to 5 images.");
                                    e.target.value = "";
                                    return;
                                }
                                setImages(selectedFiles);
                            }}
                            className="hidden"
                        />

                        <label
                            htmlFor="imageUpload"
                            className="p-2 border rounded-md cursor-pointer bg-white text-center inline-block"
                        >
                            Choose up to 5 images (Optional)
                        </label>
                    </div>

                    <div>
                        <input
                            id="codeUpload"
                            type="file"
                            multiple
                            accept=".js,.jsx,.tsx,.ts,.py,.java,.cpp,.c,.cs,.html,.css,.json,.md,.php,.swift,.sql,.go,.rb,.kt,.rs,.sh"
                            onChange={(e) => {
                                const selectedFiles = Array.from(e.target.files);
                                if (selectedFiles.length > 5) {
                                    alert("You can only upload up to 5 files.");
                                    e.target.value = "";
                                    return;
                                }
                                setFiles(selectedFiles);
                            }}
                            className="hidden"
                        />

                        <label
                            htmlFor="codeUpload"
                            className="p-2 border rounded-md cursor-pointer bg-white text-center inline-block"
                        >
                            Choose up to 5 Code Files (Optional)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={sendLoading}
                        className="postTitleColor rounded-lg px-2 py-1 text-white text-sm cursor-pointer"
                    >
                        {sendLoading ? "Submitting..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
