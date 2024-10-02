import { useState } from 'react';
import { useBranding } from '../../contexts';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { RouteProp, useRoute } from '@react-navigation/native';

export type MYFoodScreensType = 'Custom Foods' | 'Recipe';
export const MYFoodScreens: MYFoodScreensType[] = ['Custom Foods', 'Recipe'];
export type ScreenNavigationProps = StackNavigationProp<
  ParamList,
  'MyFoodsScreen'
>;

export const useMyFoodScreen = () => {
  const branding = useBranding();
  const { params } = useRoute<RouteProp<ParamList, 'MyFoodsScreen'>>();
  const [tab, setTab] = useState(
    MYFoodScreens[params?.tab === 'Recipe' ? 1 : 0]
  );

  return {
    branding,
    tab,
    setTab,
    selectedTab: params.tab === 'Recipe' ? MYFoodScreens[1] : undefined,
  };
};
