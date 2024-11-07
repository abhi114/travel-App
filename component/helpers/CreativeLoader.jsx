import React from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CreativeLoader = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const borderRadius = useSharedValue(20);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` }
      ],
      borderRadius: borderRadius.value
    };
  });

  React.useEffect(() => {
    scale.value = withRepeat(withTiming(1.5, { duration: 1000 }), -1, true);
    rotate.value = withRepeat(withTiming(360, { duration: 2000 }), -1, true);
    borderRadius.value = withRepeat(withTiming(50, { duration: 1000 }), -1, true);
  }, [scale, rotate, borderRadius]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View
        style={[
          {
            width: 80,
            height: 80,
            backgroundColor: 'linear-gradient(to right, #4c69e0, #a24cd1)'
          },
          animatedStyles
        ]}
      />
    </View>
  );
};

export default CreativeLoader;