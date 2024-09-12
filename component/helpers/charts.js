import { View, Text, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';

const Linecharts = ({name}) => {
    const [userInfo,setUserInfo]= useState([])
    const [mapMonths,setmapMonths] = useState([])
    const [MapLoading,setMapLoading] = useState(true);
    useEffect(() => {
      const fetchUserInfo = async () => {
        const response = firestore().collection('userInfo');
        const data = await response.get();
        const userInfoArray = data.docs.map(doc => ({
          id: doc.id, // Get the document ID
          ...doc.data(), // Get the document data
        }));
        setUserInfo(userInfoArray);
        setMapLoading(false);
        console.log(JSON.stringify(userInfo));
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
    console.log(getCurrentMonthAndPastSixMonths());
    const data = {
      labels: getCurrentMonthAndPastSixMonths(),
      datasets: [
        {
          data: mappedData,
        },
      ],
    };
    
  return (
    <View style={{justifyContent: 'center', alignSelf: 'center'}}>
      {MapLoading ? <ActivityIndicator/>:(
        <View>
      <Text style={{color: '#000000', fontWeight: 'bold', marginLeft: 15}}>
        {name}'s data {`(Shows Data for the Past 6 Months)`}
      </Text>
      <LineChart
        data={{
          labels: getCurrentMonthAndPastSixMonths(),
          datasets: [
            {
              data: mappedData
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '3',
            stroke: '#ffa726',
          },
        }}
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
        width={Dimensions.get('window').width} // from react-native
        height={228}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#c000e2',
          backgroundGradientFrom: '#c000e2',
          backgroundGradientTo: '#c000e2',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
      />
      </View>
      )}
    </View>
  );
}

export default Linecharts