import { useCallback, useEffect, useRef, useState } from 'react';
import { useServices } from '../../contexts';
import type { Water, Weight } from '../../models';
import { SwitchTabLabelEnum } from '../../types';
import type { CalendarCarouselRef } from 'src/components';
import type { ParamList } from 'src/navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSettingScreen } from '../setting/useSettingScreen';
import { convertKGToPounds } from '../nutritionProfile/unitConversions';
// import type { WeightTrendChart } from './linechart/lineChart';
import { prepPareWeightChart } from './views/weightentry/Weight.utils';

export interface WaterSections {
  title: string;
  data: Water[];
}

type ScreenNavigationProps = StackNavigationProp<ParamList, 'WeightScreen'>;

export const useWeights = () => {
  const services = useServices();
  const calendarCarouselRef = useRef<CalendarCarouselRef>(null);
  const navigation = useNavigation<ScreenNavigationProps>();
  const { isImperialWeight, weightLabel } = useSettingScreen();

  const [isContentVisible, setIsContentVisible] = useState(true);
  const [weights, setWeightSection] = useState<Weight[]>([]);
  const [weightTrendData, seTWeightTrendData] = useState<any[]>([]);

  const getWeights = useCallback(
    (startDate: Date, endDate: Date, type: SwitchTabLabelEnum) => {
      services.dataService
        .getWeight(startDate, endDate)
        .then((data) => {
          setWeightSection(data);
          seTWeightTrendData(
            prepPareWeightChart(
              isImperialWeight,
              data,
              startDate,
              endDate,
              type === SwitchTabLabelEnum.Week ? 'EEE' : 'MMM dd'
            )
          );
        })
        .finally(() => {});
    },
    [isImperialWeight, services.dataService]
  );

  const getWeightsRefresh = useCallback(() => {
    const startDate = calendarCarouselRef?.current?.getStartDate();
    const endDate = calendarCarouselRef?.current?.getEndDate();
    const type = calendarCarouselRef?.current?.getCalendarType();

    if (startDate && endDate && type) {
      getWeights(startDate, endDate, type);
    }
  }, [getWeights]);

  const handleContentVisible = () => {
    setIsContentVisible((prev) => !prev);
  };

  const onPressPlus = () => {
    navigation.navigate('WeightEntry', {
      onSave: () => {
        getWeightsRefresh();
      },
    });
  };
  const onEditPress = (weight: Weight) => {
    navigation.navigate('WeightEntry', {
      onSave: () => {
        getWeightsRefresh();
      },
      weight: weight,
    });
  };

  const onDeleteWeightPress = useCallback(
    (uuid: string) => {
      services.dataService
        .deleteWeight(uuid)
        .then(() => {
          setWeightSection((item) => item.filter((i) => i.uuid !== uuid));
        })
        .finally(() => {});
    },
    [services.dataService]
  );

  useEffect(() => {
    getWeightsRefresh();
  }, [getWeightsRefresh]);

  const convertWeightAccordingToUnitWeight = (val: number) => {
    if (isImperialWeight) {
      return Math.round(convertKGToPounds(val));
    } else {
      return val;
    }
  };

  return {
    calendarCarouselRef,
    isContentVisible,
    weightLabel,
    weights,
    weightTrendData,
    convertKGToPounds,
    convertWeightAccordingToUnitWeight,
    getWeights,
    getWeightsRefresh,
    handleContentVisible,
    onDeleteWeightPress,
    onEditPress,
    onPressPlus,
  };
};
