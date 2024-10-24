import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon3 from 'react-native-vector-icons/AntDesign';
import DriverDashboard from './helpers/DriverDashboard';

const ButtonPage = ({route}) => {
    const {emailId, id, data} = route.params;
    const navigation = useNavigation()
    const [namedata,setNameData] = useState(data);
    useEffect(() => {
      const fetchName=async ()=>{
      const loginState = await AsyncStorage.getItem('loginState');
        if (loginState) {
          const {emailId, id, data} = JSON.parse(loginState);
          setNameData(data)
        }
      }

      fetchName();
      return () => {
        
      }
    }, [])
    
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
    
      <DriverDashboard emailId={emailId} id={id} data={namedata} logout={logout}/>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    flexDirection:'column'
  },
  button: {
    backgroundColor: '#000C66',
    borderRadius: 25,
    padding: 15,
    margin: 20,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ButtonPage;
