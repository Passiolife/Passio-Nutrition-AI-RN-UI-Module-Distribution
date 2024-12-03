import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ParamList } from '../../navigaitons';
import type { FoodItem, FoodLog } from '../../models';
import {
  calculateComputedWeightAmount,
  DeleteIngredientAlert,
} from '../editFoodLogs';
import { BasicButton, BackNavigation } from '../../components';
import { COLORS } from '../../constants';
import LogInformationView from '../editFoodLogs/views/logInformationsView';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import NewEditServingAmountView from '../editFoodLogs/views/newEditServingsAmountView';
import { useEditIngredient } from './useEditIngredient';
import { mergeNutrients } from '../../utils/NutritentsUtils';

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

export const EditIngredient = () => {
  const { params } = useRoute<RouteProp<ParamList, 'EditIngredientScreen'>>();

  const navigation = useNavigation<EditIngredientNavigationProps>();

  const { foodItem, updateFoodItem } = useEditIngredient(params);

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

  if (foodItem === undefined) {
    return <></>;
  }

  const foodLog: FoodLog = {
    foodItems: [foodItem],
    computedWeight: foodItem.computedWeight,
    selectedQuantity: foodItem.selectedQuantity,
    selectedUnit: foodItem.selectedUnit,
    servingSizes: foodItem.servingSizes,
    servingUnits: foodItem.servingUnits,
    iconID: foodItem.iconId,
    name: foodItem.name,
  } as FoodLog;

  const onMoreDetailPress = () => {
    navigation.navigate('NutritionInformationScreen', {
      nutrient: mergeNutrients(foodLog.foodItems.flatMap((i) => i.nutrients)),
      foodLog: foodLog,
    });
  };

  return (
    <View style={styles.container}>
      <BackNavigation title="Edit Ingredient" />

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
              onMoreDetailPress={onMoreDetailPress}
              weight={calculateComputedWeightAmount(
                foodItem.selectedQuantity,
                foodItem.servingUnits,
                foodItem.selectedUnit
              )}
            />
            <NewEditServingAmountView
              foodLog={foodLog}
              onUpdateFoodLog={(updateFoodLog) => {
                if (updateFoodLog.foodItems?.[0]) {
                  let copyOfFavFoodItem: FoodItem = {
                    ...updateFoodLog.foodItems?.[0],
                    ...updateFoodLog,
                  } as FoodItem;
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
          <>
            <View style={bottomActionStyle.space} />
            <BasicButton
              isDelete
              small
              text="Delete"
              onPress={onDeleteIngredient}
            />
          </>
        )}

        <View style={bottomActionStyle.space} />
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text={
            params.deleteIngredient !== undefined ? 'Save' : 'Add Ingredient'
          }
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
    justifyContent: 'center',
  },
  space: {
    width: 8,
  },
});
