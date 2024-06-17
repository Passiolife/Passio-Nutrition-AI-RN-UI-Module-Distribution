import React, { useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../../constants';
import { Text } from '../../../components/texts/Text';
import type { PassioAdvisorFoodInfo } from '@passiolife/nutritionai-react-native-sdk-v3';
import { PictureLoggingResultItemView } from './PictureLoggingResultItemView';
import { BasicButton } from '../../../components';
import { FlatList } from 'react-native-gesture-handler';

interface Props {
  style?: StyleProp<ViewStyle>;
  passioAdvisorFoodInfoResult: Array<PassioAdvisorFoodInfo>;
  onRetake: () => void;
  onLogSelect: (selected: PassioAdvisorFoodInfo[]) => void;
}

export const PictureLoggingResult = ({
  style,
  passioAdvisorFoodInfoResult,
  onRetake,
  onLogSelect,
}: Props) => {
  const [selected, setSelected] = useState<PassioAdvisorFoodInfo[]>([]);

  const onFoodSelect = (result: PassioAdvisorFoodInfo) => {
    const find = selected?.find(
      (item) => item.recognisedName === result?.recognisedName
    );
    if (find) {
      setSelected((item) =>
        item?.filter((i) => i.recognisedName !== result?.recognisedName)
      );
    } else {
      setSelected((item) => [...(item ?? []), result]);
    }
  };

  const onClearPress = () => {
    setSelected([]);
  };

  return (
    <View style={[styles.itemsContainer, style]}>
      <View style={styles.clearBtnView}>
        <TouchableOpacity onPress={onClearPress} style={styles.clearBtn}>
          <Text size="_14px" weight="400" style={styles.clearBtnText}>
            {selected && selected.length > 0 ? 'Clear' : ''}
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        weight="700"
        size="_20px"
        color="text"
        style={styles.quickSuggestionTextStyle}
      >
        Your Results
      </Text>
      <Text
        weight="400"
        size="_14px"
        color="text"
        style={styles.noQuickSuggestionTitle}
      >
        Select the foods you would like to log
      </Text>
      <FlatList
        style={styles.list}
        data={passioAdvisorFoodInfoResult}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const foodDataInfo = item.foodDataInfo;
          const isSelected =
            selected?.find(
              (it) => it?.recognisedName === item?.recognisedName
            ) !== undefined;

          const npCalories =
            item?.foodDataInfo?.nutritionPreview?.calories ?? 0;
          const npWeightQuantity =
            item?.foodDataInfo?.nutritionPreview?.weightQuantity ?? 0;
          const ratio = npCalories / npWeightQuantity;
          const advisorInfoWeightGram = item?.weightGrams ?? 0;
          const calories = ratio * advisorInfoWeightGram;

          return (
            <PictureLoggingResultItemView
              foodName={item?.recognisedName}
              imageName={foodDataInfo?.iconID}
              bottom={`${item?.portionSize} | ${Math.round(calories)} cal`}
              onFoodLogSelect={() => {
                onFoodSelect(item);
              }}
              isSelected={isSelected}
            />
          );
        }}
      />

      <View style={styles.buttonContainer}>
        <BasicButton
          secondary
          onPress={onRetake}
          style={styles.buttonTryAgain}
          text="Retake"
        />
        <BasicButton
          onPress={() => {
            onLogSelect(selected ?? []);
          }}
          style={styles.buttonLogSelected}
          enable={selected && selected.length > 0}
          text="Log Selected"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  footer: {},
  list: {
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 16,
    flex: 1,
  },
  quickSuggestionTextStyle: {
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  noQuickSuggestionTitle: {
    paddingHorizontal: 16,
    marginBottom: 5,
    alignSelf: 'center',
    marginTop: 4,
  },
  noQuickSuggestionDescriptions: {
    fontSize: 15,
    alignSelf: 'center',
    textAlign: 'justify',
    fontWeight: '400',
    paddingHorizontal: 32,
    color: COLORS.grey7,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  buttonTryAgain: { flex: 1, marginStart: 16, marginEnd: 8 },
  buttonLogSelected: { flex: 1, marginEnd: 16, marginStart: 8 },
  clearBtnView: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  clearBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  clearBtnText: {
    textDecorationLine: 'underline',
    color: '#4F46E5',
  },
  contentView: {
    alignItems: 'center',
    marginVertical: 20,
  },
  contentText: {
    color: '#4F46E5',
  },
  micIcon: {
    height: 20,
    width: 20,
  },
});
