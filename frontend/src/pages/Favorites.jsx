import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Favorites = () => {
  const { backendUrl, userId, userInfo } = useContext(Context);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);


  // Fetch favorite posts
  useEffect(() => {
    if (!userInfo) return;

    const fetchProfilePosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/getUserFavorites`, {
          userId
        });
        setPosts(response.data.favorites || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProfilePosts();
  }, [userInfo, backendUrl]);


  // If the profile does not exist, show an error message
  if (!userInfo) {
    return (
      <div className="backgroundBlue flex items-center justify-center h-screen">
        <p className="text-white text-xl">Profile not found</p>
      </div>
    );
  }

  // If posts are still loading after profile is loaded, show a loader
  if (loadingPosts) {
    return (
      <div className="backgroundBlue flex items-center justify-center h-screen">
        <p className="text-white text-xl">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="max-h-screen backgroundBlue flex justify-center overflow-y-scroll p-[2%]">
      {posts.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-white text-2xl rounded-lg">No posts saved to favorite!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="postTitleColor w-1/3 rounded-md flex items-center justify-center px-[2%] font-bold">
            <p className="text-white text-[175%]">Favorites</p>
          </div>
          <div className="w-full h-full grid grid-cols-5 auto-rows-[25vh] gap-x-[1vh] gap-y-[1vh] mt-[5%] pb-[10%]">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-[5%] cursor-pointer flex flex-col transition:transform duration-100 hover:scale-101"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {/* Post Image */}
                <img
                  src={post.images[0]}
                  alt="Post Image"
                  className="w-full h-[80%] object-cover rounded-md"
                />

                {/* Post Title */}
                <h3 className="text-lg font-bold text-center mt-2 text-gray-800 truncate">
                  {post.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
