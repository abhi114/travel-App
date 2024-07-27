import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
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
        if(userData.exists){
        setUserData(userData.data());
        }
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
                {!expanded[item] ? (<Text>Click for detailed View</Text>):(<Text>Click for normal view</Text>)}
              </View>
              {expanded[item] && (
                <View>
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
                            Driver's Name:
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,

                              color: '#000000',
                            }}>
                            {userData[item].name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: '#000000',
                            }}>
                            Reporting Date:
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,

                              color: '#000000',
                            }}>
                            {userData[item].ReportingDate}
                          </Text>

                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: '#000000',
                            }}>
                            End Date:
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,

                              color: '#000000',
                            }}>
                            {userData[item].endDate}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: '#000000',
                            }}>
                            Start Km:
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,

                              color: '#000000',
                            }}>
                            {userData[item].startKm}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: '#000000',
                            }}>
                            End Km:
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,

                              color: '#000000',
                            }}>
                            {userData[item].endKm}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: '#000000',
                            }}>
                            Start Fuel:
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,

                              color: '#000000',
                            }}>
                            {userData[item].starFuel}
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: '#000000',
                            }}>
                            End Fuel:
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,

                              color: '#000000',
                            }}>
                            {userData[item].endFuel}
                          </Text>
                          <View>
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#000000',
                              }}>
                              Driver's Signature:
                            </Text>
                            {userData[item].passengersSignature !==
                            undefined ? (
                              <View style={styles.Imagecontainer}>
                                <Image
                                  source={{
                                    uri: userData[item].driversSignature,
                                  }}
                                  style={styles.image}
                                  resizeMode="contain"
                                />
                              </View>
                            ) : (
                              <View style={styles.Imagecontainer}>
                                <Text
                                  style={{
                                    margin: 8,
                                    fontSize: 18,

                                    color: '#000000',
                                  }}>
                                  No signature available
                                </Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.line}></View>
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
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#000000',
                      }}>
                      Passenger's Signature:
                    </Text>
                    {userData[item].passengersSignature !== undefined ? (
                      <View style={styles.Imagecontainer}>
                        <Image
                          source={{uri: userData[item].passengersSignature}}
                          style={styles.image}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View style={styles.Imagecontainer}>
                        <Text
                          style={{
                            margin: 8,
                            fontSize: 18,

                            color: '#000000',
                          }}>
                          No signature available
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{
                      margin: 8,
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#000000',
                    }}>
                    Feedbacks - 
                  </Text>
                  {userData[item].Feedback !== undefined ? (<View style={styles.feedbackcard}>
                  <Text
                    style={{
                      margin: 8,
                      fontSize: 18,

                      color: '#000000',
                    }}>
                    {userData[item].Feedback}
                  </Text>
                  </View>):(<Text>Feedbacks Not available</Text>)}
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
  Imagecontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  line: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 10,
  },
  feedbackcard: {
    backgroundColor: '#C9E4CA',
    borderRadius: 10,
    padding: 20,
    marginTop: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    marginBottom: 15,
  },
});

export default UserDataScreen;
