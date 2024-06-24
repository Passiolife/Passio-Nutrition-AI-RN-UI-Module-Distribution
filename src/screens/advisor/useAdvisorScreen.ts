import { useCallback, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Keyboard } from 'react-native';
import { useNutritionAdvisor } from '../../hooks';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'AdvisorScreen'>;

export const useAdvisorScreen = () => {
  const {
    messages,
    configureStatus,
    sending,
    ingredientAdvisorResponse,
    fetchIngredients,
    sendMessage,
    setIngredientAdvisorResponse,
    sendImages,
  } = useNutritionAdvisor({
    key: '',
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ScreenNavigationProps>();

  const onChangeTextInput = useCallback((val: string) => {
    setInputMessage(val);
  }, []);

  const onPressSendBtn = useCallback(() => {
    sendMessage(inputMessage);
    setInputMessage('');
    Keyboard.dismiss();
  }, [inputMessage, sendMessage]);

  const onPressPlusIcon = useCallback(async () => {
    try {
      navigation.navigate('ImagePickerScreen', {
        onImages: async (images) => {
          navigation.goBack();
          await sendImages(
            images.map((assets) => assets.replace('file://', '') ?? '')
          );
        },
        type: 'gallery',
      });
    } catch (err) {
      setLoading(false);
    }
  }, [navigation, sendImages]);

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
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    fetchIngredients,
    onCloseIngredientView,
  };
};
