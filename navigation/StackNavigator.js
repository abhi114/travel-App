import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../component/Login';
import Home from '../component/Home';
import Duty from '../component/Duty';
import Register from '../component/Register';
import InfoPage from '../component/InfoPage';



const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Register">
      <Stack.Screen
        options={{headerShown: false}}
        name="Register"
        component={Register}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="InfoPage"
        component={InfoPage}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{headerShown: true}}
        name="Duty"
        component={Duty}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator