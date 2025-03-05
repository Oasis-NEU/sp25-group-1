import { View, Text, ActivityIndicator } from "react-native";
import { useState, useContext, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Context } from "../context/Context";
import axios from "axios";
import tw from "twrnc";
import DisplayPostContent from "../rn-components/DisplayPostContent";

const Post = () => {
  // Gets the post id from the route params
  const route = useRoute();
  const { postId } = route.params;

  // gets every post and backend url from context
  const { posts, backendUrl } = useContext(Context);

  // Sets up states for post content, author, and loader
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(false);

  // Try to find this post from all posts
  useEffect(() => {
    if (posts.length > 0) {
      const foundPost = posts.find((p) => p._id === postId);
      setPost(foundPost || null);
    }
  }, [posts, postId]);

  // Gets author information from the getProfileInformation endpoint
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!post || !post.author || author) return;
      setLoadingAuthor(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/getProfileInformation`, {
          profileId: post.author
        });
        setAuthor(response.data.profile);
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoadingAuthor(false);
      }
    };
    fetchAuthorData();
  }, [post]);

  // If the posts or author does not exist yet, set a loader
  if ((!post && posts.length === 0) || loadingAuthor) {
    return (
      <View style={tw`flex-1 bg-indigo-500 items-center justify-center`}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={tw`text-white text-xl mt-4`}>Loading post...</Text>
      </View>
    );
  }

  // If there is no post, show an error message
  if (!post) {
    return (
      <View style={tw`flex-1 bg-indigo-500 items-center justify-center`}>
        <Text style={tw`text-white text-xl`}>Post not found</Text>
      </View>
    );
  }

  // Switches post display based on the post type state
  return (
    <DisplayPostContent post={post} author={author} />
  );
};

export default Post;