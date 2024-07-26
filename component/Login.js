import React, {useEffect, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Text, Alert} from 'react-native';
import {TextInput, Button, Title} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { validateEmail } from './helpers/helpers';
const Login = ({route}) => {
 
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  //const [restPassword,setresetPassword] = useState(false);
   const [showConfirmation, setShowConfirmation] = useState(false);
   const getUserData = async (id) => {
     try {
       const userRef = firestore().collection('userInfo').doc(id);
       const userData = await userRef.get();
       return userData.data();
     } catch (error) {
       console.error('Error fetching user data:', error);
     }
   };

   const handleResetPassword = () => {
     
     Alert.alert('Are you sure you want to reset your Password',"", [
       {
         text: 'Cancel',
         onPress: () => console.log('Cancel Pressed'),
         style: 'cancel',
       },
       {text: 'OK', onPress: () => ResetPassword()},
     ]);
   };

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
  const ResetPassword =async ()=>{
    if (emailId === '' ) {
      Alert.alert('Please enter valid email address');
      return;
    }
    if (!validateEmail(emailId)){
      return;
    }
      try {
        await auth().sendPasswordResetEmail(emailId);
        Alert.alert(
          'Password reset email sent!',
          'Please check your email to reset your password.',
        );
      } catch (error) {
        console.error('Error sending password reset email:', error);
        Alert.alert('Error', error.message);
      }
  }
  const handleRegister = async () => {
    if(emailId==='' || password ===''){
      alert("please fill email id and password");
      return;
    }
    if(!validateEmail(emailId)){
      return;
    }
    try {
      
      const email = auth().signInWithEmailAndPassword(emailId,password).then(async (user)=>{
        console.log("sign in");
        if(user){
            console.log(user);
              const id = user.user.uid;
              console.log("id is" + id);
              const data = await getUserData(id)
              console.log("dta is " + JSON.stringify(data));
              if(data){
                navigation.navigate("ButtonPage",{emailId,id,data});
                
              }else{
              console.log("final data is" + JSON.stringify(data));
              console.log("display name set to" + user.user.displayName);
              console.log('display name set to' + user.user.phoneNumber);
              navigation.navigate('PersonalInfo',{emailId,id});
              }
        }
      })
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
          setErrortext(
            "That email address is already in use!"
          );
        }
    }
  };
  
  const handleVerifyOtp = async () => {
    
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.innerContainer}>
        
        <Image
          source={require('../icon_ph1.png')}
          style={{alignSelf: 'center', margin: 10}}
        />
        <Title style={styles.title}>Login</Title>
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
          Login
        </Button>
        <Button
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}>
          Reset Password
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

export default Login;
