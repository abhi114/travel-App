import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import CarDetailsModal from './helpers/AddCarModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2 } from 'lucide-react-native';
import { LoadingAlert, SuccessAlert } from './CustomAlerts';


const CarSelectionScreen = ({route}) => {
  const navigation = useNavigation();
  const [selectedCar, setSelectedCar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading,setloading] = useState(false);
  const [successVisible,setSuccessVisible] = useState(false);
  const [cars,setCars] = useState([
  
]);
  const {id,setSelecCar} = route.params
  //console.log(id);
 const getAllCarData = async () => {
  try {
    setloading(true);
    const userRef = firestore().collection('userInfo').doc(id); // Reference to the user's document
    const doc = await userRef.get();
    
    
    if (doc.exists) {
      const userData = doc.data();
      const carPhotosUrl = userData?.CarPhotosUrl;

      if (carPhotosUrl) {
        // Extract all car data objects and store them in an array
        const carDataArray = Object.values(carPhotosUrl);

        // Sync the state with the database data
        setCars(carDataArray);
        setloading(false);
        //console.log('Updated Cars:', JSON.stringify(carDataArray));
        return carDataArray;
      } else {
        console.log('No car photos data found');
        setloading(false);
        // Clear the state if no car data exists
        setCars([]);
        return [];
      }
    } else {
      console.log('No user data found');

      // Clear the state if no user data exists
      setCars([]);
      return [];
    }
  } catch (error) {
    console.error('Error retrieving car data:', error);
    return [];
  }
};
async function getSelectedCar() {
    try {
        // Reference to the user's document
        const userRef = firestore().collection('userInfo').doc(id);

        // Fetch the document
        const doc = await userRef.get();

        if (doc.exists) {
            const data = doc.data();
            console.log(`SelectedCar for user ID ${id}:`, data?.SelectedCar);
            return data?.SelectedCar; // Return the SelectedCar value
        } else {
            console.log(`No document found for user ID: ${id}`);
            return null; // Return null if the document doesn't exist
        }
    } catch (error) {
        console.error("Error fetching SelectedCar:", error);
        return null; // Return null in case of an error
    }
}
const getSelectedCarItem = async () => {
  try {
    const item = await getSelectedCar();
    if (item) {
      //const parsedItem = JSON.parse(item); // Parse the JSON string to an object
      setSelectedCar(item.carNumber); // Set the selected car number
      setSelecCar(item); // Set the selected car item
    } else {
      console.log('No selected car found in AsyncStorage');
    }
  } catch (error) {
    console.error('Error retrieving selected car:', error);
  }
};

useEffect(() => {
    getAllCarData();
   getSelectedCarItem();
   
  
   
  
  return () => {
    
  }
}, [])

 const storeUserData = async (downloadURL, model, carNumber) => {
  try {
    const userRef = firestore().collection('userInfo').doc(id); // Reference to the user's document
    
    // Initialize data as an object
    const data = {
  CarPhotosUrl: {
    [carNumber]: {
      model: model,
      carNumber: carNumber,
      downloadURL: downloadURL,
    },
  },
};

    console.log(downloadURL, model, carNumber);
    console.log('Updated data is: ' + JSON.stringify(data));

    // Use merge option to update the document without overwriting existing data
    await userRef.set(data, { merge: true });
    await AsyncStorage.setItem("CarNumber",carNumber);
    await getAllCarData();
   
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};
  const deleteCarData = async (carNumber) => {
  try {
    const userRef = firestore().collection('userInfo').doc(id); // Reference to the user's document
    
    // Get the current user document
    const userDoc = await userRef.get();

    // Check if the document exists and the carNumber data is present
    if (!userDoc.exists) {
      console.warn(`User document does not exist.`);
      return;
    }

    const userData = userDoc.data();
    const carData = userData?.CarPhotosUrl?.[carNumber];

    if (!carData) {
      console.warn(`No car data found for carNumber: ${carNumber}`);
      setloading(false);
      return;
    }

    // Delete the car photo from Firebase Storage
    const downloadURL = carData.downloadURL;
    if (downloadURL) {
      const filePath = decodeURIComponent(downloadURL.split('/o/')[1].split('?')[0]); // Extract the file path
      await storage().ref(filePath).delete();
      console.log('Car photo deleted successfully from Firebase Storage.');
    }

    // Delete the car data from Firestore
    const updatedCarPhotosUrl = { ...userData.CarPhotosUrl };
    delete updatedCarPhotosUrl[carNumber];

    await userRef.update({ CarPhotosUrl: updatedCarPhotosUrl });
    console.log('Car data deleted successfully from Firestore.');

    // Remove carNumber from AsyncStorage if it matches
    const storedCarNumber = await AsyncStorage.getItem('CarNumber');
    console.log("asyn data" + JSON.stringify(storedCarNumber));
    if (storedCarNumber === carNumber) {
      await AsyncStorage.removeItem('CarNumber');
      console.log('CarNumber removed from AsyncStorage.');
    }

    // Optional: Refresh data
    await getAllCarData();
    setloading(false);
    setSuccessVisible(true);
  } catch (error) {
    console.error('Error deleting car data:', error);
    setloading(false)
  }
};
 const showAlert =async  (carNumber) => {
    Alert.alert(
      "Delete Vehicle Data",
      `Are you sure you want to delete the data for vehicle: ${carNumber}?`,
      [
        {
          text: "Close",
          style: "cancel", // Adds a dismissive style
        },
        {
          text: "Confirm",
          onPress: async () => {
            setloading(true);
            await deleteCarData(carNumber); // Trigger the delete function
            console.log(`Confirmed deletion for carNumber: ${carNumber}`);
          },
          style: "destructive", // Adds a red destructive style
        },
      ],
      { cancelable: true } // Allows the alert to close by tapping outside
    );
  };
  const StoreCarPhoto= async (uri,model,carNumber)=>{
      const timestamp = new Date().getTime();
      const uniqueFileName = `carPhoto_${timestamp}.png`;
       try {
      const reference = storage().ref(`CarPhotos/${id}/${uniqueFileName}`);
      
      // Upload the file to Firebase Storage
      await reference.putFile(uri);
      
      // Get the download URL
      const downloadURL = await reference.getDownloadURL();
      console.log('Download URL:', downloadURL);
      await storeUserData(downloadURL,model,carNumber);
      // Optionally, set the download URL to display in an Image component
      
      
    } catch (error) {
      console.error("Failed to upload image to Firebase:", error);
    }
  }
 const handleSubmit = async (data) => {
  // Handle form submission
  const model = data.model;
  const carNumber =data.number
  await StoreCarPhoto(data.photo.uri,model,carNumber)
  console.log('Car Photo:', data.photo);
  console.log('Car Model:', data.model);
  console.log('Car Number:', data.number);

};
async function updateSelectedCar(carValue) {
    try {
        // Reference to the user's document
        const userRef = firestore().collection('userInfo').doc(id);

        // Update the document with the key-value pair
        await userRef.set(
            { SelectedCar: carValue },
            { merge: true } // Ensures that other fields in the document are not overwritten
        );
        
        console.log(`Successfully updated SelectedCar to "${carValue}" for user ID: ${id}`);
    } catch (error) {
        console.error("Error updating SelectedCar:", error);
    }
}
  const renderCarItem = ({ item }) => {
    const isSelected = selectedCar === item.carNumber;
    
    return (
      <TouchableOpacity
        style={[
          styles.carCard,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => {setSelectedCar(item.carNumber),
          //console.log("selected Car is" + JSON.stringify(item))
          updateSelectedCar(item);
          AsyncStorage.setItem("CarSelectedNumber",JSON.stringify(item));
          setSelecCar(item)}}
        activeOpacity={0.7}
      >
         <TouchableOpacity
          style={{ alignSelf: "flex-end", // Ensures the button only takes required width
    backgroundColor: "#fff", // Red background
    paddingHorizontal: 10, // Small horizontal padding
    
    }}
          onPress={async () => {
            // Add your remove vehicle logic here
            showAlert(item.carNumber);
            //await deleteCarData(item.carNumber);
            //console.log("Remove vehicle:", item.carNumber);
          }}
          className="rounded-full"
        >
          <Trash2 color={'#000'} size={wp('5%')}/>
        </TouchableOpacity>
        
        <View style={styles.carContent}>
          <View style={[
            styles.imageContainer,
            {marginRight:5}
          ]}>
            
            <Image
              source={{ uri: item.downloadURL }}
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.carDetails}>
            <Text style={[
              styles.carName,
              isSelected && styles.selectedText
            ]}>{item.model}</Text>
            <Text style={styles.carId}>{item.carNumber}</Text>
            <Text style={[styles.status, { color: "#008000" }]}>
              Available
            </Text>
          </View>
          <View 
            style={[
              styles.bookButton,
              isSelected && styles.selectedBookButton
            ]}
            
          >
            <Text style={styles.bookButtonText}>
              {isSelected ? 'Selected' : 'Select'}
            </Text>
          </View>
          
        </View>
        
        
        {isSelected && <View style={styles.selectedIndicator} />}
        
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name='arrow-back' size={wp(5)} color={'#000'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add/Remove Vehicle</Text>
        </View>
        <TouchableOpacity onPress={()=>setModalVisible(true)}>
          <Icon name='add-circle-outline' color={"#000"} size={wp(8)}/>
        </TouchableOpacity>
      </View>
     {cars.length ==0 ?(<View style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}><Text style={{alignSelf:'center',justifyContent:'center',padding:20,color:"#000",fontSize:12,fontWeight:'bold'}}>No Car Data Available</Text></View>) : (<FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />)}
      {modalVisible && (
      <CarDetailsModal
      isVisible={true}
      onClose={() => setModalVisible(false)}
      onSubmit={handleSubmit}
      />
          )}
          {loading && <LoadingAlert visible={loading} />}
          {successVisible && <SuccessAlert visible={successVisible} onClose={()=>{setSuccessVisible(false)}} message={"Data Deleted Sucessfully"}/>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    backgroundColor: '#FFFFFF',
    justifyContent:'space-between'
  },
  backButton: {
    padding: wp(2),
  },
  backButtonText: {
    fontSize: wp(3),
    color: '#000000',
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    marginLeft: wp(2),
    color:'#000',
  },
  listContainer: {
    padding: wp(3.5),
  },
  carCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(6),
    marginBottom: hp('2%'), // Responsive margin
    padding: wp('4%'), // Responsive padding
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: hp('0.25%'),
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#0000FF',
    backgroundColor: '#F8F9FF',
    shadowColor: '#0000FF',
    shadowOffset: {
      width: 0,
      height: hp('0.5%'),
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  carContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: wp('2%'), // Responsive margin
  },
  carImage: {
    width: wp('25%'), // Responsive width
    height: wp('25%'), // Responsive height
  },
  carDetails: {
    flex: 1,
    paddingRight: wp('2%'), // Responsive padding
  },
  carName: {
    color:'#000',
    fontSize: wp('4.5%'), // Responsive font size
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  selectedText: {
    color: '#0000FF',
  },
  carId: {
    fontSize: wp('3.5%'), // Responsive font size
    color: '#666666',
    marginBottom: hp('0.5%'),
  },
  status: {
    fontSize: wp('3.5%'), // Responsive font size
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#0000FF',
    paddingHorizontal: wp('3%'), // Responsive padding
    paddingVertical: hp('0.8%'), // Responsive padding
    margin: wp('1%'), // Responsive margin
    borderRadius: 8,
  },
  selectedBookButton: {
    backgroundColor: '#4CAF50',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'), // Responsive font size
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp('1%'), // Responsive width
    height: '100%',
    backgroundColor: '#0000FF',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});

export default CarSelectionScreen;