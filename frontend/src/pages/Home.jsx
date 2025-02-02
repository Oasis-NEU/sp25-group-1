import Sidecard from "../components/Sidecard"
import PostMainPage from "../components/PostMainPage"
import { useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

const Home = () => {

  const [posts, setPosts] = useState(Array.from({ length: 10 }));
  const [more, setMore] = useState(true);

  const fetchMorePosts = () => {
    if (posts.length >= 50) {
      setMore(false);
      return;
    }
    setTimeout(() => {
      setPosts([...posts, ...Array.from({ length: 5 })]);
    }, 1000);
  }

  return (
    <div className="min-h-screen backgroundBlue flex">
      <div className="w-1/5 bg-red-400">
        <Sidecard />
      </div>

      <div className="w-3/5 flex flex-col items-center">
        <div className="mainBodyBackground rounded-2xl w-[95%] my-[3%] flex flex-col overflow-y-auto px-[3%]">
          <InfiniteScroll dataLength={posts.length} next={fetchMorePosts} hasMore={more} loader={<h4>Loading...</h4>} endMessage={<p className="text-center text-white mb-3"><b>No More Posts!</b></p>}>
            {posts.map((_, index) => (
              <div className="w-full flex justify-center min-h-[50vh]" key={index}>
                <PostMainPage />
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