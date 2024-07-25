// FeedbackScreen.js
import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const FeedbackScreen = () => {
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
