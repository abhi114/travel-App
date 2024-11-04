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
import Icon from 'react-native-vector-icons/Ionicons';
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name='arrow-back' size={20}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Car</Text>
      </View>
      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
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
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  listContainer: {
    padding: 16,
  },
  carCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
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
      height: 4,
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
  },
  selectedImageContainer: {
    borderColor: '#0000FF',
  },
  carImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  carDetails: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedText: {
    color: '#0000FF',
  },
  carId: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#0000FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    margin: 3,
    borderRadius: 8,
  },
  selectedBookButton: {
    backgroundColor: '#4CAF50',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#0000FF',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});

export default CarSelectionScreen;