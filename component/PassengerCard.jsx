import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Animated, { 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const PassengerInfoScreen = ({passengerData}) => {
  

  const renderPassengerCard = ({ item, index }) => {
    const { key, data } = item;

    return (
      <Animated.View 
        entering={FadeInRight.delay(index * 200).springify()}
        style={{
          width: Dimensions.get('window').width * 0.75,
          marginRight: 15,
          borderRadius: 20,
          padding: 17,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
          marginBottom:6
        }}
        key={key}
      >
        {/* Header with passenger number and name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ backgroundColor: '#E0F2FE', borderRadius: 50, padding: 10, marginRight: 12 }}>
            <MaterialCommunityIcons name="account" size={24} color="#0284C7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '500' }}>
              {key}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1E293B' }}>
              {data.PassengerName}
            </Text>
          </View>
        </View>

        {/* Journey Details */}
        <View style={{ marginBottom: 10 }}>
          {/* Starting Point */}
          <View style={{
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#F3F4F6', 
            padding: 15, 
            borderRadius: 12, 
            marginBottom: 5
          }}>
            <View style={{ backgroundColor: '#D1FAE5', borderRadius: 50, padding: 6, marginRight: 10 }}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#6B7280', fontSize: 13, fontWeight: '500' }}>
                Starting Point
              </Text>
              <Text style={{ color: '#374151', fontSize: 16 }}>
                {data.StartingAddress}
              </Text>
            </View>
          </View>

          {/* Connection Line */}
          <View style={{ width: 2, height: 20, backgroundColor: '#D1D5DB', marginLeft: 28, }} />

          {/* Destination */}
          <View style={{
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#F3F4F6', 
            padding: 12, 
            borderRadius: 12, 
            marginTop:2
          }}>
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 50, padding: 6, marginRight: 10 }}>
              <MaterialCommunityIcons name="map-marker-radius" size={20} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#6B7280', fontSize: 13, fontWeight: '500' }}>
                Destination
              </Text>
              <Text style={{ color: '#374151', fontSize: 16 }}>
                {data.DestinationAddress}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#fff', 
        paddingHorizontal: 24, 
        paddingVertical: 16, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 4 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
              Passengers
            </Text>
            <Text style={{ color: '#64748B' }}>
              {Object.keys(passengerData).length} passengers for this trip
            </Text>
          </View>
          <View style={{ backgroundColor: '#E0F2FE', borderRadius: 50, padding: 8 }}>
            <MaterialCommunityIcons 
              name="account-group" 
              size={24} 
              color="#0284C7"
            />
          </View>
        </View>
      </View>

      {/* Passenger Cards */}
      <FlatList
        data={Object.entries(passengerData).map(([key, data]) => ({ key, data }))}
        renderItem={renderPassengerCard}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}
      />
    </View>
  );
};

export default PassengerInfoScreen;
