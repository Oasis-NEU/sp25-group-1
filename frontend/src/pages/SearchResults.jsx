import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const fakeData = [
    {
        "id": "123",
        "type": "user",
        "user_name": "batman",
        "profile_picture": "https://api.dicebear.com/9.x/shapes/png?seed=D5slVBxd7rC4dpT&format=png"
    },
    {
        "id": "124",
        "type": "user",
        "user_name": "ironman",
        "profile_picture": "https://api.dicebear.com/9.x/shapes/png?seed=D5slVBxd7rC4dpT&format=png"
    },
    {
        "id": "321",
        "type": "post",
        "title": "Test Post 1",
        "content": "Post Content 1"
    },
    {
        "id": "125",
        "type": "user",
        "user_name": "superman",
        "profile_picture": "https://api.dicebear.com/9.x/shapes/png?seed=D5slVBxd7rC4dpT&format=png"
    },
    {
        "id": "323",
        "type": "post",
        "title": "Test Post 2",
        "content": "Post Content 2"
    },
]

const SearchResults = () => {
    const [result, setResult] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setResult(fakeData);
    }, []);

    if (!result) {
        return (
            <div className="backgroundBlue flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading Results...</p>
            </div>
        );
    }

    if (result.length === 0) {
        return (
            <div className="backgroundBlue flex items-center justify-center h-screen">
                <p className="text-white text-xl">No Results</p>
            </div>
        );
    }

    return (
        <div className="p-[5%]">
            <div className="w-full px-[5%] py-[1%] followColor mb-[2%] rounded-lg flex flex-row justify-between">
                <p className="font-bold text-white">Found {result.length} results...</p>
                <BackButton />
            </div>

            {result.map((item) => (
                <div key={item.id} className="py-[0.5%]">
                    {item.type === "user" ? (
                        <div className="flex flex-row bg-white px-[5%] py-[0.5%] items-center rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:shadow-md hover:scale-102 hover:text-white cursor-pointer group"
                             onClick={() => navigate(`/profile/${item.id}`)}>
                            <img className="w-[3%] aspect-square rounded-full border-2 border-indigo-500 group-hover:border-white transition-all duration-200" src={item.profile_picture} alt={item.user_name} />
                            <p className="font-bold ml-[2%]">{item.user_name}</p>
                        </div>
                    ) : (
                        <div className="flex flex-row bg-white px-[5%] py-[0.5%] items-center rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:shadow-md hover:scale-102 hover:text-white cursor-pointer group"
                            onClick={() => navigate(`/post/${item.id}`)}>
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="ml-2">{item.content}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

}

export default SearchResults