import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const Search = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search.trim()}`);
    }
    setSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md py-1 px-[1%] flex items-center w-full max-w-md border-1 border-indigo-500">
      <SearchIcon className="text-indigo-500" />
      <input 
        type="search" 
        onChange={(e) => setSearch(e.target.value)} 
        value={search} 
        className="text-black px-[1%] py-[1%] w-full focus:outline-none" 
        placeholder="Search"
      />
      <button type="submit" className="hidden"></button>
    </form>
  );
};

export default Search;
