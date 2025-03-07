import { useContext, useState, useEffect } from "react";
import { Context } from "../context/context";

const FollowButton = ({ otherId }) => {
  const { token, follow, userInfo, userId } = useContext(Context)
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (userInfo?.following?.includes(otherId)) {
      setFollowing(true);
    }
  }, [userInfo, otherId]);

  const isSelf = userId === otherId;

  if (!token || isSelf) return null;

  const handleFollow = () => {
    follow(otherId);
    setFollowing((prev) => !prev);
  };

  return (
    <div
      className="w-full px-3 py-0.5 followColor text-white font-bold rounded-lg inline-flex items-center justify-center text-sm cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
      onClick={handleFollow}
    >
      {following ? "Unfollow" : "Follow"}
    </div>
  );
};

export default FollowButton;
