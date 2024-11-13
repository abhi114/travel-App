import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import DriverDashboard from './helpers/DriverDashboard';

const ButtonPage = ({route}) => {
  const {emailId, id, data} = route.params || {}; // Safely destructure params
  const navigation = useNavigation();
  const [namedata, setNameData] = useState(data);

  useEffect(() => {
    // Only fetch from AsyncStorage if data is undefined
    if (!data) {
      const fetchName = async () => {
        try {
          const loginState = await AsyncStorage.getItem('loginState');
          if (loginState) {
            const parsedData = JSON.parse(loginState);
            if (parsedData.data) {
              setNameData(parsedData.data); // Set data if available
            }
          }
        } catch (error) {
          console.log('Error fetching login state:', error);
        }
      };
      fetchName();
    }
  }, [data]);

  const logout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          AsyncStorage.removeItem('loginState');
          navigation.reset({
            index: 0,
            routes: [{name: 'Register'}],
          });
        },
      },
    ]);
  };

  return (
    <DriverDashboard
      emailId={emailId}
      id={id}
      data={namedata}
      logout={logout}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    flexDirection: 'column',
  },
});

export default ButtonPage;
