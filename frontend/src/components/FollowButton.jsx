import { useContext } from "react";
import { Context } from "../context/context";

const FollowButton = ({ otherId }) => {
    const { token, follow } = useContext(Context)

    if (!token) return null;
  
    return (
      <div
        className="w-full px-3 py-0.5 followColor text-white font-bold rounded-lg inline-flex items-center justify-center text-sm cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
        onClick={() => follow(otherId)}
      >
        Follow
      </div>
    );
  };
  
  export default FollowButton;
  