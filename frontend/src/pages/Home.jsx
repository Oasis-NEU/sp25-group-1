import Sidecard from "../components/Sidecard"
import PostMainPage from "../components/PostMainPage"
import { useContext, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Context } from "../context/context"

const Home = () => {

  const {posts} = useContext(Context);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [more, setMore] = useState(false);
  const [index, setIndex] = useState(10);

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
      <div className="w-1/5 bg-red-400">
        <Sidecard />
      </div>

      <div className="w-3/5 flex flex-col items-center">
        <div className="mainBodyBackground rounded-2xl w-[95%] my-[3%] flex flex-col overflow-y-auto px-[3%]">
          <InfiniteScroll dataLength={displayedPosts.length} next={fetchMorePosts} hasMore={more} loader={<h4>Loading...</h4>} endMessage={<p className="text-center text-white mb-3"><b>No More Posts!</b></p>}>
            {displayedPosts.map((post, index) => (
              <div className="w-full flex justify-center min-h-[50vh]" key={index}>
                <PostMainPage title={post.title}/>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>

      <div className="w-1/5 bg-yellow-400">
      </div>

    </div>
  )
}

export default Home