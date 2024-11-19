import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {User, MapPin, Phone, Mail, Clock} from 'lucide-react-native';

const styles = StyleSheet.create({
  passengerCard: {
    borderRadius: wp('4%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('3%'),
    paddingBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 144, 226, 0.1)',
  },
  headerIcon: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: wp('2%'),
    borderRadius: wp('2.5%'),
    marginRight: wp('1%'),
  },
  headerTitle: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#1A237E',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('2.5%'),
  },
  iconContainer: {
    width: wp('8%'),
    alignItems: 'center',
    justifyContent:'center',
    marginRight: wp('3%'),
  },
  detailContent: {
    flex: 1,
  },
  label: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginBottom: hp('0.5%'),
  },
  value: {
    fontSize: wp('4%'),
    color: '#333333',
    fontWeight: '500',
    lineHeight: wp('5.5%'),
  },
  locationContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginTop: hp('1%'),
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  locationIcon: {
    marginRight: wp('2%'),
  },
  locationTitle: {
    fontSize: wp('3.5%'),
    color: '#4A90E2',
    fontWeight: '500',
  },
  locationText: {
    fontSize: wp('3.8%'),
    color: '#333333',
    lineHeight: wp('5.5%'),
    alignSelf:'center'
  },
  statusBadge: {
   
    marginLeft:wp(2),
    backgroundColor: '#4CAF50',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('4%'),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: wp('3%'),
    fontWeight: '500',
  },
});

const PassengerDetails = ({filteredData, item, passengerKey}) => {
  const passengerData = filteredData[item].PassengerData[passengerKey];
   const openGoogleMaps = (data) => {
     const query = encodeURIComponent(
       `${data}`,
     );
     const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
     console.log(url);
     Linking.openURL(url);
     // Linking.canOpenURL(url)
     //   .then(supported => {
     //     if (supported) {
     //       Linking.openURL(url);
     //     } else {
     //       Alert.alert('Error', 'Google Maps is not available');
     //     }
     //   })
     //   .catch(err => console.error('An error occurred', err));
   };

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      style={styles.passengerCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFF']}
        style={styles.gradientContainer}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <User size={wp(4)} color="#4A90E2" />
          </View>
          <Text style={styles.headerTitle}>Passenger Details</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
        

        <View style={styles.detailRow}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <View style={styles.iconContainer}>
              <User size={wp(5)} color="#666666" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.label}>Passenger Name</Text>
              <Text style={styles.value}>{passengerData.PassengerName}</Text>
            </View>
          </View>
        </View>

        {/* Optional Phone Number */}
        <View style={styles.detailRow}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <View style={styles.iconContainer}>
              <Phone size={wp(4)} color="#666666" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.label}>Contact</Text>
              <Text style={styles.value}>
                {passengerData.PhoneNumber || '+91 98765 43210'}
              </Text>
            </View>
          </View>
        </View>

        {/* Destination Address with special styling */}

        {/* Optional Pickup Time */}
        <View style={[styles.detailRow, {marginTop: hp('2%')}]}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <View style={styles.iconContainer}>
              <Clock size={wp(4)} color="#666666" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.label}>Pickup Time</Text>
              <Text style={styles.value}>
                {passengerData.PickupTime || '10:30 AM'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => {
            openGoogleMaps(passengerData.StartingAddress);
          }}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <View style={styles.locationHeader}>
              <MapPin
                size={wp(4)}
                color="#4A90E2"
                style={styles.locationIcon}
              />
              <Text style={styles.locationTitle}>Starting Address</Text>
            </View>
          </View>
          <Text style={styles.locationText}>
            {passengerData.StartingAddress}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => {
            openGoogleMaps(passengerData.DestinationAddress);
          }}>
          <View style={{justifyContent: 'center', flexDirection: 'row'}}>
            <View style={styles.locationHeader}>
              <MapPin
                size={wp(4)}
                color="#4A90E2"
                style={styles.locationIcon}
              />
              <Text style={styles.locationTitle}>Destination Address</Text>
            </View>
          </View>
          <Text style={styles.locationText}>
            {passengerData.DestinationAddress}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

export default PassengerDetails;
