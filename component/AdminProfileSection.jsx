import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedStyle, 
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Calendar, 
  ChevronLeft,
  Camera
} from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AdminProfileSection = ({ data, onBackPress }) => {
  const avatarScale = useSharedValue(1);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const handlePressIn = () => {
    avatarScale.value = withSpring(1.1);
  };

  const handlePressOut = () => {
    avatarScale.value = withSpring(1);
  };

  const ProfileCard = ({ icon: Icon, title, value }) => (
    <Animated.View 
      entering={FadeInRight.delay(300).springify()}
      className="flex-row items-center bg-white rounded-xl p-4 mb-3 shadow-sm"
    >
      <View className="bg-blue-50 p-3 rounded-full">
        <Icon size={wp('6%')} color="#3b82f6" />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-gray-500 text-sm">{title}</Text>
        <Text className="text-gray-800 font-semibold text-base mt-1">
          {value || 'Not provided'}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-20 rounded-b-[40px] shadow-md">
        <TouchableOpacity 
          onPress={onBackPress}
          className="absolute top-12 left-4 p-4 z-20"
        >
          <ChevronLeft size={wp('8%')} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-center text-xl font-semibold">
          Profile Details
        </Text>
      </View>

      {/* Profile Content */}
      <ScrollView 
        className="flex-1 px-4 -mt-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="items-center mb-6"
        >
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View 
              style={avatarStyle}
              className="bg-white rounded-full p-1 shadow-lg"
            >
              <View className="bg-blue-50 rounded-full p-8">
                <User size={wp('15%')} color="#3b82f6" />
              </View>
              <View className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-sm">
                <Camera size={wp('4%')} color="white" />
              </View>
            </Animated.View>
          </TouchableOpacity>
          <Text className="text-gray-800 text-xl font-bold mt-4">
            {data.name}
          </Text>
          <Text className="text-gray-500 text-sm">
            Administrator
          </Text>
        </Animated.View>

        {/* Info Cards */}
        <View className="mb-6">
          <ProfileCard 
            icon={Phone} 
            title="Mobile Number" 
            value={data.MobileNumber}
          />
          <ProfileCard 
            icon={MapPin} 
            title="Address" 
            value={data.driverAddress}
          />
          <ProfileCard 
            icon={Mail} 
            title="Email" 
            value={data.email}
          />
          <ProfileCard 
            icon={Calendar} 
            title="Joined Date" 
            value={data.joinedDate}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminProfileSection;