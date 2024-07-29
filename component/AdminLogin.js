import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {TextInput, Button, Title} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {validateEmail} from './helpers/helpers';
const Login = ({route}) => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const getUserData = async id => {
    try {
      const userRef = firestore().collection('userInfo').doc(id);
      const userData = await userRef.get();
      return userData.data();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const getAdminInfo = async id => {
    try {
      const userRef = firestore().collection('admin').doc(id);
      const userData = await userRef.get();
      if(userData.exists){
        return true;
      }else{
        return false
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const navigation = useNavigation();
  
  
  const handleRegister = async () => {
    if (emailId === '' || password === '') {
      alert('please fill email id and password');
      return;
    }
    if (!validateEmail(emailId)) {
      return;
    }
    const admininfo = await getAdminInfo(emailId);
    if(!admininfo){
        Alert.alert("Email-Id Not Registered","Please Enter a Admin Email-Id");
        return;
    }
    console.log("get admin info" + admininfo);
    try {
      const email = auth()
        .signInWithEmailAndPassword(emailId, password)
        .then(async user => {
          console.log(user);
          const id = user.user.uid;
          console.log('id is' + id);
          const data = await getUserData(id);
          console.log('dta is ' + JSON.stringify(data));
          if (data) {
            navigation.navigate('AdminPortal', {emailId, id, data});
          } else {
            console.log('final data is' + JSON.stringify(data));
            console.log('display name set to' + user.user.displayName);
            console.log('display name set to' + user.user.phoneNumber);
            Alert.alert("complete your Profile First")
          }
        })
        .catch(error => {
          if (error.code === 'auth/invalid-credential') {
            Alert.alert(
              'id password does not match',
              'Please enter a valid id and password',
            );
          }
        });
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        setErrortext('That email address is already in use!');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('email id and password does not match');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('email id and password does not match');
      } else if (error.code === 'auth/user-not-found') {
        setErrortext('Email address not found. Please try again.');
      } else {
        setErrortext('An error occurred. Please try again.');
      }
    }
  };

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
        <Title style={styles.title}>Admin Login</Title>
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
          Login To Dashboard
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  adminPortalText: {
    textDecorationLine: 'underline',
    textDecorationColor: '#007AFF', // blue color
    color: '#007AFF', // blue color
    fontSize: 16,
  },
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
