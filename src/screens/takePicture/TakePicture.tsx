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
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { BasicButton } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scaleHeight } from '../../utils';
import { ICONS } from '../../assets';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

interface Props {
  recognizePictureRemote: (images: string[]) => void;
  animatedIndex: SharedValue<number>;
}

export interface TakePictureRef {
  onRetake: () => void;
}

const RenderItem = ({
  item,
  onDelete,
}: {
  item: string;
  onDelete: (item: string) => void;
}) => {
  const [isSelect, setSelect] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => {
        setSelect(!isSelect);
      }}
    >
      <Image
        source={{
          uri: Image.resolveAssetSource({
            uri: item,
          }).uri,
        }}
        style={{
          height: 75,
          width: 75,
          borderRadius: 8,
          marginHorizontal: 4,
          marginTop: 10,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        }}
      />

      {isSelect && (
        <TouchableOpacity
          onPress={() => {
            onDelete(item);
          }}
          style={{
            position: 'absolute',
            right: 0,
            height: 18,
            width: 18,
            overflow: 'hidden',
          }}
        >
          <Image
            source={ICONS.close}
            style={{
              height: 18,
              overflow: 'hidden',
              width: 18,
            }}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export const TakePicture = React.forwardRef<TakePictureRef, Props>(
  (
    { recognizePictureRemote, animatedIndex }: Props,
    ref: React.Ref<TakePictureRef>
  ) => {
    const [images, setImages] = useState<string[]>([]);
    const camera = useRef<Camera>(null);
    const navigation = useNavigation<TakePictureScreenProps>();
    const flatListRef = useRef<FlatList>(null);

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

          LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
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

    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
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
          <View style={{}}>
            <FlatList
              data={images.reverse()}
              ref={flatListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal={false}
              contentContainerStyle={{
                alignItems: 'center',
                alignSelf: 'center',
                alignContent: 'center',
                paddingHorizontal: Dimensions.get('window').width / 2 - 75 / 2, // Center the items
                flexGrow: 1,
                justifyContent: images.length < 4 ? 'center' : 'flex-start',
              }}
              style={{
                marginBottom: 18,
              }}
              renderItem={({ item }) => {
                return (
                  <RenderItem
                    item={item}
                    onDelete={(item) => {
                      setImages((i) => i.filter((o) => o !== item));
                    }}
                  />
                );
              }}
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
              marginStart: 16,
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
              marginEnd: 16,
              marginStart: 16,
              opacity: images.length > 0 ? 1 : 0.5,
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
);
