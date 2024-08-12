import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';
import type { CustomRecipe, FoodItem, FoodLog, Image } from '../../models';
import { useCallback, useRef, useState } from 'react';
import RNFS from 'react-native-fs';

import { content } from '../../constants/Content';
import { useBranding, useServices } from '../../contexts';
import { ShowToast } from '../../utils';
import {
  StackActions,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { ImagePickerType, ParamList } from '../../navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  CUSTOM_USER_FOOD,
  generateCustomID,
} from '../foodCreator/FoodCreator.utils';
import { Platform } from 'react-native';
import type { EditRecipeNameRef } from './views/EditRecipeName';

export type EditRecipeScreenNavigationProps = StackNavigationProp<
  ParamList,
  'EditRecipeScreen'
>;

export function useEditRecipe() {
  const { params } = useRoute<RouteProp<ParamList, 'EditRecipeScreen'>>();
  const branding = useBranding();
  const services = useServices();

  const navigation = useNavigation<EditRecipeScreenNavigationProps>();

  const [customRecipe, setCustomRecipe] = useState<CustomRecipe>(params.recipe);
  const [isImagePickerVisible, setImagePickerModalVisible] = useState(false);
  const editRecipeNameRef = useRef<EditRecipeNameRef>(null);

  const [image, setImage] = useState<Image | undefined>(
    customRecipe?.iconID
      ? {
          id: customRecipe?.iconID,
          base64: '',
        }
      : undefined
  );

  const openImagePickerModal = () => {
    setImagePickerModalVisible(true);
  };

  const closeImagePickerModal = () => {
    setImagePickerModalVisible(false);
  };
  const onEditImagePress = () => {
    openImagePickerModal();
  };

  const onSelectImagePress = (type: ImagePickerType) => {
    closeImagePickerModal();
    navigation.push('ImagePickerScreen', {
      type: type,
      isMultiple: false,
      onImages: async (uris) => {
        if (uris) {
          const uri = Platform.OS === 'android' ? `file://${uris[0]}` : uris[0];
          const response = await RNFS.readFile(uri, 'base64');
          let id = generateCustomID();
          if (image?.id.includes(CUSTOM_USER_FOOD)) {
            id = image?.id;
          }
          let customFoodImageID = await services.dataService.saveImage({
            id: id,
            base64: response,
          });
          setImage({
            id: customFoodImageID,
            base64: response,
          });
          navigation.goBack();
        }
      },
    });
  };

  const recalculateFoodLogServing = useCallback(
    (value: FoodLog | CustomRecipe) => {
      const updatedFoodLog = { ...value };
      const sum = updatedFoodLog.foodItems.reduce(
        (acc, item) => acc + item.computedWeight.value,
        0
      );
      updatedFoodLog.computedWeight = {
        value: sum,
        unit: 'g',
      };
      updatedFoodLog.selectedUnit = 'serving';
      updatedFoodLog.selectedQuantity = 1;
      updatedFoodLog.servingUnits = [
        {
          unit: 'serving',
          mass: sum,
        },
        {
          unit: 'gram',
          mass: 1,
        },
      ];
      if (updatedFoodLog.foodItems.length === 1) {
        updatedFoodLog.name = `${content.recipeWith} ${updatedFoodLog.name}`;
      }
      return updatedFoodLog;
    },
    []
  );

  const addIngredient = useCallback(
    (foodItem: FoodItem) => {
      const updatedFoodLog = { ...customRecipe };
      updatedFoodLog.foodItems.push(foodItem);
      setCustomRecipe(recalculateFoodLogServing(updatedFoodLog));
      ShowToast('Ingredient added successfully');
      navigation.goBack();
    },
    [customRecipe, navigation, recalculateFoodLogServing]
  );

  const deleteIngredient = useCallback(
    (foodItem: FoodItem) => {
      const newFoodLog = {
        ...customRecipe,
        foodItems: customRecipe.foodItems.filter(
          (value) => value.refCode !== foodItem.refCode
        ),
      };
      setCustomRecipe(recalculateFoodLogServing(newFoodLog));
    },
    [customRecipe, recalculateFoodLogServing]
  );

  const updateIngredient = useCallback(
    (foodLogObj: FoodItem) => {
      let updatedFoodItems = customRecipe.foodItems.map((value) =>
        value.refCode === foodLogObj.refCode ? foodLogObj : value
      );
      let foodLogData: CustomRecipe = {
        ...customRecipe,
        foodItems: updatedFoodItems,
      };
      setCustomRecipe(recalculateFoodLogServing(foodLogData));
      navigation.goBack();
    },
    [customRecipe, navigation, recalculateFoodLogServing]
  );

  const onUpdateFoodLog = useCallback((item: CustomRecipe) => {
    setCustomRecipe({ ...item });
  }, []);

  const onSavePress = async () => {
    const name = editRecipeNameRef?.current?.getValue()?.records?.name;
    if (name) {
      try {
        const updatedRecipe: CustomRecipe = {
          ...customRecipe,
          iconID: image?.id,
          name: name,
        };
        services?.dataService?.saveCustomRecipe(updatedRecipe);
        params?.onSaveLogPress?.({ ...updatedRecipe });
        navigation.goBack();
      } catch (e) {}
    } else {
    }
  };

  const onCancelPress = async () => {
    navigation.dispatch(StackActions.pop(2));
    params?.onCancelPress?.();
  };

  const onAddIngredientPress = () => {
    navigation.navigate('FoodSearchScreen', {
      onSaveData: (item) => {
        const foodItem = convertPassioFoodItemToFoodLog(
          item,
          new Date(),
          undefined
        ).foodItems[0];
        if (foodItem) {
          addIngredient(foodItem);
        }
      },
      from: 'Ingredient',
    });
  };

  const onEditIngredientPress = useCallback(
    (foodItem: FoodItem) => {
      navigation.navigate('EditIngredientScreen', {
        foodItem: foodItem,
        deleteIngredient: (food) => {
          deleteIngredient(food);
          navigation.goBack();
        },
        updateIngredient,
      });
    },
    [navigation, updateIngredient, deleteIngredient]
  );

  return {
    branding,
    closeImagePickerModal,
    deleteIngredient,
    editRecipeNameRef,
    foodLog: customRecipe,
    from: params.prevRouteName,
    image,
    isImagePickerVisible,
    onAddIngredientPress,
    onCancelPress,
    onEditImagePress,
    onEditIngredientPress,
    onSavePress,
    onSelectImagePress,
    onUpdateFoodLog,
    openImagePickerModal,
  };
}
