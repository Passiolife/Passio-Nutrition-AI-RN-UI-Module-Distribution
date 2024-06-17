import React, { useEffect } from 'react';
import { takePictureStyle } from './takePicture.styles';
import { useTakePicture } from './useTakePicture';
import { useBranding } from '../../contexts';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BasicButton } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scaleHeight, screenHeight } from '../../utils';
import { ICONS } from '../../assets';
import BottomSheet from '@gorhom/bottom-sheet';
import { PictureLoggingResult } from './views/PictureLoggingResult';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const TakePictureScreen = gestureHandlerRootHOC(() => {
  const {
    hasPermission,
    requestPermission,
    camera,
    captureImage,
    images,
    recognizePictureRemote,
    snapPoints,
    bottomSheetModalRef,
    onLogSelectPress,
    passioAdvisorFoodInfo,
    onRetakePress,
    isFetchingResponse,
    animatedMarginBottom,
  } = useTakePicture();
  const device = useCameraDevice('back');
  const animatedIndex = useSharedValue<number>(46);
  const branding = useBranding();
  const styles = takePictureStyle(branding);
  useEffect(() => {
    requestPermission();
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return <Text>abc</Text>;
  }

  if (!device) {
    return <Text>device</Text>;
  }

  const renderItem = ({ item }: { path: string }) => {
    return (
      <Image
        source={{
          uri: Image.resolveAssetSource({
            uri: item.path,
          }).uri,
        }}
        style={{ height: 100, width: 100, borderRadius: 24 }}
      />
    );
  };

  return (
    <>
      {isFetchingResponse && (
        <View style={styles.generatingResultLoading}>
          <View
            style={{
              padding: 16,
              backgroundColor: '#FFFFFF80',
              borderRadius: 15,
            }}
          >
            <ActivityIndicator style={{ marginVertical: 8 }} color={'black'} />
            <Text style={{ color: 'black' }}>Generating results...</Text>
          </View>
        </View>
      )}
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 16 }}
      >
        <Camera
          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
          device={device}
          isActive={true}
          ref={camera}
          photo={true}
        />
        <Animated.View
          style={{
            marginBottom: interpolate(
              animatedIndex.value,
              [0, 1],
              [(screenHeight * 30) / 100, (screenHeight * 60) / 100]
            ),
          }}
        >
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            renderItem={renderItem}
          />
        </Animated.View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: scaleHeight(75),
          }}
        >
          <BasicButton
            text="Cancel"
            boarderColor={branding.primaryColor}
            secondary={true}
            style={{
              backgroundColor: 'white',
              maxHeight: 50,
              flex: 1,
              marginEnd: 16,
            }}
          />
          <TouchableOpacity onPress={captureImage}>
            <Image
              source={ICONS.CaptureIcon}
              resizeMethod="resize"
              resizeMode="contain"
              style={{ height: 78, width: 78 }}
            />
          </TouchableOpacity>
          <BasicButton
            disabled={images.length < 0}
            onPress={recognizePictureRemote}
            text="Next"
            boarderColor={branding.primaryColor}
            style={{
              maxHeight: 50,
              flex: 1,
              marginStart: 16,
              opacity: images.length > 0 ? 1 : 0.5,
            }}
          />
        </View>
      </SafeAreaView>
      <BottomSheet
        ref={bottomSheetModalRef}
        index={-1}
        animatedIndex={animatedIndex}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetChildrenContainer}
        handleIndicatorStyle={{ display: 'none' }}
      >
        <PictureLoggingResult
          onLogSelect={onLogSelectPress}
          onRetake={onRetakePress}
          passioAdvisorFoodInfoResult={passioAdvisorFoodInfo ?? []}
        />
      </BottomSheet>
    </>
  );
});
