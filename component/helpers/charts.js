import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const Linecharts = ({name}) => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43],
        },
      ],
    };
  return (
    <View style={{justifyContent: 'center', alignSelf: 'center'}}>
      <Text style={{color: '#000000', fontWeight: 'bold', marginLeft: 15}}>
        {name}'s data {`(Shows Data for the Past 6 Months)`}
      </Text>
      <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
              ],
            },
          ],
        }}
        width={Dimensions.get('window').width-20} // from react-native
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
  );
}

export default Linecharts