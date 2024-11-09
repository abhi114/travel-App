import {View, Text, StyleSheet, Pressable} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {MapPin, Car, ChevronRight} from 'lucide-react-native';

const styles = StyleSheet.create({
  detailCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 144, 226, 0.1)',
  },
  iconWrapper: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: wp('2.5%'),
    borderRadius: wp('2.5%'),
    marginRight: wp('3%'),
  },
  cardTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#1A237E',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('2%'),
    paddingHorizontal: wp('1%'),
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    color: '#666666',
    fontWeight: '500',
    width: wp('25%'),
  },
  detailValue: {
    fontSize: wp('3.5%'),
    color: '#333333',
    flex: 1,
    fontWeight: '400',
    lineHeight: wp('5%'),
  },
  vehicleText: {
    fontSize: wp('3.5%'),
    color: '#333333',
    lineHeight: wp('5.5%'),
    paddingHorizontal: wp('1%'),
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    padding: wp('2%'),
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: wp('2%'),
  },
  expandButtonText: {
    fontSize: wp('3.2%'),
    color: '#4A90E2',
    marginRight: wp('1%'),
  },
});

const LocationCard = ({data, item}) => {
  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(100)}
      style={styles.detailCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFF']}
        style={styles.gradientContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <MapPin size={wp(4)} color="#4A90E2" />
          </View>
          <Text style={styles.cardTitle}>Location Details</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{data[item].address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>City</Text>
          <Text style={styles.detailValue}>{data[item].city}</Text>
        </View>

        <Pressable style={styles.expandButton}>
          <Text style={styles.expandButtonText}>View on Map</Text>
          <ChevronRight size={wp(4)} color="#4A90E2" />
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
};

const VehicleCard = ({data, item}) => {
  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(200)}
      style={styles.detailCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFF']}
        style={styles.gradientContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <Car size={wp(4)} color="#4A90E2" />
          </View>
          <Text style={styles.cardTitle}>Vehicle Details</Text>
        </View>

        <Text style={styles.vehicleText}>
          {data[item].vehicleDetails}
        </Text>

        <Pressable style={styles.expandButton}>
          <Text style={styles.expandButtonText}>View Full Details</Text>
          <ChevronRight size={wp(4)} color="#4A90E2" />
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
};

export {LocationCard, VehicleCard};
