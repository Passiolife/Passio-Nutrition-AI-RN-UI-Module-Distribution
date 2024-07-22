import { useRef, useState } from 'react';
import { useBranding, useServices } from '../../contexts';
import type { OtherNutritionFactsRef } from './views/OtherNutritionFacts';
import type { RequireNutritionFactsRef } from './views/RequireNutritionFacts';
import type { FoodCreatorFoodDetailRef } from './views/FoodCreatorFoodDetail';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ImagePickerType, ParamList } from '../../navigaitons';
import {
  convertPassioFoodItemToCustomFood,
  createFoodLogUsingFoodCreator,
} from './FoodCreator.utils';
import type { CustomFood } from '../../models';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { ShowToast } from '../../utils';
import uuid4 from 'react-native-uuid';

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

  const [image, setImage] = useState<string | undefined>(
    foodLog?.userFoodImage
  );
  const [isImagePickerVisible, setImagePickerModalVisible] = useState(false);

  const otherNutritionFactsRef = useRef<OtherNutritionFactsRef>(null);
  const requireNutritionFactsRef = useRef<RequireNutritionFactsRef>(null);
  const foodCreatorFoodDetailRef = useRef<FoodCreatorFoodDetailRef>(null);

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
              prevRouteName: 'MyFood',
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
          setCustomFood({
            ...item?.customFood,
            barcode: undefined,
            uuid: uuid4.v4() as string,
          });
        } else {
          // custom food doesn't exist
          // If they click on "Create Custom Food Anyway", the barcode value is imported into the Food Creator screen.
          if (item?.passioIDAttributes) {
            const customFood = convertPassioFoodItemToCustomFood(
              item.passioIDAttributes,
              item?.barcode
            );
            setCustomFood(customFood);
          }
        }
      },
    });
  };
  const onSavePress = async () => {
    const info = foodCreatorFoodDetailRef.current?.getValue();
    const requireNutritionFact = requireNutritionFactsRef.current?.getValue();
    const otherNutritionFact = otherNutritionFactsRef.current?.getValue();

    if (info?.isNotValid) {
      return;
    }

    if (requireNutritionFact?.isNotValid) {
      return;
    }
    if (otherNutritionFact?.isNotValid) {
      return;
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
        image,
      });

      try {
        const updateCustomFood: CustomFood = {
          ...foodLog,
          ...modifiedFoodLog,
          uuid: foodLog?.uuid ?? modifiedFoodLog.uuid,
        };
        await services.dataService.saveCustomFood(updateCustomFood);

        if (params.from === 'Search') {
          ShowToast('Food added successfully into my food');
        } else if (modifiedFoodLog) {
          ShowToast('Food update successfully customized to my food');
        } else {
          ShowToast('Food added successfully into my food');
        }
        navigation.goBack();
      } catch (error) {}
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
          setImage(response);
          navigation.goBack();
        }
      },
    });
  };

  const onCancelPress = () => {
    navigation.goBack();
  };

  return {
    branding,
    foodLog,
    image,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    isImagePickerVisible,
    onSelectImagePress,
    openImagePickerModal,
    closeImagePickerModal,
    onSavePress,
    onBarcodePress,
    onCancelPress,
    onEditImagePress,
  };
};
