import React, { useEffect, useRef, useState } from 'react';
import { TakePictureScreenProps, onTakeImages } from './useTakePicture';
import { Dimensions, FlatList, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('screen').width;

interface Props {
  recognizePictureRemote: (images: string[]) => void;
}

export const SelectPhotos = ({ recognizePictureRemote }: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const navigation = useNavigation<TakePictureScreenProps>();
  const isFirstTime = useRef(true);

  useEffect(() => {
    async function init() {
      setTimeout(async () => {
        try {
          const takenImages = await onTakeImages();
          if (takenImages && takenImages.length > 0) {
            setImages(takenImages);
            recognizePictureRemote(takenImages);
          } else {
            navigation.goBack();
          }
        } catch {
          navigation.goBack();
        }
      }, 300);
    }

    if (isFirstTime.current) {
      init();
      isFirstTime.current = false;
    }
  }, [navigation, recognizePictureRemote]);

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
                    uri: item,
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
};
