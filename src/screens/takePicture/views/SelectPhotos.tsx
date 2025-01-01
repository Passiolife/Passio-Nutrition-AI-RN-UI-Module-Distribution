import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Dimensions, FlatList, Image, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { PHOTO_LIMIT, type TakePictureScreenProps } from '../useTakePicture';
import { BackOnly } from '../../../components';
import { useBranding } from '../../../contexts';

const width = Dimensions.get('screen').width;

interface Props {
  recognizePictureRemote: (images: string[]) => void;
  isMultiple?: boolean;
}

export interface SelectPhotosRef {
  onRetake: () => void;
}

export const SelectPhotos = React.forwardRef<SelectPhotosRef, Props>(
  (
    { recognizePictureRemote, isMultiple = true }: Props,
    ref: React.Ref<SelectPhotosRef>
  ) => {
    const [images, setImages] = useState<string[]>([]);
    const navigation = useNavigation<TakePictureScreenProps>();
    const branding = useBranding();
    const isFirstTime = useRef(true);

    const onTakeImages = useCallback(async () => {
      try {
        const { assets } = await launchImageLibrary({
          selectionLimit: isMultiple ? PHOTO_LIMIT : 1,
          mediaType: 'photo',
          quality: 0.4,
        });
        const galleryImages = assets?.map(
          (i) => i.uri?.replace('file://', '') ?? ''
        );

        if (galleryImages && galleryImages.length > 0) {
          setImages(galleryImages);
          recognizePictureRemote(galleryImages);
        } else {
          navigation.goBack();
        }
        return galleryImages;
      } catch (e) {
        return [];
      }
    }, [isMultiple, navigation, recognizePictureRemote]);

    useImperativeHandle(
      ref,
      () => ({
        onRetake: () => {
          setImages([]);
          onTakeImages();
        },
      }),
      [onTakeImages]
    );

    useEffect(() => {
      async function init() {
        setTimeout(async () => {
          try {
            await onTakeImages();
          } catch {
            navigation.goBack();
          }
        }, 300);
      }

      if (isFirstTime.current) {
        init();
        isFirstTime.current = false;
      }
    }, [navigation, onTakeImages, recognizePictureRemote]);

    return (
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        <BackOnly />
        <View style={{ backgroundColor: branding.backgroundColor, flex: 1 }}>
          {images.length === 1 ? (
            <Image
              source={{
                uri: Image.resolveAssetSource({
                  uri:
                    Platform.OS === 'android'
                      ? `${'file://' + images[0]}`
                      : images[0],
                }).uri,
              }}
              resizeMode="cover"
              resizeMethod="resize"
              style={{
                height: width / 1,
                marginHorizontal: 16,
                borderRadius: 12,
                margin: 3,
              }}
            />
          ) : images.length === 2 ? (
            <FlatList
              data={images}
              style={{
                margin: 16,
              }}
              renderItem={({ item }) => {
                return (
                  <Image
                    source={{
                      uri: Image.resolveAssetSource({
                        uri:
                          Platform.OS === 'android'
                            ? `${'file://' + item}`
                            : item,
                      }).uri,
                    }}
                    resizeMode="cover"
                    resizeMethod="resize"
                    style={{
                      height: width / 2.3,
                      borderRadius: 12,
                      margin: 3,
                      width: width / 2.3,
                    }}
                  />
                );
              }}
              numColumns={3}
            />
          ) : (
            <FlatList
              data={images}
              style={{
                margin: 16,
              }}
              renderItem={({ item }) => {
                return (
                  <Image
                    source={{
                      uri: Image.resolveAssetSource({
                        uri:
                          Platform.OS === 'android'
                            ? `${'file://' + item}`
                            : item,
                      }).uri,
                    }}
                    resizeMode="cover"
                    resizeMethod="resize"
                    style={{
                      height: width / 3.5,
                      borderRadius: 12,
                      margin: 3,
                      width: width / 3.5,
                    }}
                  />
                );
              }}
              numColumns={3}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
);
