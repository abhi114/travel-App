import React, {useEffect, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Text, Alert, ActivityIndicator} from 'react-native';
import {TextInput, Button, Title} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { MainFooter, validateEmail } from './helpers/helpers';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMostUsedLoginId, saveLoginId } from './helpers/MostUsedLoginId';

const Login = ({route}) => {
 
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [suggestedLoginId, setSuggestedLoginId] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  //const [restPassword,setresetPassword] = useState(false);
   const [showConfirmation, setShowConfirmation] = useState(false);
   const [LoginActivityIndicator,setLoginActivityIndicator] = useState(false);
   const getUserData = async (id) => {
     try {
       const userRef = firestore().collection('userInfo').doc(id);
       const userData = await userRef.get();
       return userData.data();
     } catch (error) {
       console.error('Error fetching user data:', error);
     }
   };

   const handleResetPassword =async () => {
     
     Alert.alert('Are you sure you want to reset your Password',"", [
       {
         text: 'Cancel',
         onPress: () => console.log('Cancel Pressed'),
         style: 'cancel',
       },
       {text: 'OK', onPress: async () =>await ResetPassword()},
     ]);
   };
   useEffect(() => {
     const fetchMostUsedLoginId = async () => {
       const mostUsedLoginId = await getMostUsedLoginId();
       if (mostUsedLoginId) {
         setSuggestedLoginId(mostUsedLoginId);
         setEmailId(mostUsedLoginId || '');
       }
     };
     fetchMostUsedLoginId();
   }, []);

   const handleConfirmReset = () => {
     // Reset password logic goes here
     console.log('Password reset successfully!');
     setShowConfirmation(false);
     
     ResetPassword();
   };

   const handleCancelReset = () => {
     setShowConfirmation(false);
   };
  const navigation = useNavigation();
  const ResetPassword = async () => {
    if (emailId === '') {
      Alert.alert('Please enter a valid email address');
      return;
    }
    if (!validateEmail(emailId)) {
      return;
    }

    try {
      await auth().sendPasswordResetEmail(emailId);
      Alert.alert(
        'Password reset email sent!',
        'Please check your email to reset your password.',
      );
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Not registered email');
      } else {
        console.error('Error sending password reset email:', error);
        Alert.alert('Error', error.message);
      }
    }
  };
  const handleRegister = async () => {
    if(emailId==='' || password ===''){
      alert("please fill email id and password");
      return;
    }
    if(!validateEmail(emailId)){
      return;
    }
    try {
      setLoginActivityIndicator(true);
      const email = auth().signInWithEmailAndPassword(emailId,password).then(async (user)=>{
        console.log("sign in");
        if(user){
            console.log(user);
              await saveLoginId(emailId);
              const id = user.user.uid;
              console.log("id is" + id);
              const data = await getUserData(id)
              console.log("dta is " + JSON.stringify(data));
              if(data){
                await AsyncStorage.setItem(
                  'loginState',
                  JSON.stringify({emailId, id, data}),
                );
                setLoginActivityIndicator(false);
                console.log("data is" + JSON.stringify(data));
                navigation.reset({
                  index: 0,
                  routes: [{name: 'ButtonPage', params: {emailId, id, data}}],
                });
                 
                
              }else{
              console.log("final data is" + JSON.stringify(data));
              console.log("display name set to" + user.user.displayName);
              console.log('display name set to' + user.user.phoneNumber);
              await AsyncStorage.setItem(
                'loginState',
                JSON.stringify({emailId, id}),
              );
              setLoginActivityIndicator(false);
              navigation.reset({
                index: 0,
                routes: [{name: 'PersonalInfo', params: {emailId, id}}],
              });
              }
        }
      }).catch((error)=>{
        setLoginActivityIndicator(false);
        if(error.code === "auth/invalid-credential"){
          Alert.alert("id password does not match","Please enter a valid id and password");
        }else if (error.code === 'auth/too-many-requests') {
          Alert.alert("Too many attempts","Please try again after some time");
        } else {
          Alert.alert('Login Failed','Please Try Again Later');
          console.log(error);
        }
      })
    } catch (error) {
      setLoginActivityIndicator(false);
     console.log(error);
    if (error.code === "auth/email-already-in-use") {
      setErrortext("That email address is already in use!");
    } else if (error.code === "auth/wrong-password") {
      Alert.alert("email id and password does not match")
    }else if (error.code === "auth/invalid-credential") {
      Alert.alert("email id and password does not match")
    } else if (error.code === "auth/user-not-found") {
      setErrortext("Email address not found. Please try again.");
    } else {
      setErrortext("An error occurred. Please try again.");
    }

    }
  };
  
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {LoginActivityIndicator ? (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <ActivityIndicator size="large" />
          <Text
            style={{
              marginTop: 10, // Space between indicator and text
              fontSize: 16,
              color: '#FFFFFF',
            }}>
            Please Wait, While We Log You In
          </Text>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          {/* Logo */}
          <Image
            source={require('../assets/taxicar.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Happy Journey, Forever!</Text>

          {/* Input Fields */}
          <TextInput
            label="Email Id"
            value={emailId}
            onChangeText={setEmailId}
            style={styles.input}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              secureTextEntry={!showPassword}
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordButton}>
              {showPassword ? (
                <Icon name="eye" size={24} color="gray" />
              ) : (
                <Icon name="eye-slash" size={24} color="gray" />
              )}
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            textColor="#000000">
            Login
          </Button>
          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.button}
            textColor="#000000">
            Reset Password
          </Button>

          {/* Admin Portal */}
          <TouchableOpacity
            onPress={() => navigation.navigate('AdminLogin')}
            style={styles.adminPortalButton}>
            <Text style={styles.adminPortalText}>Admin portal</Text>
          </TouchableOpacity>

          {/* Social Icons */}
        </View>
      )}
      {/* Add car image graphic at the bottom */}
    </KeyboardAvoidingView>
  );
}
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#40096B', // light background
  },
  innerContainer: {
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    height: '95%',
  },
  logo: {
    width: 300,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 18,
    color: '#40096B',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    marginHorizontal: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginLeft: 10,
  },
  showPasswordButton: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFD600',
    borderRadius: 24,
    paddingVertical: 2,
    marginVertical: 5,
    marginHorizontal: 15,
    
  },
  adminPortalButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  adminPortalText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
  carImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
  },
});


export default Login;
