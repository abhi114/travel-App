import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Replace with your icon library
import Icon1 from 'react-native-vector-icons/Entypo'; // Replace with your icon library
import { useNavigation } from '@react-navigation/native';
 
const Home = ({route}) => {
    const navigate = useNavigation();
    const {
      id,
      name,
      number,
      Rprtdate,
      endDate,
      address,
      city,
      vehicleDetails,
      dutyInstructions,
    } = route.params;
    const [accept,setaccept] = useState(false);
    const afteraccept = ()=>{
        console.log("hit");
        if(accept === false){
        setaccept(true);
        return;
        }
        navigate.navigate("Duty");

    }
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>{name}</Text>
              <Text style={styles.headerText}>{number}</Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Icon name="phone" size={35} color={'#ffA500'} />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reporting Date and Time</Text>
            <Text style={styles.sectionText}>{Rprtdate}</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>End Date</Text>
            <Text style={styles.sectionText}>{endDate}</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.sectionRow}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reporting Address</Text>
              <Text style={styles.sectionText}>{address}</Text>
            </View>
            <View style={styles.sectionIconContainer}>
              <Icon1 name="location" size={30} color={'#000000'} />
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serving city</Text>
            <Text style={styles.sectionText}>{city}</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <Text style={styles.sectionText}>{vehicleDetails}</Text>
          </View>
          <View style={styles.line}></View>
          <Text style={styles.sectionTitle}>{dutyInstructions}</Text>
          <View style={styles.line}></View>
          {accept && (
            <View>
              <View style={[styles.section]}>
                <Text style={styles.sectionTitle}>Start Km</Text>
                <TextInput placeholder="Enter Km" style={styles.textInput} />
              </View>
              <View style={styles.line}></View>
              <View style={[styles.section]}>
                <Text style={styles.sectionTitle}>Send OTP</Text>
                <Text style={styles.sectionText}>
                  Please Select Any One of the Source to send OTP
                </Text>
                <View
                  style={{flexDirection: 'column', flex: 1, borderWidth: 2}}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: 'gray',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      height: 50,
                    }}>
                    <Icon name="whatsapp" size={30} color={'#FFFF00'} />
                    <Text style={[styles.text, {color: '#FFFFFF'}]}>
                      Send code on Whatsapp
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      height: 50,
                    }}>
                    <Icon1 name="message" size={30} color={'#000000'} />
                    <Text style={[styles.text, {color: '#000000'}]}>
                      Send code on Message
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => console.log('Reject')}
          style={[styles.button, styles.noShowButton]}>
          <Text style={styles.buttonText}>{accept ? 'reject' : 'dismiss'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => afteraccept()}
          style={[styles.button, styles.startButton]}>
          <Text style={styles.buttonText}>{accept ? 'accept' : 'start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#D3D3D3',
    height: 80, // Fixed height for the header
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerText: {
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerIconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 12,
  },
  section: {
    flexDirection: 'column',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    margin: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionText: {
    marginLeft: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionIconContainer: {
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 18,
  },
  line: {
    marginTop: 15,
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 120,
    height: 60,
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
  buttonText: {
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10, // Adjust corner curvature here
    padding: 10,
    margin:5
  },
});

export default Home;
