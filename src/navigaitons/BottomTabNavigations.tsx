import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { Branding } from '../contexts';
import { scaleHeight, scaleWidth, scaledSize } from '../utils';

export type MenuType = 'Home' | 'Diary' | 'Blank' | 'MealPlan' | 'Progress';

export interface BottomNavTab {
  title: string;
  icon: number;
  selectedIcon: number;
  type: MenuType;
}

export interface TabBarProps extends BottomTabBarProps {
  items: BottomNavTab[];
  onFoodScanner: () => void;
  onTextSearch: () => void;
  onFavorite: () => void;
  onVoiceLogging: () => void;
  onTakePicture: () => void;
  onTakeCamera: () => void;
  onAiAdvisor: () => void;
  onMyFoods: () => void;
}

export const renderTabBarIcons = (
  icon: number,
  isFocused: boolean,
  color: Branding
) => {
  const styles = bottomTabStyle(color);
  return (
    <Image
      source={icon}
      style={isFocused ? styles.tabSelctedIcon : styles.tabIcon}
    />
  );
};

export const bottomTabStyle = ({
  white,
  primaryColor,
  border,
  footer,
}: Branding) => {
  const styles = StyleSheet.create({
    tabBarContainer: {
      alignItems: 'center',
      backgroundColor: footer,
      borderColor: border,
      borderWidth: Platform.OS === 'android' ? 0.2 : 0,
      borderTopColor: border,
      elevation: 16,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingBottom: scaleHeight(10),
      paddingHorizontal: scaleWidth(8),
      shadowColor: '#00000029',
      shadowOffset: {
        height: -10,
        width: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8.0,
    },
    tabBarItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    tabIcon: {
      backgroundColor: 'transparent',
      borderRadius: 16,
      marginBottom: scaleHeight(8),
      marginTop: scaleHeight(8),
      paddingHorizontal: 8,
      height: scaleHeight(24),
      width: scaleWidth(24),
      tintColor: '#9CA3AF',
    },
    tabItemText: {},
    addPlusContainer: {
      height: scaleHeight(52),
      borderRadius: scaleWidth(52),
      width: scaleWidth(52),
      justifyContent: 'center',
      backgroundColor: primaryColor,
      transform: [
        {
          translateY: -scaledSize(30),
        },
      ],
    },
    addPlus: {
      tintColor: white,
      height: scaleHeight(24),
      width: scaleWidth(24),
      alignSelf: 'center',
      justifyContent: 'center',
    },
    tabSelctedIcon: {
      borderRadius: 16,
      tintColor: primaryColor,
      marginBottom: scaleHeight(8),
      marginTop: scaleHeight(8),
      paddingHorizontal: 8,
      height: scaleHeight(24),
      width: scaleWidth(24),
    },
  });
  return styles;
};
