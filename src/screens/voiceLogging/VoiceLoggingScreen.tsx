import { Image, SafeAreaView, View } from 'react-native';

import type { MealLabel } from '../../models';
import React from 'react';
import { voiceLoggingScreenStyle } from './VoiceLoggingScreen.styles';
import { useVoiceLogging } from './useVoiceLoggingScreen';
import type { PassioFoodItem } from '@passiolife/nutritionai-react-native-sdk-v3';
import { useBranding } from '../../contexts';
import { BackNavigation, Text, BasicButton } from '../../components';
import BottomSheet from '@gorhom/bottom-sheet';
import { VoiceLoggingResult } from './views/VoiceLoggingResult';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ICONS, speeking_wave } from '../../assets';

export interface VoiceLoggingScreenProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
  onSaveData?: (item: PassioFoodItem) => void;
}

export const VoiceLoggingScreen = gestureHandlerRootHOC(() => {
  const {
    bottomSheetModalRef,
    snapPoints,
    searchQuery,
    PassioSpeechRecognitionResult,
    isFetchingResponse,
    isRecording,
    onRecordingPress,
    onLogSelectPress,
    onTryAgainPress,
    onSearchManuallyPress,
  } = useVoiceLogging();

  const branding = useBranding();
  const styles = voiceLoggingScreenStyle(branding);

  return (
    <>
      <BackNavigation title={'Voice Logging'} />
      <SafeAreaView style={styles.container}>
        <View style={styles.contentView}>
          <View style={styles.textView}>
            {searchQuery.length > 0 ? (
              <View style={styles.textWrapper}>
                <Text weight="400" size="_14px" numberOfLines={3}>
                  {searchQuery}
                </Text>
              </View>
            ) : null}
          </View>
          <View>
            {isRecording ? (
              <>
                <Image
                  source={speeking_wave}
                  resizeMode="stretch"
                  style={styles.speekingImg}
                />
              </>
            ) : isFetchingResponse ? (
              <></>
            ) : (
              <>
                <Text size="_16px" weight="400">
                  Tap{' '}
                  <Text size="_16px" weight="600">
                    Start Listening,
                  </Text>{' '}
                  then say something like:
                </Text>
                <Text size="_16px" weight="400" style={styles.contentText}>
                  “I had one blueberry muffin and a cup of green tea for my
                  breakfast”
                </Text>
              </>
            )}
          </View>
          <View style={styles.btnView}>
            <BasicButton
              text={!isRecording ? 'Start Listening' : 'Stop Listening'}
              onPress={onRecordingPress}
              isLoading={isFetchingResponse}
              rightIcon={
                <Image
                  source={!isRecording ? ICONS.Mic : ICONS.RecordingStop}
                  resizeMode="contain"
                  style={styles.micIcon}
                />
              }
            />
          </View>
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetModalRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetChildrenContainer}
        handleIndicatorStyle={{ display: 'none' }}
      >
        <VoiceLoggingResult
          onLogSelect={onLogSelectPress}
          onTryAgain={onTryAgainPress}
          onSearchManuallyPress={onSearchManuallyPress}
          passioSpeechRecognitionResults={PassioSpeechRecognitionResult ?? []}
        />
      </BottomSheet>
    </>
  );
});
