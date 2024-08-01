import { convertKGToPounds } from './../../../nutritionProfile/unitConversions';
import { useEffect, useRef, useState } from 'react';
import { useServices } from '../../../../contexts';
import uuid4 from 'react-native-uuid';
import type { TimeStampViewRef } from '../../../../components';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { ParamList } from 'src/navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSettingScreen } from '../../../../screens/setting/useSettingScreen';
import { convertPoundsToKG } from '../../../../screens/nutritionProfile/unitConversions';
import { isValidDecimalNumber } from '../../../../screens/foodCreator/FoodCreator.utils';
type ScreenNavigationProps = StackNavigationProp<ParamList, 'WeightEntry'>;

export const useWeightEntry = () => {
  const { params } = useRoute<RouteProp<ParamList, 'WeightEntry'>>();
  const dateRef = useRef<TimeStampViewRef>(null);
  const timeRef = useRef<TimeStampViewRef>(null);
  const navigation = useNavigation<ScreenNavigationProps>();
  const { isImperialWeight, weightLabel } = useSettingScreen();
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (params.weight?.weight) {
      setWeight(
        (isImperialWeight
          ? Math.round(
              convertKGToPounds(Number(params.weight?.weight ?? 0))
            ).toString()
          : params.weight?.weight) ?? '50'
      );
    }
  }, [isImperialWeight, params.weight?.weight]);

  const service = useServices();

  const handleWeightInput = (val: string) => {
    setWeight(val);
  };

  const handlePressCancel = () => {
    navigation.goBack();
  };
  const handlePressOk = () => {
    if (!isValidDecimalNumber(weight)) {
      setError('Please enter valid input');
      return;
    }
    const updateDate = dateRef.current?.getTimeStamp();
    const updateTime = timeRef.current?.getTimeStamp();

    if (
      updateDate !== undefined &&
      updateTime !== undefined &&
      weight.length > 0
    ) {
      let convertedWeight = Number(weight);
      if (isImperialWeight) {
        convertedWeight = Math.round(convertPoundsToKG(Number(weight)));
      }

      service.dataService.saveWeight({
        weight: convertedWeight.toString(),
        uuid: params.weight?.uuid ?? (uuid4.v4() as string),
        day: updateDate,
        time: updateTime,
      });
      params.onSave();
      navigation.pop();
    } else {
    }
  };

  return {
    dateRef,
    prevWeight: params.weight,
    isEdit: params.weight !== undefined,
    timeRef,
    weight,
    weightLabel,
    error,
    handlePressCancel,
    handlePressOk,
    handleWeightInput,
  };
};
