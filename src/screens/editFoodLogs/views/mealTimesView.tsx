import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, SelectBar, Text } from '../../../components';
import { COLORS } from '../../../constants';
import type { MealLabel } from '../../../models';
import { content } from '../../../constants/Content';
import { scaleHeight, scaleWidth } from '../../../utils';

interface Props {
  defaultLabel: MealLabel;
  onPress: (label: MealLabel) => unknown;
}

export const MealTimeView = ({ defaultLabel, onPress }: Props) => {
  const [selectedLabel, setSelectedLabel] = useState<MealLabel>(defaultLabel);

  const onSelectPress = (mealLabel: MealLabel) => {
    setSelectedLabel(mealLabel);
    onPress(mealLabel);
  };

  const styles = stylesObj();

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => onPress(selectedLabel)}>
      <Card style={styles.container}>
        <Text weight="600" size="title" color="text" style={styles.headerText}>
          Meal Time
        </Text>
        <View style={styles.mealsContainer}>
          <SelectBar
            selectedValue={
              selectedLabel as 'breakfast' | 'lunch' | 'dinner' | 'snack'
            }
            onChange={(g) =>
              onSelectPress(
                g.value as 'breakfast' | 'lunch' | 'dinner' | 'snack'
              )
            }
            options={[
              { label: content.breakfast, value: 'breakfast' },
              { label: content.lunch, value: 'lunch' },
              { label: content.dinner, value: 'dinner' },
              { label: content.snack, value: 'snack' },
            ]}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const stylesObj = () =>
  StyleSheet.create({
    container: {
      marginTop: scaleHeight(12),
      paddingHorizontal: scaleWidth(13),
      paddingVertical: scaleHeight(12),
      flexDirection: 'column',
    },
    headerText: {
      marginTop: scaleHeight(8),
    },
    mealsContainer: {
      paddingTop: scaleHeight(12),
      marginVertical: scaleHeight(8),
      flex: 1,
    },
    dateText: {
      color: COLORS.blue,
      fontSize: 15,
      fontWeight: '700',
      alignSelf: 'center',
    },
  });
