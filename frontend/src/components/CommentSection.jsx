import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const CommentSection = () => {
    const [comments, setComments] = useState(
        Array.from({ length: 10 }, (_, index) => ({
            id: `comment ${index + 1}`,
            user: `User ${index + 1}`,
            text: `Comment ${index + 1}`,
        }))
    );

    const fetchMoreComments = () => {
        const newComments = Array.from({ length: 10 }, (_, index) => ({
            id: `comment-${comments.length + index + 1}`,
            user: `User ${comments.length + index + 1}`,
            text: `Comment ${comments.length + index + 1}`,
        }));

        setComments((prev) => [...prev, ...newComments]);
    };

    return (
        <div
            id="scrollableDiv"
            className="postTitleColor flex-10 w-full rounded-md flex flex-col p-[3%] overflow-y-scroll"
        >
            <InfiniteScroll
                dataLength={comments.length}
                next={fetchMoreComments}
                hasMore={true}
                scrollableTarget="scrollableDiv"
                loader={<h4>Loading...</h4>}
                endMessage={<p className="text-center mt-3 text-white mb-3"><b>No More Comments!</b></p>}
            >
                <div className="flex flex-col gap-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-800 rounded-md p-[2%] flex gap-[3%] items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Comment Content */}
                            <div>
                                <p className="text-white font-bold">{comment.user}</p>
                                <p className="text-gray-300 text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default CommentSection;
