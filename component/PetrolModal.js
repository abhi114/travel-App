import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';

const PetrolEntryModal = ({visible, onClose, onSubmit}) => {
  const [litres, setLitres] = useState('');
  const [price, setPrice] = useState('');
  const [totalCost, setTotalCost] = useState('');
  
  const handleSubmit = () => {
    // Basic validation
    if (!price) {
      Alert.alert('Error', 'Please enter price');
      return;
    }

    // Convert to numbers and calculate total cost
    
    const priceNum = parseFloat(price);
   

    // Prepare data object to submit
   
    if(priceNum === 0 || priceNum <0){
      alert('Price Cannot be negative or 0');
      setPrice('');
      return
    }
    // Call submit handler and close modal
    onSubmit(priceNum);
    resetForm();
  };

  const resetForm = () => {
    //setLitres('');
    setPrice('');
    //setTotalCost('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Fuel Entry</Text>

          {/* <TextInput
            style={styles.input}
            placeholder="Litres"
            keyboardType="numeric"
            value={litres}
            onChangeText={setLitres}
          /> */}

          <TextInput
            style={styles.input}
            placeholder="Price Of Fuel "
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PetrolEntryModal;
