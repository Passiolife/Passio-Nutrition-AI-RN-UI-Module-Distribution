import React from 'react';
import {
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import type { SlideListType } from '../OnboardingScreen';
import { ic_left_white } from '../../../assets';
import styles from '../OnboardingScreen.style';
import Pagination from './Pagination';
import SliderItem from './SliderItem';

interface OnboardingScreenViewProps {
  slideList: Array<SlideListType>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  currentIndex: number;
  setFlatListRef: (ref: FlatList<SlideListType> | null) => void;
  navigateToBack: () => void;
}

const OnboardingScreenView = (props: OnboardingScreenViewProps) => {
  const { slideList, onScroll, currentIndex, setFlatListRef, navigateToBack } =
    props;

  const renderItem = ({
    item,
    index,
  }: {
    item: SlideListType;
    index: number;
  }) => {
    return <SliderItem data={item} index={index} currentIndex={currentIndex} />;
  };

  return (
    <View style={styles.onboardingViewContainer}>
      <View style={styles.videoLayout}>
        <FlatList
          ref={(ref: FlatList<SlideListType> | null) => {
            setFlatListRef(ref);
          }}
          data={slideList}
          renderItem={renderItem}
          keyExtractor={(_item: SlideListType, index: number) =>
            index.toString()
          }
          extraData={slideList}
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          bounces={false}
        />
      </View>
      <Pagination slideList={slideList} index={currentIndex} />
      <TouchableOpacity onPress={navigateToBack} style={styles.backIconLayout}>
        <Image source={ic_left_white} style={styles.backIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(OnboardingScreenView);
