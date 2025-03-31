import React from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import {
  BackNavigation,
  BasicButton,
  Card,
  DashboardMenu,
  TextInput,
  Text,
} from '../../components';
import { COLORS } from '../../constants';
import type { GenderType } from '../../models';
import {
  LengthUnitSystemToUnitSetting,
  UnitSystem,
  getCaloriesDeficitWeightLabel as getCaloriesDeficitWeightLabel,
  getCaloriesDeficits,
} from '../../models';
import { HeightPicker } from './HeightPicker';
import { MacroModal } from './MacroModal';
import { convertPoundsToKG } from './unitConversions';
import { getActivityLevels } from '../../utils';
import { ListPicker } from '../../components/listPickers';
import CalculateBMI from './CalculateBMI';
import { useNutritionProfile } from './useNutritionProfile';
import { scaleHeight } from '../../utils';
import { useBranding, type Branding } from '../../contexts';
import { ProfileMacroInfo } from './ProfileMacroInfo';

export const NutritionProfileScreen = () => {
  return <NutritionProfileView />;
};

export const NutritionProfileView = () => {
  const {
    activityLevel,
    age,
    calories,
    caloriesDeficit,
    carbs,
    fat,
    gender,
    height,
    isEditMacroModalShow,
    mealPlan,
    name,
    passioMealPlans,
    protein,
    targetWater,
    targetWeight,
    unitHeight,
    unitsWeight,
    weight,
    handleActivityLevelChange,
    handleAgeChange,
    handleCaloriesDeficit,
    handleGenderChange,
    handleHeightChange,
    handleMacroChange,
    handleNameChange,
    handleTargetWater,
    handleTargetWeight,
    handleWeightChange,
    isValidProfile,
    onCloseEditMacroInfo,
    onMealPlanChanged,
    onOpenEditMacroInfo,
    onSavePress,
  } = useNutritionProfile();

  const branding = useBranding();
  const styles = profileScreenStyle(branding);

  return (
    <View style={styles.container}>
      <BackNavigation
        title="My Profile"
        rightSide={<DashboardMenu hide={['My Profile']} />}
      />
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.cardContainer}>
          <Text
            weight="600"
            size="_16px"
            color="text"
            style={[
              styles.label,
              styles.labelMargin,
              { marginBottom: 16, marginTop: 4 },
            ]}
          >
            {'Personal Information '}
          </Text>

          <View style={styles.formRow}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Name '}
            </Text>
            <TextInput
              value={name}
              onChangeText={handleNameChange}
              style={styles.textInput}
              containerStyle={styles.containerTextInput}
              placeholder={``}
              error={name === '' ? 'Required' : ''}
              keyboardType="default"
            />
          </View>
          <View style={[styles.formRow, styles.formRowMarginBottom]}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Age'}
            </Text>
            <TextInput
              value={age?.toString()}
              containerStyle={styles.containerTextInput}
              onChangeText={handleAgeChange}
              style={styles.textInput}
              returnKeyType="done"
              placeholder=""
              error={age?.toString() === '' || age === '0' ? 'Required' : ''}
              keyboardType="numeric"
            />
          </View>

          <View
            style={[
              styles.formRow,
              styles.formRowMarginBottom,
              styles.formRowCentered,
            ]}
          >
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={styles.label}
            >
              {'Gender'}
            </Text>

            <ListPicker
              value={gender?.toLocaleLowerCase() ?? '-'}
              title={'Select Gender'}
              onChange={(value) => {
                Keyboard.dismiss();
                handleGenderChange(value.toLocaleLowerCase() as GenderType);
              }}
              lists={['Male', 'Female']}
              style={styles.pickerTextInput}
              error={''}
            />
          </View>

          <View style={styles.formRow}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Height '}
              {`(${LengthUnitSystemToUnitSetting[unitHeight]})`}
            </Text>
            <HeightPicker
              value={height ?? 0}
              onChange={handleHeightChange}
              style={styles.textInput}
              unit={unitHeight}
              error={height === 0 ? 'Required' : ''}
            />
          </View>
          <View style={styles.formRow}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Weight '}
              {unitsWeight === 'imperial' ? '(lbs)' : '(kgs)'}
            </Text>
            <TextInput
              value={weight}
              onChangeText={handleWeightChange}
              style={styles.textInput}
              containerStyle={styles.containerTextInput}
              placeholder={``}
              returnKeyType="done"
              error={weight === '' || weight === '0' ? 'Required' : ''}
              keyboardType="decimal-pad"
            />
          </View>
        </Card>
        <Card style={styles.cardContainer}>
          <Text
            weight="600"
            size="_16px"
            color="text"
            style={[
              styles.label,
              styles.labelMargin,
              { marginBottom: 16, marginTop: 4 },
            ]}
          >
            {'Nutrition Goals '}
          </Text>

          <View style={styles.formRow}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Target Weight '}
              {unitsWeight === 'imperial' ? '(lbs)' : '(kgs)'}
            </Text>
            <TextInput
              value={targetWeight?.toString()}
              onChangeText={handleTargetWeight}
              style={styles.textInput}
              containerStyle={styles.containerTextInput}
              placeholder={``}
              returnKeyType="done"
              error={
                targetWeight === '' || targetWeight === '0' ? 'Required' : ''
              }
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.formRow, styles.formRowMarginBottom]}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Activity level'}
            </Text>
            <ListPicker
              value={activityLevel ?? '-'}
              title={'Activity level'}
              onChange={handleActivityLevelChange}
              lists={getActivityLevels()}
              style={styles.pickerTextInput}
              error={''}
            />
          </View>

          <View style={[styles.formRow, styles.formRowMarginBottom]}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Calories Deficit'}
            </Text>
            <ListPicker
              value={
                (caloriesDeficit
                  ? getCaloriesDeficitWeightLabel(unitsWeight, caloriesDeficit)
                  : '-') ?? '-'
              }
              extraWidth={100}
              title={'Calories level'}
              onChange={handleCaloriesDeficit}
              lists={getCaloriesDeficits()}
              labelList={getCaloriesDeficits().map((item) =>
                getCaloriesDeficitWeightLabel(unitsWeight, item)
              )}
              style={styles.pickerTextInput}
              error={''}
            />
          </View>
          <View style={[styles.formRow, styles.formRowMarginBottom]}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Diet'}
            </Text>
            <ListPicker
              value={mealPlan ?? '-'}
              title={'Meal Plan'}
              onChange={onMealPlanChanged}
              lists={(passioMealPlans ?? []).map((item) => item.mealPlanLabel)}
              label={
                (passioMealPlans ?? []).find(
                  (item) => item.mealPlanLabel === mealPlan
                )?.mealPlanTitle
              }
              labelList={(passioMealPlans ?? []).map(
                (item) => item.mealPlanTitle
              )}
              style={styles.pickerTextInput}
              error={''}
            />
          </View>
          <View style={styles.formRow}>
            <Text
              weight="400"
              size="_14px"
              color="gray500"
              style={[styles.label, styles.labelMargin]}
            >
              {'Water Level '}
              {unitsWeight === 'imperial' ? '(oz)' : '(ml)'}
            </Text>
            <TextInput
              value={targetWater?.toString()}
              onChangeText={handleTargetWater}
              style={styles.textInput}
              containerStyle={styles.containerTextInput}
              placeholder={``}
              returnKeyType="done"
              error={
                targetWater === '' || targetWater === '0' ? 'Required' : ''
              }
              keyboardType="decimal-pad"
            />
          </View>
        </Card>

        {isValidProfile() ? (
          <Card style={styles.cardContainer}>
            <ProfileMacroInfo
              onEditMacro={onOpenEditMacroInfo}
              config={{
                carbs: Number(carbs ?? 0),
                protein: Number(protein ?? 0),
                fat: Number(fat ?? 0),
                totalCalories: Number(calories ?? 0),
              }}
            />
          </Card>
        ) : null}

        {isValidProfile() ? (
          <Card style={styles.cardContainer}>
            <CalculateBMI
              weight={
                unitsWeight === UnitSystem.IMPERIAL
                  ? Number(convertPoundsToKG(Number(weight)).toFixed(2))
                  : Number(weight)
              }
              height={Number(height)}
            />
          </Card>
        ) : null}
        <View style={styles.verticalSpace} />
      </ScrollView>
      <View style={styles.footer}>
        <BasicButton
          text="Save Changes"
          style={styles.button}
          onPress={onSavePress}
        />
      </View>
      <View style={styles.flexSpace} />
      {isEditMacroModalShow && (
        <MacroModal
          config={{
            carbs: Number(carbs),
            protein: Number(protein),
            fat: Number(fat),
            totalCalories: Number(calories),
          }}
          isShow={isEditMacroModalShow}
          onCloseModal={onCloseEditMacroInfo}
          onChange={handleMacroChange}
        />
      )}
    </View>
  );
};

