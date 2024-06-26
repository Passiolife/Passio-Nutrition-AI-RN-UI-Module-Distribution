import { useCallback, useState } from 'react';
import { useNutritionAdvisor } from '../../hooks';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ImagePickerType, ParamList } from '../../navigaitons';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'AdvisorScreen'>;

export const useAdvisorScreen = () => {
  const {
    messages,
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
      try {
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
    [navigation, sendImages]
  );

  const onCloseIngredientView = useCallback(async () => {
    setIngredientAdvisorResponse(null);
  }, [setIngredientAdvisorResponse]);

  return {
    configureStatus,
    ingredientAdvisorResponse,
    inputMessage,
    messages,
    loading,
    sending,
    isOptionShow,
    listRef,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    fetchIngredients,
    onCloseIngredientView,
    onPickerImageOrGallery,
  };
};
