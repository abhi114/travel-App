import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Linecharts from './helpers/charts';
import { LineView } from './helpers/helpers';
import UserDataScreen from './ReportsScreen';
import firestore from '@react-native-firebase/firestore';
import AdminDriversPage from './AdminDriversPage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminProfileSection from './AdminProfileSection';
import AnalyticsGraphSection from './helpers/Analytics/Analytics';
import SettingsNewSection from './helpers/SettingsSection';

const Tab = createBottomTabNavigator();

const AdminPortal = ({route}) => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState([]);
  const [activeSection, setActiveSection] = useState('Home');
  const {data} = route.params
  
   //const {setActive} = route.params || {};
   //console.log(setActive + 'hello');
  
  console.log("came back")
  const gotoStats = ()=>{
    navigation.navigate("Stats")
  }
  const renderSection = () => {
    switch (activeSection) {
      case 'Profile':
        return <ProfileSection />;
      case 'Settings':
        return <SettingsSection />;
      case 'Analytics':
        return <AnalyticsSection />;
      case 'Messages':
        return <MessagesSection />;
      case 'Tasks':return <TasksSection/>;
      case 'Calendar':
        return <CalendarSection />;
      default:
        return <HomeSection />;
    }
  };
  
  const renderBackButton = () => (
    <TouchableOpacity
      onPress={() => setActiveSection('Home')}
      style={styles.backButton}>
      <Icon name="arrow-back" size={30} color="#000000" />
      
    </TouchableOpacity>
  );

  const HomeSection = () => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome to the Dashboard!</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => setActiveSection('Profile')}
            style={styles.button}>
            <Icon name="person" size={25} color="white" />
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveSection('Settings')}
            style={styles.button}>
            <Icon name="settings" size={25} color="white" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.featuresContainer}>
        <PressableFeatureBox
          name="Analytics"
          icon="stats-chart"
          onPress={() => setActiveSection('Analytics')}
        />
        <PressableFeatureBox
          name="Users Information"
          icon="people-outline"
          onPress={() => setActiveSection('Messages')}
        />
        <PressableFeatureBox
          name="Drivers Information"
          icon="person-circle"
          onPress={() => setActiveSection('Tasks')}
        />
        <PressableFeatureBox
          name="Calendar"
          icon="calendar"
          onPress={() => setActiveSection('Calendar')}
        />
        
        <PressableFeatureBox
          name={` Top User \n Abhishek\n\nTotal Rides\n       37`}
          icon="person-circle"
          onPress={() => setActiveSection('Home')}
        />
      </View>
      
    </View>
  );
  const ProfileSection = () => {
    useEffect(() => {
      const handleBackPress = () => {
        if (activeSection !== 'Home') {
          setActiveSection('Home');
          return true; // Prevent default behavior (exit app)
        } else {
          return false; // Allow default behavior (exit app)
        }
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [activeSection]);
    return (
      // <View style={styles.container}>
      //   <View style={styles.headerContainer}>
      //     {renderBackButton()}
      //     <Text style={styles.headerTitle}>Profile Section</Text>
      //   </View>
      //   <View style={styles.contentContainer}>
      //     <Icon name="person" size={80} color="#3498db" />
      //     <Text style={styles.contentText}>Username: {data.name}</Text>
      //     <Text style={styles.contentText}>
      //       Mobile Number: {data.MobileNumber}
      //     </Text>
      //     <Text style={styles.contentText}>Address: {data.driverAddress}</Text>
      //   </View>
      // </View>
      <AdminProfileSection
        data={{
          name: data.name,
          MobileNumber: data.MobileNumber,
          driverAddress: data.driverAddress,
          email: 'john@example.com',
          joinedDate: 'Jan 2024',
        }}
        onBackPress={() => setActiveSection('Home')}
      />
    );
  };

  const SettingsSection = () => {
   useEffect(() => {
     const handleBackPress = () => {
       if (activeSection !== 'Home') {
         setActiveSection('Home');
         return true; // Prevent default behavior (exit app)
       } else {
         return false; // Allow default behavior (exit app)
       }
     };

     // Register the back button handler
     BackHandler.addEventListener('hardwareBackPress', handleBackPress);

     // Clean up the event listener when the component unmounts
     return () => {
       BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
     };
   }, [activeSection]);
   const handleLogout = () => {
     Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
       {
         text: 'Logout',
         onPress: () => {
          AsyncStorage.removeItem('AdminloginState');
           navigation.reset({
             index: 0,
             routes: [{name: 'Register'}],
           });
         },
       },
     ]);
   };
    return (
      // <View style={styles.container}>
      //   <View style={styles.headerContainer}>
      //     {renderBackButton()}
      //     <Text style={styles.headerTitle}>Settings Section</Text>
      //   </View>
      //   <View style={styles.contentContainer}>
      //     <Icon name="settings" size={80} color="#3498db" />
      //     <Text style={styles.contentText}>Notifications: On</Text>
      //     <Text style={styles.contentText}>Theme: Light</Text>
      //     <TouchableNativeFeedback
      //       onPress={handleLogout}
      //       background={TouchableNativeFeedback.Ripple('#fff', true)}>
      //       <View
      //         style={{
      //           backgroundColor: '#007bff', // blue color
      //           padding: 16,
      //           borderRadius: 8,
      //           borderColor: '#007bff',
      //           borderWidth: 1,
      //         }}>
      //         <Text
      //           style={{
      //             fontSize: 18,
      //             color: '#fff', // white text color
      //             textAlign: 'center',
      //           }}>
      //           Logout
      //         </Text>
      //       </View>
      //     </TouchableNativeFeedback>
      //   </View>
      // </View>
      <SettingsNewSection
        onBackPress={() => setActiveSection('Home')}
        onLogout={() => handleLogout()}
      />
    );
  };

  const PressableFeatureBox = ({name, icon, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.featureBox}>
      <Icon name={icon} size={50} color="#3498db" />
      <Text style={styles.featureName}>{name}</Text>
    </TouchableOpacity>
  );

  const AnalyticsSection = () => {
    
    useEffect(() => {
      const handleBackPress = () => {
        if (activeSection !== 'Home') {
          setActiveSection('Home');
          return true; // Prevent default behavior (exit app)
        } else {
          return false; // Allow default behavior (exit app)
        }
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [activeSection]);
    
    return (
      // <View style={styles.container}>
      //   <ScrollView>
      //     <View style={styles.headerContainer}>
      //       {renderBackButton()}
      //       <Text style={styles.headerTitle}>Analytics Section</Text>
      //     </View>
      //     <View style={styles.contentContainer}>
      //       <Text style={[styles.contentText, {fontWeight: 'bold'}]}>
      //         Analysis Of User Data
      //       </Text>
      //       <LineView />
      //       <Linecharts name={'User'} />
      //     </View>
      //     <View style={styles.contentContainer}>
      //       <Text style={[styles.contentText, {fontWeight: 'bold'}]}>
      //         Analysis Of Driver's Data
      //       </Text>
      //       <LineView />
      //       {userInfo && <Linecharts name={'Driver'} userInfo={userInfo} />}
      //     </View>
      //   </ScrollView>
      // </View>
      <AnalyticsGraphSection
        userInfo={userInfo}
        onBackPress={() => setActiveSection('Home')}
      />
    );
  };

  const MessagesSection = () => {
    useEffect(() => {
      const handleBackPress = () => {
        if (activeSection !== 'Home') {
          setActiveSection('Home');
          return true; // Prevent default behavior (exit app)
        } else {
          return false; // Allow default behavior (exit app)
        }
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [activeSection]);
    return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderBackButton()}
        <Text style={styles.headerTitle}>Users Section</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>No User Infromation Available</Text>
      </View>
    </View>
    )
  };

  const TasksSection = () => {
   
   useEffect(() => {
     const handleBackPress = () => {
       if (activeSection !== 'Home') {
         setActiveSection('Home');

         return true; // Prevent default behavior (exit app)
       } else {
         return false; // Allow default behavior (exit app)
       }
     };

     // Register the back button handler
     BackHandler.addEventListener('hardwareBackPress', handleBackPress);

     // Clean up the event listener when the component unmounts
     return () => {
       BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
     };
   }, [activeSection]);
    return (
      <View style={styles.container}>
        <View className="flex-row items-center justify-between bg-blue-400 px-4 py-8 border-b border-gray-200 shadow-sm">
          <View className="flex-row items-center space-x-3">
            {renderBackButton()}
            <Text className="text-xl font-bold text-gray-800">
              Driver's Information
            </Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <AdminDriversPage data={data}/>
        </View>
      </View>
    );
  };
  const CalendarSection = () => {
    useEffect(() => {
      const handleBackPress = () => {
        if (activeSection !== 'Home') {
          setActiveSection('Home');
          return true; // Prevent default behavior (exit app)
        } else {
          return false; // Allow default behavior (exit app)
        }
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [activeSection]);
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {renderBackButton()}
          <Text style={styles.headerTitle}>Ride's Information</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Events -  Live</Text>
          <EventItem
            date="Mon, Jan 10"
            time="3:00 PM - 5:00 PM"
            title="Completed Ride"
            location="HazjrantGanj - GomtiNagar"
            km="Total Km Travelled - 5km"
            Fuel={`Total Cost of Fuel - Rs100`}
          />
          <EventItem
            date="Thu, Jan 13"
            time="10:00 AM - 12:00 PM"
            title="Ongoing Ride"
            location="GomtiNagar - HazratGanj"
            km="Total Km Travelled - 10km"
            Fuel={`Total Cost of Fuel - Rs1000`}
          />
          <EventItem
            date="Sat, Jan 15"
            time="6:00 PM - 8:00 PM"
            title="Ongoing Ride"
            location="HazratGanj - Charbagh"
            km="Total Km Travelled - 20km"
            Fuel={`Total Cost of Fuel - Rs400`}
          />
        </View>
      </View>
    );
  };

  const TaskItem = ({title, description}) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{title}</Text>
      <Text style={styles.taskDescription}>{description}</Text>
    </View>
  );

  const EventItem = ({date, time, title, location, km,Fuel}) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDateTime}>
        <Text style={styles.eventDate}>{date}</Text>
        <Text style={styles.eventTime}>{time}</Text>
      </View>
      <Text style={styles.eventTitle}>{title}</Text>
      <Text style={styles.eventLocation}>{location}</Text>
      <Text style={styles.eventLocation}>{km}</Text>
      <Text style={styles.eventLocation}>{Fuel}</Text>
    </View>
  );
 const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      backgroundColor: '#3498db',
      padding: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 5,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
      
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2ecc71',
      padding: 10,
      borderRadius: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    featuresContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    featureBox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      aspectRatio: 1,
      backgroundColor: 'white',
      borderRadius: 10,
      marginVertical: 10,
      elevation: 5,
    },
    featureName: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#555',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      color: '#3498db',
      fontSize: 16,
      marginLeft: 10,
    },
    contentContainer: {
      flex: 1,
      padding: 20,
    },
    contentText: {
      fontSize: 16,
      marginBottom: 10,
      color: '#555',
    },
    contentTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    taskItem: {
      backgroundColor: '#3498db',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
    },
    taskTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    taskDescription: {
      color: 'white',
      fontSize: 14,
      marginTop: 5,
    },
    eventItem: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      elevation: 5,
    },
    eventDateTime: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    eventDate: {
      color: '#3498db',
      fontSize: 16,
      fontWeight: 'bold',
    },
    eventTime: {
      color: '#555',
      fontSize: 16,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    eventLocation: {
      fontSize: 14,
      color: '#777',
    },
  });

  return (
    <View style={styles.container}>
      {renderSection()}
    </View>
  );
};

export default AdminPortal;
