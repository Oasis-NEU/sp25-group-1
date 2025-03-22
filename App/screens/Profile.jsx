import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import tw from "twrnc";
import axios from "axios";
import { Context } from "../context/Context";
import { useRoute, useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { backendUrl, userId } = useContext(Context);
  const navigation = useNavigation();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoadingProfile(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/getProfileInformation`, {
          profileId: userId,
        });
        setProfile(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  useEffect(() => {
    if (!profile || posts.length > 0) return;
    const fetchProfilePosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await axios.post(`${backendUrl}/api/posts/getPostsByUser`, {
          userId,
        });
        setPosts(response.data.documents);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchProfilePosts();
  }, [loadingProfile]);

  if (loadingProfile) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-blue-800`}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={tw`text-white mt-4`}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-blue-800`}>
        <Text style={tw`text-white text-xl`}>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-blue-800 p-4`}>
      <View style={tw`bg-indigo-500 rounded-xl p-4 mb-4`}>
        <View style={tw`items-center`}>
          <Image
            source={{ uri: profile.profile_picture || "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg" }}
            style={tw`w-32 h-32 rounded-full border-2 border-white`}
            resizeMode="cover"
          />
          <Text style={tw`text-white text-xl font-bold mt-2`}>
            {profile.first_name} {profile.last_name}
          </Text>
          <Text style={tw`bg-indigo-700 px-3 py-1 rounded-full text-white mt-1`}>
            {profile.role}
          </Text>
          <FollowButton otherId={userId} />
          <MessageButton otherId={userId} />
          <Text style={tw`text-white mt-2`}>{profile.user_name}</Text>
          <Text style={tw`text-white`}>{profile.email}</Text>
        </View>
      </View>

      <Section title="Bio" content={profile.bio} />
      <Section title="Location" content={profile.location} />
      <Section title="Availability" content={profile.availability} />
      <Section title="Open to Collaboration?" content={profile.looking_for_collab} />
      <TagList title="Skills" tags={profile.skills} />
      <TagList title="Interests" tags={profile.interests} />

      <Text style={tw`text-white text-lg font-bold mt-6 mb-2`}>Posts</Text>
      {loadingPosts ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : posts.length === 0 ? (
        <Text style={tw`text-white`}>No Posts</Text>
      ) : (
        <View style={tw`flex flex-wrap flex-row justify-between`}>
          {posts.map((post, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("Post", { postId: post._id })}
              style={tw`bg-white rounded-lg mb-4 w-[47%] p-2`}
            >
              <Image
                source={{ uri: post.images[0] }}
                style={tw`w-full h-32 rounded-md`}
                resizeMode="cover"
              />
              <Text style={tw`text-center text-gray-800 font-bold mt-2`} numberOfLines={1}>
                {post.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const Section = ({ title, content }) => (
  <View style={tw`mb-4`}>
    <Text style={tw`text-indigo-300 font-bold text-base mb-1`}>{title}</Text>
    <Text style={tw`text-white`}>{content}</Text>
  </View>
);

const TagList = ({ title, tags }) => (
  <View style={tw`mb-4`}>
    <Text style={tw`text-indigo-300 font-bold text-base mb-1`}>{title}</Text>
    <View style={tw`flex-row flex-wrap gap-2`}>
      {tags.slice(0, 10).filter(Boolean).map((tag, index) => (
        <Text
          key={index}
          style={tw`px-3 py-1 bg-black text-white rounded-full text-sm mr-2 mb-2`}
        >
          {tag}
        </Text>
      ))}
    </View>
  </View>
);

export default ProfileScreen;