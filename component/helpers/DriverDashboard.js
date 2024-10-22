import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

const DriverDashboard = ({emailId, id, data,logout}) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale for the title
  const opacityAnim = useRef(new Animated.Value(0)).current; // Initial opacity for buttons

  useEffect(() => {
    // Title Animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.elastic(1),
    }).start();

    // Button Animation (delayed)
    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 800); // Delay for the buttons
  }, []);

  return (
    <View style={styles.container}>
      {/* Title Animation */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={{color: '#fff'}}>Logout</Text>
      </TouchableOpacity>
      <LottieView
        source={require('../../assets/lottie-animation.json')}
        autoPlay
        loop
        speed={0.5}
        style={{width: 150, height: 150}}
      />
      <Animated.View style={{transform: [{scale: scaleAnim}]}}>
        <Text style={styles.titleText}>Welcome To Drive</Text>
      </Animated.View>
      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:10,marginVertical:10}}>
        <Image source={require('../../assets/profile.png')} style={{width:40,height:40}}/>
        <Text style={styles.titleText}>{data?.name}</Text>
      </View>

      {/* Buttons appear after the animation */}
      <Animated.View style={{opacity: opacityAnim}}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate('InfoPage', {emailId, id, data})}>
          <Icon name="add-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Create New Duty</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('ReportsScreen', {id})}>
          <Icon name="insert-chart-outlined" size={24} color="white" />
          <Text style={styles.buttonText}>Check Reports</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    
   
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff4757', // Optional color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  buttonSecondary: {
    backgroundColor: '#555',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
});


export default DriverDashboard;
