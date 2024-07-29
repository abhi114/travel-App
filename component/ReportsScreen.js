import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  BackHandler,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Fontisto';
import { LineChart } from 'react-native-chart-kit';
import Linecharts from './helpers/charts';
import { LineView } from './helpers/helpers';

const UserDataScreen = ({route}) => {
  const {id} = route.params;
  const [userData, setUserData] = useState({});
  const [expanded, setExpanded] = useState({});
   const [selectedMonth, setSelectedMonth] = useState('');
   const [filteredData, setFilteredData] = useState({});
   const navigation = useNavigation();
   
  const EventItem = ({date, time, title, location}) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDateTime}>
        <Text style={styles.eventDate}>{date}</Text>
        <Text style={styles.eventTime}>{time}</Text>
      </View>
      <Text style={styles.eventTitle}>{title}</Text>
      <Text style={styles.eventLocation}>{location}</Text>
    </View>
  );

    useEffect(() => {
      const filterData = () => {
        if (selectedMonth === '') {
          setFilteredData(userData);
        } else {
          const filteredData = {};
          Object.keys(userData).forEach(key => {
            const date = new Date(key);
            if (date.getMonth() === selectedMonth) {
              filteredData[key] = userData[key];
            }
          });
          setFilteredData(filteredData);
        }
      };
      filterData();
    }, [selectedMonth, userData]);
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
  const handleMonthChange = month => {
    setSelectedMonth(month);
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Text style={styles.headerText}>Report Details</Text>
      </View>
      <View style={styles.monthSelector}>
        <Picker
          selectedValue={selectedMonth}
          style={{height: 50, width: Dimensions.width}}
          onValueChange={itemValue => handleMonthChange(itemValue)}>
          <Picker.Item label="Select Month" value="" />
          <Picker.Item label="January" value={0} />
          <Picker.Item label="February" value={1} />
          <Picker.Item label="March" value={2} />
          <Picker.Item label="April" value={3} />
          <Picker.Item label="May" value={4} />
          <Picker.Item label="June" value={5} />
          <Picker.Item label="July" value={6} />
          <Picker.Item label="August" value={7} />
          <Picker.Item label="September" value={8} />
          <Picker.Item label="October" value={9} />
          <Picker.Item label="November" value={10} />
          <Picker.Item label="December" value={11} />
        </Picker>
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
                  Date of Journey - {item}
                </Text>
                {!expanded[item] ? (
                  <Text style={{fontSize: 14, color: '#0000FF'}}>
                    Click for detailed View
                  </Text>
                ) : (
                  <Text style={{fontSize: 14, color: '#0000FF'}}>
                    Click for normal view
                  </Text>
                )}
              </View>
              {expanded[item] && (
                <View>
                  <View style={styles.cardBody}>
                    <View></View>
                    {Object.keys(userData[item].PassengerData).map(
                      passengerKey => (
                        <View key={passengerKey}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                            }}>
                            <Icon name="person-circle" size={50} />
                            <Text
                              style={{
                                color: '#000000',
                                fontSize: 20,
                                marginBottom: 1,
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}>
                              Driver's Name:
                            </Text>
                            <Text
                              style={{
                                color: '#0000FF',
                                fontSize: 20,
                                marginBottom: 1,
                                textAlign: 'center',
                              }}>
                              {userData[item].name}
                            </Text>
                          </View>
                          <View style={styles.line}></View>
                          <View style={{flexDirection: 'row',marginVertical:10}}>
                            <View style={{flexDirection: 'row'}}>
                              <Icon1 name="date" size={20} color={'#0000FF'} />
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginLeft: 5,
                                }}>
                                Start Date:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,

                                  color: '#000000',
                                }}>
                                {userData[item].ReportingDate}
                              </Text>
                            </View>
                            <View
                              style={{flexDirection: 'row', marginLeft: 10}}>
                              <Icon1 name="date" size={20} color={'#0000FF'} />
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginLeft: 5,
                                }}>
                                End Date:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,

                                  color: '#000000',
                                }}>
                                {userData[item].endDate}
                              </Text>
                            </View>
                          </View>
                          <LineView/>
                          <View style={{flexDirection: 'row',marginVertical:10}}>
                            <View style={{flexDirection: 'row'}}>
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
                          </View>
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
                          </View>
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
                  {userData[item].Feedback !== undefined ? (
                    <View style={styles.feedbackcard}>
                      <Text
                        style={{
                          margin: 8,
                          fontSize: 18,

                          color: '#000000',
                        }}>
                        {userData[item].Feedback}
                      </Text>
                    </View>
                  ) : (
                    <Text>Feedbacks Not available</Text>
                  )}
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
    backgroundColor: '#FFFFFF',
  },
  line: {
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252F40',
    textAlign: 'center',
  },
  monthSelector: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#E5E5EA',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
  eventItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 5,
  },
  eventDateTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eventDate: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#555',
    fontSize: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventLocation: {
    fontSize: 14,
    color: '#777',
  },
});

export default UserDataScreen;
