import { Context } from "../context/context"
import { useContext } from "react";

const Sidecard = () => {

  const { token, user } = useContext(Context);

  return (
    <div className="p-[9.5%]">
      <div className="navbarColor rounded-lg">
        <div className="text-white text-xl font-bold flex flex-col items-center justify-center">
          <p className="mt-[10%] mb-[5%]">First Last</p>
        </div>
        <div className="text-white text-sm font-bold flex flex-col items-center justify-center mb-[7%]">
          <p className="px-[10%] bg-blue-500 rounded-lg">Developer</p>
        </div>
        <div className="px-[25%] pb-[10%]">
          <img className="rounded-full border-2 border-blue-500" src="https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" alt="profile picture" />
        </div>
        <div className="text-white text-sm font-bold flex flex-col items-center justify-center rounded-b-lg bg-blue-500">
          <p>10 Posts | 12340 Likes</p>
        </div>
      </div>
    </div>
  )
}

export default Sidecard