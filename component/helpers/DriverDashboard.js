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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const DriverDashboard = ({emailId, id, data,logout}) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale for the title
  const opacityAnim = useRef(new Animated.Value(0)).current; // Initial opacity for buttons
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('screen').width;
  const [selectedCar, setSelecCar] = useState({
    model: 'Jeep Rubicon',
    carNumber: 'UP32AD2445',
    downloadURL:
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
        style={{
          position: 'absolute',
          top: hp('2%'),
          right: wp('4%'),
          backgroundColor: '#EF4444',
          borderRadius: wp('4%'),
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: hp('1%'),
          paddingHorizontal: wp('4%'),
          shadowOpacity: 0.2,
          shadowRadius: 5,
        }}>
        <Icon
          name="logout"
          size={wp('5%')}
          style={{marginRight: wp('2%')}}
          color="white"
        />
        <Text className="text-white font-medium">Logout</Text>
      </TouchableOpacity>

      {/* Main Content Container */}
      <View
        className="flex-1 items-center justify-center "
        style={{paddingHorizontal: wp(6)}}>
        {/* Animation Container */}
        {/* <View className="mb-8">
           <LottieView
            source={require('../../assets/lottie-animation.json')}
            autoPlay
            loop
            speed={0.5}
            style={{width: width * 0.4, height: width * 0.4}}
          /> 
        </View> */}

        {/* Welcome Text */}
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <Text
            className=""
            style={{
              fontSize: wp('10%'),
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              marginBottom: hp('2%'),
            }}>
            Welcome To <Text style={{color: '#FF0000'}}>Drive..</Text>
          </Text>
        </Animated.View>
        <TouchableOpacity
          className="flex-row items-center bg-gray-800/50"
          onPress={() => {}}
          style={{
            paddingHorizontal: wp('6%'),
            paddingVertical: hp('1.5%'),
            borderRadius: wp('8%'),
            marginBottom: hp('3%'),
            shadowOpacity: 0.2,
            shadowRadius: 5,
          }}>
          <Image
            source={require('../../assets/profile.png')}
            style={{
              width: wp('10%'),
              height: wp('10%'),
              borderRadius: wp('5%'),
              marginRight: wp('3%'),
            }}
          />
          <Text
            className=" text-white font-semibold"
            style={{fontSize: wp('5%')}}>
            {data?.name}
          </Text>
        </TouchableOpacity>
        {/* Selected Car Display */}
        <View style={{width: wp('90%'), marginBottom: hp('3%')}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CarSelectionScreen', {
                id: id,
                setSelecCar: setSelecCar,
              })
            }
            className="bg-gray-800/80 "
            style={{
              borderRadius: wp('4%'),
              overflow: 'hidden',
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}>
            <View
              className="  border-gray-700"
              style={{
                paddingVertical: hp('2%'),
                paddingHorizontal: wp('3%'),
                borderBottomWidth: wp(0.5),
              }}>
              <Text
                className="text-gray-400 "
                style={{
                  color: '#A3A3A3',
                  fontSize: wp('3.5%'),
                  fontWeight: '500',
                }}>
                Current Vehicle
              </Text>
            </View>
            <View className="flex-row items-center" style={{padding: hp('2%')}}>
              <Image
                source={{uri: selectedCar?.downloadURL}}
                className="rounded-lg"
                resizeMode="cover"
                style={{
                  width: wp('16%'),
                  height: wp('16%'),
                  marginRight: wp('4%'),
                }}
              />
              <View className="flex-1">
                <Text
                  className="text-white font-semibold"
                  style={{fontSize: wp('5%')}}>
                  {selectedCar?.model}
                </Text>
                <Text className="text-gray-400" style={{fontSize: wp('4%')}}>
                  ID: {selectedCar?.carNumber}
                </Text>
              </View>
              <View
                className="bg-blue-500/20 rounded-full"
                style={{padding: wp('2%')}}>
                <Icon name="directions-car" size={wp('6%')} color="#60A5FA" />
              </View>
            </View>
            <View className="bg-blue-500/10 px-4 py-2 flex-row items-center justify-between">
              <Text className="text-blue-400 text-sm">
                Tap to change vehicle
              </Text>
              <Icon name="chevron-right" size={wp(5)} color="#60A5FA" />
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
            className="bg-blue-600  rounded-2xl shadow-xl active:bg-blue-700 transform active:scale-95 transition-all"
            onPress={() => navigation.navigate('InfoPage', {emailId, id, data})}
            style={{marginBottom: hp('2%')}}>
            <View
              className="flex-row items-center justify-between"
              style={{paddingHorizontal: wp('6%'), paddingVertical: hp('2%')}}>
              <View className="flex-1">
                <Text
                  className="text-white font-semibold"
                  style={{fontSize: wp('5%'), marginBottom: wp(1)}}>
                  Create New Duty
                </Text>
                <Text className="text-blue-100" style={{fontSize: wp('3.5%')}}>
                  Start a new driving assignment
                </Text>
              </View>
              <View
                className="bg-blue-500 rounded-full"
                style={{padding: wp('3%')}}>
                <Icon name="add-circle-outline" size={wp('6%')} color="white" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Check Reports Button */}
          <TouchableOpacity
            className="bg-gray-800 rounded-2xl shadow-xl active:bg-gray-700 transform active:scale-95 transition-all"
            onPress={() => navigation.navigate('ReportsScreen', {id})}>
            <View
              className="flex-row items-center justify-between"
              style={{paddingHorizontal: wp('6%'), paddingVertical: hp('2%')}}>
              <View className="flex-1">
                <Text
                  className="text-white font-semibold "
                  style={{fontSize: wp('5%'), marginBottom: wp(1)}}>
                  Check Reports
                </Text>
                <Text className="text-gray-400" style={{fontSize: wp('3.5%')}}>
                  View your driving history and stats
                </Text>
              </View>
              <View
                className="bg-gray-700 rounded-full"
                style={{padding: wp('3%')}}>
                <Icon
                  name="insert-chart-outlined"
                  size={wp('6%')}
                  color="white"
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Decoration */}
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
