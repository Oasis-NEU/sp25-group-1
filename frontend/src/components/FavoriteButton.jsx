const FavoriteButton = ({ postId, onFavorite, token }) => {
  if (!token) return null;

  return (
    <div
      className="inline-block w-fit px-3 py-0.5 bg-white text-black rounded-lg text-sm cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
      onClick={() => onFavorite(postId)}
    >
      Favorite
    </div>
  );
};

export default FavoriteButton;
