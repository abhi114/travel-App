import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchLayout,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeInDown,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Camera, MapPin, Phone, User, Upload} from 'lucide-react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FormAlert, LoadingAlert, SuccessAlert } from './CustomAlerts';
const ProfileEditScreen = ({route}) => {
     const {data, id, setNameData} = route.params;
     //console.log( data);
     const navigation = useNavigation();
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [SuccessVisible,setSuccessVisible] = useState(false);
    const [validationVisible,setValidationVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: data.name,
    address: data.driverAddress,
    mobile: data.MobileNumber,
    profilePhoto: null,
  });
  const EditData = async (EditData) => {
    console.log("id" + id)
    try {
      const userRef = firestore().collection('userInfo').doc(id); // Reference user document
      await userRef.set(EditData, {merge: true}); // Set user data in the document
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };
  
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: withSpring(1)}],
    };
  });

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets) {
      setProfileData(prev => ({
        ...prev,
        profilePhoto: result.assets[0].uri,
      }));
    }
  };
  const updateLoginState = async newData => {
    try {
      // Retrieve the existing data from AsyncStorage
      const loginStateString = await AsyncStorage.getItem('loginState');
      if (loginStateString) {
        // Parse the data
        const loginState = JSON.parse(loginStateString);

        // Update only the specific fields in `data`
        loginState.data = {
          ...loginState.data,
          name: newData.name,
          MobileNumber: newData.MobileNumber,
          driverAddress: newData.driverAddress,
        };
        console.log("data set is",loginState.data);
        setNameData(loginState.data);
        // Save the updated object back to AsyncStorage
        await AsyncStorage.setItem('loginState', JSON.stringify(loginState));
      } else {
        console.log('No login state found.');
      }
    } catch (error) {
      console.error('Error updating login state:', error);
    }
  };
  const handleSubmitChange =async ()=>{
    
    console.log(profileData);
    if (
      profileData.name == '' ||
      profileData.mobile == '' ||
      profileData.address == ''
    ) {
      console.log("hit here")
      setValidationVisible(true);
      return;
    }
    setLoadingVisible(true);
    const EditedData = {
      name: profileData.name,
      MobileNumber: profileData.mobile,
      driverAddress: profileData.address,
    };
    
    //console.log(EditedData);
    await EditData(EditedData);
    await updateLoginState(EditedData);
    setLoadingVisible(false);
    setSuccessVisible(true);
    //navigation.goBack();
  }
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-4" style={{paddingTop: hp('5%')}}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800">Edit Profile</Text>
        </Animated.View>

        {/* Profile Photo Section */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="items-center mb-8">
          <TouchableOpacity onPress={handleImagePick} className="relative">
            <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100">
              {profileData.profilePhoto ? (
                <Image
                  source={{uri: profileData.profilePhoto}}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gray-100 items-center justify-center">
                  <Camera size={40} color="#9CA3AF" />
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-full">
              <Upload size={20} color="white" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Form Fields */}
        <View className="space-y-6" style={{width: wp('90%')}}>
          {/* Name Field */}
          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl p-3 bg-gray-50">
              <User size={20} color="#6B7280" />
              <TextInput
                value={profileData.name}
                onChangeText={text =>
                  setProfileData(prev => ({...prev, name: text}))
                }
                className="flex-1 ml-3 text-gray-800"
                placeholder="Enter your full name"
              />
            </View>
          </Animated.View>

          {/* Address Field */}
          <Animated.View entering={FadeInUp.delay(800).springify()}>
            <Text className="text-gray-700 mb-2 font-medium">Address</Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl p-3 bg-gray-50">
              <MapPin size={20} color="#6B7280" />
              <TextInput
                value={profileData.address}
                onChangeText={text =>
                  setProfileData(prev => ({...prev, address: text}))
                }
                className="flex-1 ml-3 text-gray-800"
                placeholder="Enter your address"
                multiline
              />
            </View>
          </Animated.View>

          {/* Mobile Number Field */}
          <Animated.View entering={FadeInUp.delay(1000).springify()}>
            <Text className="text-gray-700 mb-2 font-medium">
              Mobile Number
            </Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl p-3 bg-gray-50">
              <Phone size={20} color="#6B7280" />
              <TextInput
                value={profileData.mobile}
                onChangeText={text =>
                  setProfileData(prev => ({...prev, mobile: text}))
                }
                className="flex-1 ml-3 text-gray-800"
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
              />
            </View>
          </Animated.View>

          {/* Save Button */}
          <AnimatedTouchable
            style={[buttonStyle]}
            className="bg-purple-500 rounded-xl p-4 items-center mt-8"
            onPress={() => handleSubmitChange()}>
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          </AnimatedTouchable>
        </View>
      </View>
      <LoadingAlert visible={loadingVisible} message="Saving Data..." />
      <SuccessAlert visible={SuccessVisible} message="Profile Updated Successfully" onClose={()=>{setSuccessVisible(!SuccessVisible)}}/>
      <FormAlert visible={validationVisible} fields={["Name,Address,Number"]} onClose={()=>{setValidationVisible(!validationVisible)}}/>
    </ScrollView>
  );
};

export default ProfileEditScreen;
