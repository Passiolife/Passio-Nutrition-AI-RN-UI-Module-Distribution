import { QuickScanningLoadingView } from '../../../scanning';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import EditIngredientsModal from '../modal/EditIngredientsModal';
import type { FoodItem } from '../../../../models';
import type { ParamList } from '../../../../navigaitons';
import React from 'react';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import styles from './IngredientQuickScanScreen.style';
import { useIngredientQuickScan } from './useIngredientQuickScan';

export interface IngredientQuickScanScreenProps {
  onSelectPassioIDAttribute: (item: FoodItem) => void;
}

export type ScanningScreenNavigationProps = StackNavigationProp<
  ParamList,
  'IngredientQuickScanScreen'
>;

const IngredientQuickScanScreen = () => {
  const navigation = useNavigation<ScanningScreenNavigationProps>();
  const { params } =
    useRoute<RouteProp<ParamList, 'IngredientQuickScanScreen'>>();

  const goBack = () => {
    navigation.goBack();
  };

  const { passioIdAttributes, isEditModalOpen, foodItem, editModalDismiss } =
    useIngredientQuickScan();

  const updateIngredientsItem = async (item: FoodItem) => {
    params.onSelectPassioIDAttribute(item);
    await editModalDismiss();
    await goBack();
  };

  return (
    <>
      <View style={styles.blackBackgroundStyle}>
        <>
          <DetectionCameraView style={styles.cameraStyle} />
          <TouchableOpacity style={styles.touchAreaStyle} activeOpacity={1} />
          {passioIdAttributes === null ? (
            <QuickScanningLoadingView />
          ) : (
            <View />
          )}
        </>
      </View>
      {foodItem !== null && (
        <EditIngredientsModal
          foodItemData={foodItem}
          isEditModalOpen={isEditModalOpen}
          updateIngredientsItem={(item: FoodItem) =>
            updateIngredientsItem(item)
          }
          editModalDismiss={editModalDismiss}
        />
      )}
    </>
  );
};

export default IngredientQuickScanScreen;
