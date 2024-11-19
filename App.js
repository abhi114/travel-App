import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, } from 'react-native';
import StackNavigator from './navigation/StackNavigator';
import { MainFooter } from './component/helpers/helpers';
import { Text, TextInput } from 'react-native';

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

const Stack = createNativeStackNavigator();
export default App = () => {
  return (
    
      <NavigationContainer>
        <StackNavigator />
        <MainFooter />
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