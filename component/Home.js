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
        const userRef = firestore().collection('users').doc(id); // Reference user document
        mainData[Rprtdate].startKm=startkmvalue
        mainData[Rprtdate].endKm = endkmvalue
        mainData[Rprtdate].starFuel = startfuelValue + `lit`;
        mainData[Rprtdate].endFuel = endfuelValue + `lit`;
         mainData[Rprtdate].FuelCost = `Rs `+fuelcost;
        
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
          endDate,
          mainData,
          fuelcost
        });

    }
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.cardContainer}>
          <View style={[styles.card, {marginBottom: 10}]}>
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>{name}</Text>
                <Text style={styles.headerText}>{number}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  makecall();
                }}
                style={styles.headerIconContainer}>
                <Icon name="phone" size={35} color={'#ffA500'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reporting Date and Time</Text>
              <Text style={styles.sectionText}>{Rprtdate}</Text>
            </View>
          </View>

          <View style={styles.line}></View>

          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>End Time</Text>
              <Text style={styles.sectionText}>{endDate}</Text>
            </View>
          </View>

          <View style={styles.line}></View>

          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reporting Address</Text>
                <Text style={styles.sectionText}>{address}</Text>
              </View>
              <TouchableOpacity style={styles.sectionIconContainer}>
                <Icon1 name="location" size={30} color={'#000000'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.line}></View>

          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Serving city</Text>
              <Text style={styles.sectionText}>{city}</Text>
            </View>
          </View>

          <View style={styles.line}></View>

          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Details</Text>
              <Text style={styles.sectionText}>{vehicleDetails}</Text>
            </View>
          </View>

          <View style={styles.line}></View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Duty Instructions</Text>
            <Text style={styles.sectionText}>{dutyInstructions}</Text>
          </View>

          <View style={styles.line}></View>

          {accept && (
            <View>
              <View style={styles.card}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Start Km</Text>
                  <TextInput
                    value={startKm}
                    keyboardType="numeric"
                    onChangeText={setStartkm}
                    placeholder="Enter Km"
                    style={styles.textInput}
                  />
                </View>
              </View>
              <View style={styles.line}></View>
              <View style={[styles.card, {marginTop: 5}]}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>End Km</Text>
                  <TextInput
                    value={endkm}
                    onChangeText={setendKm}
                    keyboardType="numeric"
                    placeholder="Enter Km"
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.line}></View>
              <View style={[styles.card, {marginTop: 5}]}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Fuel Cost In Rs</Text>
                  <TextInput
                    value={fuelcost}
                    keyboardType="numeric"
                    onChangeText={setfuelcost}
                    placeholder="Enter Cost of Fuel"
                    style={styles.textInput}
                  />
                </View>
              </View>
              <View style={styles.line}></View>
              <View style={[styles.card, {marginTop: 5}]}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Starting Fuel Reading</Text>
                  <TextInput
                    value={startFuel}
                    keyboardType="numeric"
                    onChangeText={setStartFuel}
                    placeholder="Enter Start Fuel Reading"
                    style={styles.textInput}
                  />
                </View>
              </View>
              <View style={styles.line}></View>
              <View style={[styles.card, {marginTop: 5}]}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>End Fuel Reading</Text>
                  <TextInput
                    value={endFuel}
                    keyboardType="numeric"
                    onChangeText={setEndFuel}
                    placeholder="Enter End Fuel Reading"
                    style={styles.textInput}
                  />
                </View>
              </View>
              <View style={styles.line}></View>

              <View style={styles.card}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Send OTP</Text>
                  <Text style={styles.sectionText}>
                    Please Select Any One of the Source to send OTP
                  </Text>
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      borderWidth: 2,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: 'gray',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        height: 50,
                      }}>
                      <Icon name="whatsapp" size={30} color={'#FFFF00'} />
                      <Text style={[styles.text, {color: '#FFFFFF'}]}>
                        Send code on Whatsapp
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        height: 50,
                      }}>
                      <Icon1 name="message" size={30} color={'#000000'} />
                      <Text style={[styles.text, {color: '#000000'}]}>
                        Send code on Message
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigate.goBack()}
          style={[styles.button, styles.noShowButton]}>
          <Text style={styles.buttonText}>{accept ? 'reject' : 'dismiss'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => afteraccept()}
          style={[styles.button, styles.startButton]}>
          <Text style={styles.buttonText}>{accept ? 'accept' : 'start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerIconContainer: {
    justifyContent: 'center',
    marginRight: 12,
  },
  section: {
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionIconContainer: {
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 18,
  },
  line: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 5,
    marginBottom: 30,
    backgroundColor: '#F5FFFA',
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noShowButton: {
    backgroundColor: '#FF0000',
  },
  startButton: {
    backgroundColor: '#0000FF',
  },
  buttonText: {
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
});

export default Home;
