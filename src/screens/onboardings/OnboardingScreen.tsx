import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './OnboardingScreen.style';
import OnboardingScreenView from './views/OnboardingScreenView';
import { useOnBoarding } from './useOnBoarding';
import { content } from '../../constants/Content';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamList } from '../../navigaitons';

export interface SlideListType {
  id: number;
  imagePath: number;
  title: string;
  content: string;
}

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const {
    onBoardingData,
    currentIndex,
    nextPage,
    isLastPage,
    attachOnScrollListener,
    attachFlatListRef,
  } = useOnBoarding();

  const onPressNextBtn = () => {
    if (isLastPage) {
      navigateToBack();
    } else {
      nextPage();
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.onboardingScrnContainer}>
      <OnboardingScreenView
        slideList={onBoardingData}
        onScroll={attachOnScrollListener}
        currentIndex={currentIndex}
        setFlatListRef={attachFlatListRef}
        navigateToBack={navigateToBack}
      />
      <TouchableOpacity onPress={onPressNextBtn} style={styles.nextBtn}>
        <Text style={styles.nextBtnText}>
          {isLastPage ? content.startTracking : content.next}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;
