import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeFileViewer = () => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileUpload = (e) => {
    const fileArray = Array.from(e.target.files);
    const newFiles = fileArray
    .filter((file) => !files.some((f) => f.name === file.name))
    .map((file) => ({
      name: file.name,
      language: detectLanguage(file.name),
      content: null
    }))

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
      const updatedFiles = prevFiles.filter((_, index) => index !== currentIndex);
      const newIndex = Math.max(0, currentIndex - 1); // To prevent from last file becoming negative
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
  }

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

  return (
    <div>
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
            <button className="p-2 bg-amber-600" onClick={() => setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1))}>Next</button>
            <button className="p-2 bg-amber-600" onClick={() => setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1))}>Previous</button>
          </div>
          <div>
            <h2>File Name: {files[currentIndex]?.name}</h2>
            <SyntaxHighlighter language={files[currentIndex]?.language} style={dracula}>
              {files[currentIndex]?.content}
            </SyntaxHighlighter>
            <button className="p-2 bg-red-600" onClick={handleRemoveFile}>Remove File</button>
          </div>
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
  
}

export default CodeFileViewer;