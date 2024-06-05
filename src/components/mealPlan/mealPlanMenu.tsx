import React, { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useBranding } from '../../contexts';
import { ICONS } from '../../assets';
import menuStyle from './menu.styles';
import { TutorialView, type Options } from '../tutorial/Tutorial';
import type { PassioMealPlan } from '@passiolife/nutritionai-react-native-sdk-v3';

interface Props {
  plan?: PassioMealPlan[];
  onPress?: (item: PassioMealPlan) => void;
}

export const MealPlanMenu = ({ plan, onPress }: Props) => {
  const branding = useBranding();
  const styles = menuStyle(branding);

  const [isOpenMen, setOpenMenu] = useState(false);

  const render = () => {
    return (
      <TutorialView
        onClose={() => {
          setOpenMenu(false);
        }}
        isStepActive={isOpenMen}
        options={(plan ?? []).map((item) => {
          const options: Options = {
            icon: undefined,
            onPress: () => {
              setOpenMenu(false);
              onPress?.(item);
            },
            title: item.mealPlanTitle,
          };
          return options;
        })}
      >
        <TouchableOpacity
          onPress={() => {
            setOpenMenu(true);
          }}
          style={styles.main}
        >
          <Image source={ICONS.menu} style={styles.icon} />
        </TouchableOpacity>
      </TutorialView>
    );
  };
  return render();
};
