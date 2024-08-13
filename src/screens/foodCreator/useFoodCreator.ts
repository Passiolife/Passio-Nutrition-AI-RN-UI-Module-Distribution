import { useRef, useState, useEffect } from 'react';
import { useBranding, useServices } from '../../contexts';
import type { OtherNutritionFactsRef } from './views/OtherNutritionFacts';
import type { RequireNutritionFactsRef } from './views/RequireNutritionFacts';
import type { FoodCreatorFoodDetailRef } from './views/FoodCreatorFoodDetail';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ImagePickerType, ParamList } from '../../navigaitons';
import {
  createFoodLogUsingFoodCreator,
  CUSTOM_USER_FOOD_PREFIX,
  CUSTOM_USER_NUTRITION_FACT__PREFIX,
  generateCustomID,
  generateCustomNutritionFactID,
} from './FoodCreator.utils';
import type { CustomFood, Image } from '../../models';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';
import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';
import { ShowToast } from '../../utils';

export type ScanningScreenNavigationProps = StackNavigationProp<
  ParamList,
  'FoodCreatorScreen'
>;

export const useFoodCreator = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScanningScreenNavigationProps>();
  const { params } = useRoute<RouteProp<ParamList, 'FoodCreatorScreen'>>();
  const [foodLog, setCustomFood] = useState<CustomFood | undefined>(
    params.foodLog
  );
  const [barcode, setBarcode] = useState<string | undefined>(
    params.foodLog?.barcode
  );

  const [image, setImage] = useState<Image | undefined>(
    foodLog?.iconID
      ? {
          id: foodLog?.iconID,
          base64: '',
        }
      : undefined
  );
  const [isImagePickerVisible, setImagePickerModalVisible] = useState(false);
  const [isDeleteButtonVisible, setDeleteButtonVisible] = useState(false);

  const otherNutritionFactsRef = useRef<OtherNutritionFactsRef>(null);
  const requireNutritionFactsRef = useRef<RequireNutritionFactsRef>(null);
  const foodCreatorFoodDetailRef = useRef<FoodCreatorFoodDetailRef>(null);

  useEffect(() => {
    if (foodLog?.uuid) {
      services.dataService.getCustomFoodLog(foodLog?.uuid).then((data) => {
        setDeleteButtonVisible(data !== undefined && data !== null);
      });
    }
  }, [foodLog?.uuid, services.dataService]);

  const openImagePickerModal = () => {
    setImagePickerModalVisible(true);
  };

  const closeImagePickerModal = () => {
    setImagePickerModalVisible(false);
  };

  const onBarcodePress = async () => {
    navigation.navigate('BarcodeScanScreen', {
      onViewExistingItem: (item) => {
        if (item?.customFood) {
          // If the user clicks on the "View Food Item", they're navigated to the food details screen of that custom food.
          // Might be in this case they navigate to the new create food detail screen.
          navigation.push('FoodCreatorScreen', {
            from: 'MyFood',
            foodLog: item.customFood,
          });
          // setCustomFood(item?.customFood);
        } else {
          navigation.goBack();
          // custom food doesn't exist
          // . If the user clicks on the "View Food Item", they're navigated to the food details screen of that food item
          if (item?.passioIDAttributes) {
            const barcodeFoodLog = convertPassioFoodItemToFoodLog(
              item.passioIDAttributes,
              undefined,
              undefined
            );
            navigation.push('EditFoodLogScreen', {
              foodLog: barcodeFoodLog,
              prevRouteName: 'QuickScan',
              onSaveLogPress: () => {},
            });
          }
        }
      },
      onBarcodePress: (item) => {
        navigation.goBack();
        if (item?.customFood) {
          setCustomFood(item?.customFood);
        } else {
          setCustomFood({
            barcode: item?.barcode ?? '',
          } as CustomFood);
        }
      },
      onCreateFoodAnyWay: (item) => {
        navigation.goBack();
        if (item?.customFood) {
          //If they click on "Create Custom Food Without Barcode", the barcode value is left as empty in the Food Creator screen.

          setBarcode('');

          // setCustomFood({
          //   ...item?.customFood,
          //   barcode: undefined,
          //   uuid: uuid4.v4() as string,
          // });
        } else {
          // custom food doesn't exist
          // If they click on "Create Custom Food Anyway", the barcode value is imported into the Food Creator screen.
          setBarcode(item?.barcode);
          // if (item?.passioIDAttributes) {
          //   const customFood = convertPassioFoodItemToCustomFood(
          //     item.passioIDAttributes,
          //     item?.barcode
          //   );
          //   setCustomFood(customFood);
          // }
        }
      },
    });
  };

  const getCurrentFood = (): CustomFood | undefined => {
    const info = foodCreatorFoodDetailRef.current?.getValue();
    const requireNutritionFact = requireNutritionFactsRef.current?.getValue();
    const otherNutritionFact = otherNutritionFactsRef.current?.getValue();

    if (info?.isNotValid) {
      return undefined;
    }

    if (requireNutritionFact?.isNotValid) {
      return undefined;
    }
    if (otherNutritionFact?.isNotValid) {
      return undefined;
    }

    if (
      info?.records &&
      requireNutritionFact?.records &&
      otherNutritionFact?.records
    ) {
      const modifiedFoodLog = createFoodLogUsingFoodCreator({
        info: info?.records,
        requireNutritionFact: requireNutritionFact?.records,
        otherNutritionFact: otherNutritionFact?.records,
        image: image?.id,
      });

      try {
        const updateCustomFood: CustomFood = {
          ...foodLog,
          ...modifiedFoodLog,
          uuid: foodLog?.uuid ?? modifiedFoodLog.uuid,
        };
        return updateCustomFood;
      } catch (error) {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  const onNutritionFactSave = async () => {
    const customFood = getCurrentFood();
    if (customFood) {
      params.onSave?.(customFood);
    }
  };
  const onSavePress = async () => {
    const food = getCurrentFood();
    if (food) {
      await services.dataService.saveCustomFood(food);
      if (params.from === 'Search') {
        ShowToast('Food added successfully into my food');
      } else if (food) {
        ShowToast('Food update successfully customized to my food');
      } else {
        ShowToast('Food added successfully into my food');
      }
      params.onSave?.(food);
      if (params.from === 'FoodDetail') {
        // Prevent to go back
      } else {
        navigation.goBack();
      }
    }
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
          let id =
            params.from === 'NutritionFact'
              ? generateCustomNutritionFactID()
              : generateCustomID();

          if (params.from === 'NutritionFact') {
            if (image?.id.includes(CUSTOM_USER_NUTRITION_FACT__PREFIX)) {
              id = image?.id;
            }
          } else {
            if (image?.id.includes(CUSTOM_USER_FOOD_PREFIX)) {
              id = image?.id;
            }
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

  const onCancelPress = () => {
    navigation.goBack();
  };

  const onDeletePress = () => {
    if (foodLog?.uuid) {
      Alert.alert('Are you sure want to delete this from my food?', undefined, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            services.dataService.deleteCustomFood(foodLog?.uuid).then(() => {
              navigation.goBack();
            });
          },
          style: 'destructive',
        },
      ]);
    }
  };

  return {
    branding,
    barcode,
    foodLog,
    isDeleteButtonVisible,
    image,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    isImagePickerVisible,
    from: params.from,
    title:
      params.from === 'NutritionFact' ? 'Edit Nutrition Facts' : 'Food Creator',
    closeImagePickerModal,
    onBarcodePress,
    onCancelPress,
    onDeletePress,
    onEditImagePress,
    onNutritionFactSave,
    onSavePress,
    onSelectImagePress,
    openImagePickerModal,
  };
};
