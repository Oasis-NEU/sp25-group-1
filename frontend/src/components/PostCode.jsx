import { useState, useEffect, useContext } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import CommentSection from "./CommentSection";
import FavoriteButton from "../components/FavoriteButton";
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import EditPost from "./EditPost";

const PostCode = ({ post, author }) => {
  const [mode, setMode] = useState("description");
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(post.images?.[0] || "");
  const [extraImages, setExtraImages] = useState(post.images?.slice(1) || []);
  const { favorite, token, userId } = useContext(Context);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false); // EDIT MODE ONLY FOR AUTHOR
  const [isEditable, setIsEditable] = useState(false); // IS THIS EDITABLE BY THIS USER

  useEffect(() => {
    if (post.files && post.files.length > 0) {
      const fetchedFiles = post.files.map((fileObj) => {
        const { filename, file_url: url } = fileObj;
        return {
          name: filename,
          language: detectLanguage(filename),
          content: null,
          url: url, // Store the Cloudinary URL
        };
      });

      setFiles(fetchedFiles);

      // Fetch all files in parallel and update state once
      Promise.all(
        fetchedFiles.map((file) =>
          fetch(file.url)
            .then((response) => response.text())
            .then((text) => ({ ...file, content: text }))
            .catch((error) => {
              console.error(`Error fetching file ${file.name}:`, error);
              return { ...file, content: "Error loading file" };
            })
        )
      ).then((updatedFiles) => {
        setFiles(updatedFiles); // Update state only once after all fetches complete
      });
    }
  }, [post.files]);

  useEffect(() => {
    if (author?.id === userId) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [author, userId]);


  const detectLanguage = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    const languageMap = {
      js: "javascript",
      jsx: "jsx",
      tsx: "tsx",
      ts: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      php: "php",
      swift: "swift",
      sql: "sql",
      go: "go",
      rb: "ruby",
      kt: "kotlin",
      rs: "rust",
      sh: "bash",
    };
    return languageMap[extension] || "plaintext";
  };


  // Function to handle clicking side images
  const handleImageClick = (image, index) => {
    const newExtraImages = [...extraImages];
    newExtraImages[index] = currentImage;
    setCurrentImage(image);
    setExtraImages(newExtraImages);
  };

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
        {/* Container for Post Information */}
        <div className="flex flex-col w-[45%] items-center gap-[2%]">
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

          {/* Mode Switch Buttons */}
          <div className="w-full flex justify-start gap-2">
            <div
              onClick={() => setMode("description")}
              className={`bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md ${mode === "description" ? "bg-gray-300" : ""
                }`}
            >
              <p className="text-indigo-500 text-sm">Description</p>
            </div>
            <div
              onClick={() => setMode("code")}
              className={`bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md ${mode === "code" ? "bg-gray-300" : ""
                }`}
            >
              <p className="text-indigo-500 text-sm">Code</p>
            </div>
            <div
              onClick={() => setMode("comments")}
              className={`bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md ${mode === "comments" ? "bg-gray-300" : ""
                }`}
            >
              <p className="text-indigo-500 text-sm">Comments</p>
            </div>
            <div
              onClick={() => setMode("other")}
              className={`bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md ${mode === "comments" ? "bg-gray-300" : ""
                }`}
            >
              <p className="text-indigo-500 text-sm">Other</p>
            </div>
          </div>

          {/* Conditional Display for Different Modes */}
          {mode === "description" && (
            <div className="postTitleColor flex-10 w-full rounded-md flex p-[3%] overflow-y-scroll">
              <p className="text-white text-md">{post.content}</p>
            </div>
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

          {mode === "code" && (
            <div className="bg-transparent flex-10 w-full rounded-md flex flex-col overflow-y-scroll">
              {files.length > 0 ? (
                <SyntaxHighlighter language={files[currentIndex]?.language} style={dracula} className="w-full h-full p-4 text-xs">
                  {files[currentIndex]?.content || "Loading..."}
                </SyntaxHighlighter>
              ) : (
                <p>No files uploaded yet.</p>
              )}
            </div>
          )}
          {mode === "comments" && (
            <CommentSection postId={post._id} />
          )}

          {/* Buttons to show only when state is code*/}
          <div className={`p-0 flex flex-row items-center gap-[5%] w-full ${mode !== "code" ? "hidden" : ""}`}>
            <button
              className="px-3 py-0.5 bg-indigo-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? files.length - 1 : prev - 1
                )
              }
            >
              Previous
            </button>
            <button
              className="px-3 py-0.5 bg-indigo-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === files.length - 1 ? 0 : prev + 1
                )
              }
            >
              Next
            </button>
            <div className="flex flex-row text-white">
              <p className="text-white pr-[10%]">Total Files: {files.length}</p>
              <p className="text-white">File Name: {files[currentIndex]?.name}</p>
            </div>
          </div>

          {/* Show favorite button only when mode is NOT code */}
          <div className={`bg-transparent flex-0.5 w-full rounded-m flex justify-start gap-[1%] ${mode === "code" ? "hidden" : ""}`}>
            <BackButton />
            <FavoriteButton postId={post._id} onFavorite={favorite} token={token} />
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

        {/* Images Section */}
        <div className="flex flex-col w-[55%] items-start justify-start">
          {/* Sub container for images */}
          <div className="w-full h-full flex flex-col pl-[6%] py-[2%]">
            {/* Other images (If they exist) */}
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

            {/* Main Image */}
            <div className="flex-[5] w-full h-full rounded-lg flex justify-center items-center overflow-hidden">
              <img
                src={currentImage}
                alt=""
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCode;
