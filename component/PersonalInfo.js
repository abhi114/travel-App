import { View, Text, TextInput, Alert, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
const PersonalInfo = ({route}) => {
    const {id, emailId} = route.params;
    const [name, setName] = useState('');
    const [number, enterNumber] = useState('');
    const [driversaddress,setdriversaddress] = useState('');
    const navigation = useNavigation();
    const monthExpenditure = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
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
    const currentMonth = monthNames[new Date().getMonth()];
    const storeData = async (userId,userData)=>{
        try {
    const userRef = firestore().collection('userInfo').doc(userId); // Reference user document
    await userRef.set(userData,{merge:true}); // Set user data in the document
    
  } catch (error) {
    console.error('Error storing user data:', error);
  }
}
    const onsubmit =async ()=>{
        if(name === '' || number === '' || driversaddress === ''){
            Alert.alert("Please Enter the Required fields")
            return;
        }
        data={
            name:name,
            MobileNumber:number,
            driverAddress:driversaddress,
            monthExpenditure:monthExpenditure,
            RegisterMonth:currentMonth
        }
        console.log("data is" + JSON.stringify(data))
        await storeData(id,data)
        await AsyncStorage.setItem('loginState', JSON.stringify({emailId, id,data}));
        navigation.reset({
          index: 0,
          routes: [{name: 'ButtonPage', params: {emailId, id, data}}],
        });
    }
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.buttonContainer}>
          <Text style={styles.headerText}>Enter User Details</Text>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Full Name</Text>
            <TextInput
              onChangeText={setName}
              value={name}
              placeholder="Enter Name"
              placeholderTextColor="#8e8e8e"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mobile Number</Text>
            <TextInput
              onChangeText={enterNumber}
              value={number}
              keyboardType="numeric"
              placeholder="Enter Mobile Number"
              placeholderTextColor="#8e8e8e"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Address</Text>
            <TextInput
              onChangeText={setdriversaddress}
              value={driversaddress}
              placeholder="Enter Address"
              placeholderTextColor="#8e8e8e"
              style={styles.textInput}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => onsubmit()}
          style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  removeViewButton: {
    marginLeft: 10,
  },
  headerContainer: {
    backgroundColor: '#00000',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
  addViewButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    zIndex: 1,
  },
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  section: {
    flexDirection: 'column',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'pace-between',
  },
  sectionTitle: {
    margin: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 12,
    marginTop: 18,
  },
  line: {
    marginTop: 15,
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#e6e6fa',
    borderRadius: 10, // Add a slight corner radius
    borderWidth: 1, // Add a thin border
    borderColor: '#CCCCCC', // Light gray border color
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 25,
  },

  proceedButton: {
    backgroundColor: '#000080', // a nice blue color
    borderRadius: 10,
    padding: 10,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  proceedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10, // Adjust corner curvature here
    fontWeight: 'bold',
    color: '#000000',
    padding: 10,
    margin: 5,
    underlineStyle: {
      borderBottomWidth: 2,
      borderBottomColor: 'blue',
    },
    
  },
});

export default PersonalInfo