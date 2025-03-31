import { useCallback, useEffect, useRef, useState } from 'react';
import {
  convertKGToPounds,
  convertMlToOg,
  convertOgToMl,
  convertPoundsToKG,
} from './unitConversions';
import { calculateBMR } from '../../utils';
import {
  ActivityLevelType,
  CaloriesDeficit,
  getCaloriesSubtractionForDeficit,
  type GenderType,
} from '../../models';
import { type NutritionProfile, UnitSystem } from '../../models';
import { useServices } from '../../contexts';
import { ShowToast } from '../../utils';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { Alert } from 'react-native';
import {
  PassioSDK,
  type PassioMealPlan,
} from '@passiolife/nutritionai-react-native-sdk-v3';

const defaultUnitSystem = UnitSystem.IMPERIAL;

export type ProfileScreenNavigationProps = StackNavigationProp<
  ParamList,
  'ProfileScreen'
>;

export function useNutritionProfile() {
  const services = useServices();
  const navigator = useNavigation<ProfileScreenNavigationProps>();
  const isFocus = useIsFocused();
  const nutritionProfileRef = useRef<NutritionProfile | undefined>(undefined);

  const [passioMealPlans, setPassioMealPlans] = useState<
    PassioMealPlan[] | undefined
  >(undefined);

  /* Personal information */
  const [name, setName] = useState<string | undefined>();
  const [age, setAge] = useState<string | undefined>(undefined);
  const [gender, setGender] = useState<GenderType | undefined>();
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<string | undefined>(undefined);

  /* Nutrition Goal */
  const [targetWeight, setTargetWeight] = useState<string | undefined>(
    undefined
  );
  const [activityLevel, setActivityLevel] = useState<
    ActivityLevelType | undefined
  >(ActivityLevelType.active);
  const [dietPlan, setDietPlan] = useState<string | undefined>(undefined);
  const [targetWater, setTargetWater] = useState<string | undefined>(undefined);
  const [caloriesDeficit, setCaloriesDeficit] = useState<
    CaloriesDeficit | undefined
  >(CaloriesDeficit.maintainWeight);

  /* Macros */
  const [calories, setCalories] = useState<string | null>(null);
  const [carbs, setCarbs] = useState<string | number | null>(null);
  const [fat, setFat] = useState<string | number | undefined>(undefined);
  const [protein, setProtein] = useState<string | number | undefined>(
    undefined
  );
  const [isEditMacroModalShow, setEditMacroModalShow] =
    useState<boolean>(false);

  // Units
  const [unitLength, setUnitLength] = useState<UnitSystem>(defaultUnitSystem);
  const [unitsWeight, setUnitWeight] = useState<UnitSystem>(defaultUnitSystem);

  const getDBConvertedWeight = useCallback(
    (val: number) => {
      const convertedWeight =
        unitsWeight === UnitSystem.IMPERIAL
          ? convertPoundsToKG(Number(val))
          : val;
      return convertedWeight;
    },
    [unitsWeight]
  );

  const handleMacroChange = (
    cCarbs: number,
    pProtein: number,
    fFat: number,
    pCalories: string
  ) => {
    setCarbs(cCarbs);
    setProtein(pProtein);
    setFat(fFat);
    setCalories(pCalories);
  };

  const handleCalorieChange = (updatedCalories: string) => {
    setCalories(updatedCalories);
  };
  const handleCaloriesDeficit = (update: CaloriesDeficit) => {
    setCaloriesDeficit(update);
    const convertedWeight = getDBConvertedWeight(Number(weight));
    const calculated = calculateBMR(
      Number(age),
      height ?? 0,
      Number(convertedWeight),
      gender ?? 'male',
      activityLevel
    ).toFixed(2);
    setCalories(() => {
      const data =
        (calculated && calculated?.length > 0 ? Number(calculated) : 0) +
        getCaloriesSubtractionForDeficit[update];
      if (data > 0) {
        return Math.round(data).toString();
      } else {
        return '0';
      }
    });
  };

  const handleBMRChange = useCallback(
    (
      _activityLevel: ActivityLevelType | undefined,
      _age: number | null,
      _weight: number | undefined,
      _height: number | undefined,
      _gender: GenderType | undefined
    ) => {
      if (_age === null || _height === undefined || _gender === undefined)
        return;
      // Convert height and weight in metric unit system
      const convertedWeight = getDBConvertedWeight(Number(_weight));
      setCalories(
        calculateBMR(
          Number(_age),
          _height,
          Number(convertedWeight),
          _gender,
          _activityLevel
        ).toFixed(2)
      );
    },
    [getDBConvertedWeight]
  );

  const isValidProfile = useCallback(() => {
    return (
      height !== undefined &&
      weight !== undefined &&
      gender !== undefined &&
      age != null
    );
  }, [age, gender, height, weight]);

  const handleAgeChange = useCallback(
    (changedAge: string) => {
      setAge(changedAge.length > 0 ? Number(changedAge).toString() : undefined);
      handleBMRChange(
        activityLevel,
        Number(changedAge),
        Number(weight),
        height,
        gender
      );
    },
    [activityLevel, gender, handleBMRChange, height, weight]
  );

  const handleGenderChange = (updatedGender: GenderType) => {
    setGender(updatedGender);
    handleBMRChange(
      activityLevel,
      Number(age),
      Number(weight),
      height,
      updatedGender
    );
  };

  const handleHeightChange = (updatedHeight: number) => {
    setHeight(updatedHeight);
    handleBMRChange(
      activityLevel,
      Number(age),
      Number(weight),
      updatedHeight,
      gender
    );
  };

  const handleTargetWeight = (updatedValue: string) => {
    setTargetWeight(updatedValue.length > 0 ? updatedValue : undefined);
  };

  const handleTargetWater = (updatedValue: string) => {
    setTargetWater(updatedValue.length > 0 ? updatedValue : undefined);
  };

  const handleWeightChange = useCallback(
    (updatedWeight: string) => {
      setWeight(updatedWeight);
      handleBMRChange(
        activityLevel,
        Number(age),
        Number(updatedWeight),
        height,
        gender
      );
    },
    [activityLevel, age, gender, handleBMRChange, height]
  );
  const handleNameChange = useCallback((updatedName: string) => {
    setName(updatedName);
  }, []);

  const handleActivityLevelChange = useCallback(
    (type: ActivityLevelType) => {
      setActivityLevel(type);
      handleBMRChange(type, Number(age), Number(weight), height, gender);
    },
    [age, gender, handleBMRChange, height, weight]
  );

  const onSavePress = () => {
    if (name === undefined) {
      setName('');
    }

    if (age === undefined) {
      setAge('');
    }

    if (weight === undefined) {
      setWeight('');
    }

    if (weight === undefined || name === undefined || age === undefined) {
      return;
    }

    if (
      activityLevel !== undefined &&
      height !== undefined &&
      weight !== undefined &&
      gender !== undefined &&
      age != null
    ) {
      const data: NutritionProfile = {
        caloriesTarget: Number(calories),
        carbsPercentage: Number(carbs),
        proteinPercentage: Number(protein),
        fatPercentage: Number(fat),
        age: Number(age),
        unitLength: unitLength,
        gender: gender ?? 'male',
        height: height, //cm
        weight:
          unitsWeight === UnitSystem.IMPERIAL
            ? Number(convertPoundsToKG(Number(weight)).toFixed(2))
            : Number(weight), //kg
        targetWeight:
          unitsWeight === UnitSystem.IMPERIAL
            ? Number(convertPoundsToKG(Number(targetWeight ?? 0)).toFixed(2))
            : Number(targetWeight ?? 0), //kg
        targetWater:
          unitsWeight === UnitSystem.IMPERIAL
            ? convertOgToMl(Number(targetWater ?? 0))
            : Number(targetWater ?? 0), //kg
        activityLevel: activityLevel,
        unitsWeight: unitsWeight,
        mealPlan: dietPlan,
        name: name ?? '',
      };

      services.dataService.saveNutritionProfile(data).then(async () => {
        navigator.goBack();
        ShowToast('Profile Saved.');
      });
    } else {
      Alert.alert('Please fill data');
    }
  };

  const onMealPlanChanged = (label: string) => {
    setDietPlan(label);
    let selectedMealPlan = (passioMealPlans ?? []).find(
      (item) => item.mealPlanLabel === label
    );
    if (selectedMealPlan) {
      setCarbs(selectedMealPlan.carbsTarget ?? 0);
      setFat(selectedMealPlan.fatTarget);
      setProtein(selectedMealPlan.proteinTarget);
    }
  };

  const onOpenEditMacroInfo = () => {
    setEditMacroModalShow(true);
  };
  const onCloseEditMacroInfo = () => {
    setEditMacroModalShow(false);
  };

  useEffect(() => {
    if (isFocus) {
      services.dataService.getNutritionProfile().then((profile) => {
        setUnitLength(profile?.unitLength ?? defaultUnitSystem);
        setUnitWeight(profile?.unitsWeight ?? defaultUnitSystem);
        setWeight((_currentWeight) => {
          const weightUnit = profile?.unitsWeight ?? 0;
          let updatedWeight = profile?.weight;
          if (updatedWeight && weightUnit === UnitSystem.IMPERIAL) {
            const lbs = convertKGToPounds(Number(updatedWeight));
            if (!isNaN(lbs)) {
              updatedWeight = Number(Number(lbs)?.toFixed(2));
            }
          }

          if (updatedWeight === undefined) {
            return undefined;
          } else {
            return updatedWeight?.toString();
          }
        });

        setTargetWeight(() => {
          const weightUnit = profile?.unitsWeight ?? 0;
          let updatedWeight = profile?.targetWeight;
          if (updatedWeight && weightUnit === UnitSystem.IMPERIAL) {
            const lbs = convertKGToPounds(Number(updatedWeight));
            if (!isNaN(lbs)) {
              updatedWeight = Number(Number(lbs)?.toFixed(2));
            }
          }

          if (updatedWeight === undefined) {
            return undefined;
          } else {
            return updatedWeight?.toString();
          }
        });
        setTargetWater(() => {
          const weightUnit = profile?.unitsWeight ?? 0;
          let updatedWeight = profile?.targetWater;
          if (updatedWeight && weightUnit === UnitSystem.IMPERIAL) {
            const lbs = convertMlToOg(Number(updatedWeight));
            if (!isNaN(lbs)) {
              updatedWeight = Number(Number(lbs)?.toFixed(2));
            }
          }
          if (updatedWeight === undefined) {
            return undefined;
          } else {
            return updatedWeight?.toString();
          }
        });

        setName(profile?.name);

        if (nutritionProfileRef.current === undefined) {
          setHeight(profile?.height ?? 0);
          setGender(profile?.gender ?? 'male');
          setAge(profile?.age ? profile?.age.toString() : undefined);
          setCalories(String(profile?.caloriesTarget));
          setCarbs(String(profile?.carbsPercentage));
          setProtein(String(profile?.proteinPercentage));
          setFat(String(profile?.fatPercentage));
          setActivityLevel(profile?.activityLevel);
          setDietPlan(profile?.mealPlan);
          setCaloriesDeficit(profile?.caloriesDeficit);
          nutritionProfileRef.current = profile;
        }
      });
    }
  }, [services, isFocus]);

  useEffect(() => {
    function init() {
      PassioSDK.fetchMealPlans().then((item) => {
        if (item) {
          setPassioMealPlans(item);
        }
      });
    }
    init();
  }, []);

  return {
    activityLevel,
    age,
    calories,
    caloriesDeficit,
    carbs,
    fat,
    gender,
    height,
    isEditMacroModalShow,
    isUnitLengthMetric: unitLength === UnitSystem.METRIC,
    isUnitWeightMetric: unitsWeight === UnitSystem.METRIC,
    mealPlan: dietPlan,
    name,
    passioMealPlans,
    protein,
    targetWater,
    targetWeight,
    unitHeight: unitLength,
    unitOfWater: unitsWeight === UnitSystem.METRIC ? 'ml' : 'oz',
    unitOfWeight: unitsWeight === UnitSystem.METRIC ? 'kgs' : 'lbs',
    unitsWeight,
    weight,
    handleActivityLevelChange,
    handleAgeChange,
    handleCalorieChange,
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
  };
}
