import { AlternativeFoodLogsView, BasicButton } from '../../../../components';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import {
  UpdateFoodLogAlertPrompt,
  calculateComputedWeightAmount,
} from '../../../editFoodLogs';

import { COLORS } from '../../../../constants';
import EditServingAmountView from '../../../editFoodLogs/views/EditServingAmountView';
import type { FoodItem } from '../../../../models';
import LogInformationView from '../../../editFoodLogs/views/logInformationsView';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { convertPassioIDAttributesToFoodItem } from '../../../../utils';

interface EditIngredientsModalProps {
  isEditModalOpen: boolean;
  foodItemData: FoodItem;
  updateIngredientsItem: (foodItem: FoodItem) => void;
  editModalDismiss: () => void;
}

const EditIngredientsModal = (props: EditIngredientsModalProps) => {
  const { isEditModalOpen, foodItemData, editModalDismiss } = props;
  const [foodItem, setFoodItem] = useState<FoodItem>(
    foodItemData ?? foodItemData
  );
  const [isUpdateAlertPromptOpen, setUpdateAlertPromptOpen] =
    useState<boolean>(false);

  const onSwitchAlternative = async (attributes: PassioIDAttributes) => {
    setFoodItem(convertPassioIDAttributesToFoodItem(attributes));
  };

  const saveIngredient = () => {
    props.updateIngredientsItem(foodItem);
  };

  const updateIngredientName = async (input: string | undefined) => {
    if (input != null) {
      foodItem.name = input;
      setFoodItem(foodItem);
      await saveIngredient();
      setUpdateAlertPromptOpen(false);
    } else {
    }
  };

  const dismissUpdateNameAlert = () => {
    setUpdateAlertPromptOpen(false);
  };

  const bottomActionView = () => {
    return (
      <View style={bottomActionStyle.bottomActionContainer}>
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Cancel"
          small
          secondary={false}
          onPress={() => editModalDismiss()}
        />
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Add"
          testId="testButtonSave"
          small
          secondary={false}
          onPress={() => saveIngredient()}
        />
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      animated={true}
      visible={isEditModalOpen}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => {
              setUpdateAlertPromptOpen(true);
            }}
            activeOpacity={1}
          >
            <LogInformationView
              foodItems={[foodItem]}
              iconID={foodItem.iconId}
              name={foodItem.name}
              qty={foodItem.selectedQuantity}
              servingUnit={foodItem.selectedUnit}
              entityType={foodItem.entityType}
              weight={calculateComputedWeightAmount(
                foodItem.selectedQuantity,
                foodItem.servingUnits,
                foodItem.selectedUnit
              )}
            />
          </TouchableOpacity>
          <EditServingAmountView
            servingInfo={foodItem}
            foodItems={[foodItem]}
            onUpdateServingInfo={(servingInfo, foodItems) => {
              if (foodItems[0]) {
                let copyOfFavFoodItem: FoodItem = {
                  ...foodItems[0],
                  selectedUnit: servingInfo.selectedUnit,
                  selectedQuantity: servingInfo.selectedQuantity,
                };
                setFoodItem(copyOfFavFoodItem);
              }
            }}
          />
          <AlternativeFoodLogsView
            passioId={foodItem.passioID}
            onAlternateItemCall={onSwitchAlternative}
          />

          <View style={styles.lastContainer} />
          {bottomActionView()}
          <UpdateFoodLogAlertPrompt
            defaultValue={foodItem.name}
            onSave={updateIngredientName}
            onClose={() => dismissUpdateNameAlert()}
            isVisible={isUpdateAlertPromptOpen}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditIngredientsModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width - 24,
    height: Dimensions.get('window').height - 100,
    alignSelf: 'center',
    backgroundColor: COLORS.white55,
    marginHorizontal: 50,
    marginTop: 50,
    flex: 1,
    zIndex: 25,
    borderRadius: 16,
  },
  body: {
    paddingHorizontal: 10,
  },
  lastContainer: {
    height: 50,
  },
});

const bottomActionStyle = StyleSheet.create({
  bottomActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 32,
    marginBottom: 60,
    marginHorizontal: 32,
    zIndex: 98,
  },
  bottomActionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 14,
    justifyContent: 'center',
  },
});
