import { Context } from "../context/context"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Sidecard = () => {

  const { token, userInfo } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div className="p-[9.5%] cursor-pointer" onClick={() => navigate("/profile")}>
      <div className="navbarColor rounded-lg">
        <div className="text-white text-xl font-bold flex flex-col items-center justify-center">
          <p className="mt-[10%] mb-[5%]">{userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : "Guest User"}</p>
        </div>
        <div className="text-white text-sm font-bold flex flex-col items-center justify-center mb-[7%]">
          <p className="px-[10%] bg-blue-500 rounded-lg">{userInfo ? `${userInfo.role}` : "Guest User"}</p>
        </div>
        <div className="px-[25%] pb-[10%]">
          <img className="rounded-full border-2 border-blue-500" src={userInfo?.profile_picture || "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg"} alt="profile picture" />
        </div>
        <div className="text-white text-sm font-bold flex flex-col items-center justify-center rounded-b-lg bg-blue-500">
          <p>{userInfo ? `${userInfo.posts.length} posts` : "No Posts Yet"}</p>
        </div>
      </div>
    </div>
  )
}

export default Sidecard