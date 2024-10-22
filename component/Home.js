import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Replace with your icon library
import Icon1 from 'react-native-vector-icons/Entypo'; // Replace with your icon library
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'; 
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import {Linking} from 'react-native';
 
const Home = ({route}) => {
    const navigate = useNavigation();
    const [startKm,setStartkm] = useState('');
    const [endkm,setendKm] = useState('');
    const [startFuel,setStartFuel] = useState('');
    const [endFuel,setEndFuel] = useState('');
    const [fuelcost,setfuelcost] = useState('');
    const getCurrentTime = () => {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12; // The hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero to minutes

      const time = `${hours}:${minutes} ${ampm}`;
      return time;
    };
    const {
      id,
      name,
      number,
      Rprtdate,
      endDate,
      address,
      city,
      vehicleDetails,
      dutyInstructions,
      mainData,month
    } = route.params;
    const makecall = ()=>{
      const phoneUrl = `tel:${number}`;
      Linking.openURL(phoneUrl).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
    const storeFuelData = async () => {
     try {
       const userRef = firestore().collection('userInfo').doc(id); // Reference user document
       const userDoc = await userRef.get(); // Get user document
       const userData = userDoc.data(); // Convert user document to object

       if (userData.monthExpenditure) {
         const currentMonthData = userData.monthExpenditure[month];
         const totalCost =
           (parseFloat(currentMonthData) || 0) + parseFloat(fuelcost);
         const fuelData = {
           [`monthExpenditure.${month}`]: totalCost.toString(),
         };
         await userRef.update(fuelData); // Set user data in the document
         console.log('fuel data updated');
       } else {
         console.log('Monthly expenditure data not found');
       }
     } catch (error) {
       console.error('Error storing fuel data:', error);
     }
    };
    const storeData = async (startkmvalue,endkmvalue,startfuelValue,endfuelValue) => {
      try {
        console.log(getCurrentTime());
        const userRef = firestore().collection('users').doc(id); // Reference user document
        mainData[Rprtdate].startKm=startkmvalue
        mainData[Rprtdate].endKm = endkmvalue
        mainData[Rprtdate].starFuel = startfuelValue + `lit`;
        mainData[Rprtdate].endFuel = endfuelValue + `lit`;
         mainData[Rprtdate].FuelCost = `Rs `+fuelcost;
          mainData[Rprtdate].endDate = getCurrentTime();
        const updatedUserData = mainData // Add new key-value pair
        console.log("updated data is" + JSON.stringify(updatedUserData));
        await userRef.set(updatedUserData, {merge: true}); // Set user data in the document
      } catch (error) {
        console.error('Error storing user data:', error);
      }
    };
    const [accept,setaccept] = useState(false);
    
    const afteraccept = async ()=>{
        console.log("hit");
        if(accept === false){
        setaccept(true);
        return;
        }
        if(startKm == '' || endkm == '' || startFuel== '' || endFuel == '' || fuelcost == ''){
          Alert.alert("please enter the km and fuel values");
          return;
        }
        await storeData(startKm,endkm,startFuel,endFuel);
        await storeFuelData();
        navigate.navigate('Duty', {
          name,
          number,
          startKm,
          endkm,
          id,
          startFuel,
          endFuel,
          Rprtdate,
          endDate:getCurrentTime(),
          mainData,
          fuelcost,
          vehicleDetails,
          address
        });

    }
 return (
   <View style={styles.container}>
     <ScrollView style={styles.scrollContainer}>
       <View style={styles.contentWrapper}>
         <Text style={styles.mainHeader}>Summary Details</Text>

         {/* Header Card */}
         <View style={styles.headerCard}>
           <View style={styles.headerContent}>
             <View>
               <Text style={styles.nameText}>{name}</Text>
               <Text style={styles.numberText}>{number}</Text>
             </View>
             <TouchableOpacity onPress={makecall} style={styles.phoneButton}>
               <Icon name="phone" size={24} color="#fff" />
             </TouchableOpacity>
           </View>
         </View>

         {/* Info Cards */}
         <View style={styles.infoCard}>
           <View style={styles.infoRow}>
             <View style={styles.infoContent}>
               <Text style={styles.infoLabel}>Reporting Date And Time</Text>
               <Text style={styles.infoValue}>{Rprtdate}</Text>
             </View>
             <Icon3 name="clock-time-five-outline" size={24} color="#555" />
           </View>
         </View>

         <View style={styles.infoCard}>
           <View style={styles.infoRow}>
             <View style={styles.infoContent}>
               <Text style={styles.infoLabel}>Reporting Address</Text>
               <Text style={styles.infoValue}>{address}</Text>
             </View>
             <Icon1 name="location" size={24} color="#555" />
           </View>
         </View>

         <View style={styles.infoCard}>
           <View style={styles.infoRow}>
             <View style={styles.infoContent}>
               <Text style={styles.infoLabel}>City</Text>
               <Text style={styles.infoValue}>{city}</Text>
             </View>
             <Icon3 name="home-city-outline" size={24} color="#555" />
           </View>
         </View>

         <View style={styles.infoCard}>
           <View style={styles.infoRow}>
             <View style={styles.infoContent}>
               <Text style={styles.infoLabel}>Vehicle Details</Text>
               <Text style={styles.infoValue}>{vehicleDetails}</Text>
             </View>
             <Icon3 name="car" size={24} color="#555" />
           </View>
         </View>

         {accept && (
           <View style={styles.readingsSection}>
             <Text style={styles.readingsHeader}>Final Readings</Text>
             <View style={styles.driverNote}>
               <Text style={styles.driverNoteText}>
                 To Be Filled By The Driver
               </Text>
               <Icon3 name="car-info" size={20} color="#2196F3" />
             </View>

             <View style={styles.inputGroup}>
               <Text style={styles.inputLabel}>Start Km</Text>
               <TextInput
                 value={startKm}
                 onChangeText={setStartkm}
                 keyboardType="numeric"
                 placeholder="Enter Km"
                 style={styles.input}
                 placeholderTextColor="#999"
               />
             </View>

             <View style={styles.inputGroup}>
               <Text style={styles.inputLabel}>End Km</Text>
               <TextInput
                 value={endkm}
                 onChangeText={setendKm}
                 keyboardType="numeric"
                 placeholder="Enter Km"
                 style={styles.input}
                 placeholderTextColor="#999"
               />
             </View>

             <View style={styles.inputGroup}>
               <Text style={styles.inputLabel}>Fuel Cost In Rs</Text>
               <TextInput
                 value={fuelcost}
                 onChangeText={setfuelcost}
                 keyboardType="numeric"
                 placeholder="Enter Cost of Fuel"
                 style={styles.input}
                 placeholderTextColor="#999"
               />
             </View>

             <View style={styles.inputGroup}>
               <Text style={styles.inputLabel}>Starting Fuel Reading</Text>
               <TextInput
                 value={startFuel}
                 onChangeText={setStartFuel}
                 keyboardType="numeric"
                 placeholder="Enter Start Fuel Reading"
                 style={styles.input}
                 placeholderTextColor="#999"
               />
             </View>

             <View style={styles.inputGroup}>
               <Text style={styles.inputLabel}>End Fuel Reading</Text>
               <TextInput
                 value={endFuel}
                 onChangeText={setEndFuel}
                 keyboardType="numeric"
                 placeholder="Enter End Fuel Reading"
                 style={styles.input}
                 placeholderTextColor="#999"
               />
             </View>
           </View>
         )}
       </View>
     </ScrollView>

     <View style={styles.footer}>
       <TouchableOpacity
         onPress={() => navigate.goBack()}
         style={[styles.footerButton, styles.dismissButton]}>
         <Text style={styles.buttonText}>{accept ? 'Reject' : 'Dismiss'}</Text>
       </TouchableOpacity>
       <TouchableOpacity
         onPress={() => afteraccept()}
         style={[styles.footerButton, styles.startButton]}>
         <Text style={styles.buttonText}>{accept ? 'Finish' : 'Start'}</Text>
       </TouchableOpacity>
     </View>
   </View>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentWrapper: {
    padding: 16,
  },
  mainHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    marginLeft: 4,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  numberText: {
    fontSize: 16,
    color: '#666',
  },
  phoneButton: {
    backgroundColor: '#2196F3',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  readingsSection: {
    marginTop: 24,
  },
  readingsHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  driverNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
  },
  driverNoteText: {
    color: '#2196F3',
    fontWeight: '600',
    marginRight: 8,
  },
  inputGroup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight:'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ADD8E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f8f8f8',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: 20,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButton: {
    backgroundColor: '#ef5350',
  },
  startButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Home;
