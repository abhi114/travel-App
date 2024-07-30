import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Linecharts from './helpers/charts';
import { LineView } from './helpers/helpers';
import UserDataScreen from './ReportsScreen';
import AdminDriversPage from './AdminDriversPage';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const AdminPortal = ({route}) => {
  const navigation = useNavigation();
  
  const [activeSection, setActiveSection] = useState('Home');
  const {emailId, id, data} = route.params
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
      case 'Tasks':
        return <TasksSection />;
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
      <Text style={styles.backButtonText}>Back to Home</Text>
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
            <Icon name="person" size={30} color="white" />
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveSection('Settings')}
            style={styles.button}>
            <Icon name="settings" size={30} color="white" />
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
        // Prevent the default back button behavior
        return true;
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []);
    return(
      
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderBackButton()}
        <Text style={styles.headerTitle}>Profile Section</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon name="person" size={80} color="#3498db" />
        <Text style={styles.contentText}>Username: {data.name}</Text>
        <Text style={styles.contentText}>
          Mobile Number: {data.MobileNumber}
        </Text>
        <Text style={styles.contentText}>Address: {data.driverAddress}</Text>
      </View>
    </View>
    )
  };

  const SettingsSection = () => {
    useEffect(() => {
      const handleBackPress = () => {
        // Prevent the default back button behavior
        return true;
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []);
    return (
      
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderBackButton()}
        <Text style={styles.headerTitle}>Settings Section</Text>
      </View>
      <View style={styles.contentContainer}>
        <Icon name="settings" size={80} color="#3498db" />
        <Text style={styles.contentText}>Notifications: On</Text>
        <Text style={styles.contentText}>Theme: Light</Text>
      </View>
    </View>
    )
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
        // Prevent the default back button behavior
        return true;
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []);
    return(
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          {renderBackButton()}
          <Text style={styles.headerTitle}>Analytics Section</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentText, {fontWeight: 'bold'}]}>
            Analysis Of User Data
          </Text>
          <LineView />
          <Linecharts name={'User'} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.contentText, {fontWeight: 'bold'}]}>
            Analysis Of Driver's Data
          </Text>
          <LineView />
          <Linecharts name={'Driver'} />
        </View>
      </ScrollView>
    </View>
    )
  };

  const MessagesSection = () => {
    useEffect(() => {
      const handleBackPress = () => {
        // Prevent the default back button behavior
        return true;
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []);
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
    
    return <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderBackButton()}
        <Text style={styles.headerTitle}>Driver's Information</Text>
      </View>
      <View style={styles.contentContainer}>
       
        <AdminDriversPage/>
      </View>
    </View>
  };
  const CalendarSection = () => {
    useEffect(() => {
      const handleBackPress = () => {
        // Prevent the default back button behavior
        return true;
      };

      // Register the back button handler
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Clean up the event listener when the component unmounts
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []);
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {renderBackButton()}
          <Text style={styles.headerTitle}>Ride's Information</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Events -  This Week</Text>
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
      borderRadius: 5,
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
