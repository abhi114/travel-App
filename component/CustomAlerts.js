import React, {useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import {Check, AlertCircle, Loader2} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Success Alert Component
export const SuccessAlert = ({visible, message, onClose}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1);
      opacity.value = withTiming(1, {duration: 300});
    } else {
      scale.value = withSpring(0);
      opacity.value = withTiming(0, {duration: 300});
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const checkmarkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      checkmarkScale.value = withSpring(1, {damping: 8});
    }
  }, [visible]);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{scale: checkmarkScale.value}],
  }));

  return (
    <Modal transparent visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View
          style={containerStyle}
          className="bg-white rounded-2xl p-6 m-4 items-center shadow-lg w-80">
          <Animated.View
            style={checkmarkStyle}
            className="bg-green-100 rounded-full p-3 mb-4">
            <Check size={hp('4%')} color="#22c55e" />
          </Animated.View>
          <Text className="text-lg font-semibold text-gray-800 text-center mb-4">
            {message}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-green-500 rounded-lg py-3 px-6">
            <Text className="text-white font-medium">Got it</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Form Validation Alert Component
export const FormAlert = ({visible, fields, onClose}) => {
  const slideY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      slideY.value = withSpring(0);
      opacity.value = withTiming(1, {duration: 300});
    } else {
      slideY.value = withSpring(50);
      opacity.value = withTiming(0, {duration: 300});
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{translateY: slideY.value}],
    opacity: opacity.value,
  }));

  return (
    <Modal transparent visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View
          style={containerStyle}
          className="bg-white rounded-2xl p-6 m-4 shadow-lg w-80">
          <View className="bg-red-100 rounded-full p-3 self-center mb-4">
            <AlertCircle size={hp('4%')} color="#ef4444" />
          </View>
          <Text className="text-lg font-semibold text-gray-800 text-center mb-2">
            Incomplete Form
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            Please fill in the following fields:
          </Text>
          {fields.map((field, index) => (
            <Text key={index} className="text-red-500 text-center mb-1">
              • {field}
            </Text>
          ))}
          <TouchableOpacity
            onPress={onClose}
            className="bg-red-500 rounded-lg py-3 px-6 mt-4 self-center">
            <Text className="text-white font-medium">Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Loading Alert Component
export const LoadingAlert = ({visible, message = 'Loading...'}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
      );
    }
  }, [visible]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <Modal transparent visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 m-4 items-center shadow-lg">
          <Animated.View style={spinStyle}>
            <Loader2 size={hp('4%')} color="#6366f1" />
          </Animated.View>
          <Text className="text-gray-800 font-medium mt-4">{message}</Text>
        </View>
      </View>
    </Modal>
  );
};
