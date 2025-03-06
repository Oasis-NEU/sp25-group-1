import SearchIcon from '@mui/icons-material/Search';

const Search = () => {
  return (
    <div className="bg-white rounded-md py-1 px-[1%] flex items-center w-full max-w-md border border-gray-300">
        <SearchIcon className="text-black" />
        <input type="search" className="text-black px-3 py-1 w-full focus:outline-none" placeholder="Search"/>
    </div>
  )
}

export default Search