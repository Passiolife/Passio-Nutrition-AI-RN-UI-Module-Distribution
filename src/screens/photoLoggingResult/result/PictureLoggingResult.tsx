import React, { useEffect, useState } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { COLORS } from '../../../constants';
import { Text } from '../../../components/texts/Text';
import { BasicButton } from '../../../components';
import { FlatList } from 'react-native-gesture-handler';
import { PictureLoggingResultItemView } from './PictureLoggingResultItemView';
import type { PhotoLoggingResults } from '../usePhotoLogging';
import { scaleHeight, scaleWidth } from '../../../utils';
import { formatNumber } from '../../../utils/NumberUtils';

export const SCANNED_NUTRITION_LABEL = 'Scanned Nutrition Label';

interface Props {
  style?: StyleProp<ViewStyle>;
  passioAdvisorFoodInfoResult: Array<PhotoLoggingResults>;
  onLogSelect: (selected: PhotoLoggingResults[]) => void;
  onCreateRecipePress: (selected: PhotoLoggingResults[]) => void;
  onUpdateMacros: (selected: PhotoLoggingResults[]) => void;
  onEditServingInfo: (selected: PhotoLoggingResults) => void;
  onEditNutritionFact: (selected: PhotoLoggingResults) => void;
  onTryAgain: () => void;
  onCancel: () => void;
  isPreparingLog: boolean;
}

export const PictureLoggingResult = ({
  style,
  passioAdvisorFoodInfoResult,
  isPreparingLog,
  onEditServingInfo,
  onEditNutritionFact,
  onUpdateMacros,
  onLogSelect,
  onTryAgain,
  onCancel,
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
          {'Sorry, we could not find any matches. Please try again'}
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
              foodName={item.resultType ?? ''}
              imageName={item.passioFoodItem?.iconId || foodDataInfo?.iconID}
              type={item.resultType}
              assets={item.assets}
              foodItem={item.passioFoodItem}
              calories={item?.nutrients?.calories?.value}
              carbs={item?.nutrients?.carbs?.value}
              fat={item?.nutrients?.fat?.value}
              protein={item?.nutrients?.protein?.value}
              bottom={`${formatNumber(item.passioFoodItem?.amount.selectedQuantity) || item?.foodDataInfo?.nutritionPreview?.servingQuantity} ${item.passioFoodItem?.amount.selectedUnit || item?.foodDataInfo?.nutritionPreview?.servingUnit} (${Math.round((item.passioFoodItem?.amount.weight.value || item.foodDataInfo?.nutritionPreview?.weightQuantity) ?? 0)} g)`}
              onFoodLogSelect={() => {
                onFoodSelect(item);
              }}
              onEditServingInfo={() => {
                onEditServingInfo(item);
              }}
              onEditNutritionFact={() => {
                onEditNutritionFact(item);
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
            onPress={() => {
              onTryAgain?.();
            }}
            disabled={isPreparingLog}
            style={styles.buttonTryAgain}
            text={'Try Again'}
          />
          <BasicButton
            onPress={() => {
              onLogSelect(advisorFoodInfo ?? []);
            }}
            disabled={isPreparingLog}
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
            onPress={() => {
              onCancel?.();
            }}
            style={styles.buttonTryAgain}
            text={'Cancel'}
          />
          <BasicButton
            onPress={() => {
              onTryAgain?.();
            }}
            style={styles.buttonLogSelected}
            text="Try Again"
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
