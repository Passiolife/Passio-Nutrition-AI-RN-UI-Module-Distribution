import React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import animation from '../../assets/loader_animation.json';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const CustomActivityIndicator = (props: Props) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={animation}
        style={[styles.lottieView, props.style]}
        autoPlay={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieView: {
    width: 50,
    height: 50,
  },
});
