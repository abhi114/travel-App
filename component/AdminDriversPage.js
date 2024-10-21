import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const AdminDriversPage = ({renderbackButton}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
   const monthNames = [
     'January',
     'February',
     'March',
     'April',
     'May',
     'June',
     'July',
     'August',
     'September',
     'October',
     'November',
     'December',
   ];
  const currentMonth = monthNames[new Date().getMonth()]
  console.log(currentMonth)
  const handleViewProfile = id => {
    if (id) {
      navigation.navigate('ReportsScreen', {id});
    }
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = firestore().collection('userInfo');
      const data = await response.get();
      const userInfoArray = data.docs.map(doc => ({
        id: doc.id, // Get the document ID
        ...doc.data(), // Get the document data
      }));
      setUserInfo(userInfoArray);
      console.log(JSON.stringify(userInfoArray));
      setLoading(false);
    };
    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Admin Driver's Dashboard</Text>
          <Icon1 name="admin-panel-settings" size={32} color="#2196F3" />
        </View>
      </View>

      {/* Subheader */}
      <View style={styles.subheader}>
        <View style={styles.subheaderContent}>
          <Text style={styles.subheaderTitle}>All Drivers Information</Text>
          <Icon name="drivers-license" size={28} color="#2196F3" />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {userInfo.map((user, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderText}>
                    Driver {index + 1} Information
                  </Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Icon1 name="person" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{user.name}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon1 name="phone" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Mobile:</Text>
                    <Text style={styles.infoValue}>{user.MobileNumber}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon1 name="location-on" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>{user.driverAddress}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon1 name="date-range" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Registered:</Text>
                    <Text style={styles.infoValue}>{user.RegisterMonth}</Text>
                  </View>

                  <View style={styles.statsContainer}>
                    <Icon1 name="local-gas-station" size={24} color="#2196F3" />
                    <View style={styles.statsContent}>
                      <Text style={styles.statsLabel}>
                        {currentMonth} Fuel Expenses
                      </Text>
                      <Text style={styles.statsValue}>
                        ₹{user.monthExpenditure?.[currentMonth] || 0}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.viewProfileButton}
                    onPress={() => handleViewProfile(user.id)}>
                    <Text style={styles.viewProfileText}>View Profile</Text>
                    <Icon1 name="arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginRight: 12,
  },
  subheader: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subheaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  subheaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    marginLeft: 8,
    width: 70,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  statsContent: {
    marginLeft: 12,
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  viewProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
export default AdminDriversPage;
