import uuid4 from 'react-native-uuid';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MealLogScreenNavigationProps } from '.';
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useServices } from '../../contexts';
import type { FoodLog } from '../../models';
import { getMealLogsForDate } from '../../utils/DataServiceHelper';
import { AsyncStorageHelper } from '../../utils/AsyncStorageHelper';
import type { Module, ParamList } from '../../navigaitons';
import { ShowToast, getMealLog } from '../../utils';
import type BottomSheet from '@gorhom/bottom-sheet';
import type { QuickSuggestion } from '../../models/QuickSuggestion';
import { convertDateToDBFormat } from '../../utils/DateFormatter';
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';

export function useMealLogs() {
  const bottomSheetModalRef = useRef<BottomSheet>(null);

  const navigation = useNavigation<MealLogScreenNavigationProps>();
  const { params } = useRoute<RouteProp<ParamList, 'MealLogScreen'>>();

  const services = useServices();
  const isFocused = useIsFocused();

  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [date, setDate] = useState<Date>(params.defaultDate ?? new Date());
  const [isOpenDatePicker, openDatePicker] = useState(false);
  const isSubmitting = useRef<boolean>(false);

  useEffect(() => {
    const initData = async () => {
      if (isFocused) {
        const mealLogs = await getMealLogsForDate(date, services);
        setFoodLogs(mealLogs);
      }
    };
    initData();
  }, [date, services, isFocused]);

  useEffect(() => {
    async function init() {
      const loggedDate = await AsyncStorageHelper.getLoggedInDate();
      if (loggedDate === null) {
        AsyncStorageHelper.setLoggedInDate();
      }
    }
    init();
  }, []);

  const onDeleteFoodLog = useCallback(
    async (foodLog: FoodLog) => {
      await services.dataService.deleteFoodLog(foodLog.uuid);
      setDate(new Date(date));
    },
    [date, services.dataService]
  );

  function onDateChange(updatedDate: Date) {
    setDate(new Date(updatedDate));
    params?.onDateChange?.(updatedDate);
  }

  async function onQuickSuggestionPress(
    quickSuggestion: QuickSuggestion,
    isOpenEditor: boolean
  ) {
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;
    let foodLog = quickSuggestion.foodLog;

    if (foodLog === undefined && quickSuggestion.refCode) {
      const attribute = await PassioSDK.fetchFoodItemForRefCode(
        quickSuggestion.refCode
      );
      if (attribute) {
        foodLog = convertPassioFoodItemToFoodLog(attribute, date, undefined);
      }
    } else if (foodLog === undefined && quickSuggestion.passioFoodDataInfo) {
      const attribute = await PassioSDK.fetchFoodItemForDataInfo(
        quickSuggestion.passioFoodDataInfo
      );
      if (attribute) {
        foodLog = convertPassioFoodItemToFoodLog(attribute, date, undefined);
      }
    }

    if (foodLog !== undefined) {
      const uuid: string = `${uuid4.v4() as string}`;
      const updateFoodLog = {
        ...foodLog,
        uuid: uuid,
        eventTimestamp: convertDateToDBFormat(date),
        meal: getMealLog(date, undefined),
      };

      if (isOpenEditor) {
        navigateToEditFoodLog(updateFoodLog, 'Other');
      } else {
        await services.dataService.saveFoodLog(updateFoodLog);
        ShowToast(`"${updateFoodLog.name}" added into "${updateFoodLog.meal}"`);
        setFoodLogs((value) => [...value, updateFoodLog!]);
      }
      bottomSheetModalRef.current?.snapToIndex(0);
    }
    isSubmitting.current = false;
  }

  const changeDate = (updateDate: Date) => {
    openDatePicker(false);
    onDateChange(updateDate);
  };

  const navigateToEditFoodLog = useCallback(
    (foodLog: FoodLog, prevRouteName?: Module) => {
      navigation.navigate('EditFoodLogScreen', {
        foodLog: foodLog,
        prevRouteName: prevRouteName ?? 'MealLog',
      });
    },
    [navigation]
  );

  return {
    bottomSheetModalRef,
    date,
    foodLogs,
    isOpenDatePicker,
    changeDate,
    navigateToEditFoodLog,
    onQuickSuggestionPress,
    onDeleteFoodLog,
    openDatePicker,
  };
}
