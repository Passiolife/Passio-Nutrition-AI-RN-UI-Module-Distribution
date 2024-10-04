import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useBranding } from '../../contexts';
import type { Branding } from '../../contexts';
import { scaledSize, scaled, scaleWidth, scaleHeight } from '../../utils';
import { Card } from '../cards';
import { Text } from '../texts';

interface WidgetsCardProps {
  widgetTitle: string;
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  unitValue?: string;
  remain?: number;
  value: string | number;
  onPressRightIcon?: () => void;
  onPressLeftIcon?: () => void;
}

export const WidgetsCard = ({
  widgetTitle,
  leftIcon,
  rightIcon,
  value,
  unitValue,
  remain,
  onPressRightIcon,
  onPressLeftIcon,
}: WidgetsCardProps) => {
  const styles = WidgetsCardStyle(useBranding());
  return (
    <Card style={styles.widgetContainer}>
      <Pressable onPress={onPressRightIcon && onPressRightIcon}>
        <View style={[styles.header, styles.row]}>
          <View style={styles.row}>
            {leftIcon ? (
              <TouchableOpacity onPress={onPressLeftIcon && onPressLeftIcon}>
                <Image
                  source={leftIcon}
                  resizeMode="contain"
                  style={styles.icon}
                />
              </TouchableOpacity>
            ) : undefined}
            <Text weight="600" size="title" color="text" style={styles.title}>
              {widgetTitle}
            </Text>
          </View>
          {rightIcon ? (
            <TouchableOpacity onPress={onPressRightIcon && onPressRightIcon}>
              <Image
                source={rightIcon}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          ) : undefined}
        </View>
        <View style={styles.contentView}>
          <Text weight="800" size="_28px" color="primaryColor">
            {value}
          </Text>
          <Text weight="400" size="_16px" color="gray500">
            {unitValue}
          </Text>
        </View>
        <View>
          <Text
            weight="400"
            size="_12px"
            color="text"
            style={styles.bottomText}
          >
            <Text weight="600" size="_12px" color="text">
              {remain && remain > 0 ? remain : 0}
            </Text>
            <Text>&nbsp;</Text>
            <Text weight="600" size="_12px" color="text">
              {unitValue}
            </Text>
            <Text>&nbsp;</Text>
            remain to daily goal
          </Text>
        </View>
      </Pressable>
    </Card>
  );
};

const WidgetsCardStyle = ({ primaryColor }: Branding) =>
  StyleSheet.create({
    widgetContainer: {
      borderRadius: scaledSize(8),
      padding: scaledSize(16),
      flex: 1,
      marginVertical: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    header: {
      justifyContent: 'space-between',
    },
    icon: {
      ...scaled(24),
      tintColor: primaryColor,
    },
    title: {
      marginLeft: scaleWidth(8),
    },
    contentView: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginVertical: scaleHeight(16),
      alignItems: 'baseline',
      columnGap: 2,
    },
    bottomText: {
      textAlign: 'center',
    },
  });
