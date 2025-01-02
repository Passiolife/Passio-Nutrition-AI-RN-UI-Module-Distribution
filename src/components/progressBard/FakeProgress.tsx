import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Branding, useBranding } from '../../contexts';

const INIT_TIME = 500;
const MID_TIME = 200;
const FINAL_TIME = 800;
const FINAL_TIME_2 = 1200;
const DELAY_TIME = 250;
interface ProgressBarProps {
  data: [];
  loading: boolean;
  isNutritionLabelProgress?: boolean;
}

const FakeProgress = ({
  data,
  loading,
  isNutritionLabelProgress = false,
}: ProgressBarProps) => {
  const INITIAL_LOADING_TIME = isNutritionLabelProgress
    ? INIT_TIME + DELAY_TIME
    : 500;
  const MID_LOADINDG_TIME = isNutritionLabelProgress
    ? MID_TIME + DELAY_TIME
    : 200;
  const FINAL_LOADING_TIME = isNutritionLabelProgress
    ? FINAL_TIME + DELAY_TIME
    : 800;
  const FINAL_LOADING_TIME_2 = isNutritionLabelProgress
    ? FINAL_TIME_2 + DELAY_TIME
    : 1200;

  const branding = useBranding();
  const styles = progressBarStyle(branding);
  const [progress, setProgress] = useState<number>(0);
  const animProgress = useSharedValue<number>(0);
  const [hide, setHide] = useState<boolean>(false);

  useEffect(() => {
    if ((data && data.length > 0) || !loading) {
      animProgress.value = 100;
      setProgress(100);
      setTimeout(() => {
        setHide(true);
      }, 250);
    }

    const time =
      progress < 40
        ? INITIAL_LOADING_TIME
        : progress < 90
          ? MID_LOADINDG_TIME
          : progress < 95
            ? FINAL_LOADING_TIME
            : FINAL_LOADING_TIME_2;
    const randomNumberTillFour = Math.floor(Math.random() * 4) + 1;
    let timer = setInterval(() => {
      const progressVal =
        progress < 40
          ? progress + 40
          : progress < 90
            ? progress + randomNumberTillFour
            : progress >= 99
              ? 99
              : progress + 1;

      setProgress(progressVal);
      animProgress.value = progressVal;
    }, time);

    return () => clearInterval(timer);
  }, [
    progress,
    data,
    loading,
    animProgress,
    INITIAL_LOADING_TIME,
    MID_LOADINDG_TIME,
    FINAL_LOADING_TIME,
    FINAL_LOADING_TIME_2,
  ]);

  const animWidthStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${animProgress.value}%`, {
        easing: Easing.linear,
        duration: 200,
      }),
    };
  });

  if (hide) return null;

  return (
    <View style={styles.bottomModal}>
      <View style={styles.progressBarView}>
        <Animated.View style={[styles.barStyle, animWidthStyle]} />
      </View>
      <Text style={styles.topSpace}>Analyzing Photo...</Text>
    </View>
  );
};

export default FakeProgress;

const progressBarStyle = ({ primaryColor, searchBody }: Branding) => {
  return StyleSheet.create({
    centerModal: {
      alignItems: 'center',
      padding: 20,
      left: 30,
      right: 30,
      backgroundColor: 'white',
      borderRadius: 24,
      position: 'absolute',
      top: '45%',
      zIndex: 2,
      justifyContent: 'center',
    },
    barStyle: {
      backgroundColor: primaryColor,
      height: 11,
    },
    progressBarContainer: {
      width: '100%',
      overflow: 'hidden',
      borderRadius: 15,
      backgroundColor: searchBody,
    },
    progressBarView: {
      width: '100%',
      overflow: 'hidden',
      borderRadius: 15,
      backgroundColor: searchBody,
      borderWidth: 1,
      borderColor: primaryColor,
    },
    progressText: {
      marginVertical: 8,
    },
    topSpace: {
      marginTop: 10,
      fontWeight: '600',
    },
    bottomModal: {
      alignItems: 'center',
      padding: 20,
      left: 0,
      right: 0,
      position: 'absolute',
      top: '40%',
      zIndex: 2,
    },
  });
};
