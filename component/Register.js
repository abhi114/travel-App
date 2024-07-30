import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {TextInput, Button, Title} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { MainFooter, validateEmail } from './helpers/helpers';

const Register = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('');
  const [number,setNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const navigation = useNavigation();
  const handleRegister = async () => {
    if (emailId === '' || password === '') {
      alert('please fill The Required Details');
      return;
    }
    if (!validateEmail(emailId)) {
      return;
    }
    try {
      const user = await auth().createUserWithEmailAndPassword(
        emailId,
        password,
      );
      console.log('registered successfully');
      if (user) {
        console.log(user);
        try {
          await user.user.updateProfile({
            displayName: 'name',
          });
          await user.user.reload();
          console.log('Display name set to: ' + user.user.displayName);
        } catch (error) {
          console.error('Error updating profile: ', error);
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('email already in use');
          } else if (error.code === 'auth/weak-password') {
            Alert.alert(
              'Password is Too weak',
              'Please enter a strong password',
            );
          }
        }
        const id = user.user.uid;
         Alert.alert('Successfully Registered Please Proceed To Login Page', 'Press Ok to Continue', [
           {
             text: 'Cancel',
             onPress: () => console.log('Cancel Pressed'),
             style: 'cancel',
           },
           {text: 'OK', onPress: async () => {navigation.navigate('Login', {id})}},
         ]);
        
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('email already in use');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Password is Too weak', 'Please enter a strong password');
      }
    }
  };

  const handleVerifyOtp = async () => {};
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={{
            uri: `https://firebasestorage.googleapis.com/v0/b/travelinfo-6a043.appspot.com/o/icon_ph1.png?alt=media&token=85da75e0-75c3-4064-a9dd-d71e6e3c18c0`,
          }}
          width={300}
          height={300}
          style={{alignSelf: 'center', margin: 10}}
        />
        <Title style={styles.title}>Register</Title>

        <TextInput
          label="Email Id"
          value={emailId}
          onChangeText={setEmailId}
          style={styles.input}
        />
        <TextInput
          secureTextEntry={true}
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Register
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}>
          Go To Login
        </Button>
      </View>
    <MainFooter/>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  otpInput: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputField: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'gray',
    marginHorizontal: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default Register;
