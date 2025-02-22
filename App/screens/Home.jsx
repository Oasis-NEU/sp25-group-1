import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { Context } from "../context/Context";
import PostMainPage from "../rn-components/PostMainPage";

const Home = () => {
  const { posts } = useContext(Context);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [more, setMore] = useState(false);
  const [index, setIndex] = useState(10);
  const navigation = useNavigation();

  useEffect(() => {
    if (posts.length > 0) {
      const newPosts = posts.slice(0, 10);
      setDisplayedPosts(newPosts);
      setMore(posts.length > 10);
    }
  }, [posts]);

  const fetchMorePosts = () => {
    if (index >= posts.length) {
      setMore(false);
      return;
    }

    setDisplayedPosts((prevPosts) => [
      ...prevPosts,
      ...posts.slice(index, index + 10),
    ]);
    
    setIndex((prevIndex) => prevIndex + 10);

    if (index + 10 >= posts.length) {
      setMore(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-900`}>
      <View style={tw`px-4 flex-1`}>
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`w-full flex justify-center mb-4`}
              onPress={() => navigation.navigate("Post", { postId: item._id })}
            >
              <PostMainPage title={item.title} image={item.images?.[0]} />
            </TouchableOpacity>
          )}
          onEndReached={fetchMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            more ? (
              <Text style={tw`text-center text-white mb-3 font-bold`}>
                Loading!
              </Text>
            ) : (
              <Text style={tw`text-center text-white mb-3 font-bold`}>
                No More Posts!
              </Text>
            )
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;