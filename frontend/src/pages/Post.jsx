const Post = () => {
    return (
      <div className="backgroundBlue flex items-center justify-center h-screen">
        {/* Main Box for Post */}
        <div className="navbarColor flex w-[90%] h-[85%] rounded-2xl p-[3%]">
        {/* Images Section */}
        <div className="flex flex-col w-[65%] items-center">
            {/* Sub container for images */}
            <div className="w-full h-full flex flex-col py-[5%] pr-[6%]">
                {/* Image 1 */}
                <div className="bg-white flex-[4] w-full rounded-lg"></div>
                {/* Other images */}
                <div className="flex-[2] w-full flex justify-between items-center rounded-lg">
                    <div className="bg-white w-[20%] h-[40%] rounded-md"></div>
                    <div className="bg-white w-[20%] h-[40%] rounded-md"></div>
                    <div className="bg-white w-[20%] h-[40%] rounded-md"></div>
                    <div className="bg-white w-[20%] h-[40%] rounded-md"></div>
                </div>
            </div>
        </div>
          {/* Container for Post Information */}
          <div className="flex flex-col w-[35%] items-center gap-[2%]">
            {/* Title */}
            <div className="postTitleColor flex-1 w-full rounded-md flex items-center px-[2%]">
                <p className="text-white text-xl">Title</p>
            </div>
            {/* Box for Profile Picture + Username/LookingFor */}
            <div className="flex-1 w-full flex flex-row">
                {/* Box for profile picture */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="bg-black rounded-full aspect-square h-[90%]"></div>
                </div>
                {/* Box for Username/LookingFor Info*/}
                <div className=" flex-3 flex flex-col justify-center">
                    <div className="postTitleColor w-full rounded-md flex items-center px-[2%] mb-[2%]">
                        <p className="text-white text-md">Username</p>
                    </div>
                    <div className="postTitleColor w-full rounded-md flex items-center px-[2%] mt-[2%]">
                        <p className="text-white text-md">Looking For</p>
                    </div>
                </div>
            </div>
            {/* Description Box */}
            <div className="postTitleColor flex-10 w-full rounded-md flex p-[3%] mb-[10%] overflow-y-scroll">
                <p className="text-white text-xl">Description</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Post;
  