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
  Linking,
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeInUp} from 'react-native-reanimated';
import { LocationCard, VehicleCard } from './helpers/Cards';
import PassengerDetails from './helpers/PassengerDetailsCard';
import FuelExpenditureCard from './helpers/FuelExpenditureCard';

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

        if (userData.exists) {
          const data = userData.data();
          const sortedData = {};

          // Sort entries by timestamp in descending order, placing entries without `createdAt` at the end
          Object.keys(data)
            .sort((a, b) => {
              //console.log("data is " + JSON.stringify(data[a]))
              const timestampA = data[a]?.createdAt?.toMillis?.() ?? -Infinity; // If createdAt is missing, treat it as very low
              const timestampB = data[b]?.createdAt?.toMillis?.() ?? -Infinity;
              return timestampB - timestampA; // Sort in descending order
            })
            .forEach(key => {
              sortedData[key] = data[key]; // Build the sorted data object
            });

          setmainuserData(sortedData);
          setUserData(sortedData);
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
  function removeMonth(dateString) {
    const monthRegex = dateString.split(' '); // Matches a whole word
    return monthRegex.filter((element, index) => index !== 1).join(' ');
  }
  // const sortTheData = data => {
  //   console.log('Data given to sort is:', JSON.stringify(data));

  //   const validEntries = [];
  //   const invalidEntries = [];

  //   // Separate valid and invalid entries based on date parsing
  //   Object.entries(data).forEach(([key, value]) => {
  //     const parseDate = key => {
  //       try {
  //         const [day, month, yearAndTime] = key.split('-');
  //         const [year, time, ampm] = yearAndTime.split(' ');
  //         return new Date(`${year}-${month}-${day} ${time} ${ampm}`);
  //       } catch (e) {
  //         return null; // Return null if parsing fails
  //       }
  //     };

  //     const date = parseDate(key);
  //     if (date && !isNaN(date)) {
  //       validEntries.push([key, value, date]);
  //     } else {
  //       invalidEntries.push([key, value]);
  //     }
  //   });

  //   // Sort valid entries based on parsed date
  //   validEntries.sort(([, , dateA], [, , dateB]) => dateA - dateB);

  //   // Convert sorted valid entries and unsorted invalid entries back to object
  //   const sortedObject = Object.fromEntries([
  //     ...validEntries.map(([key, value]) => [key, value]),
  //     ...invalidEntries,
  //   ]);

  //   return sortedObject;
  // };
  
  return (
    <ScrollView style={styles2.container}>
      <View style={styles2.header}>
        <Text style={styles2.headerText}>Report Details</Text>
      </View>
      <LinearGradient
        colors={['#F0F0F0', '#F5F5F5', '#FAFAFA']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        <View style={styles2.pickerContainer}>
          <LinearGradient
            colors={['#7C4DFF', '#673AB7', '#f278ee']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradient}>
            <Picker
              selectedValue={selectedMonth}
              style={styles2.picker}
              onValueChange={itemValue => handleMonthChange(itemValue)}
              mode="dropdown">
              <Picker.Item
                label="Select Month"
                value={13}
                style={styles2.pickerItem}
              />
              <Picker.Item
                label="January"
                value={12}
                style={styles2.pickerItem}
              />
              <Picker.Item
                label="February"
                value={1}
                style={styles2.pickerItem}
              />
              <Picker.Item label="March" value={2} style={styles2.pickerItem} />
              <Picker.Item label="April" value={3} style={styles2.pickerItem} />
              <Picker.Item label="May" value={4} style={styles2.pickerItem} />
              <Picker.Item label="June" value={5} style={styles2.pickerItem} />
              <Picker.Item label="July" value={6} style={styles2.pickerItem} />
              <Picker.Item
                label="August"
                value={7}
                style={styles2.pickerItem}
              />
              <Picker.Item
                label="September"
                value={8}
                style={styles2.pickerItem}
              />
              <Picker.Item
                label="October"
                value={9}
                style={styles2.pickerItem}
              />
              <Picker.Item
                label="November"
                value={10}
                style={styles2.pickerItem}
              />
              <Picker.Item
                label="December"
                value={11}
                style={styles2.pickerItem}
              />
            </Picker>
          </LinearGradient>
        </View>

        {/* <LineView /> */}

        {/* <View style={styles2.expenditureContainer}>
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
        </View> */}
        <FuelExpenditureCard selectedMonth={selectedMonth} monthNames={monthNames} userInfo={userInfo}/>

        {/* <LineView /> */}
        {Object.keys(filteredData).length === 0 ? (
          <Text
            style={{
              flex: 1,
              justifyContent: 'center',
              alignSelf: 'center',
              fontWeight: 'bold',
              color: '#000',
            }}>
            No Data Available
          </Text>
        ) : (
          <FlatList
            data={Object.keys(filteredData)}
            renderItem={({item}) => {
              const fuelUsed = Math.abs(
                parseInt(filteredData[item].endFuel) -
                  parseInt(filteredData[item].starFuel),
              );
              return (
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  style={styles2.touchable}
                  activeOpacity={0.7}>
                  <Animated.View style={styles2.cardContainer}>
                    
                    <View style={styles2.cardHeader}>
                      <View style={styles2.dateContainer}>
                        <Text style={styles2.dateLabel}>Date of Journey</Text>
                        <Text style={styles2.dateValue}>
                          {removeMonth(item)}
                        </Text>
                      </View>

                      <View style={styles2.expandButton}>
                        <Text style={styles2.expandText}>
                          {!expanded[item] ? 'View Details' : 'Show Less'}
                        </Text>
                        {!expanded[item] ? (
                          <ChevronDown size={wp(4)} color="#4A90E2" />
                        ) : (
                          <ChevronUp size={wp(4)} color="#4A90E2" />
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
                                  {/* <View style={styles2.driverHeader}>
                                    <View style={styles2.iconContainer}>
                                      <Icon
                                        name="person-circle"
                                        size={wp(10)}
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
                                  </View> */}
                                  <View style={styles2.divider} />
                                  <View style={styles2.dateSection}>
                                    <View style={styles2.dateContainer}>
                                      <View style={styles2.dateRow}>
                                        <View style={styles2.iconWrapper}>
                                          <Icon1
                                            name="date"
                                            size={wp(5)}
                                            color="#4A90E2"
                                          />
                                        </View>
                                        <View style={styles2.dateInfo}>
                                          <Text style={styles2.dateLabel}>
                                            Start Date
                                          </Text>
                                          <Text style={styles2.dateValue}>
                                            {removeMonth(
                                              filteredData[item].ReportingDate,
                                            )}
                                          </Text>
                                        </View>
                                      </View>

                                      <View style={styles2.separator} />

                                      <View style={styles2.dateRow}>
                                        <View style={styles2.iconWrapper}>
                                          <Icon1
                                            name="date"
                                            size={wp(5)}
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
                                        size={wp(6)}
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
                                            size={wp(5)}
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
                                            size={wp(5)}
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
                                          size={wp(6)}
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
                                    <Animated.View
                                      entering={FadeInUp.duration(400)}
                                      style={styles3.costCard}>
                                      <LinearGradient
                                        colors={['#F8FAFF', '#F0F7FF']}
                                        start={{x: 0, y: 0}}
                                        end={{x: 1, y: 1}}
                                        style={styles3.gradientContainer}>
                                        <View style={styles3.costHeader}>
                                          <View
                                            style={styles3.iconWrapper}></View>
                                          <Text style={styles3.costLabel}>
                                            Fuel Costs
                                          </Text>
                                        </View>

                                        <View
                                          style={styles3.costValueContainer}>
                                          <Text style={styles3.currencySymbol}>
                                            ₹
                                          </Text>
                                          <Text style={styles3.costValue}>
                                            {filteredData[item].FuelCost}
                                          </Text>
                                        </View>

                                        {/* Optional: Add percentage change indicator */}
                                        <View style={styles3.changeIndicator}>
                                          <Icon3
                                            name="trending-up"
                                            size={wp('3.5%')}
                                            color="#66BB6A"
                                          />
                                          <Text style={styles3.changeText}>
                                            +2.4% from last month
                                          </Text>
                                        </View>
                                      </LinearGradient>
                                    </Animated.View>

                                    <View style={styles2.divider} />

                                    {/* Details Section */}
                                    <View style={styles2.detailsSection}>
                                      {/* Location Details */}
                                      <LocationCard
                                        data={filteredData}
                                        item={item}
                                      />

                                      {/* Duty Instructions */}
                                      {/* <View style={styles2.detailCard}>
                                      <View style={styles2.cardHeader}>
                                        <FileText size={20} color="#4A90E2" />
                                        <Text style={styles2.cardTitle}>
                                          Duty Instructions
                                        </Text>
                                      </View>
                                      <Text style={styles2.instructionsText}>
                                        {filteredData[item].dutyInstructions}
                                      </Text>
                                    </View> */}

                                      {/* Vehicle Details */}
                                      <VehicleCard
                                        data={filteredData}
                                        item={item}
                                      />
                                    </View>
                                  </View>
                                  <View className="w-full">
                                    <LineView />

                                    {/* Driver's Signature Section */}
                                    <View style={{marginBottom: wp(3)}}>
                                      <Text className="text-lg font-bold text-gray-900 mb-2">
                                        Driver's Signature:
                                      </Text>

                                      {filteredData[item]
                                        .passengersSignature !== undefined ? (
                                        <View
                                          className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                                          style={{height: wp(40)}}>
                                          <Image
                                            source={{
                                              uri: filteredData[item]
                                                .driversSignature,
                                            }}
                                            className="w-full h-full"
                                            resizeMode="contain"
                                          />
                                        </View>
                                      ) : (
                                        <View
                                          className="w-full bg-gray-50 rounded-lg border border-gray-200 items-center justify-center"
                                          style={{height: wp(40)}}>
                                          <Text
                                            className="text-lg text-gray-900 "
                                            style={{padding: wp(2)}}>
                                            No signature available
                                          </Text>
                                        </View>
                                      )}
                                    </View>

                                    {/* Divider Line */}
                                    <LineView />

                                    {/* Passenger Info Section */}
                                    <View className="flex-row items-center space-x-2">
                                      <Icon
                                        name="person-circle"
                                        size={wp(10)}
                                        color="#2563eb" // Tailwind blue-600
                                      />
                                      <Text className="text-lg font-bold text-gray-900">
                                        {passengerKey}:{' '}
                                      </Text>
                                    </View>
                                  </View>
                                  <LineView />
                                  <PassengerDetails
                                    filteredData={filteredData}
                                    item={item}
                                    passengerKey={passengerKey}
                                  />
                                  {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: wp('4.5%'),
                                      fontWeight: 'bold',
                                      color: '#000000',
                                      marginVertical: hp('1%'),
                                      flexShrink: 1,
                                    }}>
                                    Starting Address:
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: wp('4.5%'),
                                      color: '#000000',
                                      marginVertical: hp('1%'),
                                      flexShrink: 1,
                                    }}>
                                    {
                                      filteredData[item].PassengerData[
                                        passengerKey
                                      ].StartingAddress
                                    }
                                  </Text>
                                </View> */}
                                  <LineView />
                                </View>
                              ),
                            )}
                          </View>

                          <View className="mb-6">
                            <View className="flex-row items-center mb-3 gap-2">
                              <Icon3
                                name="draw-pen"
                                size={24}
                                color="#4B5563"
                                className="mr-3"
                              />
                              <Text className="text-xl font-bold text-gray-900">
                                Passenger's Signature
                              </Text>
                            </View>

                            {filteredData[item].passengersSignature !==
                            undefined ? (
                              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <Image
                                  source={{
                                    uri: filteredData[item].passengersSignature,
                                  }}
                                  className="w-full h-32 rounded-lg"
                                  resizeMode="contain"
                                />
                              </View>
                            ) : (
                              <View className="bg-gray-50 rounded-xl p-6 border border-gray-200 items-center justify-center">
                                <Icon3
                                  name="pencil-off"
                                  size={32}
                                  color="#9CA3AF"
                                  className="mb-2"
                                />
                                <Text className="text-gray-500 text-lg">
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
                  </Animated.View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item}
          />
        )}
      </LinearGradient>
    </ScrollView>
  );
};
const styles3 = StyleSheet.create({
  costCard: {
    borderRadius: wp('4%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('2%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A237E',
    shadowOffset: {
      width: 0,
      height: hp('0.5%'),
    },
    shadowOpacity: 0.08,
    shadowRadius: wp('2%'),
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
  },
  gradientContainer: {
    borderRadius: wp('4%'),
    padding: wp('4%'),
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  iconWrapper: {
    backgroundColor: '#FFFF00',
    padding: wp('1%'),
    borderRadius: wp('3%'),
    marginRight: wp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  costLabel: {
    fontSize: wp('3.8%'),
    color: '#424242',
    fontWeight: '600',
    letterSpacing: 0.3,
    flex: 1,
    flexShrink: 1,
  },
  costValueContainer: {
    marginTop: hp('0.5%'),
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#1A237E',
    marginRight: wp('1%'),
  },
  costValue: {
    fontSize: wp('6.5%'),
    fontWeight: '700',
    color: '#1A237E',
    letterSpacing: 0.5,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  changeText: {
    fontSize: wp('3%'),
    color: '#66BB6A',
    marginLeft: wp('1%'),
  },
});
const styles2 = StyleSheet.create({
  container: {padding: wp('2.0%'), marginBottom: hp('1.0%')},
  costCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: hp('0.5%')},
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
    elevation: 3,
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  iconWrapper: {
    backgroundColor: '#FFFFFF',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  costLabel: {
    fontSize: wp('4%'),
    color: '#666666',
    fontWeight: '500',
    flex: 1,
    flexShrink: 1,
  },
  costValue: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#333333',
    marginTop: hp('1%'),
    flexWrap: 'wrap',
  },
  divider: {height: 1, backgroundColor: '#E8EDF3', marginVertical: hp('2%')},
  detailsSection: {gap: wp('4%')},
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.25%'),
    },
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
    elevation: 3,
    marginVertical: hp('1%'),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
    paddingBottom: hp('1%'),
  },
  cardTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333333',
    flexShrink: 1,
  },
  detailRow: {
    marginBottom: hp('1%'),
  },
  detailLabel: {
    fontSize: wp('4%'),
    color: '#666666',
    marginBottom: hp('0.5%'),
  },
  detailValue: {
    fontSize: wp('4.25%'),
    color: '#333333',
    flexShrink: 1,
  },
  instructionsText: {
    fontSize: wp('3.75%'),
    color: '#333333',
    lineHeight: hp('5.5%'),
  },
  vehicleText: {
    fontSize: wp('3.75%'),
    color: '#333333',
    lineHeight: hp('5.5%'),
  },
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: wp('1.25%')},
  expandedContent: {
    marginTop: hp('2%'),
    marginBottom: hp('1.25%'),
  },
  cardBody: {
    backgroundColor: '#FAFAFA',
    borderRadius: wp('2%'),
    padding: wp('2%'),
  },
  driverSection: {
    marginBottom: hp('2%'),
  },
  dateSection: {
    marginVertical: hp('1.5%'),
  },
  dateContainer: {
    backgroundColor: '#F8F9FB',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  distanceSection: {
    marginVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.25%'),
    },
    shadowOpacity: 0.1,
    shadowRadius: wp('0.75%'),
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
  },
  fuelSection: {
    marginVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.25%'),
    },
    shadowOpacity: 0.1,
    shadowRadius: wp('0.75%'),
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: '#EBF3FF',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  headerText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333333',
  },
  subHeader: {
    fontSize: wp('3.5%'),
    color: '#666666',
    fontWeight: '400',
  },
  fuelMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  fuelCard: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    position: 'relative',
    overflow: 'hidden',
  },
  fuelInfo: {
    zIndex: 1,
  },
  fuelLabel: {
    fontSize: wp('3.25%'),
    color: '#666666',
    marginBottom: hp('0.5%'),
  },
  fuelValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  fuelValue: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333333',
  },
  unitLabel: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginLeft: wp('1%'),
  },
  fuelIndicator: level => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('0.5%'),
    backgroundColor: level === 'full' ? '#4CAF50' : '#FF9800',
  }),
  totalFuelUsage: {
    marginTop: hp('2%'),
    backgroundColor: '#F0F7FF',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: wp('3.5%'),
    color: '#4A90E2',
    marginBottom: hp('0.5%'),
  },
  totalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalValue: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#333333',
  },
  totalUnit: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginLeft: wp('1%'),
  },
  headerText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333333',
    marginLeft: wp('2%'),
  },
  metersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('1.25%'),
  },
  meterCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    backgroundColor: '#F8F9FB',
    borderRadius: wp('2%'),
  },
  iconWrapper: {
    backgroundColor: '#EBF3FF',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  meterInfo: {
    flex: 1,
  },
  meterLabel: {
    fontSize: wp('3.25%'),
    color: '#666666',
    marginBottom: hp('0.5%'),
  },
  meterValue: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333333',
  },
  separator: {
    width: wp('4%'),
  },
  totalDistance: {
    marginTop: hp('2%'),
    padding: wp('3%'),
    backgroundColor: '#F0F7FF',
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: wp('3.5%'),
    color: '#4A90E2',
    marginBottom: hp('0.5%'),
  },
  totalValue: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#333333',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  iconWrapper: {
    backgroundColor: '#EBF3FF',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: wp('3.25%'),
    color: '#666666',
    marginBottom: hp('0.5%'),
    fontWeight: '500',
  },
  dateValue: {
    fontSize: wp('4%'),
    color: '#333333',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E8EDF3',
    marginVertical: hp('1%'),
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.25%'),
    },
    shadowOpacity: 0.05,
    shadowRadius: wp('0.5%'),
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#F0F7FF',
    padding: wp('2%'),
    borderRadius: 50,
    marginRight: wp('3%'),
  },
  driverInfo: {
    flex: 1,
  },
  label: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginBottom: hp('0.5%'),
  },
  driverName: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: hp('2%'),
  },
  header: {
    marginBottom: hp('2.5%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#F5F5F5',
    borderRadius: wp('2%'),
  },
  headerText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginVertical: hp('1%'),
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    marginVertical: hp('2%'),
    marginHorizontal: wp('2%'),
    overflow: 'hidden',
    shadowColor: '#1A237E',
    shadowOffset: {
      width: 0,
      height: hp('0.5%'),
    },
    shadowOpacity: 0.08,
    shadowRadius: wp('2%'),
    elevation: 4,
  },
  picker: {
    height: hp('6.5%'),
    width: '100%',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  pickerItem: {
    color: '#000',
  },
  gradient: {
    paddingHorizontal: wp('3%'),
  },
  expenditureContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginVertical: hp('2%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.25%'),
    },
    shadowOpacity: 0.1,
    shadowRadius: wp('0.75%'),
    elevation: 3,
    marginHorizontal:wp(3)
  },
  subText: {
    color: '#666666',
    fontSize: wp('3.5%'),
    marginVertical: hp('1%'),
    textAlign: 'center',
  },
  amountText: {
    color: '#000',
    fontSize: wp('6%'),
    fontWeight: '700',
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  touchable: {
    marginVertical: hp('1%'),
    marginHorizontal: wp('4%'),
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.25%'),
    },
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
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
    fontSize: wp('3.5%'),
    color: '#666666',
    marginBottom: hp('0.5%'),
  },
  dateValue: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333333',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
    paddingVertical: hp('0.75%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  expandText: {
    fontSize: wp('3.5%'),
    color: '#4A90E2',
    marginRight: wp('1%'),
    fontWeight: '500',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#FFFFFF',
  },
  line: {
    height: hp('0.1%'),
    backgroundColor: '#000000',
    marginVertical: hp('1%'),
  },
  headerText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#252F40',
    textAlign: 'center',
  },
  monthSelector: {
    marginBottom: hp('2.5%'),
    borderWidth: hp('0.2%'),
    borderColor: '#ccc',
    borderRadius: wp('1%'),
    padding: wp('2.5%'),
    marginVertical: hp('1%'),
    backgroundColor: '#E5E5EA',
  },
  cardContainer: {
    backgroundColor: '#E5E5EA',
    borderRadius: wp('2.5%'),
    padding: wp('5%'),
    marginBottom: hp('2.5%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: hp('0.25%')},
    shadowOpacity: 0.2,
    shadowRadius: wp('1.25%'),
  },
  cardHeader: {
    padding: wp('2.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  Imagecontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.5%'),
    padding: wp('5%'),
    marginBottom: hp('2.5%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: hp('0.25%')},
    shadowOpacity: 0.2,
    shadowRadius: wp('1.25%'),
  },
  image: {
    width: wp('50%'),
    height: wp('50%'),
    resizeMode: 'contain',
  },
  dateText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  cardBody: {
    padding: wp('2.5%'),
  },
  feedbackcard: {
    backgroundColor: '#C9E4CA',
    borderRadius: wp('2.5%'),
    padding: wp('5%'),
    marginTop: hp('0.6%'),
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: wp('1.25%'),
    elevation: 5,
  },
  heading: {
    fontSize: wp('3.75%'),
    fontWeight: 'bold',
    marginBottom: hp('0.6%'),
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: wp('3.75%'),
    backgroundColor: '#e6e6fa',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: wp('1.25%'),
    elevation: 5,
    marginBottom: hp('1.8%'),
  },
  eventItem: {
    backgroundColor: 'white',
    borderRadius: wp('2.5%'),
    padding: wp('3.75%'),
    marginVertical: hp('1.25%'),
    elevation: 5,
  },
  eventDateTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1.25%'),
  },
  eventDate: {
    color: '#3498db',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#555',
    fontSize: wp('4%'),
  },
  eventTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  eventLocation: {
    fontSize: wp('3.5%'),
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
