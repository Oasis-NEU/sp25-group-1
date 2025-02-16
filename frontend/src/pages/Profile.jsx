import PostMainPage from "../components/PostMainPage"
import { useContext, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Context } from "../context/context"
import { useNavigate } from "react-router-dom"

const Profile = () => {

    const { posts } = useContext(Context);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [more, setMore] = useState(false);
    const [index, setIndex] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        if (posts.length > 0) {
            const newPosts = posts.slice(0, 10);
            setDisplayedPosts(newPosts);
            setMore(posts.length > 10);
        }
    }, [posts]);

    const fetchMorePosts = () => {
        if (index >= posts.length) {
            setMore(false);
            return;
        }

        const newPosts = posts.slice(index, index + 10);
        setDisplayedPosts([...displayedPosts, ...newPosts]);
        setIndex(index + 10);

        if (index + 10 >= posts.length) {
            setMore(false);
        }
    }

    return (
        <div className="min-h-screen backgroundBlue flex justify-center">
            <div className="navbarColor rounded-lg w-[60%] mt-[2%] mb-[2%]">
                <div className="w-full flex">
                    <div className="px-[5%] w-[30%] mt-[3%]">
                        <img className="rounded-full border-2 border-blue-500" src="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" alt="profile picture" />
                    </div>
                    <div className="w-[65%] mt-[8%] flex-col">
                        <div className="w-[80%] h-10 bg-white items-center rounded-lg justify-end text-[160%]">
                            <p className="flex justify-center">UserName</p>
                        </div>
                        <div className="flex">
                            <div className="mt-[6%] w-[45%] h-[15%] items-center bg-white rounded-lg justify-end text-[87.5%]">
                                <p className="flex justify-center">FullName</p>
                            </div>
                            <div className="ml-[10%] mt-[6%] w-[45%] h-[15%] items-center bg-white rounded-lg justify-end text-[87.5%]">
                                <p className="flex justify-center">Email (Contact)</p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mt-[1.5%] w-[45%] h-[15%] items-center bg-white rounded-lg justify-end text-[87.5%]">
                                <p className="flex justify-center">Role</p>
                            </div>
                            <div className="ml-[10%] mt-[1.5%] w-[45%] h-[15%] items-center bg-white rounded-lg justify-end text-[87.5%]">
                                <p className="flex justify-center">Other (Contact)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-[5%] w-full flex">
                    <div className="mt-[1.5%] h-[80%] w-[65%] items-center bg-white rounded-lg text-[215%]">
                        <p className="flex justify-center">Posts</p>
                    </div>
                    <div className="ml-[3%] mt-[5.5%] h-[30%] w-[22%] cursor-pointer items-center bg-white rounded-lg text-[87.5%]">
                        <p className="flex justify-center">Favorite</p>
                    </div>
                </div>
                <div className="navbarColor rounded-2xl w-[90%] ml-[5%] flex flex-col overflow-y-auto">
                    <InfiniteScroll dataLength={displayedPosts.length} next={fetchMorePosts} hasMore={more} loader={<h4>Loading...</h4>} endMessage={<p className="text-center mt-3 text-white mb-3"><b>No More Posts!</b></p>}>
                        {displayedPosts.map((post, index) => (
                            <div className="w-full flex justify-center min-h-[50vh] cursor-pointer" key={index} onClick={() => navigate(`/post/${post._id}`)}>
                                <PostMainPage title={post.title} image={post.images?.[0]} />
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};

export default Profile;
