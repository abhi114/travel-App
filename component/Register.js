import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {TextInput, Button, Title} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { MainFooter, validateEmail } from './helpers/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const Register = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('');
  const [number,setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [verificationId, setVerificationId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const checkAdminLoginState = async () => {
      try {
        const loginState = await AsyncStorage.getItem('AdminloginState');
        if (loginState) {
          const {emailId, id, data} = JSON.parse(loginState);
          navigation.reset({
            index: 0,
            routes: [{name: 'AdminPortal', params: {emailId, id, data}}],
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        
      }
    };
    checkAdminLoginState();
  }, []);
  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const loginState = await AsyncStorage.getItem('loginState');
        if (loginState) {
          const {emailId, id, data} = JSON.parse(loginState);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: data ? 'ButtonPage' : 'PersonalInfo',
                params: {emailId, id, data},
              },
            ],
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginState();
  }, []);
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
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/hirelogo.png')}
          style={{
            width: 250,
            height: 50,
            alignSelf: 'center',
            marginBottom: 16,
          }}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/taxicar.png')}
          style={{
            width: 250,
            height: 150,
            alignSelf: 'center',
            marginBottom: 16,
          }}
          resizeMode="contain"
        />

        <Title style={styles.title}>Register</Title>

        <TextInput
          label="Email Id"
          value={emailId}
          onChangeText={setEmailId}
          style={styles.input}
        />
        <View style={{flexDirection: 'row'}}>
          <TextInput
            secureTextEntry={!showPassword}
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={[styles.input,{flex:0.9}]}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
            {showPassword ? (
              <Icon name="eye" size={24} color="gray" />
            ) : (
              <Icon name="eye-slash" size={24} color="gray" />
            )}
          </TouchableOpacity>
        </View>
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          textColor="#000000">
          Register
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
          textColor="#000000">
          Go To Login
        </Button>
      </View>
      <MainFooter />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#40096B',
  },
  innerContainer: {
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    height: '95%',
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    marginHorizontal:10,
    borderRadius:15
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
    marginHorizontal: 10,
    backgroundColor: '#FFD600',
  },
});

export default Register;
