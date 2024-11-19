import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  interpolate,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const FuelExpenditureCard = ({ selectedMonth, monthNames, userInfo }) => {
  const scale = useSharedValue(1);
  const cardOpacity = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const amountScale = useSharedValue(0.9);

  useEffect(() => {
    // Initial animation sequence
    cardOpacity.value = withSequence(
      withDelay(300, withSpring(1)),
    );
    iconRotate.value = withDelay(600, withSpring(1));
    amountScale.value = withDelay(800, withSpring(1));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        rotate: `${interpolate(iconRotate.value, [0, 1], [0, 360])}deg`
      }
    ],
  }));

  const amountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: amountScale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.98);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const styles = {
    container: {
      marginHorizontal: wp(3),
      marginVertical: hp(2),
      
      borderRadius: wp(4),
      overflow: 'hidden',
      elevation: 5, // for Android shadow
      shadowColor: '#000', // for iOS shadow
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    gradientContainer: {
      flex: 1,
      padding: wp(4),
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hp(1),
    },
    iconContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: wp(2),
      borderRadius: wp(2),
      width: wp('8%'),
      height: wp('8%'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      color: '#FFFFFF',
      fontSize: wp(4),
      fontWeight: '600',
      marginLeft:wp(2),
      flex: 1, // allows text to wrap if needed
    },
    subText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: wp(3),
      
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    currencySymbol: {
      color: '#FFFFFF',
      fontSize: wp(5),
      fontWeight: '600',
      marginRight: wp(1),
    },
    amountText: {
      color: '#FFFFFF',
      fontSize: wp(5),
      fontWeight: '700',
    },
    rightIconContainer: {
      position: 'absolute',
      right: wp(4),
      top: wp(4),
    }
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.container, cardStyle]}>
        <AnimatedLinearGradient
          colors={['#4158D0', '#C850C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <View style={styles.headerContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Animated.View style={[styles.iconContainer, iconStyle]}>
                <AnimatedIcon 
                  name="gas-station" 
                  size={wp(5)} 
                  color="#FFFFFF" 
                />
              </Animated.View>
              <Text style={styles.headerText}>Monthly Fuel Expenditure</Text>
            </View>
          </View>

          <Text style={styles.subText}>
            Total Fuel Expenditure for the Month of{' '}
            {selectedMonth !== 13 ? monthNames[selectedMonth] : ' '}
          </Text>

          <Animated.View style={[styles.amountContainer, amountStyle]}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.amountText}>
              {selectedMonth !== 13
                ? userInfo.monthExpenditure?.[monthNames[selectedMonth]]?.toLocaleString()
                : '0'}
            </Text>
          </Animated.View>

          <View style={styles.rightIconContainer}>
            <Icon 
              name="arrow-top-right" 
              size={wp(5)} 
              color="rgba(255, 255, 255, 0.8)" 
            />
          </View>
        </AnimatedLinearGradient>
      </Animated.View>
    </Pressable>
  );
};

export default FuelExpenditureCard;