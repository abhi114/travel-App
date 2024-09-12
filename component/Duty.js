import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Button, TouchableHighlight, useAnimatedValue, Alert, ActivityIndicator } from 'react-native'
import React, { Component, useRef, useState } from 'react'

import SignatureCapture from 'react-native-signature-capture';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { LineView } from './helpers/helpers';
import Icon from 'react-native-vector-icons/Ionicons';



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
      `signatures/${id}/${currentSignature}.png`,
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
          }}>
          Signature - Driver's Signature
        </Text>
        {signSaveStart ? (
          <ActivityIndicator />
        ) : (
          <View>
            <SignatureCapture
              style={[{flex: 1, width: 350, height: 300}, styles.signature]}
              ref={signRef}
              onSaveEvent={_onSaveEvent}
              onDragEvent={_onDragEvent}
              saveImageFileInExtStorage={false}
              showNativeButtons={false}
              showTitleLabel={false}
              backgroundColor="#2f4f4f"
              strokeColor="#ffffff"
              minStrokeWidth={4}
              maxStrokeWidth={4}
              viewMode={'portrait'}
            />

            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableHighlight style={styles.buttonStyle} onPress={saveSign}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={resetSign}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableHighlight>
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
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
          }}>
          Signature - Passenger's Signature
        </Text>
        {signSaveStart ? (
          <ActivityIndicator />
        ) : (
          <View>
            <SignatureCapture
              style={[{flex: 1, width: 350, height: 300}, styles.signature]}
              ref={signRef}
              onSaveEvent={_onSaveEvent}
              onDragEvent={_onDragEvent}
              saveImageFileInExtStorage={false}
              showNativeButtons={false}
              showTitleLabel={false}
              backgroundColor="#2f4f4f"
              strokeColor="#ffffff"
              minStrokeWidth={4}
              maxStrokeWidth={4}
              viewMode={'portrait'}
            />
            
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableHighlight style={styles.buttonStyle} onPress={saveSign}>
                <Text style={styles.buttonText}>Save And Exit</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={resetSign}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableHighlight>
            </View>
          </View>
        )}
      </View>
    );
  }
};

const Duty = ({route}) => {
    
    const [accept, setaccept] = useState(false);
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
       ['Duration', Rprtdate, endDate],
       ['Fuel',startFuel,endFuel]
     ];
     
     const [signatureEnable,setSignatureEnable] = useState(false);
     const handleCloseDuty = ()=>{
      navigation.navigate("Feedback",{id});
     }
     const getData = ()=>{

     }
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        {/* Driver Information */}
        <Text style={[styles.title, {alignSelf: 'center', marginVertical: 10}]}>
          Journey Information
        </Text>
        <View style={styles.card}>
          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={styles.row}>
              <Icon name="person-circle-outline" size={30} color="#333" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Driver's Name</Text>
                <Text style={styles.detail}>{name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Icon name="car-outline" size={30} color="#333" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Car Details</Text>
                <Text style={styles.detail}>{vehicleDetails}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={styles.row}>
              <Icon name="person-circle-outline" size={30} color="#333" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Driver's Number</Text>
                <Text style={styles.detail}>{number}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Icon name="home-outline" size={30} color="#333" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Address</Text>
                <Text style={[styles.detail,]}>{address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Report */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Summary Report</Text>
          <View style={styles.table}>
            {tableData.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, colIndex) => (
                  <View key={`${rowIndex}-${colIndex}`} style={styles.cell}>
                    <Text style={{color: '#000000'}}>{cell}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Signature Button */}
        <TouchableOpacity
          onPress={() => setSignatureEnable(true)}
          style={styles.signatureButton}>
          <Icon name="create-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Add Signature</Text>
        </TouchableOpacity>

        {signatureEnable && (
          <View style={styles.signatureContainer}>
            <Sign id={id} Rprtdate={Rprtdate} mainData={mainData} />
          </View>
        )}

        {/* End Duty Button */}
        <View style={styles.footerButtonContainer}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  signature: `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      background-color: #fff;
    }
    .m-signature-pad--body {
      border: 1px solid #000;
    }
    .m-signature-pad--footer {
      display: none;
    }
  `,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  footerButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5733',
    borderRadius: 8,
    paddingVertical: 12,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  signatureButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal:2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    marginBottom: 16,
    width:'50%'
  },
  signatureContainer: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noShowButton: {
    backgroundColor: '#808080',
  },
  startButton: {
    backgroundColor: '#0000FF',
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 3,
  },
  buttonStyle: {
    flex: 1,
    width: 100,
    height: 40,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#808080',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10, // Adjust corner curvature here
    padding: 10,
    margin: 5,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  table: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    margin: 2,
    borderRadius: 5,
  },
  container: {
    
  },
  header: {
    paddingTop: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffff',
    height: 80, // Fixed height for the header
  },
  textContainer: {
    marginLeft: 10,
  },
  headerText: {
    marginBottom: 14,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerIconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});
export default Duty