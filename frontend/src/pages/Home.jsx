import Sidecard from "../components/Sidecard"
import PostMainPage from "../components/PostMainPage"

const Home = () => {
  return (
    <div className="min-h-screen backgroundBlue flex">
      <div className="w-1/5 bg-red-400">
        <Sidecard />
      </div>

      <div className="w-3/5 items-center justify-center flex">
        <div className="mainBodyBackground rounded-2xl h-[95%] w-[95%] justify-center items-center flex flex-col">
          <PostMainPage />
          <PostMainPage />
        </div>
      </div>

      <div className="w-1/5 bg-yellow-400">
      </div>

    </div>
  )
}

export default Home