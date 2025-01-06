import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { Text } from '../../../components';
import { formatNumber } from '../../../utils/NumberUtils';
import { scaleWidth } from '../../../utils';

interface Props {
  imageName?: string;
  foodName: string;
  bottom: string;
  onFoodLogEditor?: () => void;
  onFoodLogSelect: () => void;
  onEditServingInfo: () => void;
  isSelected: boolean;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
}

export const PictureLoggingResultItemView = (props: Props) => {
  const {
    foodName,
    imageName,
    onFoodLogSelect,
    isSelected,
    bottom,
    onEditServingInfo,
  } = props;
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onEditServingInfo} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <PassioFoodIcon
              style={styles.image}
              iconID={imageName}
              entityType={PassioIDEntityType.group}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text weight="600" size="_14px" style={styles.text}>
              {foodName}
            </Text>
            <Text
              weight="400"
              color="secondaryText"
              size="_14px"
              style={[styles.bottom, styles.secondaryText]}
            >
              {bottom}
            </Text>
          </View>
        </View>
        <View style={styles.allNutrientsContainer}>
          <View style={styles.nutrientsContainer}>
            <Text weight="600" color="calories">
              {formatNumber(props.calories)}
            </Text>
            <Text style={styles.unit} color="secondaryText" weight="400">
              cal
            </Text>
          </View>
          <View style={styles.nutrientsContainer}>
            <Text size="_16px" weight="600" color="carbs">
              {formatNumber(props.carbs)}
            </Text>
            <Text style={styles.unit} color="secondaryText" weight="400">
              g
            </Text>
          </View>
          <View style={styles.nutrientsContainer}>
            <Text size="_16px" weight="600" color="proteins">
              {formatNumber(props.protein)}
            </Text>
            <Text style={styles.unit} color="secondaryText" weight="400">
              g
            </Text>
          </View>
          <View style={styles.nutrientsContainer}>
            <Text size="_16px" weight="600" color="fat">
              {formatNumber(props.fat)}
            </Text>
            <Text
              style={styles.unit}
              size="_16px"
              color="secondaryText"
              weight="400"
            >
              g
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onFoodLogSelect} style={styles.radioPress}>
        <View style={styles.radioContainer}>
          <View
            style={[styles.addIcon, isSelected && styles.selectedAddIcon]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#00000029',
    shadowOpacity: 1,
    shadowOffset: {
      width: 1.0,
      height: 2.0,
    },
    shadowRadius: 0.5,
    elevation: 1,
  },
  radioPress: {
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  radioContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nutrientsContainer: {
    flexDirection: 'row',
    marginStart: 16,
  },
  allNutrientsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  imageContainer: {
    width: 42,
    marginLeft: 8,
    borderRadius: 32,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  image: {
    width: 42,
    height: 42,
    aspectRatio: 1,
  },
  addIcon: {
    width: 24,
    height: 24,
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  text: {
    textTransform: 'capitalize',
    marginStart: 8,
    marginVertical: 2,
    marginRight: 10,
  },
  bottom: {
    marginStart: 8,
    marginVertical: 2,
    marginRight: 10,
  },
  selectedAddIcon: {
    borderWidth: 1,
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  secondaryText: {},
  unit: {
    marginStart: scaleWidth(4),
  },
});
