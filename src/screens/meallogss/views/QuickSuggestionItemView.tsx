import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { ICONS } from '../../../assets';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { Text } from '../../../components';

interface Props {
  imageName?: string;
  foodName: string;
  onFoodLogEditor: () => void;
  onFoodLog: () => void;
}

export const QuickSuggestionItemView = (props: Props) => {
  const { foodName, imageName, onFoodLogEditor, onFoodLog } = props;
  return (
    <TouchableOpacity onPress={onFoodLogEditor} style={styles.container}>
      <View style={styles.imageContainer}>
        <PassioFoodIcon
          imageName={imageName}
          style={styles.image}
          passioID={imageName}
          entityType={PassioIDEntityType.group}
        />
      </View>
      <Text
        weight="600"
        size="_12px"
        numberOfLines={2}
        ellipsizeMode="tail"
        style={styles.text}
      >
        {foodName}
      </Text>
      <TouchableOpacity onPress={onFoodLog}>
        <Image source={ICONS.newAddPlus} style={styles.addIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(238, 242, 255, 1)',
    height: 45,
    flex: 1,
    margin: 8,
  },
  imageContainer: {
    width: 32,
    marginLeft: 4,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  image: {
    width: 32,
    aspectRatio: 1,
  },
  addIcon: {
    width: 24,
    alignSelf: 'center',
    margin: 16,
    height: 24,
  },
  text: {
    alignSelf: 'center',
    textTransform: 'capitalize',
    flex: 1,
    marginHorizontal: 5,
    marginRight: 10,
    lineHeight: 16,
  },
});
