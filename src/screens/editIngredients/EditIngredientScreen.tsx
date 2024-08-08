import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ParamList } from '../../navigaitons';
import type { FoodItem } from '../../models';
import {
  calculateComputedWeightAmount,
  DeleteIngredientAlert,
} from '../editFoodLogs';
import { BasicButton, DeleteButton, BackNavigation } from '../../components';
import { COLORS } from '../../constants';
import LogInformationView from '../editFoodLogs/views/logInformationsView';
import { type RouteProp, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import EditServingAmountView from '../editFoodLogs/views/EditServingAmountView';
import { useEditIngredient } from './useEditIngredient';

export type EditIngredientNavigationProps = StackNavigationProp<
  ParamList,
  'EditIngredientScreen'
>;

export interface EditIngredientsScreenProps {
  foodItem?: FoodItem;
  deleteIngredient?: (foodItem: FoodItem) => void;
  updateIngredient?: (foodItem: FoodItem) => void;
}

export const EditIngredientScreen = () => {
  return <EditIngredient />;
};

export const EditIngredient = (props?: EditIngredientsScreenProps) => {
  const { params } = useRoute<RouteProp<ParamList, 'EditIngredientScreen'>>();

  const { foodItem, updateFoodItem } = useEditIngredient(params ?? props);

  const onSavePress = async () => {
    await saveIngredient().then(() => {});
  };

  const saveIngredient = async () => {
    if (foodItem) {
      params?.updateIngredient?.(foodItem);
    }
  };

  const onDeleteIngredient = async () => {
    DeleteIngredientAlert({
      onClose(): void {},
      async onDelete() {
        if (params.deleteIngredient !== undefined && foodItem) {
          params.deleteIngredient(foodItem);
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <BackNavigation title="Edit Ingridient" />

      {foodItem ? (
        <ScrollView>
          <View style={styles.body}>
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
                  updateFoodItem(copyOfFavFoodItem);
                }
              }}
            />
            <View style={styles.lastContainer} />
          </View>
        </ScrollView>
      ) : null}
      <View style={bottomActionStyle.bottomActionContainer}>
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Cancel"
          testId="testButtonSave"
          small
          secondary
          onPress={() => onSavePress()}
        />
        {params.deleteIngredient !== undefined && (
          <DeleteButton
            style={bottomActionStyle.bottomActionButton}
            small
            onPress={onDeleteIngredient}
          />
        )}

        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Add Ingredient"
          testId="testButtonSave"
          small
          secondary={false}
          onPress={() => onSavePress()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerIconImg: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  body: {
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    backgroundColor: 'red',
    flex: 1,
  },
  informationContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  informationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.grey2,
  },
  informationContent: {
    marginLeft: 10,
  },
  logName: {
    color: COLORS.blue,
    fontSize: 20,
  },
  logSize: {
    fontSize: 13,
    color: COLORS.grey7,
    marginTop: 2,
  },
  calorieContainer: {
    flexDirection: 'row',
    marginTop: 15,
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
    marginHorizontal: 24,
  },
  bottomActionButton: {
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
});
