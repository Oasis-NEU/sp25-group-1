import { Context } from "../context/context"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const RightSideCard = () => {
  const { token, user } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div className="pt-[9.5%] px-[30%]">
      <div className="navbarColor rounded-lg flex flex-col items-center gap-y-4">
        <div onClick={() => navigate("/sign-in")} className="bg-blue-500 rounded-lg w-[50%] h-[50%] mt-[15%]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" alt="" />
        </div>
        <div className="bg-blue-500 rounded-lg w-[50%] h-[50%]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" alt="" />
        </div>
        <div className="bg-blue-500 rounded-lg w-[50%] h-[50%]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" alt="" />
        </div>
        <div className="bg-blue-500 rounded-lg w-[50%] h-[50%] mb-[15%]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default RightSideCard