import { useState, useEffect, useContext } from "react";
import { Context } from "../context/context";

const FavoriteButton = ({ postId, onFavorite, token }) => {
  const [favorited, setFavorited] = useState(false);
  const { userInfo } = useContext(Context);

  useEffect(() => {
    if (userInfo?.favorites?.includes(postId)) {
      setFavorited(true);
    }
  }, [userInfo, postId]);

  if (!token) return null;

  const handleFavorite = () => {
    onFavorite(postId);
    setFavorited((prev) => !prev);
  };

  return (
    <div
      className="inline-block w-fit px-3 py-0.5 bg-white text-black rounded-lg text-sm cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
      onClick={handleFavorite}
    >
      {favorited ? "Unfavorite" : "Favorite"}
    </div>
  );
};

export default FavoriteButton;
