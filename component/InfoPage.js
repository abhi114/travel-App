import React, {useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Replace with your icon library
import Icon1 from 'react-native-vector-icons/Entypo'; // Replace with your icon library
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { LineView } from './helpers/helpers';

const InfoPage = ({route}) => {
   
    const {id,data:driversdta} = route.params;
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
    const currentMonthName = monthNames[new Date().getMonth()];
    const importantCitiesUP = [
      'Agra',
      'Aligarh',
      'Allahabad',
      'Ambedkarnagar',
      'Auraiya',
      'Ayodhya',
      'Azamgarh',
      'Badaun',
      'Baghpat',
      'Bahraich',
      'Ballia',
      'Balrampur',
      'Banda',
      'Barabanki',
      'Bareilly',
      'Bijnor',
      'Budaun',
      'Bulandshahr',
      'Chandauli',
      'Chitrakoot',
      'Deoria',
      'Etah',
      'Etawah',
      'Farrukhabad',
      'Fatehpur',
      'Firozabad',
      'Gautam Buddha Nagar (Noida)',
      'Ghaziabad',
      'Ghazipur',
      'Gonda',
      'Gorakhpur',
      'Hamirpur',
      'Hapur',
      'Hardoi',
      'Hathras',
      'Jalaun',
      'Jaunpur',
      'Jhansi',
      'Kannauj',
      'Kanpur',
      'Kanshiram Nagar',
      'Kushinagar',
      'Lakhimpur Kheri',
      'Lucknow',
      'Maharajganj',
      'Mahoba',
      'Mainpuri',
      'Mathura',
      'Mau',
      'Mirzapur',
      'Moradabad',
      'Muzaffarnagar',
      'Pilibhit',
      'Pratapgarh',
      'Raebareli',
      'Rampur',
      'Saharanpur',
      'Sambhal',
      'Shahjahanpur',
      'Shrawasti',
      'Siddharthnagar',
      'Sitapur',
      'Sonbhadra',
      'Sultanpur',
      'Unnao',
      'Varanasi',
    ];

  const navigate = useNavigation();
  const [Rprtdate,setRprDate] = useState('');
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [RprtTime,setRprtTime] = useState('');
  const [month, setmonth] = useState(currentMonthName);
  const [endDate,setEndDate] = useState('');
  const [address,setAddress] = useState('');
  const[city,setCity] = useState('');
  const [passengerNames, setPassengerNames] = useState(['']);
  const [startingAddress, setStartingAddress] = useState(['']);
  const [destinationAddress,setDestinationAddress] = useState(['']);
  const [vehicleDetails,setvehicleDetails]= useState('');
    const [dutyInstructions,setDutyInstructions] =useState('');
     //const [city, setCity] = useState('');
     const [suggestions, setSuggestions] = useState([]);
    const [views, setViews] = useState([{}]);
    const handleInputChange = input => {
      setCity(input);

      if (input) {
        const filteredSuggestions = importantCitiesUP.filter(cityName =>
          cityName.toLowerCase().includes(input.toLowerCase()),
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    const onSelectSuggestion = suggestion => {
      console.log('press');
      setCity(suggestion);
      setSuggestions([]); // Clear suggestions after selection
    };
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
    const addView = () => {
      setViews([...views, {}]);
      setPassengerNames([...passengerNames, '']);
      setStartingAddress([...startingAddress, '']);
      setDestinationAddress([...destinationAddress, '']);
    };
    const handleTimePicker = () => {
      setIsTimePickerVisible(true);
    };
    const handleendTimePicker = () => {
      setIsEndTimePickerVisible(true);
    };
    const handleDatePicker = () => {
      setIsDatePickerVisible(true);
    };
    const handleConfirmDate = date => {
      const formattedDate = `${pad(date.getDate())}-${pad(
        date.getMonth() + 1, // getMonth() returns 0-11, so we add 1 for a 1-12 range
      )}-${date.getFullYear()}`;
      
      const month = monthNames[date.getMonth()]
      setmonth(month);
      setRprDate(formattedDate );
      setIsDatePickerVisible(false);
    };

    const handleCancelDate = () => {
      setIsDatePickerVisible(false);
      //setRprDate('');
    };
    const handleConfirm = time => {
      const formattedTime = `${pad(time.getHours() % 12 || 12)}:${pad(
        time.getMinutes(),
      )} ${time.getHours() < 12 ? 'am' : 'pm'}`;
      setRprtTime(formattedTime);
      setIsTimePickerVisible(false);
    };
    const handleConfirmForEndDate = time => {
      const formattedTime = `${pad(time.getHours() % 12 || 12)}:${pad(
        time.getMinutes(),
      )} ${time.getHours() < 12 ? 'am' : 'pm'}`;
      setEndDate(formattedTime);
      setIsEndTimePickerVisible(false);
    };
     const pad = n => (n < 10 ? `0${n}` : n);
    const handleCancel = () => {
      setIsTimePickerVisible(false);
    };
     const handleendCancel = () => {
       setIsEndTimePickerVisible(false);
     };
    const removeView = (index) => {
      if (views.length > 1) {
        setViews(views.slice(0, -1));
        setPassengerNames(passengerNames.filter((_, i) => i !== index));
        setStartingAddress(startingAddress.filter((_, i) => i !== index));
        setDestinationAddress(destinationAddress.filter((_, i) => i !== index));  
      }

    };
    const handlePassengerNameChange = (index, value) => {
      const newPassengerNames = [...passengerNames];
      newPassengerNames[index] = value;
      setPassengerNames(newPassengerNames);
    };
    const handleStartingAddressChange = (index, value) => {
      const newStartingAddresses = [...startingAddress];
      newStartingAddresses[index] = value;
      setStartingAddress(newStartingAddresses);
    };

    const handleDestinationAddressChange = (index, value) => {
      const newDestinationAddresses = [...destinationAddress];
      newDestinationAddresses[index] = value;
      setDestinationAddress(newDestinationAddresses);
    };

    const getUserData = async(userId)=>{
        try {
          const userRef = firestore().collection('users').doc(userId);
          const snapshot = await userRef.get();
          if (snapshot.exists) {
            return snapshot.data(); // Return user data if document exists
            
          } else {
            console.warn('No user data found for:', userId);
            return null; // Handle case where document doesn't exist
          }
        } catch (error) {
          console.error('Error retrieving user data:', error);
          return null; // Handle errors
        }
    }
    /*useEffect(() => {
        if(id!==undefined){
            console.log("id is " + id);
            const newid = id;
            const fetchData = async (newid) => {
              if (id !== null) {
                console.log("id is " + id);
                const data = await getUserData(id);
                if(Object.keys(data).length>0){
                    setName(data.name)
                    enterNumber(data.number);
                    setRprDate(data.ReportingDate);
                    setEndDate(data.endDate);
                    setAddress(data.address);
                    setCity(data.city);
                    setvehicleDetails(data.vehicleDetails);
                    setDutyInstructions(data.dutyInstructions);
                } // Log the retrieved data
              }
            };

            fetchData();
        }
    }, [id]) **/
    

    const storeData = async (userId,userData)=>{
        try {
    const userRef = firestore().collection('users').doc(userId); // Reference user document
    await userRef.set(userData,{merge:true}); // Set user data in the document
  } catch (error) {
    console.error('Error storing user data:', error);
  }
    }
    function validatePassengers(passengers) {
      for (const passenger in passengers) {
        const passengerObject = passengers[passenger];
        if (
          passengerObject.DestinationAddress === '' ||
          passengerObject.PassengerName === '' ||
          passengerObject.StartingAddress === ''
        ) {
          return false;
        }
      }
      return true;
    }
    const passengerData = useMemo(() => {
      const data = {};
      passengerNames.forEach((name, index) => {
        data[`Passenger ${index + 1}`] = {  
          PassengerName: name,
          StartingAddress: startingAddress[index],
          DestinationAddress: destinationAddress[index],
        };
      });
      return data;
    }, [passengerNames, startingAddress, destinationAddress]);

    //console.log(passengerData);
  const afteraccept =async () => {
    if( Rprtdate === ''  || address === '' || city === '' || vehicleDetails === ''){
        alert("Please fill all the Fields")
        return;
    } 
    if(!validatePassengers(passengerData)){
      alert('Please fill all the Passenger Fields');
      return;
    };
    
    console.log(passengerData);
    console.log("id is" + id);
    const data = {
      name: driversdta.name,
      number: driversdta.MobileNumber,
      ReportingDate: Rprtdate + ' ' + month + ' ' + RprtTime,
      //endDate: endDate,
      address: address,
      city: city,
      vehicleDetails: vehicleDetails,
      //dutyInstructions: dutyInstructions,
      PassengerData: passengerData,
      ReportingTime: RprtTime,
      ReportingMonth: month,
    };  
    const mainData = {}
    mainData[`${Rprtdate + ' ' + month + ' ' + RprtTime}`] = data;

        console.log(mainData);
        await storeData(id,mainData);
        navigate.navigate('Home', {
          id,
          name:driversdta.name,
          number:driversdta.MobileNumber,
          Rprtdate:Rprtdate +" " + month +" "+  RprtTime,
         //endDate,
          address,
          city,
          vehicleDetails,
          //dutyInstructions,
          mainData,
          month
        });
    
  };
  return (
    <View style={styles.outerContainer} className="bg-gray-50">
      <ScrollView style={styles.container} className="flex-1 bg-gray-50 ">
        <View className="w-full px-4 py-3 flex flex-row justify-between items-center bg-white border-b border-gray-100">
          <Text className="text-xl font-semibold text-gray-800">
            Your Details
          </Text>

          <TouchableOpacity
            onPress={logout}
            className="flex flex-row items-center space-x-2 px-3 py-2 rounded-lg bg-red-500"
            activeOpacity={0.7}>
            <Icon3 size={20} name="logout" color={'#fff'} />
            <Text className="text-white font-medium text-base">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 py-6 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">
            Journey Details
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            Please fill in the required information
          </Text>
        </View>
        <View className="p-4 space-y-4 " >
          {/* Full Name Card */}
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Full Name <Text className="text-blue-500">*</Text>
            </Text>
            <View className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <Text className="text-gray-800 font-medium">
                {driversdta.name}
              </Text>
            </View>
          </View>

          {/* Number Card */}
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Number <Text className="text-blue-500">*</Text>
            </Text>
            <View className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <Text className="text-gray-800 font-medium">
                {driversdta.MobileNumber}
              </Text>
            </View>
          </View>

          {/* Reporting Date Card */}
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Reporting Date <Text className="text-blue-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
              <TextInput
                className="flex-1 p-3 text-gray-800"
                keyboardType="numeric"
                inputMode="numeric"
                onChangeText={setRprDate}
                value={Rprtdate}
                placeholder="Enter Date"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={handleDatePicker}
                className="px-4 py-3 bg-blue-50 rounded-r-lg border-l border-gray-200">
                <View className="items-center">
                  <Icon3 name="calendar" size={24} color="#3b82f6" />
                  <Text className="text-xs text-blue-600 mt-1">Select</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reporting Time Card */}
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Reporting Time <Text className="text-blue-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200">
              <TextInput
                className="flex-1 p-3 text-gray-800"
                inputMode="text"
                onChangeText={setRprtTime}
                value={RprtTime}
                placeholder="Enter Time"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={handleTimePicker}
                className="px-4 py-3 bg-blue-50 rounded-r-lg border-l border-gray-200">
                <View className="items-center">
                  <Icon4 name="access-time" size={24} color="#3b82f6" />
                  <Text className="text-xs text-blue-600 mt-1">Select</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={handleCancelDate}
          is24Hour={false}
        />

        {/* Time Picker Modal */}
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          is24Hour={false}
        />
        {/* <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reporting month*</Text>
            <TextInput
              inputMode="date"
              onChangeText={setmonth}
              value={month}
              placeholder="Enter month"
              style={styles.textInput}
              placeholderTextColor={'#8e8e8e'}
            />
          </View>
        </View> */}

        {/* <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>End Time *</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: 'gray',
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                justifyContent: 'space-around',
              }}>
              <TextInput
                inputMode="date"
                onChangeText={setEndDate}
                value={endDate}
                placeholder="Enter in 00:00 am/pm"
                style={styles.textInput}
              />
              <TouchableOpacity
                style={[
                  {
                    marginLeft: 10,
                    width: 80,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                onPress={handleendTimePicker}>
                <Icon4 name="access-time" size={30} color="#4F8EF7" />
                <Text>Select Time</Text>
              </TouchableOpacity>
            </View>
            {isEndTimePickerVisible && (
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmForEndDate}
                onCancel={handleendCancel}
                is24Hour={false}
              />
            )}
          </View>
        </View> */}

        <View className="p-4 space-y-4">
          {/* Reporting Address Section */}
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Reporting Address <Text className="text-blue-500">*</Text>
                </Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200"
                />
              </View>
              <View className="p-3 bg-blue-50 rounded-lg">
                <Icon1 name="location" size={24} color="#3b82f6" />
              </View>
            </View>
          </View>

          {/* Serving City Section */}
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Serving City <Text className="text-blue-500">*</Text>
            </Text>
            <TextInput
              value={city}
              onChangeText={handleInputChange}
              placeholder="Enter City"
              placeholderTextColor="#9ca3af"
              className="bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200"
            />
            {suggestions.length > 0 && (
              <View className="mt-2 bg-white rounded-lg border border-gray-200">
                <FlatList
                  data={suggestions}
                  keyExtractor={item => item}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => onSelectSuggestion(item)}
                      className="px-4 py-3 active:bg-gray-50">
                      <Text className="text-gray-700">{item}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View className="h-px bg-gray-200" />
                  )}
                  className="max-h-40"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                />
              </View>
            )}
          </View>

          {/* Vehicle Details Section */}
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Vehicle Details <Text className="text-blue-500">*</Text>
            </Text>
            <TextInput
              value={vehicleDetails}
              onChangeText={setvehicleDetails}
              placeholder="Enter Vehicle Details"
              placeholderTextColor="#9ca3af"
              className="bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200"
            />
          </View>
        </View>

        {/* <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Duty Instructions *</Text>
            <TextInput
              value={dutyInstructions}
              onChangeText={setDutyInstructions}
              placeholder="Enter Instructions"
              style={styles.textInput}
            />
          </View>
        </View> */}
        <LineView />
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Passengers Information <Text className="text-blue-500">*</Text>
          </Text>

          {/* Add/Remove Buttons */}
          {/* <View className="flex-row justify-between items-center my-4">
            <TouchableOpacity
              onPress={addView}
              className="flex-row items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <Text className="text-blue-600 mr-2">Add</Text>
              <Icon3 name="plus" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View> */}

          {/* Passenger Forms */}
          {views.map((view, index) => (
            <View key={index} className="mb-4">
              <Text className="text-md font-medium text-gray-700 mb-2">
                Passenger {index + 1}
              </Text>

              {/* Name Input */}
              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Name Of Passenger <Text className="text-blue-500">*</Text>
                </Text>
                <TextInput
                  value={passengerNames[index]}
                  onChangeText={value =>
                    handlePassengerNameChange(index, value)
                  }
                  placeholder="Enter Name of passenger"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200"
                />
              </View>

              {/* Starting Address */}
              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Starting Address <Text className="text-blue-500">*</Text>
                </Text>
                <TextInput
                  value={startingAddress[index]}
                  onChangeText={value =>
                    handleStartingAddressChange(index, value)
                  }
                  placeholder="Enter Starting address"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200"
                />
              </View>

              {/* Drop Address */}
              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Drop Address <Text className="text-blue-500">*</Text>
                </Text>
                <TextInput
                  value={destinationAddress[index]}
                  onChangeText={value =>
                    handleDestinationAddressChange(index, value)
                  }
                  placeholder="Enter Drop Address"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200"
                />
              </View>
              <View className="flex-row justify-between items-center my-4">
                {index == 0 && (
                  <TouchableOpacity
                    onPress={addView}
                    className="flex-row items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                    <Text className="text-blue-600 mr-2">Add</Text>
                    <Icon3 name="plus" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                )}

                {index != 0 && (
                  <TouchableOpacity
                    onPress={() => removeView(index)} // Pass the index here
                    className="flex-row items-center bg-red-50 px-4 py-2 rounded-lg border border-red-100 mt-2">
                    <Text className="text-red-600 mr-2">Remove</Text>
                    <Icon3 name="minus" size={20} color="#dc2626" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
        <View className="w-full px-5 py-8">
          <TouchableOpacity
            onPress={afteraccept}
            className="w-full bg-blue-500 px-8 py-3.5 rounded-lg shadow-sm active:bg-blue-600"
            activeOpacity={0.8}>
            <Text className="text-white font-semibold text-center text-base">
              Proceed
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles2 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // for Android shadow
    marginBottom:10
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8, // Note: If gap isn't supported in your RN version, use marginLeft on logoutText instead
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    padding:5
    // marginLeft: 8, // Uncomment this if gap isn't supported in your RN version
  },
});
export const styles = StyleSheet.create({
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
  suggestionList: {
    maxHeight: 200,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 2,
  },
  suggestionItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  suggestionText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#E8EDF1',
    marginHorizontal: 16,
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
    padding: 16,
    backgroundColor: '#F8F8FF', // Lighter shade of lavender
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8FF', // Subtle border color
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 20,
    marginBottom: 25,
  },

  proceedButton: {
    backgroundColor: '#1a237e', // Deeper, more professional blue
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{scale: 1}], // For potential animation
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5, // Adds professional spacing between letters
    textTransform: 'uppercase', // Makes the text more commanding
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

export default InfoPage;
