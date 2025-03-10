import { useContext, useState } from "react";
import { Context } from "../context/context";
import { toast } from "react-toastify";
import axios from "axios";

const DeleteButton = ({ postId, postAuthorId }) => {
    const { userId, token, backendUrl } = useContext(Context);
    const [confirm, setConfirm] = useState(false);

    const handleDelete = async () => {
        if (!userId || !token) {
            toast.error("You must be logged in to delete!");
            return;
        }

        if (userId !== postAuthorId) {
            toast.error("You must be the author of this post to delete!");
            return;
        }

        setConfirm(true);

    }

    const confirmDelete = async () => {
        setConfirm(false);
        try {
            const response = await axios.post(`${backendUrl}/api/posts/deletePost`, {
                post_Id: postId,
                token: token,
            });

            console.log(response)

            if (response.data.success) {
                window.location.href = "/"
                toast.success(response.data.message)
            }

        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete!");
        }
    };

    if (userId !== postAuthorId) {
        return <></>
    }

    return (
        <>
            <div
                className="inline-block w-fit px-3 py-0.5 bg-red-500 text-white font-bold rounded-lg text-sm cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
                onClick={handleDelete}
            >
                Delete
            </div>

            {/* Confirmation Modal */}
            {confirm && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white p-[5%] rounded-lg shadow-lg">
                        <p className="text-lg font-bold">Are you sure you want to delete this post?</p>
                        <div className="flex justify-between mt-[10%]">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                                onClick={() => setConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteButton;
