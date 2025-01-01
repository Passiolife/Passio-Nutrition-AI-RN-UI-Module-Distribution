import React from 'react';
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
import { ICONS } from '../../../assets';

interface Props {
  style?: StyleProp<ViewStyle>;
  onTryAgain: () => void;
  onSearchManuallyPress: () => void;
}
export interface VoiceLoggingResultRef {}

export const VoiceLoggingResultFailed = React.forwardRef(
  (
    { style, onTryAgain, onSearchManuallyPress }: Props,
    _ref: React.Ref<VoiceLoggingResultRef>
  ) => {
    return (
      <View style={[styles.itemsContainer, style]}>
        <Text
          weight="700"
          size="_20px"
          color="text"
          style={styles.quickSuggestionTextStyle}
        >
          No Results Found
        </Text>
        <Text
          weight="400"
          size="_14px"
          color="text"
          style={[styles.noQuickSuggestionTitle, { paddingVertical: 10 }]}
        >
          Sorry, we could not find any matches. Please try again or try
          searching manually
        </Text>
        <View style={[styles.buttonContainer, { marginVertical: 20 }]}>
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
            onPress={onSearchManuallyPress}
            style={styles.buttonLogSelected}
            text="Search Manually"
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
