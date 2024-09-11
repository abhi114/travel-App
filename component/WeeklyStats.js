import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const WeeklyStats = () => {
  const [data, setData] = useState([
    {category: 'Followers', value: 1000},
    {category: 'Likes', value: 500},
    {category: 'Reach', value: 2000},
    {category: 'Followers', value: 1000},

    {category: 'Category', value: 7500},
    {category: 'Other', value: 66000},
    {category: 'One category', value: 3300},
  ]);

  const renderStatItem = ({item}) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statsCategory}>{item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>       
      </View>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Weekly Stats</Text>
        <FlatList
          data={data}
          renderItem={renderStatItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: '#fff',
    marginTop: 60,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
   
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  userFollowers: {
    color: '#999',
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#008B8B',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },
  statsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  statItem: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsCategory: {
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6495ED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default WeeklyStats;
