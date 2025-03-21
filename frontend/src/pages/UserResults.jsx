import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const UserResults = () => {
    const [result, setResult] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        const resultsData = localStorage.getItem("matchResults");

        if (resultsData) {
            try {
                const parsedData = JSON.parse(resultsData);
                setResult(parsedData || []);
            } catch (error) {
                console.error("Error parsing match results:", error);
                setResult([]);
            }
        } else {
            setResult([]);
        }
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

    console.log(result);

    return (
        <div className="p-[5%]">
            <div className="w-full px-[5%] py-[1%] followColor mb-[2%] rounded-lg flex flex-row justify-between">
                <p className="font-bold text-white">Found {result.length} results...</p>
                <BackButton />
            </div>
            {result.map((item) => (
                <div key={item.userId} className="py-[0.5%]">
                    <div className="grid grid-cols-7 bg-white px-[5%] py-[0.5%] items-center rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:shadow-md hover:scale-102 hover:text-white cursor-pointer group"
                        onClick={() => navigate(`/profile/${item.userId}`)}>

                        <div className="flex justify-center">
                            <img className="w-10 h-10 rounded-full border-2 border-indigo-500 group-hover:border-white transition-all duration-200"
                                src={item.profile_picture}
                                alt={item.user_name} />
                        </div>

                        <p className="text-center font-bold truncate">{item.user_name}</p>
                        <p className="text-center font-bold">{item.match_score}</p>
                        <p className="text-center">{item.role || "N/A"}</p>
                        <p className="text-center">{item.experience_level || "N/A"}</p>
                        <p className="text-center">{item.availability || "N/A"}</p>
                        <p className="text-center truncate">{item.skills.slice(0, 5).join(", ") || "N/A"}</p>
                    </div>
                </div>
            ))}

        </div>
    );

}

export default UserResults