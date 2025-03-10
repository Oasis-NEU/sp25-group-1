import { useState, useContext, useEffect } from "react";
import { Context } from "../context/context";
import axios from "axios";

const Inbox = () => {
    const [currentChat, setCurrentChat] = useState("");
    const [messages, setMessages] = useState([]);
    const [userChats, setUserChats] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingChat, setLoadingChat] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const { userId, backendUrl } = useContext(Context)

    useEffect(() => {
        fetchUserChats();
    }, [userId]);

    const fetchUserChats = async () => {
        if (!userId) return

        try {
            setLoadingChat(true);
            const response = await axios.post(`${backendUrl}/api/chat/listChats`, { user_Id: userId });
            setUserChats(response.data.chats);

        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoadingChat(false);
        }
    };

    useEffect(() => {
        if (!currentChat) return;
    
        const interval = setInterval(() => {
            fetchMessages(currentChat.chat_id);
        }, 2000);
    
        return () => clearInterval(interval);
    }, [currentChat]);
    

    const fetchMessages = async (chatId) => {
        try {
            setLoadingMessages(true);
            const response = await axios.post(`${backendUrl}/api/chat/getMessages`, { chat_id: chatId });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleChatSelect = async (chat) => {
        setCurrentChat(chat);
        fetchMessages(chat.chat_id);
    };


    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentChat) return;

        try {
            await axios.post(`${backendUrl}/api/chat/newMessage`, {
                chat_id: currentChat.chat_id,
                creator_id: userId,
                text: newMessage,
            });

            setNewMessage("");
            fetchMessages(currentChat.chat_id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // If profile is still loading, show a loader
    if (loadingChat) {
        return (
            <div className="backgroundBlue flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="w-screen h-[90vh] flex flex-row">
            {/* Sidebar with Scrollable Users */}
            <div className="w-[25%] h-full navbarColor flex flex-col">
                <div className="text-white text-xl font-bold flex flex-col items-center justify-center py-[5%]">
                    <p>Messages</p>
                </div>

                <div className="flex flex-col w-full h-[100%] overflow-y-auto py-[5%]">
                    {userChats.map((chat) => (
                        <div
                            key={chat.chat_id}
                            className="flex items-center gap-[5%] px-[5%] py-[2%] rounded-md hover:bg-indigo-500 cursor-pointer transition"
                            onClick={() => handleChatSelect(chat)}
                        >
                            <img
                                className="w-[15%] aspect-square rounded-full border border-white"
                                src={chat.recipient_information.profile_picture || "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg"}
                                alt={`Profile picture`}
                            />
                            <p className="font-bold text-white">{chat.recipient_information.user_name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Messaging Field */}
            <div className="w-[75%] h-full flex flex-col justify-between backdrop-blur-sm">
                {/* Chat Header */}
                <div className="text-xl font-bold p-[2%] bg-white shadow-md">
                    {currentChat ? `Chat with ${currentChat.recipient_information?.user_name}` : "Select a chat to start messaging"}
                </div>

                {/* Messages Container */}
                <div className="flex flex-col flex-grow overflow-y-auto p-[2%]">
                    {messages.length === 0 ? (
                        <p className="text-center text-white font-bold">No messages yet. Start a conversation!</p>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.creator === userId ? "justify-end" : "justify-start"} mb-[1%]`}
                            >
                                <div className={`px-[1%] py-[1%] rounded-lg text-white ${message.creator === userId ? "bg-indigo-500" : "bg-gray-600"}`}>
                                    {message.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Input Field */}
                {currentChat && (
                    <div className="p-[1%] bg-white flex items-center gap-[1%]">
                        <input
                            type="text"
                            className="flex-grow rounded-lg px-[1.5%] py-[1%] focus:outline-none"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button
                            className="bg-indigo-500 text-white px-[2%] py-[0.5%] rounded-lg"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Inbox;
