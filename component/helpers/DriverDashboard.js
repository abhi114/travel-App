import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DriverDashboard = ({emailId, id, data,logout}) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale for the title
  const opacityAnim = useRef(new Animated.Value(0)).current; // Initial opacity for buttons
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('screen').width;
  const [selectedCar, setSelectedCar] = useState({
    name: 'Jeep Rubicon',
    id: 'UP32AD2445',
    image:
      'https://images.pexels.com/photos/810357/pexels-photo-810357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  });
  useEffect(() => {
    // Title Animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.elastic(1),
    }).start();

    // Button Animation (delayed)
    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 800); // Delay for the buttons
  }, []);

  return (
    <View className={`flex-1 bg-gray-900`} style={{paddingTop: insets.top}}>
      {/* Header Section with Gradient Overlay */}

      {/* Logout Button */}
      <TouchableOpacity
        onPress={logout}
        className="absolute right-4 top-4 bg-red-500 rounded-full flex-row items-center px-4 py-2 shadow-lg">
        <Icon name="logout" size={20} color="white" className="mr-2" />
        <Text className="text-white font-medium">Logout</Text>
      </TouchableOpacity>

      {/* Main Content Container */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Animation Container */}
        <View className="mb-8">
          {/* <LottieView
            source={require('../../assets/lottie-animation.json')}
            autoPlay
            loop
            speed={0.5}
            style={{width: width * 0.4, height: width * 0.4}}
          /> */}
        </View>

        {/* Welcome Text */}
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <Text className="text-4xl font-bold text-white text-center mb-5">
            Welcome To <Text style={{color: '#FF0000'}}>Drive..</Text>
          </Text>
        </Animated.View>
        <TouchableOpacity
          className="flex-row items-center bg-gray-800/50 px-6 py-3 rounded-full mb-5 shadow-xl"
          onPress={() => navigation.navigate('CarSelectionScreen')}>
          <Image
            source={require('../../assets/profile.png')}
            className="w-10 h-10 rounded-full mr-4"
          />
          <Text className="text-xl text-white font-semibold">{data?.name}</Text>
        </TouchableOpacity>
        {/* Selected Car Display */}
        <View className="w-full max-w-sm mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate('CarSelectionScreen')}
            className="bg-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
            <View className="px-4 py-3 border-b border-gray-700">
              <Text className="text-gray-400 text-sm font-medium">
                Current Vehicle
              </Text>
            </View>
            <View className="flex-row items-center p-4">
              <Image
                source={{uri: selectedCar?.image}}
                className="w-16 h-16 rounded-lg mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">
                  {selectedCar?.name}
                </Text>
                <Text className="text-gray-400 text-sm">
                  ID: {selectedCar?.id}
                </Text>
              </View>
              <View className="bg-blue-500/20 p-2 rounded-full">
                <Icon name="directions-car" size={24} color="#60A5FA" />
              </View>
            </View>
            <View className="bg-blue-500/10 px-4 py-2 flex-row items-center justify-between">
              <Text className="text-blue-400 text-sm">
                Tap to change vehicle
              </Text>
              <Icon name="chevron-right" size={20} color="#60A5FA" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}

        {/* Action Buttons Container */}
        <Animated.View
          className="w-full max-w-sm"
          style={{opacity: opacityAnim}}>
          {/* Create New Duty Button */}
          <TouchableOpacity
            className="bg-blue-600 mb-4 rounded-2xl shadow-xl active:bg-blue-700 transform active:scale-95 transition-all"
            onPress={() =>
              navigation.navigate('InfoPage', {emailId, id, data})
            }>
            <View className="flex-row items-center justify-between px-6 py-4">
              <View className="flex-1">
                <Text className="text-white text-xl font-semibold mb-1">
                  Create New Duty
                </Text>
                <Text className="text-blue-100 text-sm">
                  Start a new driving assignment
                </Text>
              </View>
              <View className="bg-blue-500 p-3 rounded-full">
                <Icon name="add-circle-outline" size={24} color="white" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Check Reports Button */}
          <TouchableOpacity
            className="bg-gray-800 rounded-2xl shadow-xl active:bg-gray-700 transform active:scale-95 transition-all"
            onPress={() => navigation.navigate('ReportsScreen', {id})}>
            <View className="flex-row items-center justify-between px-6 py-4">
              <View className="flex-1">
                <Text className="text-white text-xl font-semibold mb-1">
                  Check Reports
                </Text>
                <Text className="text-gray-400 text-sm">
                  View your driving history and stats
                </Text>
              </View>
              <View className="bg-gray-700 p-3 rounded-full">
                <Icon name="insert-chart-outlined" size={24} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Decoration */}
        <View className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
  },
  logoutButton: {
    position: 'absolute',
    top: Dimensions.get('screen').width / 20,
    right: 20,
    backgroundColor: '#ff4757', // Optional color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    marginRight:5
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  buttonSecondary: {
    backgroundColor: '#555',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
});


export default DriverDashboard;
