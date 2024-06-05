import type { FlatList } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { SlideListType } from './OnboardingScreen';
import { content } from '../../constants/Content';
import { onBoardingAssets } from '../../assets';

export function useOnBoarding() {
  const [currentIndex, updateCurrentIndex] = useState(0);
  const [isLastPage, updateLastPageFlag] = useState<boolean>(false);
  let flatListRef = useRef<FlatList<SlideListType> | null>();
  const indexRef = useRef(currentIndex);
  indexRef.current = currentIndex;

  const onBoardingData: Array<SlideListType> = [
    {
      id: 1,
      imagePath: onBoardingAssets.onBoardingStep1,
      title: content.identifySingleFoods,
      content: content.identifySingleFoodsDescription,
    },
    {
      id: 2,
      imagePath: onBoardingAssets.onBoardingStep2,
      title: content.addRecipeIngredients,
      content: content.addRecipeIngredientsDescription,
    },
    {
      id: 3,
      imagePath: onBoardingAssets.onBoardingStep3,
      title: content.scanPackagedProducts,
      content: content.scanPackagedProductsDescription,
    },
    {
      id: 4,
      imagePath: onBoardingAssets.onBoardingStep4,
      title: content.exportShareReports,
      content: content.exportShareReportsDescription,
    },
  ];

  useEffect(() => {
    updateLastPageFlag(onBoardingData.length - 1 <= currentIndex);
  }, [currentIndex, onBoardingData.length]);

  const attachOnScrollListener = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      const distance = Math.abs(roundIndex - index);
      const isNoMansLand = distance > 0.4;
      if (roundIndex !== indexRef.current && !isNoMansLand) {
        updateCurrentIndex(roundIndex);
      }
    },
    []
  );

  function nextPage() {
    flatListRef?.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
    setTimeout(() => {
      updateCurrentIndex(currentIndex + 1);
    }, 500);
  }

  function attachFlatListRef(ref: FlatList<SlideListType> | null) {
    flatListRef.current = ref;
  }

  return {
    onBoardingData,
    isLastPage,
    currentIndex,
    attachOnScrollListener,
    attachFlatListRef,
    nextPage,
  };
}
