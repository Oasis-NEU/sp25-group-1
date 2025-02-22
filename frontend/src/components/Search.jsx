const Search = () => {
  return (
    <div className="bg-white rounded-md p-1 flex items-center w-full max-w-md border border-gray-300">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 ml-2">
            <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd" />
        </svg>
        <input type="search" className="text-black px-3 py-1 w-full focus:outline-none" placeholder="Search"/>
    </div>
  )
}

export default Search