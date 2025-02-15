import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const PostCode2 = ({post}) => {
  const [mode, setMode] = useState("description");
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileUpload = (e) => {
    const fileArray = Array.from(e.target.files);
    const newFiles = fileArray
      .filter((file) => !files.some((f) => f.name === file.name))
      .map((file) => ({
        name: file.name,
        language: detectLanguage(file.name),
        content: null,
      }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    fileArray.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target.result;
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          const fileIndex = updatedFiles.findIndex((f) => f.name === file.name);
          if (fileIndex !== -1) {
            updatedFiles[fileIndex].content = text;
          }

          return updatedFiles;
        });
      };

      reader.readAsText(file);
    });
  };

  const handleRemoveFile = () => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (_, index) => index !== currentIndex
      );
      const newIndex = Math.max(0, currentIndex - 1);
      setCurrentIndex(newIndex);
      return updatedFiles;
    });
  };

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

  const handleKeyDown = (event) => {
    const key = event.key;

    if (key === "ArrowRight") {
      setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
    } else if (key === "ArrowLeft") {
      setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [files.length]);

  const extraImages = post.images?.slice(1) || [];
  
  return (
    <div className="backgroundBlue flex items-center justify-center h-screen">
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
              <div className="bg-black rounded-full aspect-square h-[90%]"></div>
            </div>
            {/* Box for Username/LookingFor Info*/}
            <div className=" flex-3 flex flex-col justify-center">
              <div className="postTitleColor w-full rounded-md flex items-center px-[2%] mb-[2%]">
                <p className="text-white text-md">{post.author}</p>
              </div>
              <div className="postTitleColor w-full rounded-md flex items-center px-[2%] mt-[2%]">
                <p className="text-white text-md">{post.looking_for}</p>
              </div>
            </div>
          </div>

          {/* Code and Description Switch */}
          <div className="w-full flex justify-start">
            {mode === "description" ? (
              <div
                onClick={() => setMode("code")}
                className="bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer"
              >
                <p className="text-blue-500 text-sm">Switch to Code</p>
              </div>
            ) : (
              <div
                onClick={() => setMode("description")}
                className="bg-white inline-flex px-[5%] py-[0.5%] rounded-md cursor-pointer"
              >
                <p className="text-blue-500 text-sm">Switch to Description</p>
              </div>
            )}
          </div>

          {/* Description Box */}
          {mode === "description" ? (
            <div className="postTitleColor flex-10 w-full rounded-md flex p-[3%] mb-[10%] overflow-y-scroll">
              <p className="text-white text-xl">Description</p>
            </div>
          ) : (
            <div className="postTitleColor flex-10 w-full rounded-md flex flex-col mb-[10%] overflow-y-scroll">
              <h3>Total Files: {files.length}</h3>
              <input
                type="file"
                multiple
                accept=".js,.jsx,.tsx,.ts,.py,.java,.cpp,.c,.cs,.html,.css,.json,.md,.php,.swift,.sql,.go,.rb,.kt,.rs,.sh"
                onChange={handleFileUpload}
                className="mb-4 p-2 border rounded-md cursor-pointer"
              />
              {files.length > 0 ? (
                <div>
                  <div>
                    <button
                      className="p-2 bg-amber-600"
                      onClick={() =>
                        setCurrentIndex((prev) =>
                          prev === files.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      Next
                    </button>
                    <button
                      className="p-2 bg-amber-600"
                      onClick={() =>
                        setCurrentIndex((prev) =>
                          prev === 0 ? files.length - 1 : prev - 1
                        )
                      }
                    >
                      Previous
                    </button>
                  </div>
                  <div>
                    <h2>File Name: {files[currentIndex]?.name}</h2>
                    <SyntaxHighlighter
                      language={files[currentIndex]?.language}
                      style={dracula}
                    >
                      {files[currentIndex]?.content}
                    </SyntaxHighlighter>
                    <button
                      className="p-2 bg-red-600"
                      onClick={handleRemoveFile}
                    >
                      Remove File
                    </button>
                  </div>
                </div>
              ) : (
                <p>No files uploaded yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="flex flex-col w-[55%] items-center">
          {/* Sub container for images */}
          <div className="w-full h-full flex flex-col py-[5%] pl-[6%]">
            {/* Other images */}
            {extraImages.length > 0 && (
              <div className="flex-[2] w-full flex justify-between items-center rounded-lg">
                {post.images?.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="bg-white w-[20%] h-[40%] rounded-md flex items-center justify-center overflow-hidden"
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
            {/* Image 1 */}
            <div className="bg-white flex-5 w-full rounded-lg my-[10%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCode2;
