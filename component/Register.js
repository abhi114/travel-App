import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {TextInput, Button, Title} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Register = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const navigation = useNavigation();
  const handleRegister = async () => {
    if (emailId === '' || password === '') {
      alert('please fill email id and password');
      return;
    }
    try {
      const email = auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(user => {
          console.log('registered successfully');
          if (user) {
            console.log(user);
            
            const id = user.user.uid;
            navigation.navigate('Login',{id});
          }
        });
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        setErrortext('That email address is already in use!');
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
          source={require('../icon_ph1.png')}
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
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Register
        </Button>
        <Button mode="contained" onPress={()=>{navigation.navigate("Login")}} style={styles.button}>
            Go To Login
        </Button>
      </View>
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
