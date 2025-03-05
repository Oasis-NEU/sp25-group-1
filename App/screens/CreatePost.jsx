import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const CreatePost = () => {
  // Set states for post information
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [lookingFor, setLookingFor] = useState("programmer");
  const { backendUrl, token } = useContext(Context);
  const [sendLoading, setSendLoading] = useState(false);

  // Select Images
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets.length > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }
      setImages(result.assets.map((img) => img.uri));
    }
  };

  // Select Code Files with Restrictions
  const pickFiles = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: [
        "text/javascript", // js
        "application/javascript", // jsx
        "application/json", // json
        "text/html", // html
        "text/css", // css
        "text/markdown", // md
        "text/plain", // txt
        "application/sql", // sql
        "application/x-httpd-php", // php
        "application/x-sh", // sh
        "text/x-python", // py
        "text/x-java-source", // java
        "text/x-csrc", // c
        "text/x-c++src", // cpp
        "text/x-csharp", // cs
        "text/x-go", // go
        "text/x-ruby", // rb
        "text/x-kotlin", // kt
        "text/x-rust", // rs
        "application/x-swift-source", // swift
        "text/typescript", // ts
        "text/x-typescript", // tsx
      ],
      multiple: true,
    });

    if (result.type !== "cancel") {
      if (result.assets.length > 5) {
        alert("You can only upload up to 5 files.");
        return;
      }
      setFiles(result.assets.map((file) => file.uri));
    }
  };

  // Form submission handler
  const onSubmitHandler = async () => {
    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    setSendLoading(true);
    try {
      const currentPostType = files.length !== 0 ? "programmer" : "designer";
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("looking_for", lookingFor);
      formData.append("post_type", currentPostType);
      formData.append("token", token);

      images.forEach((uri, index) => {
        formData.append("images", {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      files.forEach((uri, index) => {
        formData.append("files", {
          uri,
          name: `file_${index}`,
          type: "application/octet-stream",
        });
      });

      const response = await axios.post(
        `${backendUrl}/api/posts/createPost`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Successful Post!");
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-900 p-4`}>
      <Text style={tw`text-white text-2xl font-bold mt-4`}>Create a Post</Text>

      {/* Title Input */}
      <TextInput
        style={tw`bg-gray-800 text-white p-2 mt-4 rounded-lg`}
        placeholder="Title Of Post"
        placeholderTextColor="gray"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description Input */}
      <TextInput
        style={tw`bg-gray-800 text-white p-2 mt-4 rounded-lg`}
        placeholder="Description of Post"
        placeholderTextColor="gray"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Looking For Section */}
      <Text style={tw`text-white text-lg pt-4`}>Looking For:</Text>
      <View style={tw`flex-row py-4 gap-2`}>
        <TouchableOpacity
          style={tw`px-4 py-2 rounded-lg ${lookingFor === "programmer" ? "bg-indigo-500" : "bg-gray-500"
            }`}
          onPress={() => setLookingFor("programmer")}
        >
          <Text style={tw`text-white`}>Programmer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`px-4 py-2 rounded-lg ${lookingFor === "designer" ? "bg-indigo-500" : "bg-gray-500"
            }`}
          onPress={() => setLookingFor("designer")}
        >
          <Text style={tw`text-white`}>Designer</Text>
        </TouchableOpacity>
      </View>

      {/* Image Upload Button */}
      <TouchableOpacity
        style={tw`bg-white p-2 mt-4 rounded-lg items-center`}
        onPress={pickImage}
      >
        <Text style={tw`text-black`}>Choose Images (Optional)</Text>
      </TouchableOpacity>

      {/* File Upload Button */}
      <TouchableOpacity
        style={tw`bg-white p-2 mt-4 rounded-lg items-center`}
        onPress={pickFiles}
      >
        <Text style={tw`text-black`}>Choose Code Files (Optional)</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <View style={tw`pt-[20%]`}>
        <TouchableOpacity
          style={tw`bg-indigo-500 p-2 mt-4 rounded-lg items-center`}
          onPress={onSubmitHandler}
          disabled={sendLoading}
        >
          <Text style={tw`text-white`}>
            {sendLoading ? "Submitting..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePost;
