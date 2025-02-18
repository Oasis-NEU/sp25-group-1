const PostMainPage = ({ title, image }) => {
  return (
    <div className="backgroundNoPattern p-4 rounded-2xl w-full h-[50vh] mt-[3%] flex flex-col">
      {/* Title Section */}
      <div className="postTitleColor h-[10%] w-2/3 rounded-md flex items-center px-[2%]">
        <p className="text-white text-[175%]">{title}</p>
      </div>

      {/* Image Section */}
      {image ? (
        <div className="flex-1 w-full flex items-center justify-center rounded-md mt-[4%] overflow-hidden">
          <img
            src={image}
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      ) : (
        <div className="flex-1 w-full rounded-md mt-[4%] flex items-center justify-center text-white opacity-50">
          No image available
        </div>
      )}
    </div>
  );
};

export default PostMainPage;
