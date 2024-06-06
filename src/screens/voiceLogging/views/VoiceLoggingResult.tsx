import React, { useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '../../../constants';
import { Text } from '../../../components/texts/Text';
import type { PassioSpeechRecognitionModel } from '@passiolife/nutritionai-react-native-sdk-v3';
import { VoiceLoggingResultItemView } from './VoiceLoggingResultItemView';
import { BasicButton } from '../../../components';
import { ICONS } from '../../../assets';

interface Props {
  style?: StyleProp<ViewStyle>;
  passioSpeechRecognitionResults: Array<PassioSpeechRecognitionModel>;
  onTryAgain: () => void;
  onSearchManuallyPress: () => void;
  onLogSelect: (selected: PassioSpeechRecognitionModel[]) => void;
}
export interface VoiceLoggingResultRef {}

export const VoiceLoggingResult = React.forwardRef(
  (
    {
      style,
      passioSpeechRecognitionResults,
      onTryAgain,
      onLogSelect,
      onSearchManuallyPress,
    }: Props,
    _ref: React.Ref<VoiceLoggingResultRef>
  ) => {
    const renderFooter = () => {
      return <View style={styles.footer} />;
    };

    const [selected, setSelected] = useState<PassioSpeechRecognitionModel[]>(
      []
    );

    const onFoodSelect = (result: PassioSpeechRecognitionModel) => {
      const find = selected?.find(
        (item) =>
          item.advisorInfo?.recognisedName ===
          result.advisorInfo?.recognisedName
      );
      if (find) {
        setSelected((item) =>
          item?.filter(
            (i) =>
              i.advisorInfo?.recognisedName !==
              result.advisorInfo?.recognisedName
          )
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
          weight="600"
          size="_18px"
          color="text"
          style={styles.quickSuggestionTextStyle}
        >
          Results
        </Text>
        <Text
          weight="500"
          size="_14px"
          color="secondaryText"
          style={styles.noQuickSuggestionTitle}
        >
          Select the foods you would like to log
        </Text>
        <FlatList
          style={styles.list}
          data={passioSpeechRecognitionResults}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: PassioSpeechRecognitionModel }) => {
            const foodDataInfo = item.advisorInfo?.foodDataInfo;

            const isSelected =
              selected?.find(
                (it) =>
                  it.advisorInfo?.recognisedName ===
                  item.advisorInfo?.recognisedName
              ) !== undefined;

            return (
              <VoiceLoggingResultItemView
                foodName={item.advisorInfo?.recognisedName}
                imageName={foodDataInfo?.iconID}
                bottom={`${item.advisorInfo?.portionSize} | ${item.advisorInfo?.foodDataInfo?.nutritionPreview?.calories} cal`}
                onFoodLogSelect={() => {
                  onFoodSelect(item);
                }}
                isSelected={isSelected}
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
              onLogSelect(selected ?? []);
            }}
            style={styles.buttonLogSelected}
            enable={selected && selected.length > 0}
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
  footer: {
    height: 120,
  },
  list: {
    marginHorizontal: 16,
    marginVertical: 16,
    flex: 1,
  },
  quickSuggestionTextStyle: {
    alignSelf: 'center',
    marginTop: 4,
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
