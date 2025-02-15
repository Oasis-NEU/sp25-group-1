import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Context } from "../context/context";
import PostDesigner from "../components/PostDesigner";
import PostCode from "../components/PostCode";

const Post = () => {
  const { postId } = useParams();
  const { posts } = useContext(Context);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (posts.length > 0) {
      const foundPost = posts.find((p) => p._id === postId);
      setPost(foundPost || null);
    }
  }, [posts, postId]);

  console.log("Post:", post);

  if (!post && posts.length === 0) {
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
        <PostCode post = {post} />
      ) : (
        <PostDesigner post = {post} />
      )}
    </>
  );
}

export default Post
  