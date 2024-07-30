import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { MainFooter } from './component/helpers/helpers';


const Stack = createNativeStackNavigator();
export default App = () => {
  return (
    <NavigationContainer>
      <StackNavigator/>
      <MainFooter/>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});