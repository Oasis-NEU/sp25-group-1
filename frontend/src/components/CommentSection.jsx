import { useState, useEffect, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Context } from "../context/context";
import { toast } from "react-toastify";

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [displayedComments, setDisplayedComments] = useState([]);
    const [more, setMore] = useState(false);
    const [index, setIndex] = useState(10);
    const { backendUrl, token } = useContext(Context);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            console.log(postId);
            const response = await axios.post(`${backendUrl}/api/posts/getComments`, { "post_id": postId });
            console.log(response.data.comments);
            if (response.data.success) {
                setComments(response.data.comments);
                console.log(comments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const commentHandler = async () => {
        try {
            console.log(postId);
            const response = 
                await axios.post(`${backendUrl}/api/posts/makeComment`,
                     { "post_id": postId, "comment": comment },
                     { headers: { Authorization: `Bearer ${token}` } });
            console.log(response);
            if (response.success) {
                setComment("");
                fetchComments();
            }
        } catch (error) {
            toast.error(error);
            console.error("Could not make comment:", error);
        }
    }

    // Function to get the first 10 posts
    useEffect(() => {
        if (comments.length > 0) {
            const newComments = comments.slice(0, 10);
            setDisplayedComments(newComments);
            setMore(comments.length > 10);
        }
    }, [comments]);

    // Fetch the next posts based on index
    const fetchMoreComments = () => {
        if (index >= comments.length) {
            setMore(false);
            return;
        }

        const newComments = comments.slice(index, index + 10);
        setDisplayedComments(prev => [...prev, ...newComments]);
        setIndex(index + 10);

        if (index + 10 >= comments.length) {
            setMore(false);
        }
    }


    return (
        <div
            id="scrollableDiv"
            className="postTitleColor flex-10 w-full rounded-md flex flex-col p-[3%] overflow-y-scroll"
        >
            <div className="h-[10%] flex items-center justify-center bg-white rounded-md p-2 mb-[5%]">
                {token ? (
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={comment}
                            placeholder="Comment..."
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-grow border border-gray-300 rounded-md px-2 py-1 outline-none"
                        />
                        <button
                            onClick={commentHandler}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md"
                        >
                            Comment
                        </button>
                    </div>
                ) : (
                    <p className="text-black">Login to Comment</p>
                )}
            </div>
            <InfiniteScroll
                dataLength={displayedComments.length}
                next={fetchMoreComments}
                hasMore={more}
                scrollableTarget="scrollableDiv"
                loader={<h4>Loading...</h4>}
                endMessage={<p className="text-center mt-3 text-white mb-3"><b>No More Comments!</b></p>}
            >
                <div className="flex flex-col gap-2">
                    {displayedComments.map((comment) => (
                        <div key={comment.id} className="bg-gray-800 rounded-md p-[2%] flex gap-[3%] items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src={comment.profile_picture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Comment Content */}
                            <div>
                                <p className="text-white font-bold">{comment.username}</p>
                                <p className="text-gray-300 text-sm">{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default CommentSection;
