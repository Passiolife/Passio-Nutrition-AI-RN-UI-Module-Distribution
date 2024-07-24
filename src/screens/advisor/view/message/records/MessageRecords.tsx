import React, { useState } from 'react';
import {
  type StyleProp,
  View,
  type ViewStyle,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { BasicButton, Text } from '../../../../../components';
import type {
  AdvisorResponse,
  Selection,
} from '../../../model/advisorResponse';
import { ICONS } from '../../../../../assets';
import { MessageRecordItem } from './MessageRecordItem';
import { useBranding } from '../../../../../contexts';
import { getUpdatedCaloriesOfPassioAdvisorFoodInfo } from '../../../../../utils';

interface Props {
  style?: StyleProp<ViewStyle>;
  response: AdvisorResponse;
  onLogSelect?: (
    response: AdvisorResponse,
    select: Selection[]
  ) => Promise<void>;
  onViewDiary: () => void;
}

export const MessageRecords = ({
  style,
  onLogSelect,
  onViewDiary,
  response,
}: Props) => {
  const branding = useBranding();
  const { records = [] } = response;
  const [selected, setSelected] = useState<Selection[]>(records);

  const onFoodSelect = (result: Selection) => {
    const find = selected?.find((item) => item.index === result?.index);
    if (find) {
      setSelected((item) => item?.filter((i) => i.index !== result?.index));
    } else {
      setSelected((item) => [...(item ?? []), result]);
    }
  };

  const renderNoDataFound = () => {
    return (
      <View style={styles.noDataFound}>
        <Image source={ICONS.bottomMealPlan} />
        <Text>{'No Result Found'}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.itemsContainer, style]}>
      <Text
        weight="400"
        size="_14px"
        color="white"
        style={styles.quickSuggestionTextStyle}
      >
        {response.isLogged
          ? 'I’ve add the items below to your log:'
          : response.recordType === 'searchTool'
            ? 'Here are the items from the recipe above'
            : 'Based on the image you took, I’ve recognized the following items. Please select the items you want and log them.'}
      </Text>
      <FlatList
        style={styles.list}
        data={records}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderNoDataFound}
        renderItem={({ item, index }) => {
          const foodDataInfo = item.foodDataInfo;
          const isSelected =
            selected?.find((it) => it?.index === index) !== undefined;
          const { calories } = getUpdatedCaloriesOfPassioAdvisorFoodInfo(item);
          return (
            <MessageRecordItem
              foodName={item?.recognisedName}
              imageName={foodDataInfo?.iconID}
              bottom={`${item?.portionSize} | ${Math.round(calories)} cal`}
              onFoodLogSelect={() => {
                if (response.isLogged) {
                  return;
                }
                onFoodSelect({ ...item, index: index });
              }}
              isLogged={item.isLogged}
              isResponseLogged={response.isLogged}
              isSelected={isSelected}
            />
          );
        }}
      />

      {records.length > 0 && (
        <View style={styles.buttonContainer}>
          <BasicButton
            onPress={() => {
              if (response.isLogged) {
                onViewDiary?.();
              } else {
                onLogSelect?.(response, selected ?? []);
              }
            }}
            backgroundColor={branding.backgroundColor}
            boarderColor={branding.backgroundColor}
            textColor={branding.primaryColor}
            style={[
              styles.buttonLogSelected,
              {
                opacity: selected.length === 0 ? 0.5 : 1,
              },
            ]}
            enable={selected && selected.length > 0}
            disabled={selected.length === 0}
            isLoading={response.isLoading}
            text={response?.isLogged ? 'View Diary' : 'Log Selected'}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    backgroundColor: '#6366F1',
    flex: 1,
    marginEnd: 40,
    marginVertical: 16,
    borderEndEndRadius: 12,
    borderStartEndRadius: 12,
    borderTopStartRadius: 12,
  },
  noDataFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  list: {
    marginHorizontal: 16,
    marginVertical: 20,
    flex: 1,
  },
  quickSuggestionTextStyle: {
    alignSelf: 'center',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  buttonLogSelected: {
    flex: 1,
    marginEnd: 16,
    marginStart: 8,
    borderWidth: 0,
  },
});
