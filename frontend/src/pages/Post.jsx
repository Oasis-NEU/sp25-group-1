import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Context } from "../context/context";
import PostDesigner from "../components/PostDesigner";
import PostCode from "../components/PostCode";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";

const Post = () => {
  // Gets the post id from the url
  const { postId } = useParams();
  
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
      <LoadingScreen />
    );
  }

  // If there is no post, show an error message
  if (!post) {
    return (
      <div className="backgroundBlue flex items-center justify-center h-screen">
        <p className="text-white text-xl">Post not found</p>
      </div>
    );
  }

  // Switches post display based on the post type state
  return (
    <>
      {post.post_type === "programmer" ? (
        <PostCode post = {post} author={author} />
      ) : (
        <PostDesigner post = {post} author={author} />
      )}
    </>
  );
}

export default Post
  