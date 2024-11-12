import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Button, TouchableHighlight, useAnimatedValue, Alert, ActivityIndicator } from 'react-native'
import React, { Component, useRef, useState } from 'react'

import SignatureCapture from 'react-native-signature-capture';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { LineView } from './helpers/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PassengerInfoScreen from './PassengerCard';


const Sign = ({id, Rprtdate, mainData}) => {
  const signRef = useRef(null);
  const [currentSignature, setCurrentSignature] = useState('driversSignature');
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [signSaveStart,setSignSaveStart] = useState(false);
  const navigation = useNavigation();
  //console.log("id is" + id);
  const saveSign = () => {
    signRef.current.saveImage();
  };
  const storeData = async url => {
    try {
      const userRef = firestore().collection('users').doc(id); // Reference user document
      mainData[Rprtdate][currentSignature] = url;

      const updatedUserData = mainData; // Add new key-value pair
      console.log('updated data is' + JSON.stringify(updatedUserData));
      await userRef.set(updatedUserData, {merge: true}); // Set user data in the document
      setSignSaveStart(false);
    } catch (error) {
      setSignSaveStart(false);
      console.error('Error storing user data:', error);
    }
  };
  const resetSign = () => {
    signRef.current.resetImage();
  };

  const _onSaveEvent = async result => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result);
    setSignSaveStart(true);
    const storageref = storage().ref();
    const imageRef = storageref.child(
      `signatures/${id}/${Rprtdate}/${currentSignature}.png`,
    );
    await imageRef.putString(result.encoded, 'base64', {
      contentType: 'image/png',
    });
    const downloadURL = await imageRef.getDownloadURL();
    console.log('url is' + downloadURL);
    await storeData(downloadURL);
    setSignatureSaved(true);
    setSignSaveStart(false);
    if (currentSignature === 'passengersSignature') {
      Alert.alert("Passenger's Signature Saved");
       navigation.reset({
         index: 0,
         routes: [{name: 'Feedback', params: {id}}],
       });
    }else{
      Alert.alert(" Driver's Signature Saved");
    }
    resetSign();
  };

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };

  if (currentSignature === 'driversSignature' && !signatureSaved) {
    return (
      <View style={styles2.container}>
        <View style={styles2.headerContainer}>
          <Text style={styles2.titleText}>Verification Signature</Text>
          <Text style={styles2.subtitleText}>
            Signature - Driver's Signature
          </Text>
        </View>

        {signSaveStart ? (
          <View style={styles2.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <View style={styles2.signatureContainer}>
            <View style={styles2.signatureWrapper}>
              <SignatureCapture
                style={styles2.signature}
                ref={signRef}
                onSaveEvent={_onSaveEvent}
                onDragEvent={_onDragEvent}
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                backgroundColor="#F5F5F5"
                strokeColor="#000000"
                minStrokeWidth={4}
                maxStrokeWidth={4}
                viewMode={'portrait'}
              />
            </View>

            <View style={styles2.buttonContainer}>
              <TouchableOpacity
                style={[styles2.button, styles2.saveButton]}
                onPress={saveSign}
                activeOpacity={0.8}>
                <Text style={styles2.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles2.button, styles2.resetButton]}
                onPress={resetSign}
                activeOpacity={0.8}>
                <Text style={[styles2.buttonText, styles2.resetButtonText]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  } else if (currentSignature === 'driversSignature' && signatureSaved) {
    setCurrentSignature('passengersSignature');
    return null;
  } else if (currentSignature === 'passengersSignature') {
    return (
      <View style={styles2.container}>
        <View style={styles2.headerContainer}>
          <Text style={styles2.titleText}>Verification Signature</Text>
          <Text style={styles2.subtitleText}>
            Signature - Passenger's Signature
          </Text>
        </View>

        {signSaveStart ? (
          <View style={styles2.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <View style={styles2.signatureContainer}>
            <View style={styles2.signatureWrapper}>
              <SignatureCapture
                style={styles2.signature}
                ref={signRef}
                onSaveEvent={_onSaveEvent}
                onDragEvent={_onDragEvent}
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                backgroundColor="#F5F5F5"
                strokeColor="#000000"
                minStrokeWidth={4}
                maxStrokeWidth={4}
                viewMode={'portrait'}
              />
            </View>

            <View style={styles2.buttonContainer}>
              <TouchableOpacity
                style={[styles2.button, styles2.saveButton]}
                onPress={saveSign}
                activeOpacity={0.8}>
                <Text style={styles2.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles2.button, styles2.resetButton]}
                onPress={resetSign}
                activeOpacity={0.8}>
                <Text style={[styles2.buttonText, styles2.resetButtonText]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
};

const Duty = ({route}) => {
    const scrollViewRef= useRef(null);
    const [accept, setaccept] = useState(false);
    function removeMonth(dateString) {
      const monthRegex = dateString.split(' '); // Matches a whole word
      return monthRegex.filter((element, index) => index !== 1).join(' ');
    }
    
    const navigation = useNavigation()
     const {
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
       vehicleDetails,
       address,
     } = route.params;
     const tableData = [
       ['', 'Start', 'End '],
       ['Km', startKm, endkm],
       ['Duration', removeMonth(Rprtdate), endDate],
       ['Fuel', `${startFuel}l`, `${endFuel}l`],
     ];
     //console.log('passengers Data' + JSON.stringify(mainData[Rprtdate].PassengerData));
     const [signatureEnable,setSignatureEnable] = useState(false);
     const handleCloseDuty = ()=>{
      navigation.navigate("Feedback",{id});
     }
     const passengerData = mainData[Rprtdate].PassengerData;
     const getData = ()=>{

     }
      const renderPassengerCard = (passengerKey, data, index) => {
        return (
          <Animated.View
            entering={FadeInDown.delay(index * 200).springify()}
            className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-gray-100"
            key={passengerKey}>
            {/* Header with passenger number and name */}
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 rounded-full p-3 mr-3">
                <MaterialCommunityIcons
                  name="account"
                  size={24}
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm font-medium">
                  {passengerKey}
                </Text>
                <Text className="text-xl font-semibold text-gray-800">
                  {data.PassengerName}
                </Text>
              </View>
              {/* <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#94A3B8"
              /> */}
            </View>

            {/* Journey Details */}
            <View className="space-y-3">
              {/* Starting Point */}
              <Animated.View
                entering={FadeInRight.delay(index * 300).springify()}
                className="flex-row items-center bg-gray-50 p-3 rounded-xl">
                <View className="bg-green-100 rounded-full p-2 mr-3">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#22C55E"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 font-medium">
                    Starting Point
                  </Text>
                  <Text className="text-base text-gray-800">
                    {data.StartingAddress}
                  </Text>
                </View>
              </Animated.View>

              {/* Connection Line */}
              <View className="flex-row items-center px-4">
                <View className="w-0.5 h-7 bg-gray-400 ml-4" />
              </View>

              {/* Destination */}
              <Animated.View
                entering={FadeInRight.delay(index * 400).springify()}
                className="flex-row items-center bg-gray-50 p-3 rounded-xl">
                <View className="bg-red-100 rounded-full p-2 mr-3">
                  <MaterialCommunityIcons
                    name="map-marker-radius"
                    size={20}
                    color="#EF4444"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 font-medium">
                    Destination
                  </Text>
                  <Text className="text-base text-gray-800">
                    {data.DestinationAddress}
                  </Text>
                </View>
              </Animated.View>
            </View>
          </Animated.View>
        );
      };
  return (
    <View style={styles.outerContainer}>
      <ScrollView ref={scrollViewRef} style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Journey Information</Text>
        </View>

        {/* Driver and Vehicle Information Card */}
        <View style={styles.card}>
          <View style={styles.cardSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.iconWrapper}>
                  <Icon
                    name="person-circle-outline"
                    size={wp(7)}
                    color="#2196F3"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.labelText}>Driver's Name</Text>
                  <Text style={styles.valueText}>{name}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.iconWrapper}>
                  <Icon name="car-outline" size={wp(7)} color="#2196F3" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.labelText}>Car Details</Text>
                  <Text style={styles.valueText}>{vehicleDetails}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.infoRow, styles.topMargin]}>
              <View style={styles.infoItem}>
                <View style={styles.iconWrapper}>
                  <Icon name="call-outline" size={wp(7)} color="#2196F3" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.labelText}>Driver's Number</Text>
                  <Text style={styles.valueText}>{number}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.iconWrapper}>
                  <Icon name="home-outline" size={wp(7)} color="#2196F3" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.labelText}>Address</Text>
                  <Text style={styles.valueText} >
                    {address} 
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Report Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Summary Report</Text>
          <View style={styles.tableContainer}>
            {tableData.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.map((cell, colIndex) => (
                  <View
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      styles.tableCell,
                      rowIndex === 0 && styles.headerCell,
                      colIndex === row.length - 1 && styles.lastCell,
                    ]}>
                    <Text
                      style={[
                        styles.tableCellText,
                        rowIndex === 0 && styles.headerCellText,
                      ]}
                      numberOfLines={3}>
                      {cell}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
        {/* passenger details section */}

        {/* <View className="bg-gray-50 px-6 py-4 shadow-sm ">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Passengers
              </Text>
              <Text className="text-gray-500">
                {Object.keys(passengerData).length} passengers for this trip
              </Text>
            </View>
            <View className="bg-blue-100 rounded-full p-2">
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#3B82F6"
              />
            </View>
          </View>
        </View>
        {Object.entries(passengerData).map(([key, data], index) =>
          renderPassengerCard(key, data, index),
        )} */}
        <PassengerInfoScreen passengerData={passengerData} />
        {/* Bottom Padding */}
        <View className="h-6" />
        {/* Signature Section */}
        <TouchableOpacity
          onPress={() => {setSignatureEnable(true)
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
          }}
          style={styles.signatureButton}>
          <Icon name="create-outline" size={wp(7)} color="#fff" />
          <Text style={styles.signatureButtonText}>Add Signature</Text>
        </TouchableOpacity>

        {signatureEnable && (
          <View style={styles.signatureContainer}>
            <Sign id={id} Rprtdate={Rprtdate} mainData={mainData} />
          </View>
        )}

        <View style={styles.footerButtonContainer}></View>
      </ScrollView>
    </View>
  );
}
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2.5),
  },
  headerContainer: {
    marginBottom: hp(2.5),
  },
  titleText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: hp(1),
    ...Platform.select({
      android: {
        fontFamily: 'Roboto-Bold',
      },
    }),
  },
  subtitleText: {
    fontSize: wp(4),
    color: '#4A4A4A',
    textAlign: 'center',
    ...Platform.select({
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureContainer: {
    flex: 1,
  },
  signatureWrapper: {
    height: hp(37.5),
    borderRadius: wp(4),
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  signature: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(2.5),
    gap: wp(4),
  },
  button: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(8),
    borderRadius: wp(2),
    minWidth: wp(30),
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    ...Platform.select({
      android: {
        fontFamily: 'Roboto-Medium',
      },
    }),
  },
  resetButtonText: {
    color: '#007AFF',
  },
});
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  headerSection: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mainTitle: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    marginHorizontal: wp('4%'),
    marginVertical: hp('1%'),
    padding: wp('4%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: hp('0.25%')},
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
  },
  cardSection: {
    paddingVertical: hp('1%'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  topMargin: {
    marginTop: hp('3%'),
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: wp('2%'),
  },
  iconWrapper: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  labelText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('0.5%'),
    textAlign: 'left',
  },
  valueText: {
    fontSize: wp('4%'),
    color: '#1a1a1a',
    fontWeight: '500',
    textAlign: 'left',
    flexShrink: 1,
    lineHeight: hp('2.5%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: hp('2%'),
  },
  tableContainer: {
    borderRadius: wp('2%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    padding: wp('3%'),
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
  },
  lastCell: {
    borderRightWidth: 0,
  },
  tableCellText: {
    fontSize: wp('3.5%'),
    color: '#333',
    textAlign: 'center',
    flexShrink: 1,
  },
  headerCellText: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  signatureButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: hp('2.5%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: hp('0.15%')},
    shadowOpacity: 0.2,
    shadowRadius: wp('0.5%'),
  },
  signatureButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  signatureContainer: {
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
  },
  footerButtonContainer: {
    padding: wp('4%'),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: wp('2.5%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ADD8E6',
    marginVertical: hp('1.25%'),
  },
  buttonText: {
    color: '#000',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});
export default Duty