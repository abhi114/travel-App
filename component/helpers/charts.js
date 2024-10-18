import {View, Text, Dimensions, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {LineChart, BarChart} from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';

const Linecharts = ({name}) => {
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

  const chartConfig = {
    backgroundColor: '#1c1c1e',
    backgroundGradientFrom: '#2c2c2e',
    backgroundGradientTo: '#3a3a3c',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(140, 140, 140, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {borderRadius: 16},
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#1a73e8',
    },
  };

  return (
    <View style={{justifyContent: 'center', alignSelf: 'center'}}>
      {MapLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <Text style={{color: '#000000', fontWeight: 'bold', marginLeft: 15}}>
            {name}'s Data (Last 6 Months)
          </Text>
          <LineChart
            data={data}
            width={Dimensions.get('window').width}
            height={220}
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text style={{color: '#000000', fontWeight: 'bold', marginLeft: 15}}>
            Bar Chart
          </Text>
          <BarChart
            style={{
              marginVertical: 15,
              borderRadius: 16,
            }}
            data={data}
            width={Dimensions.get('window').width}
            height={228}
            chartConfig={chartConfig}
          />
        </View>
      )}
    </View>
  );
};

export default Linecharts;
