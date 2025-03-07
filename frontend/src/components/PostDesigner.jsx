import { useState, useContext, useEffect } from "react";
import CommentSection from "./CommentSection";
import { Context } from "../context/context";
import FavoriteButton from "../components/FavoriteButton";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import EditPost from "./EditPost";

const PostDesigner = ({ post, author }) => {
  const [extraImages, setExtraImages] = useState(post.images?.slice(1) || []);
  const [currentImage, setCurrentImage] = useState(post.images?.[0] || "");
  const [editMode, setEditMode] = useState(false); // EDIT MODE ONLY FOR AUTHOR
  const [isEditable, setIsEditable] = useState(false); // IS THIS EDITABLE BY THIS USER
  const [mode, setMode] = useState("description");
  const { favorite, token, userId } = useContext(Context);
  const navigate = useNavigate();

  // Function to handle clicking side images
  const handleImageClick = (image, index) => {
    const newExtraImages = [...extraImages];
    newExtraImages[index] = currentImage;
    setCurrentImage(image);
    setExtraImages(newExtraImages);
  };

  useEffect(() => {
    if (author?.id === userId) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [author, userId]);

  return (
    <div className="backgroundBlue flex items-center justify-center h-screen">

      {/* Edit Mode Overlay */}
      {editMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="flex items-center justify-center">
            <EditPost post={post} setEditMode={setEditMode} />
          </div>
        </div>
      )}

      {/* Main Box for Post */}
      <div className="navbarColor flex w-[90%] h-[85%] rounded-2xl p-[3%]">
        {/* Images Section */}
        <div className="flex flex-col w-[65%] items-center">
          {/* Sub container for images */}
          <div className="w-full h-full flex flex-col py-[5%] pr-[6%]">
            {/* Image Main */}
            <div className="flex-[5] w-full h-full rounded-lg flex justify-center items-center overflow-hidden">
              <img
                src={currentImage}
                alt=""
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
              />
            </div>

            {/* Other images */}
            {extraImages.length > 0 && (
              <div className="flex-[1.5] w-auto h-auto flex justify-center items-center gap-2 overflow-x-auto rounded-lg p-2">
                {extraImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white w-[30%] h-[70%] object-cover rounded-md flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(image, index)}
                  >
                    <img
                      src={image}
                      alt={`Extra ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Container for Post Information */}
        <div className="flex flex-col w-[35%] items-center gap-[2%]">
          {/* Title */}
          <div className="postTitleColor flex-1 w-full rounded-md flex items-center px-[2%]">
            <p className="text-white text-xl">{post.title}</p>
          </div>
          {/* Box for Profile Picture + Username/LookingFor */}
          <div className="flex-1 w-full flex flex-row">
            {/* Box for profile picture */}
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-black rounded-full max-w-[75%] max-h-[75%] aspect-square overflow-hidden flex items-center justify-center">
                <img className="w-full h-full object-cover rounded-full" src={author?.profile_picture || ""} alt="" />
              </div>
            </div>
            {/* Box for Username/LookingFor Info*/}
            <div className=" flex-3 flex flex-col justify-center gap-[10%]">
              <div className="inline-block w-fit px-3 py-0.5 bg-white text-black rounded-full text-sm cursor-pointer transition:transform duration-100 hover:scale-105"
                onClick={() => navigate(`/profile/${post.author}`)}>
                {author && author.user_name ? author.user_name : "Unknown User"}
              </div>
              <div className="inline-block w-fit px-3 py-0.5 bg-white text-black rounded-full text-sm">
                Project Type: {post.project_type}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <div
              onClick={() => setMode("description")}
              className="bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
            >
              <p className="text-indigo-500 text-sm">Description</p>
            </div>

            <div
              onClick={() => setMode("comments")}
              className="bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
            >
              <p className="text-indigo-500 text-sm">Comments</p>
            </div>

            <div
              onClick={() => setMode("other")}
              className="bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
            >
              <p className="text-indigo-500 text-sm">More</p>
            </div>
          </div>

          {/* Conditional Display for Different Modes */}
          {mode === "description" && (
            <div className="postTitleColor flex-10 w-full rounded-md flex flex-col p-[3%] overflow-y-scroll">
              <p className="text-white text-md">{post.content}</p>
            </div>
          )}

          {mode === "comments" && (
            <CommentSection postId={post._id} />
          )}

          {mode === "other" && (
            <div className="postTitleColor flex-10 w-full rounded-md flex flex-col p-[3%] overflow-y-scroll">
              <div className="text-white text-md">
                <p className="pb-[2%]">Skills Used: </p>
                <div className="flex flex-wrap gap-2 pb-[2%]">
                  {post.skills_used.filter((skill) => skill !== "").map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-white text-black rounded-full text-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-white text-md pb-[2%]">
                <p className="pb-[2%]">Looking For: </p>
                <div className="inline-block px-3 py-1 bg-white text-black rounded-full text-sm">{post.looking_for}</div>
              </div>

              <div className="text-white text-md pb-[2%]">
                <p className="pb-[2%]">Preferred Experience: </p>
                <div className="inline-block px-3 py-1 bg-white text-black rounded-full text-sm">{post.preferred_experience}</div>
              </div>
            </div>
          )}

          <div className="bg-transparent flex-0.5 w-full rounded-m flex justify-end gap-[1%]">
            <FavoriteButton postId={post._id} onFavorite={favorite} token={token} />
            <BackButton />
            {isEditable ?
              (
                <div className="followColor px-3 py-0.5 text-white font-semibold rounded-lg text-sm cursor-pointer transition:transform duration-100 hover:scale-105" onClick={() => setEditMode(true)}>
                  Edit
                </div>
              ) : (
                <></>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDesigner;
