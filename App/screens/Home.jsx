import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { Context } from "../context/Context";
import PostMainPage from "../rn-components/PostMainPage";

const Home = () => {
  const { posts, getPosts } = useContext(Context);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [more, setMore] = useState(false);
  const [index, setIndex] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Fetch initial posts or when posts changes
  useEffect(() => {
    if (posts.length > 0) {
      setDisplayedPosts(posts.slice(0, 10));
      setIndex(10);
      setMore(posts.length > 10);
    }
  }, [posts]);

  // Function to refresh posts
  const onRefresh = async () => {
    setRefreshing(true);
    await getPosts();
    setRefreshing(false);
  };

  // Function to load more posts
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
    setMore(index + 10 < posts.length);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-900`}>
      <View style={tw`px-4 flex-1`}>
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item._id || item.id}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={() =>
            more ? (
              <Text style={tw`text-center text-white mb-3 font-bold`}>
                Loading...
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