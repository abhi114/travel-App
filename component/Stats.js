import { View, Text ,BackHandler, StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AdminDriversPage from './AdminDriversPage';

 const Stats = ({route}) => {
  const navigation = useNavigation();
  
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
       
        <Text style={styles.headerTitle}>Driver's Information</Text>
      </View>
      <View style={styles.contentContainer}>
        <AdminDriversPage />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#3498db',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});
export default Stats;