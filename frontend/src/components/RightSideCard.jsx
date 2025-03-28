import { Context } from "../context/context"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmailIcon from '@mui/icons-material/Email';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';

const RightSideCard = () => {
  const { token, trending, setTrending } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div className="pt-[9.5%] flex flex-col items-center justify-center">
      <div className="navbarColor rounded-lg flex flex-col items-center gap-y-4 w-[40%]">
        <div onClick={() => navigate("/sign-in")}
          className="bg-indigo-500 rounded-lg w-[50%] h-[50%] aspect-square mt-[15%] cursor-pointer transition-transform duration-100 hover:scale-105 flex items-center justify-center shadow-md">
          <AssignmentIndIcon className="text-white" />
        </div>
        <div onClick={() => navigate("/favorites")}
          className="bg-indigo-500 rounded-lg w-[50%] h-[50%] aspect-square cursor-pointer transition-transform duration-100 hover:scale-105 flex items-center justify-center shadow-md">
          <BookmarkIcon className="text-white" />
        </div>
        <div onClick={() => setTrending(!trending)} 
          className="bg-indigo-500 rounded-lg w-[50%] h-[50%] aspect-square cursor-pointer transition-transform duration-100 hover:scale-105 flex items-center justify-center shadow-md">
          {!trending ? <TrendingUpIcon className="text-white" /> : <HomeIcon className="text-white" /> }
        </div>
        <div onClick={() => navigate("/recommended")} 
          className="bg-indigo-500 rounded-lg w-[50%] h-[50%] aspect-square cursor-pointer transition-transform duration-100 hover:scale-105 flex items-center justify-center shadow-md">
          <PeopleIcon className="text-white" />
        </div>
        <div onClick={() => navigate("/inbox")}
          className="bg-indigo-500 rounded-lg w-[50%] h-[50%] mb-[15%] aspect-square cursor-pointer transition-transform duration-100 hover:scale-105 flex items-center justify-center shadow-md">
          <EmailIcon className="text-white" />
        </div>
      </div>
      {/* Make a post button */}
      <p
        className="p-[3%] w-[60%] mt-[10%] postTitleColor rounded-lg cursor-pointer flex justify-center text-white transition-transform duration-100 hover:scale-102 shadow-md"
        onClick={() => {
          if (token) {
            navigate("/create-post");
          } else {
            toast.error("You must be logged in to create a post.");
          }
        }}
      >
        {token ? "Make a Post" : "Log in to Post"}
      </p>
    </div>
  )
}

export default RightSideCard