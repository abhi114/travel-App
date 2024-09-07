import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Button, TouchableHighlight, useAnimatedValue } from 'react-native'
import React, { Component, useRef, useState } from 'react'

import SignatureCapture from 'react-native-signature-capture';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { LineView } from './helpers/helpers';



const Sign = ({id, Rprtdate, mainData}) => {
  const signRef = useRef(null);
  const [currentSignature, setCurrentSignature] = useState('driversSignature');
  const [signatureSaved, setSignatureSaved] = useState(false);
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
    } catch (error) {
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
    setSignatureSaved(true);
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
    if (currentSignature === 'passengersSignature') {
      navigation.navigate('Feedback', {id});
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
          Signature Capture Driver's Signature
        </Text>
        <SignatureCapture
          style={[{flex: 1, width: 500, height: 300}, styles.signature]}
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

          <TouchableHighlight style={styles.buttonStyle} onPress={resetSign}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableHighlight>
        </View>
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
          Signature Capture Passenger's Signature
        </Text>
        <SignatureCapture
          style={[{flex: 1, width: 500, height: 300}, styles.signature]}
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

          <TouchableHighlight style={styles.buttonStyle} onPress={resetSign}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableHighlight>
        </View>
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
       mainData
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
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    styles.headerText,
                    {
                      textDecorationLine: 'underline',
                      fontSize: 20,
                      color: '#000000',
                    },
                  ]}>
                  Driver's Name:
                </Text>
                <Text
                  style={[
                    styles.headerText,
                    {
                      fontSize: 19,
                      marginRight: 10,
                      color: '#000000',
                      fontWeight: 'normal',
                    },
                  ]}>
                  {name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 7,
                }}>
                <Text
                  style={[
                    styles.headerText,
                    {
                      textDecorationLine: 'underline',
                      fontSize: 18,
                      color: '#000000',
                    },
                  ]}>
                  Driver's Number:
                </Text>
                <Text
                  style={[
                    styles.headerText,
                    {
                      fontSize: 18,
                      marginLeft: 6,
                      color: '#000000',
                      fontWeight: 'normal',
                    },
                  ]}>
                  {number}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <LineView />
        <Text
          style={[
            styles.headerText,
            {textDecorationLine: 'underline', fontSize: 20},
          ]}>
          Summary Report
        </Text>
        <View style={styles.table}>
          {tableData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <View key={`${rowIndex}-${colIndex}`} style={styles.cell}>
                  <Text>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setSignatureEnable(true)}
            style={[styles.button, styles.noShowButton]}>
            <Text style={styles.buttonText}>Signature</Text>
          </TouchableOpacity>
        </View>
        {signatureEnable && (
          <Sign id={id} Rprtdate={Rprtdate} mainData={mainData} />
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleCloseDuty()}
          style={[styles.button, styles.noShowButton]}>
          <Text style={styles.buttonText}>End Duty</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom:15
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
    color: '#f8f8ff',
    alignSelf: 'center',
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
    backgroundColor: '#f0f8ff',
  },
  table: {
    // Set table styles here (optional)
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1, // Makes cells share available space equally
    borderWidth: 1, // Optional border for cells
    borderColor: 'gray', // Optional border color
    padding: 5, // Optional padding for cells
  },
  container: {
    flex: 1,
    marginVertical:10
  },
  header: {
    paddingTop: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffff',
    height: 80, // Fixed height for the header
  },
  headerTextContainer: {
    width:'100%',
    
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
});
export default Duty