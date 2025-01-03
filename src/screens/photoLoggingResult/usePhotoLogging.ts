import type { ParamList } from '../../navigaitons';
import { useCallback, useRef, useState, useEffect } from 'react';
import { createFoodLogUsingFoodDataInfo, getMealLog } from '../../utils';
import {
  PassioSDK,
  type PassioAdvisorFoodInfo,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../contexts';
import { MealLabel } from '../../models';
import { StackNavigationProp } from '@react-navigation/stack';

export const PHOTO_LIMIT = 7;

export interface PicturePassioAdvisorFoodInfo extends PassioAdvisorFoodInfo {
  isSelected?: boolean;
}

export type PhotoLoggingScreenProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

interface Select {
  label: string;
  value: MealLabel;
}

const mealTimes: Select[] = [
  {
    label: 'Breakfast',
    value: 'breakfast',
  },
  {
    label: 'Lunch',
    value: 'lunch',
  },
  {
    label: 'Dinner',
    value: 'dinner',
  },
  {
    label: 'Snack',
    value: 'snack',
  },
];

export function usePhotoLogging() {
  const navigation = useNavigation<PhotoLoggingScreenProps>();
  const services = useServices();
  const isSubmitting = useRef<boolean>(false);

  const routes = useRoute<RouteProp<ParamList, 'PhotoLoggingScreen'>>();
  const [isFetchingResponse, setFetchResponse] = useState<boolean | undefined>(
    undefined
  );
  const [isPreparingLog, setPreparingLog] = useState(false);
  const [passioAdvisorFoodInfo, setPassioAdvisorFoodInfo] = useState<
    PicturePassioAdvisorFoodInfo[] | null
  >(null);

  const [date, setDate] = useState(routes.params.logToDate ?? new Date());
  const [meal, setMeal] = useState<MealLabel>(getMealLog(date, undefined));

  const recognizePictureRemote = useCallback(
    async (imgs: string[]) => {
      if (isFetchingResponse) {
        return;
      }
      setFetchResponse(true);
      try {
        setPassioAdvisorFoodInfo(null);

        let foodInfoArray: Array<PassioAdvisorFoodInfo[] | null> = [];

        const data = imgs.map(async (item) => {
          const val = await PassioSDK.recognizeImageRemote(
            item.replace('file://', '') ?? ''
          );
          foodInfoArray?.push(val);
        });

        await Promise.all(data);
        let foodInfoArrayFlat = foodInfoArray.flat();
        if (foodInfoArrayFlat && foodInfoArrayFlat?.length > 0) {
          setPassioAdvisorFoodInfo(
            (foodInfoArrayFlat as PassioAdvisorFoodInfo[]).map((i) => {
              return {
                ...i,
                isSelected: true,
              };
            })
          );
          setTimeout(() => {
            setFetchResponse(false);
          }, 400);
        } else {
          setFetchResponse(false);
        }
      } catch (error) {
        setFetchResponse(false);
      } finally {
      }
    },
    [isFetchingResponse]
  );

  const onLogSelectPress = useCallback(
    async (selected: PicturePassioAdvisorFoodInfo[]) => {
      if (isSubmitting.current) {
        return;
      }
      isSubmitting.current = true;

      if (isPreparingLog) {
        return;
      }
      setPreparingLog(true);
      const foodLogs = await createFoodLogUsingFoodDataInfo(
        selected.filter((i) => i.isSelected),
        date,
        meal
      );

      for (const item of foodLogs) {
        await services.dataService.saveFoodLog({
          ...item,
        });
      }
      setPreparingLog(false);
      navigation.pop(1);
      navigation.navigate('BottomNavigation', {
        screen: 'MealLogScreen',
      });

      isSubmitting.current = false;
    },

    [isPreparingLog, date, meal, navigation, services.dataService]
  );

  useEffect(() => {
    function init() {
      if (routes.params.images) {
        recognizePictureRemote(routes.params.images);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes.params.images]);

  return {
    recognizePictureRemote,
    onLogSelectPress,
    passioAdvisorFoodInfo,
    isPreparingLog,
    isFetchingResponse,
    setDate,
    setMeal,
    mealTimes,
    meal,
    date,
  };
}
