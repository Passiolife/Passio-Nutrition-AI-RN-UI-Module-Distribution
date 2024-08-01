import {
  convertMlToOg,
  convertOgToMl,
} from './../../../nutritionProfile/unitConversions';
import { useEffect, useRef, useState } from 'react';
import { useServices } from '../../../../contexts';
import uuid4 from 'react-native-uuid';
import type { TimeStampViewRef } from 'src/components';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../../../navigaitons';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useSettingScreen } from '../../../../screens/setting/useSettingScreen';
import { isValidDecimalNumber } from '../../../../screens/foodCreator/FoodCreator.utils';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'WaterEntry'>;

export const useWaterEntry = () => {
  const { params } = useRoute<RouteProp<ParamList, 'WaterEntry'>>();

  const [consumed, setConsumed] = useState('');
  const dateRef = useRef<TimeStampViewRef>(null);
  const timeRef = useRef<TimeStampViewRef>(null);
  const navigation = useNavigation<ScreenNavigationProps>();
  const { isImperialWeight, ogMlLabel } = useSettingScreen();
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.water?.consumed) {
      setConsumed(
        (isImperialWeight
          ? Math.round(
              convertMlToOg(Number(params.water?.consumed ?? 0))
            ).toString()
          : params.water?.consumed) ?? '50'
      );
    }
  }, [isImperialWeight, params.water?.consumed]);

  const service = useServices();

  const handleWaterInput = (val: string) => {
    setConsumed(val);
  };

  const handlePressCancel = () => {
    navigation.goBack();
  };
  const handlePressOk = () => {
    if (!isValidDecimalNumber(consumed)) {
      setError('Please enter valid input');
      return;
    }

    const updateDate = dateRef.current?.getTimeStamp();
    const updateTime = timeRef.current?.getTimeStamp();

    if (
      updateDate !== undefined &&
      updateTime !== undefined &&
      consumed.length > 0
    ) {
      let convertedConsume = Number(consumed);
      if (isImperialWeight) {
        convertedConsume = Math.round(convertOgToMl(Number(convertedConsume)));
      }
      service.dataService.saveWater({
        consumed: convertedConsume.toString(),
        uuid: params?.water?.uuid ?? (uuid4.v4() as string),
        day: updateDate,
        time: updateTime,
      });
      params.onSave();
      navigation.goBack();
    } else {
    }
  };

  return {
    consumed,
    dateRef,
    timeRef,
    water: params.water,
    unitLabel: ogMlLabel,
    isEdit: params.water !== undefined,
    error,
    handlePressCancel,
    handlePressOk,
    handleWaterInput,
  };
};
