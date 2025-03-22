import React from 'react';
import { View, Text, Image } from 'react-native';
import GradientBox from './GradientBox';
import tw from 'twrnc';

const PostMainPage = ({ title, image }) => {
  return (
    <View style={tw`bg-gray-800 p-4 rounded-2xl w-full h-80 mt-3 flex flex-col`}>
      {/* Title Section */}
      {/* Title Section using reusable gradient */}
      <GradientBox variant="postTitle" style={tw`h-[10%] w-2/3 flex-row items-center px-2`}>
        <Text style={tw`text-white text-xl`}>{title}</Text>
      </GradientBox>

      {/* Image Section */}
      {image ? (
        <View style={tw`flex-1 w-full items-center justify-center rounded-md mt-4 overflow-hidden`}>
          <Image source={{ uri: image }} style={tw`w-full h-full object-contain rounded-md`} resizeMode="contain" />
        </View>
      ) : (
        <View style={tw`flex-1 w-full rounded-md mt-4 items-center justify-center`}>
          <Text style={tw`text-white opacity-50`}>No image available</Text>
        </View>
      )}
    </View>
  );
};

export default PostMainPage;
