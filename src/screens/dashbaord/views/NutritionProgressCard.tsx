import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBranding } from '../../../contexts';
import { useDailyMacrosTracker } from '../useDailyMacrosTracker';
import { MacrosProgressView } from '../../../components/macrosProgressViews';
import { withLoading } from '../../../components/withLoading';
import { palette } from '../../../components/palette';
import { content } from '../../../constants/Content';
import {
  convertToNextMidnight,
  convertToPreviousMidnight,
} from '../../../utils/DateUtils';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamList } from '../../../navigaitons';

const NutritionProgressCard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const { primaryColor } = useBranding();
  const { dailyTracker } = useDailyMacrosTracker(
    convertToPreviousMidnight(new Date()),
    convertToNextMidnight(new Date())
  );
  const onNavigateToMealLogScreen = () => {
    navigation.navigate('MealLogScreen', {
      defaultDate: new Date(),
    });
  };

  return (
    <View
      testID={'testViewNutritionDataCard'}
      style={styles.nutritionTrackContainer}
    >
      <View>
        <Text style={styles.nutritionTrackTextStyle}>
          {content.nutritionTracker}
        </Text>
        <Text style={styles.nutritionTrackInfoTextStyle}>
          {content.todayMacroTridentsCalories}
        </Text>
      </View>
      <MacrosProgressView
        calories={{
          target: dailyTracker?.amountOfCalories ?? 0,
          consumed: dailyTracker?.targetCalories ?? 0,
        }}
        carbs={{
          target: dailyTracker?.amountOfCarbs ?? 0,
          consumed: dailyTracker?.targetCarbs ?? 0,
        }}
        protein={{
          target: dailyTracker?.amountOfProtein ?? 0,
          consumed: dailyTracker?.targetProtein ?? 0,
        }}
        fat={{
          target: dailyTracker?.amountOfFat ?? 0,
          consumed: dailyTracker?.targetFat ?? 0,
        }}
      />
      <TouchableOpacity onPress={onNavigateToMealLogScreen}>
        <Text
          style={[
            styles.buttonTrackNutrition,
            { borderColor: primaryColor, color: primaryColor },
          ]}
        >
          {content.trackNutrition}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nutritionTrackContainer: {
    width: Dimensions.get('window').width - 34,
    alignSelf: 'center',
    height: 'auto',
    elevation: 15,
    shadowColor: 'black',
    marginTop: 16,
    paddingVertical: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    justifyContent: 'space-between',
    shadowOpacity: 0.1,
    padding: 5,
    backgroundColor: palette.white,
    borderRadius: 18,
  },
  nutritionTrackTextStyle: {
    paddingStart: 16,
    fontWeight: 'normal',
    fontSize: 16,
    paddingEnd: Dimensions.get('window').width / 3,
    color: palette.charcoal,
  },

  buttonTrackNutrition: {
    borderWidth: 1,
    marginHorizontal: 8,
    textAlign: 'center',
    paddingVertical: 6,
    alignSelf: 'center',
    fontWeight: '500',
    paddingHorizontal: 16,
    borderRadius: 16,
    fontSize: 15,
    color: palette.black,
  },
  nutritionTrackInfoTextStyle: {
    paddingStart: 16,
    fontSize: 13,
    paddingTop: 4,
    fontWeight: '400',
    color: palette.charcoal,
  },
});
export default withLoading(NutritionProgressCard);
