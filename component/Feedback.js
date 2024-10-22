// FeedbackScreen.js
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import { TouchableOpacity } from 'react-native';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const FeedbackScreen = ({route}) => {
  const {id} = route.params
  const navigation = useNavigation();
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      text: 'This is a sample feedback. It is a few lines long and should wrap properly in the card view.',
    },
    {
      id: 2,
      text: 'Another feedback here. This one is a bit longer and should also wrap properly.',
    },
    {
      id: 3,
      text: 'This is a shorter feedback. Just a few words.',
    },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Feedback</Text>
      <ScrollView>
        {feedbacks.map(feedback => (
          <View key={feedback.id} style={styles.card}>
            <Text style={styles.cardText}>{feedback.text}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ButtonPage', {id})}>
          <Text style={styles.buttonText}>Go To Selection Page</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent:'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:""
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    margin: 20,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center'
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FeedbackScreen;
