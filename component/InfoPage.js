import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Replace with your icon library
import Icon1 from 'react-native-vector-icons/Entypo'; // Replace with your icon library
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const InfoPage = ({route}) => {
    const {id} = route.params;
    
  const navigate = useNavigation();
  const [name,setName] = useState('');
  const [number,enterNumber] = useState('');
  const [Rprtdate,setRprDate] = useState('');
  const [endDate,setEndDate] = useState('');
  const [address,setAddress] = useState('');
  const[city,setCity] = useState('');
  const [vehicleDetails,setvehicleDetails]= useState('');
    const [dutyInstructions,setDutyInstructions] =useState('');

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
    useEffect(() => {
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
    }, [id])
    

    const storeData = async (userId,userData)=>{
        try {
    const userRef = firestore().collection('users').doc(userId); // Reference user document
    await userRef.set(userData); // Set user data in the document
  } catch (error) {
    console.error('Error storing user data:', error);
  }
    }
  const afteraccept =async () => {
    if(name === '' || number === '' || Rprtdate === '' || endDate === '' || address === '' || city === '' || vehicleDetails === '' || dutyInstructions === '' ){
        alert("Please fill all the Fields")
        return;
    }
    console.log("id is" + id);
    const data = {
        name:name,
        number:number,
        ReportingDate:Rprtdate,
        endDate:endDate,
        address:address,
        city:city,
        vehicleDetails:vehicleDetails,
        dutyInstructions:dutyInstructions,
    }   
        console.log(data);
        await storeData(id,data);
        navigate.navigate('Home', {
          id,
          name,
          number,
          Rprtdate,
          endDate,
          address,
          city,
          vehicleDetails,
          dutyInstructions,
        });
    
  };
  return (
    <View style={styles.outerContainer}>
      
      <ScrollView style={styles.container}>
        <View style={styles.buttonContainer}>
          <Text style={styles.headerText}>Your Details</Text>
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
            <Text style={styles.sectionTitle}>Number</Text>
            <TextInput
              onChangeText={enterNumber}
              value={number}
              placeholder="Enter Number"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reporting Date and Time</Text>
            <TextInput
              onChangeText={setRprDate}
              value={Rprtdate}
              placeholder="Enter reporting date and time"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>End Date</Text>
            <TextInput
              value={endDate}
              onChangeText={setEndDate}
              placeholder="Enter date"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reporting Address</Text>
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
            <Text style={styles.sectionTitle}>Serving city</Text>
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
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
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
            <Text style={styles.sectionTitle}>Duty Instructions</Text>
            <TextInput
              value={dutyInstructions}
              onChangeText={setDutyInstructions}
              placeholder="Enter Instructions"
              style={styles.textInput}
            />
          </View>
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

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#d3d3d3',
  },
  headerContainer: {
    backgroundColor: '#007bff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252F40',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#C9E4CA',
    borderRadius: 10,
    padding: 20,
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
    padding: 15,
    backgroundColor: '#e6e6fa',
    borderRadius: 10, // Add a slight corner radius
    borderWidth: 1, // Add a thin border
    borderColor: '#CCCCCC', // Light gray border color
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
