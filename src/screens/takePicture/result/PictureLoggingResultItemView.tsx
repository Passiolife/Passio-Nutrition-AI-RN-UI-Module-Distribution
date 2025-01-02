import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { Text } from '../../../components';

interface Props {
  imageName?: string;
  foodName: string;
  bottom: string;
  onFoodLogEditor?: () => void;
  onFoodLogSelect: () => void;
  isSelected: boolean;
}

export const PictureLoggingResultItemView = (props: Props) => {
  const { foodName, imageName, onFoodLogSelect, isSelected, bottom } = props;
  return (
    <TouchableOpacity onPress={onFoodLogSelect} style={styles.container}>
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
        <Text weight="700" size="_12px" style={styles.text}>
          {foodName}
        </Text>
        <Text
          weight="400"
          size="_12px"
          style={[styles.bottom, styles.secondaryText]}
        >
          {bottom}
        </Text>
      </View>
      <TouchableOpacity onPress={onFoodLogSelect}>
        <View style={[styles.addIcon, isSelected && styles.selectedAddIcon]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#00000029',
    shadowOpacity: 1,
    shadowOffset: {
      width: 1.0,
      height: 1.0,
    },
    shadowRadius: 0.5,
    elevation: 1,
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
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  text: {
    textTransform: 'capitalize',
    marginStart: 16,
    marginVertical: 2,
    marginRight: 10,
  },
  bottom: {
    marginStart: 16,
    marginVertical: 2,
    marginRight: 10,
  },
  selectedAddIcon: {
    borderWidth: 1,
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  secondaryText: {},
});
