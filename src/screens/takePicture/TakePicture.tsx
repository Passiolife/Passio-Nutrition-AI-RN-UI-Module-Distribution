import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { TakePictureScreenProps } from './useTakePicture';
import { useBranding } from '../../contexts';
import {
  Camera,
  CameraCaptureError,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { BasicButton } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scaleHeight, screenWidth } from '../../utils';
import { ICONS } from '../../assets';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';

interface Props {
  recognizePictureRemote: (images: string[]) => void;
  animatedIndex: SharedValue<number>;
}

export interface TakePictureRef {
  onRetake: () => void;
}

export const TakePicture = React.forwardRef<TakePictureRef, Props>(
  (
    { recognizePictureRemote, animatedIndex }: Props,
    ref: React.Ref<TakePictureRef>
  ) => {
    const [images, setImages] = useState<string[]>([]);
    const camera = useRef<Camera>(null);
    const navigation = useNavigation<TakePictureScreenProps>();

    useImperativeHandle(
      ref,
      () => ({
        onRetake: () => {
          setImages([]);
        },
      }),
      []
    );

    const onCancelPress = () => {
      navigation.goBack();
    };

    const captureImage = useCallback(async () => {
      camera.current
        ?.takePhoto({ enableShutterSound: true })
        .then((value) => {
          let path =
            Platform.OS === 'android' ? `file://${value.path}` : value.path;
          setImages([...images, path]);
        })
        .catch((_val: CameraCaptureError) => {});
    }, [images]);

    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const branding = useBranding();
    useEffect(() => {
      requestPermission();
    }, [hasPermission, requestPermission]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(
              animatedIndex.value,
              [-1, 0, 1],
              [46, -0, -240]
            ),
          },
        ],
      };
    });

    if (!hasPermission) {
      return <></>;
    }

    if (!device) {
      return <></>;
    }

    const renderItem = ({ item }: { item: string }) => {
      return (
        <Image
          source={{
            uri: Image.resolveAssetSource({
              uri: item,
            }).uri,
          }}
          style={{
            height: 75,
            width: 75,
            backgroundColor: 'red',
            borderRadius: 8,
            marginHorizontal: 2,
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
      );
    };

    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 16 }}
      >
        <Camera
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
          device={device}
          isActive={true}
          ref={camera}
          photo={true}
        />
        <Animated.View
          style={[
            {
              marginBottom: 46,
            },
            animatedStyle,
          ]}
        >
          <View>
            {/* <Carousel
              width={screenWidth - 50}
              modeConfig={{
                parallaxScrollingOffset: 240,
                parallaxScrollingScale: 1.2,
                parallaxAdjacentItemScale: 1,
              }}
              height={130}
              data={images}
              style={{
                bottom: 100,
              }}
              mode="parallax"
              renderItem={renderItem}
            /> */}
            <FlatList
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal={false}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                alignContent: 'center',
                flex: images.length < 4 ? 1 : undefined,
              }}
              style={{
                marginBottom: 18,
              }}
              renderItem={renderItem}
            />
          </View>
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
            onPress={onCancelPress}
            style={{
              backgroundColor: 'white',
              maxHeight: 50,
              flex: 1,
              marginEnd: 16,
            }}
          />
          <TouchableOpacity
            onPress={captureImage}
            disabled={images.length >= 7}
          >
            <Image
              source={ICONS.CaptureIcon}
              tintColor={images.length >= 7 ? '#DCDCDC' : 'white'}
              resizeMethod="resize"
              resizeMode="contain"
              style={{ height: 78, width: 78 }}
            />
          </TouchableOpacity>
          <BasicButton
            disabled={images.length < 0}
            onPress={() => recognizePictureRemote(images)}
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
    );
  }
);