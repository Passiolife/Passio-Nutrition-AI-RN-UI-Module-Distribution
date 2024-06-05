import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { OnboardingScreenRoute } from '../../../navigaitons/Route';
import { palette } from '../../../components/palette';
import { content } from '../../../constants/Content';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamList } from '../../../navigaitons';

export const OnBoardingCard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();

  function onNavigateToScanningScreen() {
    navigation.navigate(OnboardingScreenRoute);
  }

  return (
    <ImageBackground
      testID={'testViewOnBoardingCard'}
      source={require('../../../assets/bg_on_boarding_card.png')}
      resizeMode={'cover'}
      style={styles.container}
    >
      <Text style={styles.titleTextStyle}>
        {content.trackYourNutritionAndMeetYourGoals}
      </Text>
      <TouchableOpacity onPress={() => onNavigateToScanningScreen()}>
        <Text style={styles.buttonStyle}>Start Tracking</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginHorizontal: 8,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    marginTop: 16,
    paddingVertical: 24,
    justifyContent: 'space-between',
    shadowOpacity: 0.1,
    padding: 5,
    backgroundColor: palette.violetRed,
    borderRadius: 16,
    overflow: 'hidden',
  },
  titleTextStyle: {
    paddingStart: 16,
    color: palette.white,
    fontWeight: 'normal',
    fontSize: 20,
    minHeight: 100,
    paddingEnd: Dimensions.get('window').width / 3,
  },
  buttonStyle: {
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1.5,
    marginHorizontal: 16,
    marginTop: 24,
    width: 150,
    textAlign: 'center',
    paddingVertical: 8,
    borderColor: palette.white,
    borderRadius: 16,
    color: palette.white,
  },
});
