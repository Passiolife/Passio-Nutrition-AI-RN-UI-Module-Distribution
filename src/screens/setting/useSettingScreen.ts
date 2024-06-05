import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../contexts';
import {
  UnitSystem,
  WeightUnitSystemToUnitSetting,
  type LengthUnitSetting,
  type NutritionProfile,
  type WeightUnitSetting,
} from '../../models';
import { ShowToast } from '../../utils';
import {
  LengthUnitSettingToUnitSystem,
  LengthUnitSystemToUnitSetting,
  OgMlUnitSystemToUnitSetting,
  WeightUnitSettingToUnitSystem,
} from './../../models/UnitSystem';

const defaultUnitSystem = UnitSystem.IMPERIAL;

export const useSettingScreen = () => {
  const services = useServices();

  const [unitLength, setUnitLength] = useState<LengthUnitSetting>(
    LengthUnitSystemToUnitSetting[defaultUnitSystem]
  );
  const [unitWeight, setUnitWeight] = useState<WeightUnitSetting>(
    WeightUnitSystemToUnitSetting[defaultUnitSystem]
  );

  const [breakfastNotification, setBreakfastNotification] = useState(false);
  const [lunchNotification, setLunchNotification] = useState(false);
  const [dinnerNotification, setDinnerNotification] = useState(false);

  const [nutritionProfile, setNutritionProfile] =
    useState<NutritionProfile | null>(null);

  useEffect(() => {
    services.dataService.getNutritionProfile().then((profile) => {
      if (profile && profile?.unitLength && profile.unitsWeight) {
        setNutritionProfile(profile);
        setUnitLength(LengthUnitSystemToUnitSetting[profile.unitLength]);
        setUnitWeight(WeightUnitSystemToUnitSetting[profile.unitsWeight]);
      }
      setBreakfastNotification(profile?.breakFastNotification ?? false);
      setLunchNotification(profile?.lunchNotification ?? false);
      setDinnerNotification(profile?.dinnerNotification ?? false);
    });
  }, [services, unitWeight]);

  const onUpdateNutritionProfile = (
    updatedWeightSystem: WeightUnitSetting,
    updateLengthSystem: LengthUnitSetting
  ) => {
    if (nutritionProfile) {
      const data: NutritionProfile = {
        ...nutritionProfile,
        unitsWeight: WeightUnitSettingToUnitSystem[updatedWeightSystem],
        unitLength: LengthUnitSettingToUnitSystem[updateLengthSystem],
      };
      setNutritionProfile(data);
      services.dataService.saveNutritionProfile(data).then(async () => {
        ShowToast('Update Unit of weight');
      });
    }
  };

  const onWeightUnitPress = (updatedSystem: WeightUnitSetting) => {
    setUnitWeight(updatedSystem);
    onUpdateNutritionProfile(updatedSystem, unitLength);
  };

  const onLengthUnitPress = (updatedSystem: LengthUnitSetting) => {
    setUnitLength(updatedSystem);
    onUpdateNutritionProfile(unitWeight, updatedSystem);
  };

  const onUpdateBreakfast = () => {
    if (nutritionProfile) {
      const updated = !breakfastNotification;
      const data: NutritionProfile = {
        ...nutritionProfile,
        breakFastNotification: updated,
      };
      setBreakfastNotification(updated);
      setNutritionProfile(data);
      services.dataService.saveNutritionProfile(data).then(async () => {
        ShowToast('Update breakfast notification');
      });

      if (updated) {
        scheduleMealNotification(8, 0, 'Breakfast');
      }
    }
  };

  const onUpdateLunch = () => {
    if (nutritionProfile) {
      const updated = !lunchNotification;
      const data: NutritionProfile = {
        ...nutritionProfile,
        lunchNotification: updated,
      };
      setLunchNotification(updated);
      setNutritionProfile(data);
      services.dataService.saveNutritionProfile(data).then(async () => {
        ShowToast('Update lunch notification');
      });
      if (updated) {
        scheduleMealNotification(12, 0, 'Lunch');
      }
    }
  };
  const onUpdateDinner = () => {
    if (nutritionProfile) {
      const updated = !dinnerNotification;
      const data: NutritionProfile = {
        ...nutritionProfile,
        dinnerNotification: updated,
      };
      setDinnerNotification(updated);
      setNutritionProfile(data);
      services.dataService.saveNutritionProfile(data).then(async () => {
        ShowToast('Update dinner notification');
      });
      if (updated) {
        scheduleMealNotification(17, 0, 'Dinner');
      }
    }
  };

  const scheduleNotification = useCallback(
    async ({
      title,
      body,
      timestamp,
    }: {
      title: string;
      body: string;
      timestamp: number;
    }) => {
      await notifee.requestPermission();
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.createTriggerNotification(
        {
          title: title,
          body: body,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: timestamp,
        }
      );
    },
    []
  );

  const scheduleMealNotification = useCallback(
    async (hour: number, minute: number, message: string) => {
      const now = new Date();
      const mealTime = new Date();
      mealTime.setHours(hour, minute, 0);
      // If the time has already passed for today, schedule for tomorrow
      if (mealTime <= now) {
        mealTime.setDate(mealTime.getDate() + 1);
      }

      scheduleNotification({
        title: `${message} Time!`,
        body: `Time for ${message.toLowerCase()}!`,
        timestamp: mealTime.getTime(),
      });
    },
    [scheduleNotification]
  );

  return {
    unitLength,
    unitWeight,
    onLengthUnitPress,
    onWeightUnitPress,
    isImperialWeight:
      WeightUnitSettingToUnitSystem[unitWeight] === UnitSystem.IMPERIAL,
    ogMlLabel:
      OgMlUnitSystemToUnitSetting[WeightUnitSettingToUnitSystem[unitWeight]],
    weightLabel: unitWeight,
    onUpdateLunch,
    onUpdateBreakfast,
    onUpdateDinner,
    lunchNotification,
    breakfastNotification,
    dinnerNotification,
  };
};
