import Sidecard from "../components/Sidecard"
import RightSideCard from "../components/RightSideCard"
import PostMainPage from "../components/PostMainPage"
import { useContext, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Context } from "../context/context"
import { useNavigate } from "react-router-dom"

const Home = () => {

  const {posts} = useContext(Context);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [more, setMore] = useState(false);
  const [index, setIndex] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (posts.length > 0) {
      const newPosts = posts.slice(0, 10);
      setDisplayedPosts(newPosts);
      setMore(posts.length > 10);
    }
  }, [posts]);

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
    <div className="min-h-screen backgroundBlue flex">
      <div className="w-1/5 h-screen top-[11.7%] sticky">
        <Sidecard />
      </div>

      <div className="w-3/5 flex flex-col items-center">
        <div className="navbarColor rounded-2xl w-[95%] my-[3%] flex flex-col overflow-y-auto px-[3%]">
          <InfiniteScroll dataLength={displayedPosts.length} next={fetchMorePosts} hasMore={more} loader={<h4>Loading...</h4>} endMessage={<p className="text-center text-white mb-3"><b>No More Posts!</b></p>}>
            {displayedPosts.map((post, index) => (
              <div className="w-full flex justify-center min-h-[50vh] cursor-pointer" key={index} onClick={() => navigate(`/post/${post._id}`)}>
                <PostMainPage title={post.title} image={post.images?.[0]}/>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>

      <div className="w-1/5 h-screen top-[11.7%] sticky backgroundBlue bg-yellow-400">
            <RightSideCard />
      </div>

    </div>
  )
}

export default Home