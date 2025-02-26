import { useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import tw from "twrnc";

const CommentSection = () => {
    const [comments, setComments] = useState(
        Array.from({ length: 10 }, (_, index) => ({
            id: `comment ${index + 1}`,
            user: `User ${index + 1}`,
            text: `Comment ${index + 1}`,
        }))
    );

    const fetchMoreComments = () => {
        const newComments = Array.from({ length: 10 }, (_, index) => ({
            id: `comment-${comments.length + index + 1}`,
            user: `User ${comments.length + index + 1}`,
            text: `Comment ${comments.length + index + 1}`,
        }));

        setComments((prev) => [...prev, ...newComments]);
    };

    return (
        <View style={tw`bg-gray-800 flex-10 w-full rounded-md p-3 h-full`}> 
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                onEndReached={fetchMoreComments}
                onEndReachedThreshold={0.5}
                ListFooterComponent={<ActivityIndicator size="small" color="white" />}
                renderItem={({ item }) => (
                    <View style={tw`bg-gray-700 rounded-md p-2 flex-row gap-3 items-center mb-2`}> 
                        <View style={tw`w-8 h-8 rounded-full overflow-hidden`}> 
                            <Image
                                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" }}
                                style={tw`w-full h-full object-cover`}
                            />
                        </View>
                        <View>
                            <Text style={tw`text-white font-bold`}>{item.user}</Text>
                            <Text style={tw`text-gray-300 text-sm`}>{item.text}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default CommentSection;