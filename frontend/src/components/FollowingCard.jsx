import { Context } from "../context/context";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Profile Sidecard showing followed users
const FollowingCard = () => {

    const { userId, token, backendUrl } = useContext(Context);
    const [followedUsers, setFollowedUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !userId) return;

        const fetchFollowingInfo = async () => {
            setLoadingUsers(true);
            try {
                const response = await axios.post(`${backendUrl}/api/user/getFollowingInfo`, { userId });
                setFollowedUsers(response.data.following || []);
            } catch (error) {
                console.error("Error fetching following:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchFollowingInfo();
    }, [token, backendUrl, userId])

    console.log(token) // Test

    // If the user is not logged in
    if (!userId || loadingUsers) {
        return (
            <div className="p-[9.5%] cursor-pointer shadow-md">
                <div className="navbarColor rounded-lg flex flex-col items-center">
                    <div className="text-white text-xl font-bold flex flex-col items-center justify-center">
                        <p className="mt-[10%] mb-[5%]">Following</p>
                    </div>
                    <p className="text-sm text-white mb-[5%]">${!userId ? "Not Logged In!": "Loading following..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-[9.5%] cursor-pointer">
            <div className="navbarColor rounded-lg flex flex-col items-center shadow-md h-[30vh]">
                <div className="text-white text-xl font-bold flex flex-col items-center justify-center">
                    <p className="mt-[10%] mb-[5%]">Following</p>
                </div>

                {followedUsers?.length > 0 ? (
                    <div className="flex flex-col w-full overflow-y-scroll">
                        {followedUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-indigo-500 cursor-pointer transition"
                                onClick={() => navigate(`/profile/${user.id}`)}
                            >
                                <img
                                    className="w-[15%] aspect-square rounded-full border border-white"
                                    src={user.profile_picture || "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg"}
                                    alt={`Profile picture`}
                                />
                                <p className="text-sm text-white font-semibold">{user.user_name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-white mb-[5%]">You're not following anyone yet.</p>
                )}
            </div>
        </div>
    );
};

export default FollowingCard;
