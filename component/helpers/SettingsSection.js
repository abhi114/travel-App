import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Switch, ScrollView} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Settings,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Shield,
  Smartphone,
  Globe,
  HelpCircle,
  LogOut,
  UserCog,
} from 'lucide-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SettingsNewSection = ({onBackPress, onLogout}) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const SettingsCard = ({
    icon: Icon,
    title,
    description,
    rightElement,
    delay = 0,
  }) => (
    <Animated.View
      entering={FadeInRight.delay(delay).springify()}
      className="bg-white rounded-xl mb-3 shadow-sm overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center p-4"
        activeOpacity={0.7}>
        <View className="bg-blue-50 p-3 rounded-full">
          <Icon size={wp('6%')} color="#3b82f6" />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-gray-800 font-semibold text-base">{title}</Text>
          {description && (
            <Text className="text-gray-500 text-sm mt-1">{description}</Text>
          )}
        </View>
        {rightElement || <ChevronRight size={wp('5%')} color="#94a3b8" />}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-6">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute top-12 left-4 p-2">
          <ChevronLeft size={wp('6%')} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-center text-xl font-semibold">
          Settings
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="bg-white rounded-xl mb-6 p-4 shadow-sm">
          <View className="flex-row items-center">
            <View className="bg-blue-500 p-4 rounded-full">
              <UserCog size={wp('8%')} color="white" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-gray-800 text-lg font-bold">John Doe</Text>
              <Text className="text-gray-500">Administrator Account</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">Edit</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Text className="text-gray-500 font-semibold mb-2 ml-1">
          PREFERENCES
        </Text>
        <SettingsCard
          icon={Bell}
          title="Notifications"
          description={notifications ? 'Enabled' : 'Disabled'}
          delay={300}
          rightElement={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{false: '#cbd5e1', true: '#93c5fd'}}
              thumbColor={notifications ? '#3b82f6' : '#94a3b8'}
            />
          }
        />
        <SettingsCard
          icon={darkMode ? Moon : Sun}
          title="Dark Mode"
          description={darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
          delay={400}
          rightElement={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{false: '#cbd5e1', true: '#93c5fd'}}
              thumbColor={darkMode ? '#3b82f6' : '#94a3b8'}
            />
          }
        />
        <SettingsCard
          icon={Globe}
          title="Location Services"
          description={locationServices ? 'Enabled' : 'Disabled'}
          delay={500}
          rightElement={
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{false: '#cbd5e1', true: '#93c5fd'}}
              thumbColor={locationServices ? '#3b82f6' : '#94a3b8'}
            />
          }
        />

        {/* General Section */}
        <Text className="text-gray-500 font-semibold mb-2 ml-1 mt-6">
          GENERAL
        </Text>
        <SettingsCard
          icon={Shield}
          title="Privacy & Security"
          description="Manage your privacy settings"
          delay={600}
        />
        <SettingsCard
          icon={Smartphone}
          title="App Settings"
          description="Manage app preferences"
          delay={700}
        />
        <SettingsCard
          icon={HelpCircle}
          title="Help & Support"
          description="Get help or contact support"
          delay={800}
        />

        {/* Logout Button */}
        <Animated.View
          entering={FadeInDown.delay(900).springify()}
          style={buttonAnimatedStyle}
          className="mt-6 mb-8">
          <TouchableOpacity
            onPress={onLogout}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="bg-red-500 py-4 px-6 rounded-xl flex-row items-center justify-center">
            <LogOut size={wp('5%')} color="white" className="mr-2" />
            <Text className="text-white font-bold text-lg ml-2">Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default SettingsNewSection;
