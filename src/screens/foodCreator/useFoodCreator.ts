import { useRef, useState, useEffect } from 'react';
import { useBranding, useServices } from '../../contexts';
import type { OtherNutritionFactsRef } from './views/OtherNutritionFacts';
import type { RequireNutritionFactsRef } from './views/RequireNutritionFacts';
import type { FoodCreatorFoodDetailRef } from './views/FoodCreatorFoodDetail';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ImagePickerType, ParamList } from '../../navigaitons';
import {
  createFoodLogUsingFoodCreator,
  CUSTOM_USER_FOOD_PREFIX,
  CUSTOM_USER_NUTRITION_FACT__PREFIX,
  generateCustomID,
  generateCustomNutritionFactID,
  getCustomFoodUUID,
} from './FoodCreator.utils';
import type {
  BarcodeCustomResult,
  CustomFood,
  FoodItem,
  Image,
  Nutrient,
} from '../../models';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';
import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';
import { ShowToast } from '../../utils';

export type ScanningScreenNavigationProps = StackNavigationProp<
  ParamList,
  'FoodCreatorScreen'
>;

function formatNumber(num: number | undefined) {
  if (num) {
    if (!isFinite(num)) return num; // Handle non-finite numbers like Infinity, NaN
    const trimmed = parseFloat(num.toFixed(3)); // Limit to 3 decimal places
    return Number(trimmed.toString()); // Ensure no trailing zeroes
  } else {
    return undefined;
  }
}

const convertFormateFoodLog = (
  food: CustomFood | undefined
): CustomFood | undefined => {
  if (food) {
    const foodItems: FoodItem[] = food.foodItems.map((i) => {
      return {
        ...i,
        nutrients: i.nutrients.map((o) => {
          const nutrient: Nutrient = {
            ...o,
            amount: formatNumber(o.amount) ?? 0,
          };
          return nutrient;
        }),
      };
    });
    return {
      ...food,
      foodItems: foodItems,
    };
  } else {
    return food;
  }
};

export const useFoodCreator = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScanningScreenNavigationProps>();
  const { params } = useRoute<RouteProp<ParamList, 'FoodCreatorScreen'>>();
  const [foodLog, _setCustomFood] = useState<CustomFood | undefined>(
    convertFormateFoodLog(params.foodLog)
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
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

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

  const onNavigateToEditFoodScreen = (item?: BarcodeCustomResult) => {
    if (item?.customFood) {
      navigation.pop(1);
      navigation.replace('FoodCreatorScreen', {
        foodLog: item?.customFood,
        from: 'MyFood',
      });
    } else {
      if (item?.passioIDAttributes) {
        navigation.pop(1);
        navigation.replace('FoodCreatorScreen', {
          foodLog: {
            ...convertPassioFoodItemToFoodLog(
              item?.passioIDAttributes,
              undefined,
              undefined
            ),
            uuid: getCustomFoodUUID(),
            barcode:
              item.barcode ??
              item.passioIDAttributes?.ingredients?.[0]?.metadata?.barcode,
          },
          from: 'MyFood',
        });
      }
    }
  };

  const onBarcodePress = async () => {
    navigation.navigate('BarcodeScanScreen', {
      onViewExistingItem: (item) => {
        if (item?.customFood) {
          // If the user clicks on the "View Food Item", they're navigated to the food details screen of that custom food.
          // Might be in this case they navigate to the new create food detail screen.
          onNavigateToEditFoodScreen(item);
        } else {
          navigation.goBack();
          // custom food doesn't exist
          // . If the user clicks on the "View Food Item", they're navigated to the food details screen of that food item
          onNavigateToEditFoodScreen(item);
        }
      },
      onBarcodePress: (item) => {
        navigation.pop();
        if (item?.customFood) {
          setBarcode('');
        } else {
          setBarcode(item?.barcode);
        }
      },
      onCreateFoodAnyWay: (item) => {
        navigation.goBack();
        if (item?.customFood) {
          //If they click on "Create Custom Food Without Barcode", the barcode value is left as empty in the Food Creator screen.
          setBarcode('');
        } else {
          // custom food doesn't exist
          // If they click on "Create Custom Food Anyway", the barcode value is imported into the Food Creator screen.
          setBarcode(item?.barcode);
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
    setSubmitting(true);
    const customFood = getCurrentFood();
    if (customFood) {
      await services.dataService.saveCustomFood(customFood);
      params.onSave?.(customFood);
    }
    setSubmitting(false);
  };
  const onSavePress = async () => {
    setSubmitting(true);
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
      } else if (params.from === 'Barcode') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'BottomNavigation',
                params: {
                  screen: 'MealLogScreen',
                },
              },
            ],
          })
        );
        navigation.navigate('MyFoodsScreen', {
          logToDate: new Date(),
          logToMeal: undefined,
        });
      } else {
        navigation.goBack();
      }
    }
    setSubmitting(false);
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
            if (
              image?.id.startsWith(CUSTOM_USER_NUTRITION_FACT__PREFIX) &&
              image?.id.length > CUSTOM_USER_NUTRITION_FACT__PREFIX.length
            ) {
              id = image?.id;
            }
          } else {
            if (
              image?.id.startsWith(CUSTOM_USER_FOOD_PREFIX) &&
              image?.id.length > CUSTOM_USER_FOOD_PREFIX.length
            ) {
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
    isSubmitting,
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
