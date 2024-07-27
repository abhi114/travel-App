import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

    const handleViewProfile = (id)=>{
        if(id){
            navigation.navigate("ReportsScreen",{id})
        }
    }
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = firestore().collection('userInfo');
      const data = await response.get();
      const userInfoArray = data.docs.map(doc => ({
        id: doc.id, // Get the document ID
        ...doc.data(), // Get the document data
      }));
      setUserInfo(userInfoArray);
      setLoading(false);
    };
    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome To Admin DashBoard</Text>
        <Icon1 name="admin-panel-settings" size={30} color={'#000'} />
      </View>
      <View style={styles.cardHeader}>
        <View style={styles.subcontainer}>
          <Text style={styles.subheading}>All Drivers Information</Text>
          <Icon name="drivers-license" size={30} color={'#000'} />
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          userInfo.map((user, index) => (
            <View
              key={index}
              style={styles.card}
              onPress={() => console.log(`Card ${index} pressed`)}>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>
                  Driver {index + 1} Information
                </Text>
                <Text style={styles.cardText}>Name: {user.name}</Text>
                <Text style={styles.cardText}>
                  Mobile Number: {user.MobileNumber}
                </Text>
                <Text style={styles.cardText}>
                  Address: {user.driverAddress}
                </Text>
                
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleViewProfile(user.id)}>
                  <Text style={styles.buttonText}>View Profile {`->`}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardHeader: {
    backgroundColor: '#fff',
    padding: 11,
    margin:9,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 12,
    backgroundColor: 'white',
  },
  subheading: {
    fontSize: 20, // Adjust the size as needed
    fontWeight: 'bold',
    color: 'black', // Black color for the text
    textDecorationLine: 'underline',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  underline: {
    height: 2,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'pace-around',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  cardBody: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    color:'#000',
    padding:5
  },
  button: {
    margin:5,
    backgroundColor: '#03A9F4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});

export default AdminDashboard;
