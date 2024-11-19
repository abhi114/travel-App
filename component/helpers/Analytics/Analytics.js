import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Users,
  Car,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {LineChart, BarChart} from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import CreativeLoader from '../CreativeLoader';
import { LoadingAlert } from '../../CustomAlerts';
const screenWidth = Dimensions.get('window').width;

const AnalyticsGraphSection = ({ onBackPress}) => {
  const [activeTab, setActiveTab] = useState('monthly');
  const cardScale = useSharedValue(1);
   const [userInfo, setUserInfo] = useState([]);
   const [MapLoading, setMapLoading] = useState(true);

   useEffect(() => {
     const fetchUserInfo = async () => {
       const response = firestore().collection('userInfo');
       const data = await response.get();
       const userInfoArray = data.docs.map(doc => ({
         id: doc.id,
         ...doc.data(),
       }));
       setUserInfo(userInfoArray);
       setMapLoading(false);
     };
     fetchUserInfo();
   }, []);

   const getCurrentMonthAndPastSixMonths = () => {
     const currentDate = new Date();
     const currentMonth = currentDate.getMonth();
     const currentYear = currentDate.getFullYear();
     const months = [];
     for (let i = 0; i < 6; i++) {
       let month = currentMonth - i;
       let year = currentYear;
       if (month < 0) {
         month += 12;
         year -= 1;
       }
       const monthName = getMonthName(month);
       months.push(`${monthName}`);
     }
     return months.reverse();
   };

   const getMonthName = monthIndex => {
     const monthNames = [
       'January',
       'February',
       'March',
       'April',
       'May',
       'June',
       'July',
       'August',
       'September',
       'October',
       'November',
       'December',
     ];
     return monthNames[monthIndex];
   };

   const mappedData = getCurrentMonthAndPastSixMonths().map(month => {
     const count = userInfo.filter(item => item.RegisterMonth === month).length;
     return count;
   });

   const data = {
     labels: getCurrentMonthAndPastSixMonths(),
     datasets: [{data: mappedData}],
   };
  const tabs = ['daily', 'weekly', 'monthly', 'yearly'];

  const userData = {
    labels: getCurrentMonthAndPastSixMonths().map(month => month.slice(0, 3)),
    datasets: [
      {
        data: mappedData,
      },
    ],
  };

  const driverData = {
    labels: getCurrentMonthAndPastSixMonths().map(month => month.slice(0, 3)),
    datasets: [
      {
        data: mappedData,
      },
    ],
  };

  const StatCard = ({title, value, percentage, icon: Icon, isIncrease}) => (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      className="bg-white rounded-2xl p-4 flex-1 mx-2 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="bg-blue-50 p-2 rounded-full">
          <Icon size={wp('5%')} color="#3b82f6" />
        </View>
        <View
          className={`flex-row items-center ${
            isIncrease ? 'bg-green-50' : 'bg-red-50'
          } px-2 py-1 rounded-full`}>
          {isIncrease ? (
            <ArrowUpRight size={wp('3%')} color="#22c55e" />
          ) : (
            <ArrowDownRight size={wp('3%')} color="#ef4444" />
          )}
          <Text
            className={`text-xs ml-1 ${
              isIncrease ? 'text-green-600' : 'text-red-600'
            }`}>
            {percentage}%
          </Text>
        </View>
      </View>
      <Text className="text-gray-500 text-sm mt-3">{title}</Text>
      <Text className="text-gray-800 text-lg font-bold mt-1">{value}</Text>
    </Animated.View>
  );

  const ChartCard = ({title, data, icon: Icon}) => (
    <Animated.View
      entering={SlideInRight.delay(200).springify()}
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-blue-50 p-1 rounded-full mr-1">
            <Icon size={wp('4%')} color="#3b82f6" />
          </View>
          <Text className="text-gray-800 font-bold text-md">{title}</Text>
        </View>
        <View className="flex-row space-x-1">
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
            onPress={() => {setActiveTab(tab)}}
              className={`px-1 py-1 rounded-full  ${
                activeTab === tab ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
              <Text
                className={`text-xs capitalize ${
                  activeTab === tab ? 'text-white' : 'text-gray-600'
                }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <LineChart
        data={data}
        width={screenWidth - wp('12%')}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-6">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute top-10 left-4 p-2 bg-gray-600 rounded-full z-10">
          <ChevronLeft size={wp('6%')} color="white" style={{padding:5}}/>
        </TouchableOpacity>
        <Text className="text-white text-center text-xl font-semibold">
          Analytics Dashboard
        </Text>
      </View>
      <LoadingAlert visible={MapLoading} />
      {userInfo.length > 0 && (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}>
          {/* Stats Row */}
          <Animated.View
            entering={FadeInUp.delay(200)}
            className="flex-row justify-between mt-4 mb-6">
            <StatCard
              title="Total Users"
              value={userInfo.length}
              percentage="12.5"
              icon={Users}
              isIncrease={true}
            />
            <StatCard
              title="Total Drivers"
              value={userInfo.length}
              percentage="8.1"
              icon={Car}
              isIncrease={false}
            />
          </Animated.View>

          {/* Charts */}
          <ChartCard title="User Analytics" data={userData} icon={TrendingUp} />

          <ChartCard
            title="Driver Analytics"
            data={driverData}
            icon={BarChart3}
          />

          {/* Additional Stats */}
          <Animated.View
            entering={FadeInDown.delay(500)}
            className="flex-row justify-between mb-6">
            <StatCard
              title="Active Rides"
              value="156"
              percentage="5.8"
              icon={TrendingUp}
              isIncrease={true}
            />
            <StatCard
              title="Revenue"
              value="$12.5K"
              percentage="15.3"
              icon={PieChart}
              isIncrease={true}
            />
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

export default AnalyticsGraphSection;
