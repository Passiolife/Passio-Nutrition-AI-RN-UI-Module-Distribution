import { useState } from 'react';
import { useBranding } from '../../contexts';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';

export type MYFoodScreensType = 'Custom Foods' | 'Recipe';
export const MYFoodScreens: MYFoodScreensType[] = ['Custom Foods', 'Recipe'];
export type ScreenNavigationProps = StackNavigationProp<
  ParamList,
  'MyFoodsScreen'
>;

export const useMyFoodScreen = () => {
  const branding = useBranding();
  const [tab, setTab] = useState(MYFoodScreens[0]);

  return {
    branding,
    tab,
    setTab,
  };
};
