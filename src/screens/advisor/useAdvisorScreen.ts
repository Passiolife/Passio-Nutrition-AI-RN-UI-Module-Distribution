import { useCallback, useState } from 'react';
import { useNutritionAdvisor } from '../../hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ImagePickerType, ParamList } from '../../navigaitons';
import { Keyboard } from 'react-native';
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';
import {
  ShowToast,
  createFoodLogUsingPortionSize,
  getLogToDate,
  mealLabelByDate,
} from '../../utils';
import { useServices } from '../../contexts';
import type { AdvisorResponse, Selection } from './model/advisorResponse';

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
    setMessage,
    setIngredientAdvisorResponse,
    sendImages,
    makeResponseLoadingState,
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

  const findFoodPress = useCallback(
    async (response: AdvisorResponse) => {
      if (response.response) {
        fetchIngredients(response);
      }
    },
    [fetchIngredients]
  );

  const onLogSelect = async (
    response: AdvisorResponse,
    selected: Selection[]
  ) => {
    makeResponseLoadingState(response.uuID, true);
    const logToDate = getLogToDate(
      route.params.logToDate,
      route.params.logToMeal
    );
    const meal =
      route.params.logToMeal === undefined
        ? mealLabelByDate(logToDate)
        : route.params.logToMeal;

    for (const item of selected) {
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

    // Response
    setMessage((item) => {
      return item.map((r) => {
        if (r.uuID === response.uuID) {
          return {
            ...r,
            isLogged: true,
            isLoading: false,
            records: r.records?.map((map) => {
              return {
                ...map,
                isLogged:
                  selected.find(
                    (selectedItem) => selectedItem.index === map.index
                  ) !== undefined,
              };
            }),
          };
        } else {
          return r;
        }
      });
    });

    ShowToast('Logged food');
  };

  const onViewDiary = () => {
    navigation.pop(1);
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
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
    onViewDiary,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    fetchIngredients,
    onCloseIngredientView,
    onPickerImageOrGallery,
    findFoodPress,
  };
};
