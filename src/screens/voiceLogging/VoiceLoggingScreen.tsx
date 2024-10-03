import { ActivityIndicator, Image, SafeAreaView, View } from 'react-native';

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
import { ICONS, LottieAsset } from '../../assets';
import LottieView from 'lottie-react-native';

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
    voiceRecords,
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
        {searchQuery.length > 0 && (
          <View style={styles.searchQuery}>
            <Text weight="400" size="_14px" numberOfLines={5}>
              {searchQuery}
            </Text>
          </View>
        )}
        {!isFetchingResponse && isRecording && (
          <View style={styles.imageContainer}>
            <LottieView
              source={LottieAsset.VOICE_LOGGING_WAVES}
              loop
              resizeMode="contain"
              style={[styles.speekingImg]}
              autoPlay={true}
            />
          </View>
        )}

        {isFetchingResponse && (
          <View style={styles.generatingResultLoading}>
            <ActivityIndicator style={{ marginVertical: 8 }} />
            <Text>Generating results...</Text>
          </View>
        )}

        {!isRecording && searchQuery.length === 0 && (
          <View style={styles.defaultText}>
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
          </View>
        )}

        {!isFetchingResponse && (
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
        )}
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
          result={voiceRecords ?? []}
        />
      </BottomSheet>
    </>
  );
});