const profileScreenStyle = ({ backgroundColor, white, border }: Branding) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    header: {
      marginTop: 16,
      marginBottom: 17,
      alignItems: 'center',
      flexDirection: 'row',
    },
    backIcon: {
      height: 24,
      width: 24,
    },
    headerText: {
      fontSize: 26,
      flex: 1,
      textAlign: 'center',
      color: COLORS.blue1,
    },
    cardContainer: {
      paddingVertical: scaleHeight(16),
      flex: 1,
      paddingHorizontal: scaleHeight(16),
      marginHorizontal: scaleHeight(16),
      marginVertical: scaleHeight(16),
    },
    formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    formRowCentered: {
      alignItems: 'center',
    },
    formRowMarginBottom: {
      marginBottom: 16,
    },
    formRowSeparator: {
      height: 10,
    },
    label: {
      flex: 1,
    },
    labelMargin: {
      marginTop: 10,
    },
    textInput: {
      textAlign: 'left',
      flex: 1,
      backgroundColor: white,
      borderColor: border,
      paddingVertical: scaleHeight(8),
      borderRadius: scaleHeight(4),
    },
    containerTextInput: {
      flex: 1,
    },

    pickerTextInput: {
      flexWrap: 'wrap',
      textAlign: 'right',
    },
    bottomContainer: {
      flex: 1,
    },
    macroHeading: {
      fontSize: 18,
      color: COLORS.grey7,
      marginBottom: 10,
      textAlign: 'center',
    },
    macrosContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    macro: {
      marginRight: 16,
    },
    flexSpace: {
      flex: 1,
    },
    footer: {
      marginVertical: 24,
    },
    button: {
      borderRadius: 8,
      marginHorizontal: 16,
    },
    informationText: {
      textAlign: 'center',
      fontWeight: '500',
      paddingHorizontal: 20,
      color: COLORS.grayscaleBody,
    },
    verticalSpace: {
      height: 180,
    },
  });
