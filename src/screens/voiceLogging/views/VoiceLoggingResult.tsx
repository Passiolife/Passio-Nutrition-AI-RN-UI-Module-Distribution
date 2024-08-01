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
import type { PassioSpeechRecognitionModel } from '@passiolife/nutritionai-react-native-sdk-v3';
import { VoiceLoggingResultItemView } from './VoiceLoggingResultItemView';
import { BasicButton } from '../../../components';
import { ICONS } from '../../../assets';
import { FlatList } from 'react-native-gesture-handler';
import { getUpdatedCaloriesOfPassioAdvisorFoodInfo } from '../../../utils';
import type { VoiceLogRecord } from '../useVoiceLoggingScreen';

interface Props {
  style?: StyleProp<ViewStyle>;
  result: Array<VoiceLogRecord>;
  onTryAgain: () => void;
  onSearchManuallyPress: () => void;
  onLogSelect: (selected: PassioSpeechRecognitionModel[]) => void;
}
export interface VoiceLoggingResultRef {}

export const VoiceLoggingResult = React.forwardRef(
  (
    { style, result, onTryAgain, onLogSelect, onSearchManuallyPress }: Props,
    _ref: React.Ref<VoiceLoggingResultRef>
  ) => {
    const [voiceRecords, setVoiceRecords] = useState<VoiceLogRecord[]>(result);

    useEffect(() => {
      setVoiceRecords(result);
    }, [result]);

    const onFoodSelect = (record: VoiceLogRecord) => {
      setVoiceRecords((item) =>
        item?.map((i) => {
          if (
            i.advisorInfo?.recognisedName === record.advisorInfo?.recognisedName
          ) {
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
      setVoiceRecords((item) =>
        item?.map((i) => {
          return {
            ...i,
            isSelected: false,
          };
        })
      );
    };

    const isSelected = voiceRecords?.find((i) => i.isSelected) !== undefined;
    return (
      <View style={[styles.itemsContainer, style]}>
        <View style={styles.clearBtnView}>
          <TouchableOpacity onPress={onClearPress} style={styles.clearBtn}>
            <Text size="_14px" weight="400" style={styles.clearBtnText}>
              {isSelected ? 'Clear' : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          weight="700"
          size="_20px"
          color="text"
          style={styles.quickSuggestionTextStyle}
        >
          Results
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
          data={voiceRecords}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: VoiceLogRecord }) => {
            const foodDataInfo = item.advisorInfo?.foodDataInfo;
            const { calories } = getUpdatedCaloriesOfPassioAdvisorFoodInfo(
              item.advisorInfo
            );

            return (
              <VoiceLoggingResultItemView
                foodName={
                  item.advisorInfo?.foodDataInfo?.foodName ??
                  item.advisorInfo.recognisedName
                }
                imageName={foodDataInfo?.iconID}
                bottom={`${item.advisorInfo?.weightGrams} g | ${Math.round(calories)} cal`}
                onFoodLogSelect={() => {
                  onFoodSelect(item);
                }}
                isSelected={item.isSelected ?? false}
              />
            );
          }}
        />
        <View style={styles.contentView}>
          <Text size="_14px" weight="400">
            Not what you’re looking for?{' '}
            <Text
              onPress={onSearchManuallyPress}
              size="_14px"
              weight="700"
              style={styles.contentText}
            >
              Search Manually
            </Text>
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <BasicButton
            secondary
            onPress={onTryAgain}
            style={styles.buttonTryAgain}
            text="Try Again"
            rightIcon={
              <Image
                source={ICONS.Mic}
                resizeMode="contain"
                style={styles.micIcon}
              />
            }
          />
          <BasicButton
            onPress={() => {
              onLogSelect(voiceRecords.filter((i) => i.isSelected));
            }}
            style={styles.buttonLogSelected}
            enable={isSelected}
            text="Log Selected"
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  itemsContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  footer: {},
  list: {
    marginHorizontal: 16,
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
