import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: ScreenWidth } = Dimensions.get('window');

interface MessageSendImageViewProps {
  imgUrl: string[] | undefined;
}

export const MessageSendImageView = ({ imgUrl }: MessageSendImageViewProps) => {
  const styles = ImageMessageViewStyle();

  return (
    <View style={[styles.msgView, styles.sentMsgView]}>
      {
        imgUrl && (
          <View style={[styles.img]}>
            <Carousel
              loop
              width={220}
              height={300}
              mode="parallax"
              style={styles.imgCarousel}
              modeConfig={{
                parallaxAdjacentItemScale: 0.5,
              }}
              data={imgUrl}
              renderItem={({ index, item }) => (
                <Image
                  key={index.toString()}
                  source={{ uri: `file://${item}` }}
                  resizeMode="cover"
                  style={[styles.img, {}]}
                />
              )}
            />
          </View>
        )
        // : (
        //   <Image
        //     source={{ uri: `file://${imgUrl?.at(0)}` }}
        //     resizeMode="cover"
        //     style={styles.img}
        //   />
        // )
      }
    </View>
  );
};

const ImageMessageViewStyle = () =>
  StyleSheet.create({
    msgView: {
      maxWidth: ScreenWidth * 0.75,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      marginVertical: 16,
      padding: 1,
    },

    sentMsgView: {
      alignSelf: 'flex-end',
    },
    img: {
      width: 220,
      height: 220,
    },
    imgCarousel: {
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      overflow: 'hidden',
    },
  });
