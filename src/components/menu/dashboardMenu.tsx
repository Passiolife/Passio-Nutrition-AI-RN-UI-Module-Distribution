import React, { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useBranding } from '../../contexts';
import { ICONS } from '../../assets';
import menuStyle from './menu.styles';
import { TutorialView } from '../tutorial/Tutorial';
import type { ScreenNavigationProps } from '../../navigaitons/HomeBottomNavigations';
import { useNavigation } from '@react-navigation/native';
import { OnboardingScreenRoute } from '../../navigaitons/Route';

type MenuType = 'My Profile' | 'Settings';
interface Props {
  hide?: MenuType[];
}

export const DashboardMenu = ({ hide }: Props) => {
  const branding = useBranding();
  const styles = menuStyle(branding);

  const [isOpenMen, setOpenMenu] = useState(false);

  const navigation = useNavigation<ScreenNavigationProps>();

  const options = [
    {
      icon: ICONS.dashboardMenuProfile,
      title: 'My Profile',
      onPress: () => {
        setOpenMenu(false);
        navigation.navigate('ProfileScreen');
      },
    },
    {
      icon: ICONS.dashboardMenuTutorial,
      title: 'Tutorials',
      onPress: () => {
        setOpenMenu(false);
        navigation.navigate(OnboardingScreenRoute);
      },
    },
    {
      icon: ICONS.dashboardMenuSetting,
      title: 'Settings',
      onPress: () => {
        setOpenMenu(false);
        navigation.navigate('SettingScreen', {});
      },
    },
  ].filter((item) => !hide?.includes(item.title as any));

  const render = () => {
    return (
      <TutorialView
        onClose={() => {
          setOpenMenu(false);
        }}
        isStepActive={isOpenMen}
        options={options}
      >
        <TouchableOpacity
          onPress={() => {
            setOpenMenu(true);
          }}
          style={styles.main}
        >
          <Image source={ICONS.hamburger} style={[styles.icon]} />
        </TouchableOpacity>
      </TutorialView>
    );
  };
  return render();
};
