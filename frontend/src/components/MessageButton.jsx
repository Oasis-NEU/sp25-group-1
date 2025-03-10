import { useContext } from "react";
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";

const MessageButton = ({ otherId }) => {
    const { token, createChat, userId } = useContext(Context)
    const isSelf = userId === otherId;
    const navigate = useNavigate();

    if (!token || isSelf) return null;

    return (
        <div
            className="w-full px-3 py-0.5 mt-[5%] followColor text-white font-bold rounded-lg inline-flex items-center justify-center text-sm cursor-pointer transition-transform duration-100 hover:scale-102 shadow-md"
            onClick={() => {
                createChat(otherId)
                navigate("/inbox")
            }}>
            Message Me!
        </div>
    );
};

export default MessageButton;