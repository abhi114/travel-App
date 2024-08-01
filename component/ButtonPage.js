import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon3 from 'react-native-vector-icons/AntDesign';

const ButtonPage = ({route}) => {
    const {emailId, id, data} = route.params;
    const navigation = useNavigation()
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
            navigate.reset({
              index: 0,
              routes: [{name: 'Register'}],
            });
          },
        },
      ]);
    };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('InfoPage', {emailId, id, data})}>
        <Text style={styles.buttonText}>Create New Duty</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ReportsScreen', {id})}>
        <Text style={styles.buttonText}>Check Reports</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={logout}
        style={{
          position: 'absolute',
          top: 20, // adjust the value to change the distance from the bottom
          right: 20, // adjust the value to change the distance from the right
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#primary', // replace with your primary color
          padding: 12,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <Icon3
          name="logout"
          size={20}
          color={'#a2b223'}
          style={{width: 20, height: 20, marginRight: 8}}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#primaryForeground',
          }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
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
