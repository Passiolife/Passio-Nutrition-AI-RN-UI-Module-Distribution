import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ICONS } from '../../../../assets';
import { Card } from '../../../../components';
import { Text } from '../../../../components/texts/Text';
import { scaleHeight, scaleWidth } from '../../../../utils';
import { convertOgToMl } from '../../../../screens/nutritionProfile/unitConversions';
import type { Branding } from '../../../../contexts';
import { useBranding } from '../../../../contexts';

export const QuickAddTracking = ({
  onPress,
  label,
  isImperial,
}: {
  onPress: (val: number) => void;
  isImperial: boolean;
  label: string;
}) => {
  const quickAddData = [
    {
      id: 0,
      add: isImperial ? 8 : convertOgToMl(8),
      title: 'Glass',
      imageSrc: ICONS.blueGlassSmall,
    },
    {
      id: 1,
      add: isImperial ? 16 : convertOgToMl(16),
      title: 'Sm Bottle',
      imageSrc: ICONS.blueGlassMedium,
    },
    {
      id: 2,
      add: isImperial ? 24 : convertOgToMl(24),
      title: 'Lg Bottle',
      imageSrc: ICONS.blueGlassLarge,
    },
  ];

  const branding = useBranding();
  const styles = quickAddStyle(branding);

  return (
    <Card style={styles.itemsContainer}>
      <Text
        weight="600"
        size="title"
        color="text"
        style={styles.quickAddTextStyle}
      >
        Quick Add
      </Text>
      <View style={styles.quickAddList}>
        {quickAddData.map((item, _index) => {
          return (
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => onPress(item.add)}
            >
              <Image
                source={item.imageSrc}
                style={[styles.glassImg, styles.iconColor]}
                resizeMode="contain"
              />
              <Text
                adjustsFontSizeToFit
                allowFontScaling
                style={styles.contentText}
              >
                {item.title + '\n'}
                <Text
                  adjustsFontSizeToFit
                  allowFontScaling
                  color="secondaryText"
                >{`(${Math.round(item.add)} ${label})`}</Text>
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
};

const quickAddStyle = ({ primaryColor }: Branding) =>
  StyleSheet.create({
    itemsContainer: {
      backgroundColor: 'white',
      marginVertical: scaleHeight(16),
    },
    list: {
      marginHorizontal: scaleWidth(16),
      marginVertical: scaleHeight(16),
    },
    quickAddTextStyle: {
      marginTop: scaleHeight(20),
      paddingHorizontal: scaleWidth(16),
    },
    noQuickAddTitle: {
      paddingHorizontal: scaleWidth(16),
      marginBottom: scaleHeight(16),
      alignSelf: 'center',
    },
    glassImg: {
      height: scaleHeight(58),
      aspectRatio: 0.5,
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
    },
    iconColor: {
      tintColor: primaryColor,
    },
    imageContainer: {
      alignItems: 'center',
      flex: 1,
      alignSelf: 'center',
    },
    contentText: {
      marginTop: scaleHeight(12),
      textAlign: 'center',
    },
    quickAddList: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
      alignItems: 'center',
      marginHorizontal: scaleWidth(8),
      marginVertical: scaleHeight(24),
    },
  });
