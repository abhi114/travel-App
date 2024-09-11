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
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Fontisto';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import Linecharts from './helpers/charts';
import { LineView } from './helpers/helpers';
import Widget from './ReportsScreenDetailed';


const UserDataScreen = ({route}) => {
  const {id} = route.params;
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
    'January',
  ];
  const [userData, setUserData] = useState({});
  const [expanded, setExpanded] = useState({});
  const [mainuserData,setmainuserData] = useState({});
   const [selectedMonth, setSelectedMonth] = useState(13);
   const [filteredData, setFilteredData] = useState({});
    const [userInfo, setUserInfo] = useState([]);
   const navigation = useNavigation();
   console.log(userInfo.monthExpenditure?.[monthNames[selectedMonth]]);
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
      const fetchUserInfo = async () => {
        const response = firestore().collection('userInfo').doc(id);
        const data = await response.get();
        if (data.exists) {
          const userInfo = {
            id: data.id, // Get the document ID
            ...data.data(), // Get the document data
          };
          setUserInfo(userInfo);
          console.log('real value is' + JSON.stringify(userInfo));
          
        } else {
          console.log('Document not found');
        }
      };
      fetchUserInfo();
    }, []);
    
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userRef = firestore().collection('users').doc(id);
        const userData = await userRef.get();
        if(userData.exists){
          setmainuserData(userData.data());
        setUserData(userData.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, [id]);
  useEffect(() => {
    const filterData = () => {
      if (selectedMonth === 13) {
        setFilteredData(mainuserData);
      } else {
        const filteredData = {};
        Object.keys(mainuserData).forEach(key => {
          const date = new Date(key);
          if (mainuserData[key].ReportingMonth == monthNames[selectedMonth]) {
            filteredData[key] = mainuserData[key];
          }
        });
        setFilteredData(filteredData);
      }
    };
    filterData();
  }, [selectedMonth,mainuserData]);
  const handlePress = date => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [date]: !prevExpanded[date],
    }));
  };
  const handleMonthChange = month => {
     console.log(monthNames[month]);
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
          <Picker.Item label="Select Month" value={13} />
          <Picker.Item label="January" value={12} />
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
      <LineView />
      <View>
        <Text style={styles.headerText}>Monthly Fuel Expenditure</Text>
        <Text
          style={{
            color: '#000000',
            fontSize: 12,
            marginBottom: 1,
            margin: 5,
            textAlign: 'center',
          }}>
          Total Fuel Expenditure for the Month of{' '}
          {selectedMonth !== 13 ? monthNames[selectedMonth] : ' '} -
        </Text>
        <Text
          style={{
            color: '#000000',
            fontSize: 12,
            marginBottom: 1,
            margin: 5,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Rs{' '}
          {selectedMonth !== 13
            ? userInfo.monthExpenditure?.[monthNames[selectedMonth]]
            : 0}
        </Text>
      </View>
      <LineView />
      {Object.keys(filteredData).length === 0 ? (
        <Text style={{flex:1,justifyContent:'center',alignSelf:'center',fontWeight:'bold'}}>No Data Available</Text>
      ) : (
        <FlatList
          data={Object.keys(filteredData)}
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
                      {Object.keys(filteredData[item].PassengerData).map(
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
                                {filteredData[item].name}
                              </Text>
                            </View>
                            <View style={styles.line}></View>
                            <View
                              style={{
                                flexDirection: 'column',
                                marginVertical: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <Icon1
                                  name="date"
                                  size={20}
                                  color={'#0000FF'}
                                />
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
                                    fontSize: 14,

                                    color: '#000000',
                                  }}>
                                  {filteredData[item].ReportingDate}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginVertical: 8,
                                }}>
                                <Icon1
                                  name="date"
                                  size={20}
                                  color={'#0000FF'}
                                />
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
                                  {filteredData[item].endDate}
                                </Text>
                              </View>
                            </View>
                            <LineView />
                            <Text
                              style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#000000',
                                marginVertical: 5,
                              }}>
                              Distance Travelled in Km -
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginVertical: 10,
                                justifyContent: 'space-around',
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <Icon
                                  name="location"
                                  size={20}
                                  color={'#0000FF'}
                                />
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
                                  {filteredData[item].startKm}
                                </Text>
                              </View>
                              <View style={{flexDirection: 'row'}}>
                                <Icon
                                  name="location"
                                  size={20}
                                  color={'#0000FF'}
                                />
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
                                  {filteredData[item].endKm}
                                </Text>
                              </View>
                            </View>
                            <LineView />
                            <View style={{flexDirection: 'row'}}>
                              <Icon3 name="fuel" size={26} color={'#0000FF'} />
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                Fuel Usages {`(in litres)-`}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginVertical: 10,
                                justifyContent: 'space-around',
                              }}>
                              <View style={{flexDirection: 'row'}}>
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
                                  {filteredData[item].starFuel}
                                </Text>
                              </View>
                              <View style={{flexDirection: 'row'}}>
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
                                  {filteredData[item].endFuel}
                                </Text>
                              </View>
                            </View>
                            <LineView />
                            <View style={{flexDirection: 'row'}}>
                              <Icon3
                                name="currency-rupee"
                                size={26}
                                color={'#0000FF'}
                              />
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                Fuel Costs {`(in Rs)-`}{' '}
                                {filteredData[item].FuelCost}
                              </Text>
                            </View>

                            <View>
                              <LineView />
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                }}>
                                Driver's Signature:
                              </Text>
                              {filteredData[item].passengersSignature !==
                              undefined ? (
                                <View style={styles.Imagecontainer}>
                                  <Image
                                    source={{
                                      uri: filteredData[item].driversSignature,
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
                            <View style={{flexDirection: 'row'}}>
                              <Icon
                                name="person-circle"
                                size={35}
                                color={'#0000FF'}
                              />
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                {passengerKey}:{' '}
                              </Text>
                            </View>
                            <LineView />
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                Name:{' '}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 18,

                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                {
                                  filteredData[item].PassengerData[passengerKey]
                                    .PassengerName
                                }
                              </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                Destination Address:{' '}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 18,

                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                {
                                  filteredData[item].PassengerData[passengerKey]
                                    .DestinationAddress
                                }
                              </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                Starting Address:{' '}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 18,

                                  color: '#000000',
                                  marginVertical: 5,
                                }}>
                                {
                                  filteredData[item].PassengerData[passengerKey]
                                    .StartingAddress
                                }
                              </Text>
                            </View>
                            <LineView />
                          </View>
                        ),
                      )}
                      <Text style={styles.heading}>Address</Text>
                      <Text
                        style={{
                          fontSize: 15,

                          color: '#000000',
                        }}>
                        {filteredData[item].address}
                      </Text>
                      <Text style={styles.heading}>City</Text>
                      <Text
                        style={{
                          fontSize: 15,

                          color: '#000000',
                        }}>
                        {filteredData[item].city}
                      </Text>
                      <Text style={styles.heading}>Duty Instructions</Text>
                      <Text
                        style={{
                          fontSize: 15,

                          color: '#000000',
                        }}>
                        {filteredData[item].dutyInstructions}
                      </Text>
                      <Text style={styles.heading}>Vehicle Details</Text>
                      <Text
                        style={{
                          fontSize: 15,

                          color: '#000000',
                        }}>
                        {filteredData[item].vehicleDetails}
                      </Text>
                    </View>
                    <LineView />
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#000000',
                        }}>
                        Passenger's Signature:
                      </Text>
                      {filteredData[item].passengersSignature !== undefined ? (
                        <View style={styles.Imagecontainer}>
                          <Image
                            source={{
                              uri: filteredData[item].passengersSignature,
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
                    <LineView />
                    <Text
                      style={{
                        margin: 8,
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#000000',
                      }}>
                      Feedbacks -
                    </Text>
                    {filteredData[item].Feedback !== undefined ? (
                      <View style={styles.feedbackcard}>
                        <Text
                          style={{
                            margin: 8,
                            fontSize: 18,

                            color: '#000000',
                          }}>
                          {filteredData[item].Feedback}
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
      )}
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
    backgroundColor: '#E5E5EA',
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
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
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

const styles1 = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 18,
  },
});


export default UserDataScreen;
