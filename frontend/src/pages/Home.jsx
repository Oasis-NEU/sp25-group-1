import Sidecard from "../components/Sidecard"
import FollowingCard from "../components/FollowingCard"
import RightSideCard from "../components/RightSideCard"
import PostMainPage from "../components/PostMainPage"
import { useContext, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Context } from "../context/context"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Home = () => {
  // Initial states for the infinite scroll
  const { posts, trending, backendUrl, setPosts, getPosts } = useContext(Context);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [more, setMore] = useState(false);
  const [index, setIndex] = useState(10);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  // Fetch trending posts when `trending` is true and update posts
  useEffect(() => {
    if (trending) {
      const fetchTrendingPosts = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/posts/trending`);
          setPosts(response.data.trending_posts); // Update posts with trending posts
        } catch (error) {
          console.error("Error fetching trending posts", error);
        }
      };

      fetchTrendingPosts();
    } else {
      getPosts();
    }
  }, [trending, backendUrl, setPosts]);

  // Function to get the first 10 posts
  useEffect(() => {
    if (posts.length > 0) {
      const newPosts = posts.slice(0, 10);
      setDisplayedPosts(newPosts);
      setMore(posts.length > 10);
      setLoading(false);
    }
  }, [posts]);

  // Fetch the next posts based on index
  const fetchMorePosts = () => {
    if (index >= posts.length) {
      setMore(false);
      return;
    }

    const newPosts = posts.slice(index, index + 10);
    setDisplayedPosts([...displayedPosts, ...newPosts]);
    setIndex(index + 10);

    if (index + 10 >= posts.length) {
      setMore(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Put the left profile sidecard on the left 20% of the screen*/}
      <div className="w-[20%] h-screen top-[10%] sticky">
        <div className="transition-transform duration-100 hover:scale-101">
          <Sidecard />
        </div>
        <div className="transition-transform duration-100 hover:scale-101">
          <FollowingCard />
        </div>
      </div>

      {/* Infinite scroll setup to display the posts (50% of the screen with 5% margin on both sides)*/}
      <div className="w-[50%] flex flex-col items-center mx-[5%]">
        <div className="navbarColor rounded-2xl w-[95%] my-[3%] flex flex-col overflow-y-auto px-[3%]">
          <InfiniteScroll dataLength={displayedPosts.length} next={fetchMorePosts} hasMore={more} loader={<p className="text-center text-white mb-3"><b>Loading!</b></p>} endMessage={<p className="text-center text-white mb-3"><b>No More Posts!</b></p>}>
            {/* Map each of the posts, pass them to the post page with their respective id */}
              {displayedPosts.map((post, index) => (
                <div className="w-full flex justify-center min-h-[50vh] cursor-pointer" key={index} onClick={() => navigate(`/post/${post._id}`)}>
                  <PostMainPage title={post.title} image={post.images?.[0]} likes={post.likes} id={post._id} />
                </div>
              ))}
          </InfiniteScroll>
        </div>
      </div>

      {/* Put the right sidecard on the right 20% of the screen*/}
      <div className="w-[20%] h-screen top-[10%] sticky">
        <RightSideCard />
      </div>

    </div>
  )
}

export default Home