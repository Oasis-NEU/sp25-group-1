import PostMainPage from "../components/PostMainPage";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Context } from "../context/context";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { userId } = useParams();
  const { backendUrl } = useContext(Context);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch profile information
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoadingProfile(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/getProfileInformation`, {
          profileId: userId
        });
        setProfile(response.data.profile);
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Fetch posts only after profile has been loaded
  useEffect(() => {
    if (!profile || posts.length > 0) return;
    const fetchProfilePosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await axios.post(`${backendUrl}/api/posts/getPostsByUser`, {
          userId
        });
        setPosts(response.data.documents);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProfilePosts();
  }, [loadingProfile]);

  // If profile is still loading, show a loader
  if (loadingProfile) {
    return (
      <div className="backgroundBlue flex items-center justify-center h-screen">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  // If the profile does not exist, show an error message
  if (!profile) {
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

  console.log(posts)

  return (
    <div className="max-h-screen backgroundBlue flex justify-center p-[2%]">
      <div className="flex flex-col w-[20%] gap-[5vh]">
        <div className="navbarColor w-full min-h-[35vh] flex flex-col justify-between rounded-t-lg rounded-b-xl">
          <div className="text-white text-xl font-bold flex flex-col items-center justify-center pt-[5%]">
            <p className="">{profile ? `${profile.first_name} ${profile.last_name}` : "Guest User"}</p>
          </div>
          <div className="text-white text-sm font-bold flex flex-col items-center justify-center">
            <p className="px-[10%] bg-indigo-500 rounded-lg">{profile ? `${profile.role}` : "Guest User"}</p>
          </div>
          <div className="flex items-center justify-center">
            <img
              className="rounded-full border-2 border-indigo-500 w-[40%] object-cover"
              src={profile?.profile_picture || "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg"}
              alt="profile picture"
            />
          </div>

          <div>
            <div className="text-white text-sm font-bold flex flex-col items-center justify-center bg-indigo-500 cursor-pointer">
              <p>{profile.user_name}</p>
            </div>

            <div className="text-white text-sm font-bold flex flex-col items-center justify-center bg-indigo-500 cursor-pointer">
              <p>{profile.email}</p>
            </div>

            <div className="text-white text-sm font-bold flex flex-col items-center justify-center bg-indigo-500 cursor-pointer mt-[5%] rounded-b-lg">
              <p>Message Me</p>
            </div>
          </div>
        </div>

        <div className="w-full overflow-y-auto">

          <div className="flex flex-row items-center gap-[5%] pb-[5%]">
            <p className="font-bold text-indigo-500">Bio</p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex flex-wrap gap-2 pb-[5%]">
            <div className="text-white text-sm">
              {profile.bio}
            </div>
          </div>

          <div className="flex flex-row items-center gap-[5%] pb-[5%]">
            <p className="font-bold text-indigo-500">Location</p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex flex-wrap gap-2 pb-[5%]">
            <div className="px-3 py-1 bg-black text-white rounded-full text-sm">
              {profile.location}
            </div>
          </div>

          <div className="flex flex-row items-center gap-[5%] pb-[5%]">
            <p className="font-bold text-indigo-500">Availability</p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex flex-wrap gap-2 pb-[5%]">
            <div className="px-3 py-1 bg-black text-white rounded-full text-sm">
              {profile.availability}
            </div>
          </div>

          <div className="flex flex-row items-center gap-[5%] pb-[5%]">
            <p className="font-bold text-indigo-500">Open to Collaboration?</p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex flex-wrap gap-2 pb-[5%]">
            <div className="px-3 py-1 bg-black text-white rounded-full text-sm">
              {profile.looking_for_collab}
            </div>
          </div>

          <div className="flex flex-row items-center gap-[5%] pb-[5%]">
            <p className="font-bold text-indigo-500">Skills</p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex flex-wrap gap-2 pb-[5%]">
            {profile.skills.slice(0, 10).filter((skill) => skill !== "").map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-black text-white rounded-full text-sm"
              >
                {skill}
              </div>
            ))}
          </div>

          <div className="flex flex-row items-center gap-[5%] pb-[5%]">
            <p className="font-bold text-indigo-500">Interests</p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 10).filter((skill) => skill !== "").map((interest, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-black text-white rounded-full text-sm"
              >
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[80%] h-[80vh] pl-[2%] overflow-y-auto grid grid-cols-4 auto-rows-[25vh] gap-x-[1vh] gap-y-[1vh]">
        {posts.length === 0 ? (
          <p className="text-white text-lg">No Posts</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-[5%] cursor-pointer flex flex-col"
              onClick={() => navigate(`/post/${post._id}`)}
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
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
