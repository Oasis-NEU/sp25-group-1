import { useState, useEffect, useContext } from "react"
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import axios from "axios";
import { Context } from "../context/context";
import LoadingScreen from "./LoadingScreen";

const SearchResults = () => {
    const { query } = useParams();
    const [result, setResult] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { backendUrl } = useContext(Context);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/api/search/search`,
                {
                    "user_input": query,
                }
            );

            console.log(response)

            if (response.data.success) {
                setResult(response.data.documents);
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [query]);

    if (loading) {
        return (
            <LoadingScreen />
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


            <div className="w-full h-[80vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-[1%] gap-3 auto-rows-[25vh]">
                {result.map((item, index) => (
                    item.type === "user" ? (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg flex flex-col items-center justify-evenly cursor-pointer transition-all hover:scale-102 hover:bg-indigo-500 hover:text-white group"
                            onClick={() => navigate(`/profile/${item._id}`)}
                        >
                            <img
                                src={item.profile_picture}
                                alt={item.user_name}
                                className="w-[30%] aspect-square object-cover rounded-full mb-[2%] border-2 transition-all border-indigo-500 group-hover:border-white"
                            />
                            <h3 className="text-lg font-semibold truncate">{item.user_name}</h3>
                            <p className="rounded-full px-3 py-1 font-semibold bg-indigo-500 text-white transition-all group-hover:bg-white group-hover:text-indigo-500">
                                {item.role}
                            </p>

                        </div>
                    ) : (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-lg p-[5%] cursor-pointer flex flex-col transition-all hover:scale-102 hover:bg-indigo-500 hover:text-white group"
                            onClick={() => navigate(`/post/${item._id}`)}
                        >
                            {item.images?.[0] ? (
                                <img
                                    src={item.images[0]}
                                    alt="Post Image"
                                    className="w-full h-[70%] object-cover rounded-md mb-2"
                                />
                            ) : (
                                <div className="w-full h-[70%] bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                            <h3 className="text-lg font-bold truncate">{item.title}</h3>
                            <p className="text-base truncate">{item.content}</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    );

}

export default SearchResults