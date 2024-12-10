import { View, Text, TextInput, Alert, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {User, Phone, MapPin, LogOut, Check} from 'lucide-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PersonalInfo = ({route}) => {
    const {id, emailId} = route.params;
    const [name, setName] = useState('');
    const [number, enterNumber] = useState('');
    const [driversaddress,setdriversaddress] = useState('');
    const navigation = useNavigation();
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
   <View className="flex-1 bg-gray-50">
     {/* Header Section */}
     <View className="px-4 pt-5 pb-4 bg-white shadow-sm">
       <View className="flex-row justify-between items-center">
         <View className="flex-row items-center space-x-3">
           <User color="#4A5568" size={wp('7%')} />
           <Text className="text-2xl font-bold text-gray-800">
             Profile Details
           </Text>
         </View>
         <TouchableOpacity
           onPress={logout}
           className="bg-red-500 rounded-xl flex-row items-center px-3 py-2 space-x-2 shadow-md">
           <LogOut color="white" size={wp('5%')} />
           <Text className="text-white font-semibold">Logout</Text>
         </TouchableOpacity>
       </View>
     </View>

     {/* Form Container */}
     <ScrollView
       className="flex-1 px-4 pt-6"
       showsVerticalScrollIndicator={false}>
       {/* Full Name Input */}
       <View className="mb-4">
         <View className="flex-row items-center mb-2 space-x-2">
           <User color="#4A5568" size={wp('5%')} />
           <Text className="text-gray-700 font-semibold">Full Name</Text>
         </View>
         <View className="bg-white border border-gray-200 rounded-xl flex-row items-center px-4 shadow-sm">
           <TextInput
             onChangeText={setName}
             value={name}
             placeholder="Enter your full name"
             placeholderTextColor="#9CA3AF"
             className="flex-1 py-3 text-gray-800 font-medium"
           />
           {name && <Check color="#48BB78" size={wp('5%')} />}
         </View>
       </View>

       {/* Mobile Number Input */}
       <View className="mb-4">
         <View className="flex-row items-center mb-2 space-x-2">
           <Phone color="#4A5568" size={wp('5%')} />
           <Text className="text-gray-700 font-semibold">Mobile Number</Text>
         </View>
         <View className="bg-white border border-gray-200 rounded-xl flex-row items-center px-4 shadow-sm">
           <TextInput
             onChangeText={enterNumber}
             value={number}
             maxLength={10}
             keyboardType="numeric"
             placeholder="Enter mobile number"
             placeholderTextColor="#9CA3AF"
             className="flex-1 py-3 text-gray-800 font-medium"
           />
           {number && <Check color="#48BB78" size={wp('5%')} />}
         </View>
       </View>

       {/* Address Input */}
       <View className="mb-6">
         <View className="flex-row items-center mb-2 space-x-2">
           <MapPin color="#4A5568" size={wp('5%')} />
           <Text className="text-gray-700 font-semibold">Your Address</Text>
         </View>
         <View className="bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
           <TextInput
             onChangeText={setdriversaddress}
             value={driversaddress}
             placeholder="Enter your full address"
             placeholderTextColor="#9CA3AF"
             multiline
             numberOfLines={3}
             className="py-3 text-gray-800 font-medium h-24"
           />
           {driversaddress && (
             <View className="absolute bottom-2 right-2">
               <Check color="#48BB78" size={wp('5%')} />
             </View>
           )}
         </View>
       </View>
     </ScrollView>
     
     {/* Submit Button */}
     <View className="px-4 pb-6 bg-white shadow-2xl">
       <TouchableOpacity
         onPress={onsubmit}
         disabled={!name || !number || !driversaddress}
         className={`rounded-xl py-4 items-center shadow-md ${
           name && number && driversaddress
             ? 'bg-blue-600 active:bg-blue-700'
             : 'bg-gray-400'
         }`}>
         <View className="flex-row items-center space-x-2">
           <Check color="white" size={wp('5%')} />
           <Text className="text-white font-bold text-lg">Submit</Text>
         </View>
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