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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Replace with your icon library
import Icon1 from 'react-native-vector-icons/Entypo'; // Replace with your icon library
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
    const [views, setViews] = useState([{}]);
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
      const formattedDate = `${pad(
        date.getDate(),
      )}`;
      setRprDate(formattedDate);
      setIsDatePickerVisible(false);
    };

    const handleCancelDate = () => {
      setIsDatePickerVisible(false);
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
    const removeView = () => {
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

    console.log(passengerData);
  const afteraccept =async () => {
    if( Rprtdate === '' || endDate === '' || address === '' || city === '' || vehicleDetails === ''){
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
      endDate: endDate,
      address: address,
      city: city,
      vehicleDetails: vehicleDetails,
      dutyInstructions: dutyInstructions,
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
         endDate,
          address,
          city,
          vehicleDetails,
          dutyInstructions,
          mainData,
          month
        });
    
  };
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.buttonContainer,
            {flexDirection: 'row', justifyContent: 'space-between',},
          ]}>
          <Text style={styles.headerText}>Your Details</Text>
          <TouchableOpacity onPress={logout} style={{justifyContent:'center',alignItems:'center',}}>
            <Icon3 name="logout" size={20} color={'#a2b223'} />
            <Text style={{marginRight:5}}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Full Name *</Text>
            <Text style={styles.textInput}>{driversdta.name}</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Number *</Text>
            <Text style={styles.textInput}>{driversdta.MobileNumber}</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reporting Date * </Text>
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
                keyboardType="numeric"
                inputMode="date"
                onChangeText={setRprDate}
                value={Rprtdate}
                placeholder="Enter in 00 th/st "
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
                onPress={handleDatePicker}>
                <Icon3 name="calendar" size={30} color="#4F8EF7" />
                <Text>Select Date </Text>
              </TouchableOpacity>
            </View>
            {isDatePickerVisible && (
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={handleCancelDate}
                is24Hour={false}
              />
            )}
          </View>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reporting Time *</Text>
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
                onChangeText={setRprtTime}
                value={RprtTime}
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
                onPress={handleTimePicker}>
                <Icon4 name="access-time" size={30} color="#4F8EF7" />
                <Text>Select Time </Text>
              </TouchableOpacity>
            </View>
            {isTimePickerVisible && (
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                is24Hour={false}
              />
            )}
          </View>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reporting month*</Text>
            <TextInput
              inputMode="date"
              onChangeText={setmonth}
              value={month}
              placeholder="Enter month"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
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
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reporting Address *</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.sectionIconContainer}>
                <Icon1 name="location" size={30} color={'#000000'} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Serving city *</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Enter City"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Vehicle Details *</Text>
            <TextInput
              value={vehicleDetails}
              onChangeText={setvehicleDetails}
              placeholder="Enter Vehicle Details"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Duty Instructions *</Text>
            <TextInput
              value={dutyInstructions}
              onChangeText={setDutyInstructions}
              placeholder="Enter Instructions"
              style={styles.textInput}
            />
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Passengers Information *</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
              marginVertical: 10,
            }}>
            <TouchableOpacity
              onPress={removeView}
              style={styles.removeViewButton}>
              <Text>Remove</Text>
              <Icon3 name="minus" size={26} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={addView} style={styles.addViewButton}>
              <Text>Add</Text>
              <Icon3 name="plus" size={26} color="#000000" />
            </TouchableOpacity>
          </View>
          {views.map((view, index) => (
            <View key={index} style={styles.cardContainer}>
              <Text style={styles.sectionTitle}>Passenger {index + 1}</Text>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Name Of Passenger *</Text>
                <TextInput
                  value={passengerNames[index]}
                  onChangeText={value =>
                    handlePassengerNameChange(index, value)
                  }
                  placeholder="Enter Name of passenger"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Starting Address *</Text>
                <TextInput
                  value={startingAddress[index]}
                  onChangeText={value =>
                    handleStartingAddressChange(index, value)
                  }
                  placeholder="Enter Starting address"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Drop Address *</Text>
                <TextInput
                  value={destinationAddress[index]}
                  onChangeText={value =>
                    handleDestinationAddressChange(index, value)
                  }
                  placeholder="Enter Drop Address"
                  style={styles.textInput}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => afteraccept()}
          style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    color: '#252F40',
    textAlign: 'center',
    justifyContent:'center',
    alignSelf:'center'
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
    marginTop: 10,
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
    marginBottom:25
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
    padding: 10,
    margin: 5,
    underlineStyle: {
      borderBottomWidth: 2,
      borderBottomColor: 'blue',
    },
  },
});

export default InfoPage;
