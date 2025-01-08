import React, { useEffect, useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  Image,
} from 'react-native';

import { COLORS } from '../../../constants';
import { Text } from '../../../components/texts/Text';
import { BasicButton } from '../../../components';
import { FlatList } from 'react-native-gesture-handler';
import type { PicturePassioAdvisorFoodInfo } from '../../takePicture/useTakePicture';
import { PictureLoggingResultItemView } from './PictureLoggingResultItemView';
import { PhotoLoggingResults } from '../usePhotoLogging';
import { scaleHeight, scaleWidth } from '../../../utils';

export const SCANNED_NUTRITION_LABEL = 'Scanned Nutrition Label';

interface Props {
  style?: StyleProp<ViewStyle>;
  passioAdvisorFoodInfoResult: Array<PhotoLoggingResults>;
  onLogSelect: (selected: PhotoLoggingResults[]) => void;
  onUpdateMacros: (selected: PhotoLoggingResults[]) => void;
  onEditServingInfo: (selected: PhotoLoggingResults) => void;
  isPreparingLog: boolean;
}

export const PictureLoggingResult = ({
  style,
  passioAdvisorFoodInfoResult,
  isPreparingLog,
  onEditServingInfo,
  onUpdateMacros,
  onLogSelect,
}: Props) => {
  const [advisorFoodInfo, setPicturePassioAdvisorFoodInfo] = useState<
    PhotoLoggingResults[]
  >([]);

  useEffect(() => {
    setPicturePassioAdvisorFoodInfo(passioAdvisorFoodInfoResult);
  }, [passioAdvisorFoodInfoResult]);

  const onFoodSelect = (record: PhotoLoggingResults) => {
    setPicturePassioAdvisorFoodInfo((item) => {
      const updated = item?.map((i) => {
        if (i.uuID === record?.uuID) {
          return {
            ...i,
            isSelected: !(i.isSelected ?? false),
          };
        } else {
          return i;
        }
      });

      onUpdateMacros?.(updated);
      return updated;
    });
  };
  const renderNoDataFound = () => {
    return (
      <View style={styles.noDataFound}>
        <Text
          style={{
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {'No Result Found'}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginHorizontal: scaleWidth(24),
            marginVertical: scaleHeight(16),
          }}
        >
          {
            'Sorry, we could not find any matches. Please try again, scan the nutrition facts'
          }
        </Text>
      </View>
    );
  };

  const selectedCount = advisorFoodInfo?.filter((i) => i.isSelected).length;

  return (
    <View style={[styles.itemsContainer, style]}>
      <FlatList
        style={styles.list}
        data={advisorFoodInfo}
        extraData={advisorFoodInfo}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderNoDataFound}
        renderItem={({ item }) => {
          const foodDataInfo = item.foodDataInfo;
          return (
            <PictureLoggingResultItemView
              foodName={
                item.passioFoodItem?.name ||
                item?.foodDataInfo?.foodName ||
                item?.recognisedName ||
                (item.resultType === 'nutritionFacts'
                  ? SCANNED_NUTRITION_LABEL
                  : '')
              }
              imageName={item.passioFoodItem?.iconId || foodDataInfo?.iconID}
              calories={
                item?.nutrients?.calories?.value ||
                foodDataInfo?.nutritionPreview?.calories ||
                0
              }
              carbs={
                item?.nutrients?.carbs?.value ||
                foodDataInfo?.nutritionPreview?.carbs ||
                0
              }
              fat={
                item?.nutrients?.fat?.value ||
                foodDataInfo?.nutritionPreview?.fat ||
                0
              }
              protein={
                item?.nutrients?.protein?.value ||
                foodDataInfo?.nutritionPreview?.protein ||
                0
              }
              bottom={`${item.passioFoodItem?.amount.selectedQuantity || item?.foodDataInfo?.nutritionPreview?.servingQuantity} ${item.passioFoodItem?.amount.selectedUnit || item?.foodDataInfo?.nutritionPreview?.servingUnit} (${Math.round((item.passioFoodItem?.amount.weight.value || item.foodDataInfo?.nutritionPreview?.weightQuantity) ?? 0)} g)`}
              onFoodLogSelect={() => {
                onFoodSelect(item);
              }}
              onEditServingInfo={() => {
                onEditServingInfo(item);
              }}
              isSelected={item.isSelected ?? false}
            />
          );
        }}
      />
      {advisorFoodInfo?.length > 0 ? (
        <View style={styles.buttonContainer}>
          <BasicButton
            secondary
            onPress={() => {}}
            style={styles.buttonTryAgain}
            text={'Create Recipe'}
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
            onPress={() => {}}
            style={styles.buttonTryAgain}
            text={'Try Again'}
          />
          <BasicButton
            onPress={() => {
              onLogSelect(advisorFoodInfo ?? []);
            }}
            style={styles.buttonLogSelected}
            isLoading={isPreparingLog}
            enable={selectedCount > 0}
            text="Scan Nutrition Fact"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
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
    marginHorizontal: 8,
    marginBottom: 20,
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
    marginBottom: 16,
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
