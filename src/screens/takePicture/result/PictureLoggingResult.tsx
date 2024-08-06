import React, { useEffect, useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '../../../constants';
import { Text } from '../../../components/texts/Text';
import type { PassioAdvisorFoodInfo } from '@passiolife/nutritionai-react-native-sdk-v3';
import { PictureLoggingResultItemView } from './PictureLoggingResultItemView';
import { BasicButton } from '../../../components';
import { FlatList } from 'react-native-gesture-handler';
import { ICONS } from '../../../assets';
import type { PicturePassioAdvisorFoodInfo } from '../useTakePicture';

interface Props {
  style?: StyleProp<ViewStyle>;
  passioAdvisorFoodInfoResult: Array<PicturePassioAdvisorFoodInfo>;
  onRetake: () => void;
  type: 'camera' | 'picture';
  onLogSelect: (selected: PassioAdvisorFoodInfo[]) => void;
  onCancel: () => void;
  isPreparingLog: boolean;
}

export const PictureLoggingResult = ({
  style,
  passioAdvisorFoodInfoResult,
  type,
  isPreparingLog,
  onRetake,
  onLogSelect,
  onCancel,
}: Props) => {
  const [advisorFoodInfo, setPicturePassioAdvisorFoodInfo] = useState<
    PicturePassioAdvisorFoodInfo[]
  >([]);

  useEffect(() => {
    setPicturePassioAdvisorFoodInfo(passioAdvisorFoodInfoResult);
  }, [passioAdvisorFoodInfoResult]);

  const onFoodSelect = (record: PicturePassioAdvisorFoodInfo) => {
    setPicturePassioAdvisorFoodInfo((item) =>
      item?.map((i) => {
        if (i.recognisedName === record?.recognisedName) {
          return {
            ...i,
            isSelected: !(i.isSelected ?? false),
          };
        } else {
          return i;
        }
      })
    );
  };
  const onClearPress = () => {
    setPicturePassioAdvisorFoodInfo([]);
  };

  const renderNoDataFound = () => {
    return (
      <View style={styles.noDataFound}>
        <Image source={ICONS.bottomMealPlan} />
        <Text>{'No Result Found'}</Text>
      </View>
    );
  };

  const selectedCount = advisorFoodInfo?.filter((i) => i.isSelected).length;

  return (
    <View style={[styles.itemsContainer, style]}>
      <View style={styles.clearBtnView}>
        <TouchableOpacity onPress={onClearPress} style={styles.clearBtn}>
          <Text size="_14px" weight="400" style={styles.clearBtnText}>
            {selectedCount && selectedCount > 0 ? 'Clear' : ''}
          </Text>
        </TouchableOpacity>
      </View>
      {passioAdvisorFoodInfoResult.length > 0 && (
        <Text
          weight="700"
          size="_20px"
          color="text"
          style={styles.quickSuggestionTextStyle}
        >
          {passioAdvisorFoodInfoResult.length === 0
            ? 'No Result found'
            : 'Your Results'}
        </Text>
      )}

      {passioAdvisorFoodInfoResult.length > 0 && (
        <Text
          weight="400"
          size="_14px"
          color="text"
          style={styles.noQuickSuggestionTitle}
        >
          Select the foods you would like to log
        </Text>
      )}
      <FlatList
        style={styles.list}
        data={advisorFoodInfo}
        extraData={advisorFoodInfo}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderNoDataFound}
        renderItem={({ item }) => {
          const foodDataInfo = item.foodDataInfo;
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
              bottom={`${item?.weightGrams} g | ${Math.round(calories)} cal`}
              onFoodLogSelect={() => {
                onFoodSelect(item);
              }}
              isSelected={item.isSelected ?? false}
            />
          );
        }}
      />
      {passioAdvisorFoodInfoResult.length > 0 ? (
        <View style={styles.buttonContainer}>
          <BasicButton
            secondary
            onPress={() => {
              if (type === 'camera') {
                onRetake();
              } else {
                onCancel();
              }
            }}
            style={styles.buttonTryAgain}
            text={type === 'camera' ? 'Retake' : 'Cancel'}
          />
          <BasicButton
            onPress={() => {
              onLogSelect(advisorFoodInfo ?? []);
            }}
            style={styles.buttonLogSelected}
            isLoading={isPreparingLog}
            enable={selectedCount > 0}
            text="Log Selected"
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <BasicButton
            secondary
            onPress={onCancel}
            style={styles.buttonTryAgain}
            text={'Cancel'}
          />
          <BasicButton
            onPress={onRetake}
            style={styles.buttonLogSelected}
            text={type === 'camera' ? 'Retake' : 'Select Image'}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  footer: {},
  noDataFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    alignContent: 'center',
  },
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
