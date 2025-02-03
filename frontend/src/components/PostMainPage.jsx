const PostMainPage = ({title, image}) => {
  return (
    <div className="backgroundBlue p-4 rounded-2xl w-full h-[50vh] mt-[3%] flex flex-col">
      <div className="postTitleColor h-[10%] w-2/3 rounded-md flex items-center px-[2%]">
        <p className="text-white text-[175%]">{title}</p>
      </div>

      <div className="bg-white flex-1 w-full rounded-md mt-[4%]"></div>
    </div>
  );
};

export default PostMainPage;
