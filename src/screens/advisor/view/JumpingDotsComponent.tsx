import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

const JumpingDotsComponent = () => {
  // Shared values for animations
  const dot1Y = useSharedValue(0);
  const dot2Y = useSharedValue(0);
  const dot3Y = useSharedValue(0);

  // Animation configuration
  const animationConfig = {
    duration: 240,
    easing: Easing.linear,
  };

  // Animation functions
  const animateDot1 = () => {
    dot1Y.value = withSequence(
      withTiming(-5, animationConfig),
      withTiming(0, animationConfig)
    );
  };

  const animateDot2 = () => {
    dot2Y.value = withSequence(
      withTiming(-5, animationConfig),
      withTiming(0, animationConfig)
    );
  };

  const animateDot3 = () => {
    dot3Y.value = withSequence(
      withTiming(-5, animationConfig),
      withTiming(0, animationConfig)
    );
  };

  // Animated styles
  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1Y.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2Y.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3Y.value }],
  }));

  // Start animations
  React.useEffect(() => {
    const interval = setInterval(() => {
      animateDot1();
      setTimeout(animateDot2, 200); // Delayed start for dot2
      setTimeout(animateDot3, 400); // Delayed start for dot3
    }, 800); // Interval to start animations
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        translateY: 0,
      },
    ],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 2,
  },
});

export default JumpingDotsComponent;
