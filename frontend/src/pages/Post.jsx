import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Context } from "../context/context";
import PostDesigner from "../components/PostDesigner";
import PostCode from "../components/PostCode";
import axios from "axios";

const Post = () => {
  const { postId } = useParams();
  const { posts, backendUrl } = useContext(Context);
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loadingAuthor, setLoadingAuthor] = useState(false);

  useEffect(() => {
    if (posts.length > 0) {
      const foundPost = posts.find((p) => p._id === postId);
      setPost(foundPost || null);
    }
  }, [posts, postId]);


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

  if ((!post && posts.length === 0) || loadingAuthor) {
    return (
      <div className="backgroundBlue flex items-center justify-center h-screen">
        <p className="text-white text-xl">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="backgroundBlue flex items-center justify-center h-screen">
        <p className="text-white text-xl">Post not found</p>
      </div>
    );
  }

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
  