import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Camera, X, Upload, Check, Image as ImageIcon, Trash2 } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const CarDetailsModal = ({ isVisible, onClose, onSubmit }) => {
  const [carPhoto, setCarPhoto] = useState(null);
  const [carModel, setCarModel] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  const imageScale = useSharedValue(1);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(imageScale.value) }],
    };
  });

  const handleImagePicker = () => {
    Alert.alert(
      "Add Car Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => openCamera(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => openGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1280,
      maxHeight: 720,
      quality: 1,
      saveToPhotos: true,
    };
     const hasCameraPermission = await requestCameraPermission();
  if (hasCameraPermission) {
    const result = await launchCamera(options);
    handleImageResult(result);
  }
  };

  const openGallery = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1280,
      maxHeight: 720,
      quality: 1,
    };

    const result = await launchImageLibrary(options);
    handleImageResult(result);
  };

  const handleImageResult = (result) => {
    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage);
      console.log(result.errorMessage);
      return;
    }

    if (result.assets && result.assets[0]) {
      setCarPhoto(result.assets[0]);
      imageScale.value = 0.8;
      setTimeout(() => {
        imageScale.value = 1;
      }, 100);
    }
  };
  async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result !== RESULTS.GRANTED) {
      const requestResult = await request(PERMISSIONS.IOS.CAMERA);
      return requestResult === RESULTS.GRANTED;
    }
    return result === RESULTS.GRANTED;
  }
}
  const removeImage = () => {
    imageScale.value = 0.8;
    setTimeout(() => {
      setCarPhoto(null);
      imageScale.value = 1;
    }, 200);
  };

  const handleSubmit = async () => {
    if (!carPhoto || !carModel.trim() || !carNumber.trim()) {
      Alert.alert('Error', 'Please fill all the details');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        photo: carPhoto,
        model: carModel,
        number: carNumber,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to submit details');
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          className="flex-1 bg-black/50"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                entering={SlideInDown}
                exiting={SlideOutDown}
                className="bg-white rounded-t-3xl"
                style={{
                  paddingTop: hp('3%'),
                  paddingHorizontal: wp('5%'),
                  paddingBottom: hp('4%'),
                }}
              >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text 
                    className="text-gray-800 font-bold" 
                    style={{ fontSize: wp('5%') }}
                  >
                    Add Car Details
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    className="rounded-full bg-gray-100 p-2"
                  >
                    <X size={wp('5%')} color="#374151" />
                  </TouchableOpacity>
                </View>

                {/* Car Photo Section */}
                <Animated.View
                  entering={FadeInDown.delay(200).springify()}
                  style={{ height: hp('25%'), marginBottom: hp('2%') }}
                >
                  <TouchableOpacity
                    onPress={handleImagePicker}
                    className={`flex-1 border-2 border-dashed rounded-2xl overflow-hidden
                      ${carPhoto ? 'border-transparent' : 'border-gray-300'}`}
                  >
                    {carPhoto ? (
                      <Animated.View style={[{ flex: 1 }, imageAnimatedStyle]}>
                        <Image
                          source={{ uri: carPhoto.uri }}
                          className="w-full h-full"
                          style={{ resizeMode: 'cover' }}
                        />
                        <TouchableOpacity
                          onPress={removeImage}
                          className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                          style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}
                        >
                          <Trash2 size={wp('4%')} color="white" />
                        </TouchableOpacity>
                      </Animated.View>
                    ) : (
                      <View className="flex-1 items-center justify-center space-y-2">
                        <View className="bg-gray-100 rounded-full p-3">
                          <Camera size={wp('8%')} color="#6B7280" />
                        </View>
                        <Text
                          className="text-gray-500 text-center"
                          style={{ fontSize: wp('3.5%') }}
                        >
                          Tap to add car photo
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* Input Fields */}
                <Animated.View
                  entering={FadeInDown.delay(400).springify()}
                  style={{ gap: hp('2%') }}
                >
                  <View>
                    <Text
                      className="text-gray-700 mb-1 font-medium"
                      style={{ fontSize: wp('3.5%') }}
                    >
                      Car Model
                    </Text>
                    <TextInput
                      value={carModel}
                      onChangeText={setCarModel}
                      placeholder="e.g., Toyota Camry"
                      className="bg-gray-50 rounded-xl px-4"
                      style={{
                        height: hp('6%'),
                        fontSize: wp('3.8%'),
                        color:'#000'
                      }}
                    />
                  </View>

                  <View>
                    <Text
                      className="text-gray-700 mb-1 font-medium"
                      style={{ fontSize: wp('3.5%') }}
                    >
                      Car Number
                    </Text>
                    <TextInput
                      value={carNumber}
                      onChangeText={setCarNumber}
                      placeholder="e.g., ABC 1234"
                      className="bg-gray-50 rounded-xl px-4"
                      style={{
                        height: hp('6%'),
                        fontSize: wp('3.8%'),
                        color:'#000'
                      }}
                      autoCapitalize="characters"
                    />
                  </View>
                </Animated.View>

                {/* Submit Button */}
                <Animated.View
                  entering={FadeInDown.delay(600).springify()}
                  style={{ marginTop: hp('3%') }}
                >
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className={`rounded-xl flex-row items-center justify-center ${
                      loading ? 'bg-blue-400' : 'bg-blue-500'
                    }`}
                    style={{
                      height: hp('6.5%'),
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    {loading ? (
                      <View className="flex-row items-center">
                        <Text className="text-white font-bold mr-2" style={{ fontSize: wp('4%') }}>
                          Submitting
                        </Text>
                        <Animated.View
                          entering={FadeIn}
                          className="animate-spin"
                        >
                          <Check size={wp('5%')} color="white" />
                        </Animated.View>
                      </View>
                    ) : (
                      <Text className="text-white font-bold" style={{ fontSize: wp('4%') }}>
                        Submit Details
                      </Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CarDetailsModal;