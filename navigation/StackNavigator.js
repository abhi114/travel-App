import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../component/Login';
import Home from '../component/Home';
import Duty from '../component/Duty';
import Register from '../component/Register';
import InfoPage from '../component/InfoPage';
import FeedbackScreen from '../component/Feedback';
import ReportsScreen from '../component/ReportsScreen';
import ButtonPage from '../component/ButtonPage';
import PersonalInfo from '../component/PersonalInfo';
import AdminLogin from '../component/AdminLogin';
import AdminPortal from '../component/AdminPortal';
import Stats from '../component/Stats';
import ReportsScreenDetailed from '../component/ReportsScreenDetailed';



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
      <Stack.Screen
        options={{headerShown: false}}
        name="Feedback"
        component={FeedbackScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="ReportsScreen"
        component={ReportsScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="ButtonPage"
        component={ButtonPage}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="PersonalInfo"
        component={PersonalInfo}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AdminLogin"
        component={AdminLogin}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="AdminPortal"
        component={AdminPortal}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Stats"
        component={Stats}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="ReportsScreenDetailed"
        component={ReportsScreenDetailed}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator