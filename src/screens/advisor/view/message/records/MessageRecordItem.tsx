import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { PassioFoodIcon } from '../../../../../components/passio/PassioFoodIcon';
import { Text } from '../../../../../components';
import { ICONS } from '../../../../../assets';

interface Props {
  imageName?: string;
  foodName: string;
  bottom: string;
  onFoodLogEditor?: () => void;
  onFoodLogSelect: () => void;
  isSelected: boolean;
  // That means indvidual item response logged
  isLogged?: boolean;
  // That means whole response logged
  isResponseLogged?: boolean;
}

export const MessageRecordItem = (props: Props) => {
  const {
    foodName,
    imageName,
    onFoodLogSelect,
    isSelected,
    bottom,
    isLogged,
    isResponseLogged,
  } = props;
  return (
    <TouchableOpacity
      disabled={isResponseLogged}
      onPress={onFoodLogSelect}
      style={styles.container}
    >
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
        }}
      >
        <Text weight="500" size="_12px" style={styles.text}>
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
      {isResponseLogged ? (
        <Image
          source={isLogged ? ICONS.Tick : ICONS.CloseRed}
          height={24}
          width={24}
          style={{
            height: 24,
            width: 24,
            marginEnd: 16,
          }}
          resizeMode="contain"
          resizeMethod="resize"
        />
      ) : (
        <TouchableOpacity onPress={onFoodLogSelect}>
          <View
            style={[styles.addIcon, isSelected && styles.selectedAddIcon]}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 242, 255, 1)',
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
    marginStart: 4,
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
