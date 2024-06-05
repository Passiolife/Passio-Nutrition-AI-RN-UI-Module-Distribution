import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../OnboardingScreen.style';
import type { SlideListType } from '../OnboardingScreen';
import { useBranding } from '../../../contexts';

interface SliderItemProps {
  data: SlideListType;
  index: number;
  currentIndex: number;
}

const SliderItem = (props: SliderItemProps) => {
  const { data } = props;
  const brandingContex = useBranding();
  return (
    <View style={styles.slide} key={data.id}>
      <Image
        source={data.imagePath} // Can be a URL or a local file.
        resizeMode="cover"
        style={styles.backgroundVideo}
      />
      <View style={styles.contentLayout}>
        <Text
          style={[styles.titleText, { color: brandingContex.primaryColor }]}
        >
          {data.title}
        </Text>
        <Text style={styles.contentText}>{data.content}</Text>
      </View>
    </View>
  );
};

export default SliderItem;
