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
import WeeklyStats from './WeeklyStats';
import { ScrollView } from 'react-native';
import { Car, ChevronDown, ChevronUp, FileText, MapPin } from 'lucide-react-native';


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
    <ScrollView style={styles2.container}>
      <View style={styles2.header}>
        <Text style={styles2.headerText}>Report Details</Text>
      </View>

      <View style={styles2.pickerContainer}>
        <Picker
          selectedValue={selectedMonth}
          style={styles2.picker}
          onValueChange={itemValue => handleMonthChange(itemValue)}
          mode="dropdown">
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

      <View style={styles2.expenditureContainer}>
        <Text style={styles2.headerText}>Monthly Fuel Expenditure</Text>
        <Text style={styles2.subText}>
          Total Fuel Expenditure for the Month of{' '}
          {selectedMonth !== 13 ? monthNames[selectedMonth] : ' '} -
        </Text>
        <Text style={styles2.amountText}>
          Rs{' '}
          {selectedMonth !== 13
            ? userInfo.monthExpenditure?.[monthNames[selectedMonth]]
            : 0}
        </Text>
      </View>

      <LineView />
      {Object.keys(filteredData).length === 0 ? (
        <Text
          style={{
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            fontWeight: 'bold',
          }}>
          No Data Available
        </Text>
      ) : (
        <FlatList
          data={Object.keys(filteredData)}
          renderItem={({item}) => {
             const fuelUsed =
               parseInt(filteredData[item].endFuel) -
               parseInt(filteredData[item].starFuel);
            return (
              <TouchableOpacity
                onPress={() => handlePress(item)}
                style={styles2.touchable}
                activeOpacity={0.7}>
                <View style={styles2.cardContainer}>
                  <View style={styles2.cardHeader}>
                    <View style={styles2.dateContainer}>
                      <Text style={styles2.dateLabel}>Date of Journey</Text>
                      <Text style={styles2.dateValue}>{item}</Text>
                    </View>

                    <View style={styles2.expandButton}>
                      <Text style={styles2.expandText}>
                        {!expanded[item] ? 'View Details' : 'Show Less'}
                      </Text>
                      {!expanded[item] ? (
                        <ChevronDown size={20} color="#4A90E2" />
                      ) : (
                        <ChevronUp size={20} color="#4A90E2" />
                      )}
                    </View>
                  </View>
                  <View style={styles2.expandedContent}>
                    {expanded[item] && (
                      <View>
                        <View style={styles2.cardBody}>
                          {Object.keys(filteredData[item].PassengerData).map(
                            passengerKey => (
                              <View
                                key={passengerKey}
                                style={styles2.driverSection}>
                                <View style={styles2.driverHeader}>
                                  <View style={styles2.iconContainer}>
                                    <Icon
                                      name="person-circle"
                                      size={40}
                                      color="#4A90E2"
                                    />
                                  </View>
                                  <View style={styles2.driverInfo}>
                                    <Text style={styles2.label}>
                                      Driver's Name
                                    </Text>
                                    <Text style={styles2.driverName}>
                                      {filteredData[item].name}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles2.divider} />
                                <View style={styles2.dateSection}>
                                  <View style={styles2.dateContainer}>
                                    <View style={styles2.dateRow}>
                                      <View style={styles2.iconWrapper}>
                                        <Icon1
                                          name="date"
                                          size={20}
                                          color="#4A90E2"
                                        />
                                      </View>
                                      <View style={styles2.dateInfo}>
                                        <Text style={styles2.dateLabel}>
                                          Start Date
                                        </Text>
                                        <Text style={styles2.dateValue}>
                                          {filteredData[item].ReportingDate}
                                        </Text>
                                      </View>
                                    </View>

                                    <View style={styles2.separator} />

                                    <View style={styles2.dateRow}>
                                      <View style={styles2.iconWrapper}>
                                        <Icon1
                                          name="date"
                                          size={20}
                                          color="#4A90E2"
                                        />
                                      </View>
                                      <View style={styles2.dateInfo}>
                                        <Text style={styles2.dateLabel}>
                                          End Date
                                        </Text>
                                        <Text style={styles2.dateValue}>
                                          {filteredData[item].endDate}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles2.divider} />
                                <View style={styles2.distanceSection}>
                                  <View style={styles2.headerContainer}>
                                    <Icon
                                      name="speedometer-outline"
                                      size={24}
                                      color="#4A90E2"
                                    />
                                    <Text style={styles2.headerText}>
                                      Distance Travelled in Km
                                    </Text>
                                  </View>

                                  <View style={styles2.metersContainer}>
                                    <View style={styles2.meterCard}>
                                      <View style={styles2.iconWrapper}>
                                        <Icon
                                          name="location"
                                          size={20}
                                          color="#4A90E2"
                                        />
                                      </View>
                                      <View style={styles2.meterInfo}>
                                        <Text style={styles2.meterLabel}>
                                          Start Km
                                        </Text>
                                        <Text style={styles2.meterValue}>
                                          {filteredData[item].startKm}
                                        </Text>
                                      </View>
                                    </View>

                                    <View style={styles2.separator} />

                                    <View style={styles2.meterCard}>
                                      <View style={styles2.iconWrapper}>
                                        <Icon
                                          name="location"
                                          size={20}
                                          color="#4A90E2"
                                        />
                                      </View>
                                      <View style={styles2.meterInfo}>
                                        <Text style={styles2.meterLabel}>
                                          End Km
                                        </Text>
                                        <Text style={styles2.meterValue}>
                                          {filteredData[item].endKm}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>

                                  <View style={styles2.totalDistance}>
                                    <Text style={styles2.totalLabel}>
                                      Total Distance
                                    </Text>
                                    <Text style={styles2.totalValue}>
                                      {filteredData[item].endKm -
                                        filteredData[item].startKm}{' '}
                                      km
                                    </Text>
                                  </View>
                                </View>
                                <LineView />
                                <View style={styles2.fuelSection}>
                                  <View style={styles2.headerContainer}>
                                    <View style={styles2.iconWrapper}>
                                      <Icon3
                                        name="fuel"
                                        size={24}
                                        color="#4A90E2"
                                      />
                                    </View>
                                    <Text style={styles2.headerText}>
                                      Fuel Usage{' '}
                                      <Text style={styles2.subHeader}>
                                        (in litres)
                                      </Text>
                                    </Text>
                                  </View>

                                  <View style={styles2.fuelMetricsContainer}>
                                    <View style={styles2.fuelCard}>
                                      <View style={styles2.fuelInfo}>
                                        <Text style={styles2.fuelLabel}>
                                          Start Fuel
                                        </Text>
                                        <View
                                          style={styles2.fuelValueContainer}>
                                          <Text style={styles2.fuelValue}>
                                            {filteredData[item].starFuel}
                                          </Text>
                                          <Text
                                            style={styles2.unitLabel}></Text>
                                        </View>
                                      </View>
                                      <View
                                        style={styles2.fuelIndicator('full')}
                                      />
                                    </View>

                                    <View style={styles2.fuelCard}>
                                      <View style={styles2.fuelInfo}>
                                        <Text style={styles2.fuelLabel}>
                                          End Fuel
                                        </Text>
                                        <View
                                          style={styles2.fuelValueContainer}>
                                          <Text style={styles2.fuelValue}>
                                            {filteredData[item].endFuel}
                                          </Text>
                                          <Text
                                            style={styles2.unitLabel}></Text>
                                        </View>
                                      </View>
                                      <View
                                        style={styles2.fuelIndicator('low')}
                                      />
                                    </View>
                                  </View>

                                  <View style={styles2.totalFuelUsage}>
                                    <Text style={styles2.totalLabel}>
                                      Total Fuel Consumed
                                    </Text>
                                    <View style={styles2.totalValueContainer}>
                                      <Text style={styles2.totalValue}>
                                        {fuelUsed}
                                      </Text>
                                      <Text style={styles2.totalUnit}>
                                        Litres
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <LineView />
                                <View style={styles2.container}>
                                  {/* Fuel Cost Card */}
                                  <View style={styles2.costCard}>
                                    <View style={styles2.costHeader}>
                                      <View style={styles2.iconWrapper}>
                                        <Icon3
                                          name="currency-rupee"
                                          size={24}
                                          color="#4A90E2"
                                        />
                                      </View>
                                      <Text style={styles2.costLabel}>
                                        Fuel Costs
                                      </Text>
                                    </View>
                                    <Text style={styles2.costValue}>
                                      ₹ {filteredData[item].FuelCost}
                                    </Text>
                                  </View>

                                  <View style={styles2.divider} />

                                  {/* Details Section */}
                                  <View style={styles2.detailsSection}>
                                    {/* Location Details */}
                                    <View style={styles2.detailCard}>
                                      <View style={styles2.cardHeader}>
                                        <MapPin size={20} color="#4A90E2" />
                                        <Text style={styles2.cardTitle}>
                                          Location Details
                                        </Text>
                                      </View>

                                      <View style={styles2.detailRow}>
                                        <Text style={styles2.detailLabel}>
                                          Address
                                        </Text>
                                        <Text style={styles2.detailValue}>
                                          {filteredData[item].address}
                                        </Text>
                                      </View>

                                      <View style={styles2.detailRow}>
                                        <Text style={styles2.detailLabel}>
                                          City
                                        </Text>
                                        <Text style={styles2.detailValue}>
                                          {filteredData[item].city}
                                        </Text>
                                      </View>
                                    </View>

                                    {/* Duty Instructions */}
                                    <View style={styles2.detailCard}>
                                      <View style={styles2.cardHeader}>
                                        <FileText size={20} color="#4A90E2" />
                                        <Text style={styles2.cardTitle}>
                                          Duty Instructions
                                        </Text>
                                      </View>
                                      <Text style={styles2.instructionsText}>
                                        {filteredData[item].dutyInstructions}
                                      </Text>
                                    </View>

                                    {/* Vehicle Details */}
                                    <View style={styles2.detailCard}>
                                      <View style={styles2.cardHeader}>
                                        <Car size={20} color="#4A90E2" />
                                        <Text style={styles2.cardTitle}>
                                          Vehicle Details
                                        </Text>
                                      </View>
                                      <Text style={styles2.vehicleText}>
                                        {filteredData[item].vehicleDetails}
                                      </Text>
                                    </View>
                                  </View>
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
                                          uri: filteredData[item]
                                            .driversSignature,
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
                                      filteredData[item].PassengerData[
                                        passengerKey
                                      ].PassengerName
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
                                      filteredData[item].PassengerData[
                                        passengerKey
                                      ].DestinationAddress
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
                                      filteredData[item].PassengerData[
                                        passengerKey
                                      ].StartingAddress
                                    }
                                  </Text>
                                </View>
                                <LineView />
                              </View>
                            ),
                          )}
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
                          {filteredData[item].passengersSignature !==
                          undefined ? (
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
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item}
        />
      )}
    </ScrollView>
  );
};
const styles2 = StyleSheet.create({
  container: {
    padding: 16,
  },
  costCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  costLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  costValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EDF3',
    marginVertical: 16,
  },
  detailsSection: {
    gap: 16,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  instructionsText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  vehicleText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 5,
  },
  expandedContent: {
    marginTop: 15,
  },
  cardBody: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 8,
  },
  driverSection: {
    marginBottom: 16,
  },
  dateSection: {
    marginVertical: 12,
  },
  dateContainer: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  distanceSection: {
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
  },
  fuelSection: {
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
  },
  iconWrapper: {
    backgroundColor: '#EBF3FF',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  subHeader: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  fuelMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  fuelCard: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    borderRadius: 8,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  fuelInfo: {
    zIndex: 1,
  },
  fuelLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  fuelValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  fuelValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  unitLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  fuelIndicator: level => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: level === 'full' ? '#4CAF50' : '#FF9800',
  }),
  totalFuelUsage: {
    marginTop: 16,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 4,
  },
  totalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  totalUnit: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  metersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  meterCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FB',
    borderRadius: 8,
  },
  iconWrapper: {
    backgroundColor: '#EBF3FF',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  meterInfo: {
    flex: 1,
  },
  meterLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  meterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  separator: {
    width: 16,
  },
  totalDistance: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrapper: {
    backgroundColor: '#EBF3FF',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E8EDF3',
    marginVertical: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#F0F7FF',
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 16,
  },
  header: {
    marginBottom: 20,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginVertical: 8,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: Dimensions.get('window').width - 32, // Accounting for container padding
    backgroundColor: 'transparent',
  },
  expenditureContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  subText: {
    color: '#666666',
    fontSize: 14,
    marginVertical: 8,
    textAlign: 'center',
  },
  amountText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  touchable: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  expandText: {
    fontSize: 14,
    color: '#4A90E2',
    marginRight: 4,
    fontWeight: '500',
  },
});
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
