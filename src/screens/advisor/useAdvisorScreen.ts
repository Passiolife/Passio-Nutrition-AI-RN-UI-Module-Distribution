import { useCallback, useState } from 'react';
import { useNutritionAdvisor } from '../../hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ImagePickerType, ParamList } from '../../navigaitons';
import { Keyboard } from 'react-native';
import {
  PassioSDK,
  type PassioAdvisorFoodInfo,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import {
  ShowToast,
  createFoodLogUsingPortionSize,
  getLogToDate,
  mealLabelByDate,
} from '../../utils';
import { useServices } from '../../contexts';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'AdvisorScreen'>;

export const useAdvisorScreen = () => {
  const {
    messages,
    sdkError,
    configureStatus,
    sending,
    ingredientAdvisorResponse,
    listRef,
    fetchIngredients,
    sendMessage,
    setIngredientAdvisorResponse,
    sendImages,
  } = useNutritionAdvisor({
    key: '',
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOptionShow, setOptionShow] = useState(false);
  const navigation = useNavigation<ScreenNavigationProps>();
  const route = useRoute<RouteProp<ParamList, 'AdvisorScreen'>>();
  const services = useServices();

  const onChangeTextInput = useCallback((val: string) => {
    setOptionShow(false);
    setInputMessage(val);
  }, []);

  const onPressSendBtn = useCallback(() => {
    sendMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage, sendMessage]);

  const onPressPlusIcon = useCallback(async () => {
    setOptionShow(true);
  }, []);

  const onPickerImageOrGallery = useCallback(
    async (type: ImagePickerType) => {
      if (sending) {
        return;
      }
      try {
        Keyboard.dismiss();
        navigation.navigate('ImagePickerScreen', {
          onImages: async (images) => {
            navigation.goBack();
            await sendImages(
              images.map((assets) => assets.replace('file://', '') ?? '')
            );
          },
          type: type,
        });
      } catch (err) {
        setLoading(false);
      }
    },
    [navigation, sendImages, sending]
  );

  const onCloseIngredientView = useCallback(async () => {
    setIngredientAdvisorResponse(null);
  }, [setIngredientAdvisorResponse]);

  const onLogSelect = async (info: PassioAdvisorFoodInfo[]) => {
    const logToDate = getLogToDate(
      route.params.logToDate,
      route.params.logToMeal
    );
    const meal =
      route.params.logToMeal === undefined
        ? mealLabelByDate(logToDate)
        : route.params.logToMeal;

    for (const item of info) {
      if (item.foodDataInfo) {
        const foodItem = await PassioSDK.fetchFoodItemForDataInfo(
          item.foodDataInfo
        );
        if (foodItem) {
          let foodLog = createFoodLogUsingPortionSize(
            foodItem,
            logToDate,
            meal,
            item.weightGrams,
            item.portionSize
          );
          await services.dataService.saveFoodLog(foodLog);
        }
      }
    }

    ShowToast('Logged food');
  };

  return {
    configureStatus,
    ingredientAdvisorResponse,
    inputMessage,
    messages,
    loading,
    sending,
    isOptionShow,
    listRef,
    sdkError,
    onLogSelect,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    fetchIngredients,
    onCloseIngredientView,
    onPickerImageOrGallery,
  };
};
