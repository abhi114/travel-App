import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import CarDetailsModal from './helpers/AddCarModal';
const cars = [
  {
    id: '947239847',
    name: 'Jeep Rubicon',
    image: 'https://images.pexels.com/photos/810357/pexels-photo-810357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'Available',
    statusColor: '#4CAF50',
  },
  {
    id: '789239878',
    name: 'Tesla Model X',
    image: 'https://www.tesla.com/xNVh4yUEc3B9/04_Desktop.jpg',
    status: 'Available',
    statusColor: '#FF5252',
  },
  {
    id: '667239097',
    name: 'Audi A8 Quattro',
    image: 'https://images.pexels.com/photos/810357/pexels-photo-810357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'In Service / mechanic',
    statusColor: '#FF5252',
  },
  {
    id: '143239224',
    name: 'Ford Mustang GT',
    image: 'https://images.pexels.com/photos/810357/pexels-photo-810357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'Available',
    statusColor: '#4CAF50',
  },
];

const CarSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedCar, setSelectedCar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleSubmit = async (data) => {
  // Handle form submission
  console.log('Car Photo:', data.photo);
  console.log('Car Model:', data.model);
  console.log('Car Number:', data.number);
};

  const renderCarItem = ({ item }) => {
    const isSelected = selectedCar === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.carCard,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => setSelectedCar(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.carContent}>
          <View style={[
            styles.imageContainer,
            {marginRight:5}
          ]}>
            <Image
              source={{ uri: item.image }}
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.carDetails}>
            <Text style={[
              styles.carName,
              isSelected && styles.selectedText
            ]}>{item.name}</Text>
            <Text style={styles.carId}>{item.id}</Text>
            <Text style={[styles.status, { color: item.statusColor }]}>
              {item.status}
            </Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.bookButton,
              isSelected && styles.selectedBookButton
            ]}
            onPress={() => {}}
          >
            <Text style={styles.bookButtonText}>
              {isSelected ? 'Selected' : 'Choose Now'}
            </Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Change Car</Text>
        </View>
        <TouchableOpacity onPress={()=>setModalVisible(true)}>
          <Icon name='add-circle-outline' color={"#000"} size={wp(8)}/>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      {modalVisible && (
      <CarDetailsModal
      isVisible={true}
      onClose={() => setModalVisible(false)}
      onSubmit={handleSubmit}
          />
          )}
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