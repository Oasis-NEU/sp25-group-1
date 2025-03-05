import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    // BE VERY CAREFUL, this goes back 1 page in history
    // If a user came directly to the page, the button will break
    // ONLY PUT IN A PLACE WHERE THE USER GOES TO OUR WEBSITE FIRST
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div
            className="inline-block w-fit px-3 py-0.5 bg-white text-black rounded-lg text-sm cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
            onClick={handleBack}
        >
            Back
        </div>
    );
};

export default BackButton;

  