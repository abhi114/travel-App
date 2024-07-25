import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const UserDataScreen = ({route}) => {
  const {id} = route.params;
  const [userData, setUserData] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userRef = firestore().collection('users').doc(id);
        const userData = await userRef.get();
        setUserData(userData.data());
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, [id]);

  const handlePress = date => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [date]: !prevExpanded[date],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Text style={styles.headerText}>Report Details</Text>
      </View>
      <FlatList
        data={Object.keys(userData)}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#000000',
                  }}>
                  {item}
                </Text>
              </View>
              {expanded[item] && (
                <View style={styles.cardBody}>
                  {Object.keys(userData[item].PassengerData).map(
                    passengerKey => (
                      <View key={passengerKey}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#000000',
                          }}>
                          {passengerKey}:{' '}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,

                            color: '#000000',
                          }}>
                          Name:{' '}
                          {
                            userData[item].PassengerData[passengerKey]
                              .PassengerName
                          }
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,

                            color: '#000000',
                          }}>
                          Destination Address:{' '}
                          {
                            userData[item].PassengerData[passengerKey]
                              .DestinationAddress
                          }
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,

                            color: '#000000',
                          }}>
                          Starting Address:{' '}
                          {
                            userData[item].PassengerData[passengerKey]
                              .StartingAddress
                          }
                        </Text>
                      </View>
                    ),
                  )}
                  <Text style={styles.heading}>Address</Text>
                  <Text
                    style={{
                      fontSize: 15,

                      color: '#000000',
                    }}>
                    {userData[item].address}
                  </Text>
                  <Text style={styles.heading}>City</Text>
                  <Text
                    style={{
                      fontSize: 15,

                      color: '#000000',
                    }}>
                    {userData[item].city}
                  </Text>
                  <Text style={styles.heading}>Duty Instructions</Text>
                  <Text
                    style={{
                      fontSize: 15,

                      color: '#000000',
                    }}>
                    {userData[item].dutyInstructions}
                  </Text>
                  <Text style={styles.heading}>Vehicle Details</Text>
                  <Text
                    style={{
                      fontSize: 15,

                      color: '#000000',
                    }}>
                    {userData[item].vehicleDetails}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252F40',
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 10,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
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
    marginBottom:15
  },
});

export default UserDataScreen;
