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
  ActivityIndicator,
} from 'react-native';
import {TextInput, Button, Title} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {validateEmail} from './helpers/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
const Login = ({route}) => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [LoginActivityIndicator, setLoginActivityIndicator] = useState(false);
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
      if (userData.exists) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (emailId === '' || password === '') {
      Alert.alert('Not Found','please fill email id and password');
      return;
    }
    if (!validateEmail(emailId)) {
      return;
    }
    setLoginActivityIndicator(true);
    const admininfo = await getAdminInfo(emailId);
    if (!admininfo) {
      Alert.alert('Email-Id Not Registered', 'Please Enter a Admin Email-Id');
      setLoginActivityIndicator(false);
      return;
      
    }
    console.log('get admin info' + admininfo);
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
            await AsyncStorage.setItem(
              'AdminloginState',
              JSON.stringify({emailId, id, data}),
            );
            setLoginActivityIndicator(false)
            navigation.reset({
              index: 0,
              routes: [{name: 'AdminPortal', params: {emailId, id, data}}],
            });
          } else {
            setLoginActivityIndicator(false);
            console.log('final data is' + JSON.stringify(data));
            console.log('display name set to' + user.user.displayName);
            console.log('display name set to' + user.user.phoneNumber);
            Alert.alert('complete your Profile First');
          }
        })
        .catch(error => {
          setLoginActivityIndicator(false);
          if (error.code === 'auth/invalid-credential') {
            Alert.alert(
              'id password does not match',
              'Please enter a valid id and password',
            );
          }
        });
    } catch (error) {
      setLoginActivityIndicator(false);
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
          <Image
            source={require('../assets/admin_login1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Title style={styles.title}>Admin Panel</Title>
          <Text style={styles.subtitle}>Control panel login</Text>

          {/* Username Field */}
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#FFF" style={styles.icon} />
            <TextInput
              placeholder="Email Id"
              value={emailId}
              onChangeText={setEmailId}
              placeholderTextColor="#A9A9A9"
              style={styles.input}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}> 
            <Icon name="lock" size={20} color="#FFF" style={styles.icon} />
            <TextInput
              secureTextEntry={!showPassword}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#A9A9A9"
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={() => {
              handleRegister();
            }}
            style={styles.button}>
            Login To Dashboard
          </Button>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D', // Dark background
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
    borderRadius:35,
    
    
  },
  title: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A9A9A9',
    fontSize: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2D3E', // Input background color
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginVertical:10,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 2,
    marginHorizontal:5
  },
  button: {
    backgroundColor: '#FFB400', // Yellow login button
    marginTop: 16,
    paddingVertical: 3,
    width: '90%',
    borderRadius: 8,
  },
});

export default Login;
