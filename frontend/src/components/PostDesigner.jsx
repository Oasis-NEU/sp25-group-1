import { useState } from "react";
import CommentSection from "./CommentSection";

const PostDesigner = ({ post, author }) => {
  const [extraImages, setExtraImages] = useState(post.images?.slice(1) || []);
  const [currentImage, setCurrentImage] = useState(post.images?.[0] || "");
  const [mode, setMode] = useState("description");

  // Function to handle clicking side images
  const handleImageClick = (image, index) => {
    const newExtraImages = [...extraImages];
    newExtraImages[index] = currentImage; 
    setCurrentImage(image);
    setExtraImages(newExtraImages);
  };

  return (
    <div className="backgroundBlue flex items-center justify-center h-screen">
      {/* Main Box for Post */}
      <div className="navbarColor flex w-[90%] h-[85%] rounded-2xl p-[3%]">
        {/* Images Section */}
        <div className="flex flex-col w-[65%] items-center">
          {/* Sub container for images */}
          <div className="w-full h-full flex flex-col py-[5%] pr-[6%]">
            {/* Image Main */}
            <div className="flex-[4] w-full rounded-lg flex justify-center items-center">
              <img 
                src={currentImage} 
                alt="" 
                className="max-w-[90%] max-h-[90%] w-auto h-auto object-contain rounded-lg" 
              />
            </div>
            {/* Other images */}
            {extraImages.length > 0 && (
              <div className="flex-[2] w-full flex justify-between items-center rounded-lg">
                {extraImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white w-[20%] h-[40%] rounded-md flex items-center justify-center overflow-hidden"
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
            <div className=" flex-3 flex flex-col justify-center">
              <div className="postTitleColor w-full rounded-md flex items-center px-[2%] mb-[2%]">
                <p className="text-white text-md">
                  {author && author.user_name ? author.user_name : "Unknown User"}
                </p>
              </div>
              <div className="postTitleColor w-full rounded-md flex items-center px-[2%] mt-[2%]">
                <p className="text-white text-md">
                  Looking For: {post.looking_for}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end gap-2">
            <div
              onClick={() => setMode("description")}
              className="bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer"
            >
              <p className="text-blue-500 text-sm">Description</p>
            </div>

            <div
              onClick={() => setMode("comments")}
              className="bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer"
            >
              <p className="text-blue-500 text-sm">Comments</p>
            </div>
          </div>

          {/* Conditional Display for Different Modes */}
          {mode === "description" && (
            <div className="postTitleColor flex-10 w-full rounded-md flex p-[3%] overflow-y-scroll">
              <p className="text-white text-xl">Description</p>
            </div>
          )}

          {mode === "comments" && (
            <CommentSection/>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostDesigner;
