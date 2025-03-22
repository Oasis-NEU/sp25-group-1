import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import tw from "twrnc";
import CommentSection from "./CommentSection";
import Carousel from "pinar";
import CodeHighlighter from "react-native-code-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import GradientBox from "./GradientBox";

const DisplayPostContent = ({ post, author }) => {
  const [mode, setMode] = useState("description");
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (post.files && post.files.length > 0) {
      const fetchedFiles = post.files.map((fileObj) => {
        console.log(fileObj);
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
        setFiles(updatedFiles);
      });
    }
  }, [post.files]);

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

  return (
    <View style={tw`bg-gray-900 flex items-center h-full gap-[2%]`}>
      <View style={tw`bg-gray-800 w-[90%] h-[40%] rounded-2xl p-4 mt-[5%]`}>
        {/* Title */}
        <GradientBox variant="postTitle" style={tw`h-[10%] flex-row items-center px-2`}>
        <Text style={tw`text-white text-xl flex-1`}>
          {post?.title || "Untitled Post"}
        </Text>
      </GradientBox>

        {/* Profile Picture, Looking For, Username */}
        <View style={tw`flex-row items-center mt-2 gap-[2%]`}>
          <Image
            source={{
              uri:
                author?.profile_picture ||
                "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg",
            }}
            style={tw`w-8 h-8 rounded-full`}
          />
          <Text
            style={tw`px-1 py-1 bg-white rounded-lg text-sm`}
          >
            {author && author.user_name ? author.user_name : "Unknown User"}
          </Text>
          <Text
            style={tw`px-1 py-1 bg-white rounded-lg text-sm`}
          >
            Project Type: {post.project_type}
          </Text>
        </View>

        {/* Images */}

        <Carousel
          controlsTextStyle={tw`text-indigo-500 text-10 opacity-50`}
          dotStyle={tw`w-2 h-2 bg-white rounded-full mx-1 opacity-50`}
          activeDotStyle={tw`w-2 h-2 bg-indigo-500 rounded-full mx-1 opacity-50`}
        >
          {post?.images?.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={tw`w-full h-full rounded-md my-[2%]`}
              resizeMode="contain"
            />
          ))}
        </Carousel>
      </View>

      <View style={tw`w-full flex-row justify-start w-[90%] gap-2`}>
        <TouchableOpacity
          onPress={() => setMode("description")}
          style={tw`flex-1`}
        >
          <View style={tw`bg-white px-2 py-1 rounded-md items-center`}>
            <Text style={tw`text-indigo-500 text-sm`}>Description</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("comments")}
          style={tw`flex-1`}
        >
          <View style={tw`bg-white px-2 py-1 rounded-md items-center`}>
            <Text style={tw`text-indigo-500 text-sm`}>Comments</Text>
          </View>
        </TouchableOpacity>
        {post?.post_type === "programmer" && (
          <TouchableOpacity onPress={() => setMode("code")} style={tw`flex-1`}>
            <View style={tw`bg-white px-2 py-1 rounded-md items-center`}>
              <Text style={tw`text-indigo-500 text-sm`}>Code</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setMode("comments")}
          style={tw`flex-1`}
        >
          <View style={tw`bg-white px-2 py-1 rounded-md items-center`}>
            <Text style={tw`text-indigo-500 text-sm`}>Other</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={tw`w-[90%] h-[40%] rounded-2x`}>
        {mode === "description" && (
          <GradientBox variant="postTitle" style={tw`p-3 h-full`}>
            <ScrollView>
              <Text style={tw`text-white text-xl`}>{post?.content}</Text>
            </ScrollView>
          </GradientBox>
        )}
        {mode === "comments" && <CommentSection />}
        {mode === "code" && (
          <ScrollView style={tw`bg-transparent w-full rounded-md h-full`}>
            {files.length > 0 ? (
              <CodeHighlighter
                language={files[currentIndex]?.language}
                hljsStyle={dracula}
                textStyle={tw`px-2 text-sm`}
              >
                {files[currentIndex]?.content || "Loading..."}
              </CodeHighlighter>
            ) : (
              <Text>No files uploaded yet.</Text>
            )}
          </ScrollView>
        )}
      </View>

      <View
        style={tw`px-[5%] flex flex-row items-center gap-[2%] w-full ${
          mode !== "code" ? "hidden" : ""
        }`}
      >
        <TouchableOpacity
          style={tw`px-3 py-0.5 bg-indigo-500 text-white rounded-md`}
          activeOpacity={0.7}
          onPress={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? files.length - 1 : prev - 1
            )
          }
        >
          <Text>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`px-3 py-0.5 bg-indigo-500 text-white rounded-md`}
          activeOpacity={0.7}
          onPress={() =>
            setCurrentIndex((prev) =>
              prev === files.length - 1 ? 0 : prev + 1
            )
          }
        >
          <Text>Next</Text>
        </TouchableOpacity>
        <View style={tw`flex flex-row text-white gap-[2%]`}>
          <Text style={tw`text-white`} numberOfLines={1} ellipsizeMode="tail">
            Total Files: {files.length}
          </Text>
          <Text style={tw`text-white`} numberOfLines={1} ellipsizeMode="tail">
            File Name: {files[currentIndex]?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DisplayPostContent;
