import React from 'react';
import { View } from 'react-native';
import type { SlideListType } from '../OnboardingScreen';
import styles from '../OnboardingScreen.style';

interface PaginationProps {
  slideList: Array<SlideListType>;
  index: number;
}

const Pagination = (props: PaginationProps) => {
  const { slideList, index } = props;
  return (
    <View style={styles.pagination} pointerEvents="none">
      {slideList.map((_: SlideListType, i: number) => {
        return (
          <View
            key={i}
            style={[
              styles.paginationDot,
              index === i
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        );
      })}
    </View>
  );
};

export default React.memo(Pagination);
