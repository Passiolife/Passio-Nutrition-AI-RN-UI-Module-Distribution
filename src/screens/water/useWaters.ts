import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useRef, useState } from 'react';
import uuid4 from 'react-native-uuid';
import type { CalendarCarouselRef, ChartData } from '../../components';
import { useServices } from '../../contexts';
import type { Water } from '../../models';
import type { ParamList } from '../../navigaitons';
import { SwitchTabLabelEnum } from '../../types';
import { ShowToast } from '../../utils';
import { useSettingScreen } from '../setting/useSettingScreen';
import {
  convertKGToPounds,
  convertMlToOg,
  convertOgToMl,
} from '../nutritionProfile/unitConversions';
import { prepareWeekly } from './waterUtils';
export interface WaterSections {
  title: string;
  data: Water[];
}
type ScreenNavigationProps = StackNavigationProp<ParamList, 'WaterScreen'>;

export const useWaters = () => {
  const [isContentVisible, setIsContentVisible] = useState(true); // State to toggle content visibility
  const [waters, setWaterSection] = useState<Water[]>([]); // State to toggle content visibility
  const [target, setTarget] = useState<number>(1000);

  const services = useServices();

  const calendarCarouselRef = useRef<CalendarCarouselRef>(null);

  const { isImperialWeight, ogMlLabel } = useSettingScreen();

  const navigation = useNavigation<ScreenNavigationProps>();

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    services.dataService.getNutritionProfile().then((profile) => {
      if (isImperialWeight) {
        setTarget(convertKGToPounds(profile?.targetWater ?? 0));
      } else {
        setTarget(profile?.targetWater ?? 0);
      }
    });
  }, [isImperialWeight, services.dataService]);

  const getWaters = useCallback(
    (startDate: Date, endDate: Date, type: SwitchTabLabelEnum) => {
      services.dataService
        .getWaters(startDate, endDate)
        .then((data) => {
          setChartData([]);
          setChartData(
            prepareWeekly(
              isImperialWeight,
              data,
              startDate,
              endDate,
              type === SwitchTabLabelEnum.Week ? 'EEE' : 'MMM dd'
            )
          );
          setWaterSection(data);
        })
        .finally(() => {});
    },
    [isImperialWeight, services.dataService]
  );

  const getWaterRefresh = useCallback(() => {
    const startDate = calendarCarouselRef?.current?.getStartDate();
    const endDate = calendarCarouselRef?.current?.getEndDate();
    const type = calendarCarouselRef?.current?.getCalendarType();

    if (startDate && endDate && type) {
      getWaters(startDate, endDate, type);
    }
  }, [getWaters]);

  const onDeleteWaterPress = useCallback(
    (uuid: string) => {
      services.dataService
        .deleteWater(uuid)
        .then(() => {
          setWaterSection((item) => item.filter((i) => i.uuid !== uuid));
          getWaterRefresh();
        })
        .finally(() => {});
    },
    [getWaterRefresh, services.dataService]
  );

  const handleContentVisible = () => {
    setIsContentVisible((prev) => !prev);
  };

  const onPressPlus = () => {
    navigation.navigate('WaterEntry', {
      onSave: () => {
        getWaterRefresh();
      },
    });
  };

  const onEditPress = (water: Water) => {
    navigation.navigate('WaterEntry', {
      onSave: () => {
        getWaterRefresh();
      },
      water: water,
    });
  };

  const onPressQuickAdd = (val: number) => {
    const data = {
      consumed: (isImperialWeight ? convertOgToMl(val) : val).toString(),
      uuid: uuid4.v4() as string,
      day: DateTime.now().toUTC().toString(),
      time: DateTime.now().toUTC().toString(),
    };
    services.dataService.saveWater(data);
    getWaterRefresh();
    ShowToast('Added Water');
  };

  useEffect(() => {
    getWaterRefresh();
  }, [getWaterRefresh]);

  const convertConsumeValueAsUnitSystem = (val: number) => {
    if (isImperialWeight) {
      return convertMlToOg(val);
    } else {
      return val;
    }
  };

  return {
    target,
    calendarCarouselRef,
    chartData,
    isContentVisible,
    isImperialWeight,
    ogMlLabel,
    waters,
    convertConsumeValueAsUnitSystem,
    getWaters,
    handleContentVisible,
    onDeleteWaterPress,
    onEditPress,
    onPressPlus,
    onPressQuickAdd,
  };
};
