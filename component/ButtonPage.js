import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ButtonPage = ({route}) => {
    const {emailId, id, data} = route.params;
    const navigation = useNavigation()
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
