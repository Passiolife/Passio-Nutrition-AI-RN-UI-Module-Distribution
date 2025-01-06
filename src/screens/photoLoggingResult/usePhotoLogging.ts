import type { ParamList } from '../../navigaitons';
import { useCallback, useRef, useState, useEffect } from 'react';
import { createFoodLogUsingFoodDataInfo, getMealLog } from '../../utils';
import {
  PassioFoodItem,
  PassioNutrients,
  PassioSDK,
  type PassioAdvisorFoodInfo,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../contexts';
import { MealLabel } from '../../models';
import { StackNavigationProp } from '@react-navigation/stack';
import uuid4 from 'react-native-uuid';
import { EditServingSizeRef } from './modal/EditServingSizeModal';

export const PHOTO_LIMIT = 7;

export interface PhotoLoggingResults extends PassioAdvisorFoodInfo {
  isSelected?: boolean;
  passioFoodItem?: PassioFoodItem;
  uuID: string;
  nutrients?: PassioNutrients;
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
  const editServingInfoRef = useRef<EditServingSizeRef>(null);

  const routes = useRoute<RouteProp<ParamList, 'PhotoLoggingScreen'>>();
  const [isFetchingResponse, setFetchResponse] = useState<boolean | undefined>(
    undefined
  );
  const [isPreparingLog, setPreparingLog] = useState(false);
  const [passioAdvisorFoodInfo, setPassioAdvisorFoodInfo] = useState<
    PhotoLoggingResults[] | null
  >(null);
  const [isOpenDatePicker, openDatePicker] = useState(false);
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
        let info: PhotoLoggingResults[] = [];
        await Promise.all(
          imgs.map(async (item) => {
            const result = await PassioSDK.recognizeImageRemote(
              item.replace('file://', '') ?? ''
            );
            if (result) {
              await Promise.all(
                result.map(async (advisorFoodInfo) => {
                  let passioFoodItem: PassioFoodItem | undefined | null;
                  if (advisorFoodInfo.packagedFoodItem) {
                    passioFoodItem = advisorFoodInfo.packagedFoodItem;
                  } else if (advisorFoodInfo.foodDataInfo) {
                    passioFoodItem = await PassioSDK.fetchFoodItemForDataInfo(
                      advisorFoodInfo.foodDataInfo,
                      advisorFoodInfo?.foodDataInfo?.nutritionPreview
                        ?.servingQuantity,
                      advisorFoodInfo?.foodDataInfo?.nutritionPreview
                        ?.servingUnit
                    );
                  }
                  info.push({
                    ...advisorFoodInfo,
                    isSelected: true,
                    passioFoodItem: passioFoodItem ?? undefined,
                    uuID: uuid4.v4() as unknown as string,
                    nutrients: passioFoodItem
                      ? PassioSDK.getNutrientsOfPassioFoodItem(
                          passioFoodItem,
                          passioFoodItem?.amount.weight
                        )
                      : undefined,
                  });
                })
              );
            }
          })
        );
        setPassioAdvisorFoodInfo(info);
        setFetchResponse(false);
      } catch (error) {
        setFetchResponse(false);
      } finally {
      }
    },
    [isFetchingResponse]
  );

  const onLogSelectPress = useCallback(
    async (selected: PhotoLoggingResults[]) => {
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

  const onUpdateFoodItem = (result: PhotoLoggingResults) => {
    setPassioAdvisorFoodInfo((prev) => {
      if (prev === null) return null;
      return prev?.map((i) => {
        if (i.uuID === result.uuID) {
          return result;
        } else {
          return i;
        }
      });
    });
  };

  function onDateChange(updatedDate: Date) {
    setDate(new Date(updatedDate));
  }

  const changeDate = (updateDate: Date) => {
    openDatePicker(false);
    onDateChange(updateDate);
  };

  return {
    changeDate,
    date,
    editServingInfoRef,
    isFetchingResponse,
    isOpenDatePicker,
    isPreparingLog,
    meal,
    mealTimes,
    onLogSelectPress,
    onUpdateFoodItem,
    openDatePicker,
    passioAdvisorFoodInfo,
    recognizePictureRemote,
    setDate,
    setMeal,
  };
}
