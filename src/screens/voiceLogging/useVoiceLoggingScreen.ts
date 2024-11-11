import Voice, {
  SpeechEndEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-voice/voice';
import {
  PassioSDK,
  PassioSpeechRecognitionModel,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ShowToast,
  createFoodLogUsingWeightGram,
  getLogToDate,
  mealLabelByDate,
} from '../../utils';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { ParamList } from '../../navigaitons';
import { useServices } from '../../contexts';
import type { StackNavigationProp } from '@react-navigation/stack';
import type BottomSheet from '@gorhom/bottom-sheet';

export type VoiceLoggingScreenNavigationProps = StackNavigationProp<
  ParamList,
  'VoiceLoggingScreen'
>;

export interface VoiceLogRecord extends PassioSpeechRecognitionModel {
  isSelected?: boolean;
}

export function useVoiceLogging() {
  const services = useServices();
  const navigation = useNavigation<VoiceLoggingScreenNavigationProps>();
  const route = useRoute<RouteProp<ParamList, 'VoiceLoggingScreen'>>();
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '60%'], []);
  const isSubmitting = useRef<boolean>(false);

  const [isRecording, setIsRecord] = useState(false);
  const [isFetchingResponse, setFetchResponse] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchQueryRef = useRef<string>('');

  const [voiceRecords, setVoiceRecords] = useState<VoiceLogRecord[] | null>(
    null
  );

  const recognizeSpeechRemote = useCallback(async (text: string) => {
    try {
      setFetchResponse(true);
      setVoiceRecords(null);
      const val = await PassioSDK.recognizeSpeechRemote(text);
      if (val && val.length > 0) {
        bottomSheetModalRef.current?.expand();
        setVoiceRecords(
          val.map((o) => {
            return {
              ...o,
              isSelected: true,
            };
          })
        );
      } else {
        setSearchQuery('');
        ShowToast("Sorry we didn't recognize your input, please try again");
      }
    } catch (error) {
    } finally {
      setFetchResponse(false);
    }
  }, []);

  const speechStartHandler = (_e: SpeechStartEvent) => {
    setSearchQuery('');
    setIsRecord(true);
  };
  const speechEndHandler = (_e: SpeechEndEvent) => {
    setIsRecord(false);
    setFetchResponse(true);
    setTimeout(() => {
      if (searchQueryRef.current.length > 0) {
        recognizeSpeechRemote(searchQueryRef.current);
      } else {
        setFetchResponse(false);
      }
    }, 500);
  };

  const speechResultsHandler = (e: SpeechResultsEvent) => {
    if (e && e.value && e.value.length > 0) {
      const text = e.value[0];
      searchQueryRef.current = text;
      setSearchQuery(text);
    }
  };

  const onClearPress = () => {
    setVoiceRecords(null);
  };

  const onLogSelectPress = async (selected: PassioSpeechRecognitionModel[]) => {
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;

    const logToDate = getLogToDate(
      route.params.logToDate,
      route.params.logToMeal
    );
    const meal =
      route.params.logToMeal === undefined
        ? mealLabelByDate(logToDate)
        : route.params.logToMeal;

    for (const item of selected) {
      if (item.advisorInfo.foodDataInfo) {
        const foodItem = await PassioSDK.fetchFoodItemForDataInfo(
          item.advisorInfo.foodDataInfo,
          item.advisorInfo.foodDataInfo?.nutritionPreview?.servingQuantity,
          item.advisorInfo.foodDataInfo?.nutritionPreview?.servingUnit
        );
        if (foodItem) {
          let foodLog = createFoodLogUsingWeightGram(
            foodItem,
            logToDate,
            meal,
            item.advisorInfo.weightGrams,
            item.advisorInfo.portionSize
          );
          await services.dataService.saveFoodLog({
            ...foodLog,
            meal: item.mealTime ?? meal,
          });
        }
      }
    }

    navigation.pop(1);
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
    isSubmitting.current = false;
  };

  const onTryAgainPress = () => {
    bottomSheetModalRef.current?.close();
    setSearchQuery('');
  };

  const onSearchManuallyPress = () => {
    navigation.replace('FoodSearchScreen', {
      from: 'Search',
    });
  };

  const onRecordingPress = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-Us');
    } catch (error) {
      ShowToast('Something went wrong while starting recording');
    }
  };
  const stopRecording = async () => {
    try {
      setIsRecord(false);
      await Voice.stop();
    } catch (error) {}
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechPartialResults = speechResultsHandler;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    voiceRecords,
    bottomSheetModalRef,
    snapPoints,
    isRecording,
    searchQuery,
    isFetchingResponse,
    onRecordingPress,
    onClearPress,
    recognizeSpeechRemote,
    onLogSelectPress,
    onTryAgainPress,
    onSearchManuallyPress,
  };
}
