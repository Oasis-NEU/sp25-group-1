import { Context } from "../context/context";
import { useContext, useState } from "react";
import axios from "axios";
import { ThumbUpAlt, ThumbDownAlt } from "@mui/icons-material";

const PostMainPage = ({ title, image, likes: initalLikes, id }) => {

  const { backendUrl, userId, token, updatePostReaction } = useContext(Context)
  const [likes, setLikes] = useState(initalLikes)
  const [userLiked, setUserLiked] = useState(false);
  const [userUnliked, setUserUnliked] = useState(false);


  return (
    <div className="backgroundNoPattern p-4 rounded-2xl w-full h-[50vh] mt-[3%] flex flex-col">
      {/* Title Section */}

      <div className="w-full h-[10%] flex flex-row">
        <div className="postTitleColor w-2/3 rounded-md flex items-center px-[2%]">
          <p className="text-white text-[175%] truncate">{title}</p>
        </div>


        <div className={`w-1/3 rounded-md flex items-center justify-center gap-[10%] ${!token ? "hidden" : ""}`}>
          <ThumbUpAlt
            className="w-[10%] opacity-75 cursor-pointer transition:transform duration-100 hover:scale-110"
            onClick={async (e) => {
              e.stopPropagation();
              const newReaction = userLiked ? "dislike" : "like";
              const updatedLike = await updatePostReaction(id, newReaction);
              if (typeof updatedLike === "number") {
                setLikes(updatedLike)
                setUserLiked(!userLiked);
                setUserUnliked(false);
              }
            }}
            style={{ color: userLiked ? "#1976d2" : "gray" }}
          />
          <ThumbDownAlt
            className="w-[10%] opacity-75 cursor-pointer transition:transform duration-100 hover:scale-110"
            onClick={async (e) => {
              e.stopPropagation();
              const newReaction = userUnliked ? "like" : "dislike";
              const updatedLike = await updatePostReaction(id, newReaction);
              if (typeof updatedLike === "number") {
                setLikes(updatedLike);
                setUserUnliked(!userUnliked);
                setUserLiked(false);
              }
            }}
            style={{ color: userUnliked ? "#d32f2f" : "gray" }}
          />
          <p className="text-white text-xl font-bold">{likes}</p>
        </div>
      </div>

      {/* Image Section */}
      {image ? (
        <div className="flex-1 w-full flex items-center justify-center rounded-md mt-[4%] overflow-hidden">
          <img
            src={image}
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      ) : (
        <div className="flex-1 w-full rounded-md mt-[4%] flex items-center justify-center text-white opacity-50">
          No image available
        </div>
      )}
    </div>
  );
};

export default PostMainPage;
