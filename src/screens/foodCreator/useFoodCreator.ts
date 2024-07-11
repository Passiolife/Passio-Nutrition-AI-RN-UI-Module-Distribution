import { useRef, useState } from 'react';
import { useBranding, useServices } from '../../contexts';
import type { OtherNutritionFactsRef } from './views/OtherNutritionFacts';
import type { RequireNutritionFactsRef } from './views/RequireNutritionFacts';
import type { FoodCreatorFoodDetailRef } from './views/FoodCreatorFoodDetail';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import {
  convertPassioFoodItemToCustomFood,
  createFoodLogUsingFoodCreator,
} from './FoodCreator.utils';
import type { CustomFood } from '../../models';
import { convertPassioFoodItemToFoodLog } from '../../utils/V3Utils';

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

  const otherNutritionFactsRef = useRef<OtherNutritionFactsRef>(null);
  const requireNutritionFactsRef = useRef<RequireNutritionFactsRef>(null);
  const foodCreatorFoodDetailRef = useRef<FoodCreatorFoodDetailRef>(null);

  const onBarcodePress = async () => {
    navigation.navigate('BarcodeScanScreen', {
      onViewExistingItem: (item) => {
        navigation.goBack();
        if (item?.customFood) {
          // If the user clicks on the "View Food Item", they're navigated to the food details screen of that custom food.
          // Might be in this case they navigate to the new create food detail screen.
          setCustomFood(item?.customFood);
        } else {
          // custom food doesn't exist
          // . If the user clicks on the "View Food Item", they're navigated to the food details screen of that food item
          if (item?.passioIDAttributes) {
            const barcodeFoodLog = convertPassioFoodItemToFoodLog(
              item.passioIDAttributes,
              undefined,
              undefined
            );
            navigation.navigate('EditFoodLogScreen', {
              foodLog: barcodeFoodLog,
              prevRouteName: 'Other',
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
          if (item?.passioIDAttributes) {
            const customFood = convertPassioFoodItemToCustomFood(
              item.passioIDAttributes
            );
            setCustomFood(customFood);
          }
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
      });

      try {
        const updateCustomFood: CustomFood = {
          ...foodLog,
          ...modifiedFoodLog,
          uuid: foodLog?.uuid ?? modifiedFoodLog.uuid,
        };
        await services.dataService.saveCustomFood(updateCustomFood);
        navigation.goBack();
      } catch (error) {}
    }
  };

  return {
    branding,
    foodLog,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    onSavePress,
    onBarcodePress,
  };
};
