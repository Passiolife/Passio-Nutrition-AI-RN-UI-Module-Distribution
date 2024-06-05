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

export const VoiceLoggingResultItemView = (props: Props) => {
  const { foodName, imageName, onFoodLogSelect, isSelected, bottom } = props;
  return (
    <TouchableOpacity onPress={onFoodLogSelect} style={styles.container}>
      <View style={styles.imageContainer}>
        <PassioFoodIcon
          imageName={imageName}
          style={styles.image}
          passioID={imageName}
          entityType={PassioIDEntityType.group}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Text weight="600" size="_12px" style={[styles.text]}>
          {foodName}
        </Text>
        <Text
          weight="400"
          size="_12px"
          style={[styles.text, styles.secondaryText]}
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
    justifyContent: 'center',
    backgroundColor: 'rgba(238, 242, 255, 1)',
    flex: 1,
    margin: 8,
    paddingVertical: 8,
    borderRadius: 8,
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
    flex: 1,
    marginRight: 10,
  },
  selectedAddIcon: {
    borderWidth: 1,
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  secondaryText: {
    marginTop: -4,
  },
});
