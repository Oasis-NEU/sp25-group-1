import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';

// Define all your gradient styles here
const gradientPresets = {
  postTitle: ['#334871', '#3b3c93'],
  follow: ['#bc4e9c', '#f80759'],
  default: ['#000000', '#333333'],
};

const GradientBox = ({ children, variant = 'default', style, ...props }) => {
  const colors = gradientPresets[variant] || gradientPresets.default;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[tw`rounded-md`, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBox;
