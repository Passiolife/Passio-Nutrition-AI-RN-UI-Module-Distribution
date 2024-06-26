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

const width = Dimensions.get('screen').width;

interface Props {
  recognizePictureRemote: (images: string[]) => void;
}

export interface SelectPhotosRef {
  onRetake: () => void;
}

export const SelectPhotos = React.forwardRef<SelectPhotosRef, Props>(
  ({ recognizePictureRemote }: Props, ref: React.Ref<SelectPhotosRef>) => {
    const [images, setImages] = useState<string[]>([]);
    const navigation = useNavigation<TakePictureScreenProps>();
    const isFirstTime = useRef(true);

    const onTakeImages = useCallback(async () => {
      try {
        const { assets } = await launchImageLibrary({
          selectionLimit: PHOTO_LIMIT,
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
    }, [navigation, recognizePictureRemote]);

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
        <View>
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
                    margin: 3,
                    width: width / 3.5,
                  }}
                />
              );
            }}
            numColumns={3}
          />
        </View>
      </SafeAreaView>
    );
  }
);
