import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width: ScreenWidth } = Dimensions.get('window');

interface MessageSendImageViewProps {
  imgUrl: string[] | undefined;
}

export const MessageSendImageView = ({ imgUrl }: MessageSendImageViewProps) => {
  const styles = ImageMessageViewStyle();

  return (
    <View style={[styles.msgView, styles.sentMsgView]}>
      <Image
        source={{ uri: `file://${imgUrl?.at(0)}` }}
        resizeMode="cover"
        style={styles.img}
      />
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
      backgroundColor: '#E0E7FF',
      alignSelf: 'flex-end',
    },
    img: {
      width: 220,
      height: 220,
    },
  });
