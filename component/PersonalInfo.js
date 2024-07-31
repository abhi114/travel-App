import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { styles } from './InfoPage'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'
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
        navigation.navigate('ButtonPage', {emailId,id,data});
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

export default PersonalInfo