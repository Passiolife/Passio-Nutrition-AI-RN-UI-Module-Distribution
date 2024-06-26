import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import JumpingDotsComponent from '../JumpingDotsComponent';

const { width: ScreenWidth } = Dimensions.get('window');

export const ImageScanning = () => {
  const styles = ResponseViewStyle();
  const content = 'Advisor is analysing...';

  return (
    <TouchableOpacity style={[styles.msgView, styles.receivedMsgView]}>
      <JumpingDotsComponent />
      <Text style={[styles.msgText, styles.receivedMsg]}>{content}</Text>
    </TouchableOpacity>
  );
};

// Styles for the component
const ResponseViewStyle = () =>
  StyleSheet.create({
    msgView: {
      maxWidth: ScreenWidth * 0.75,
      minWidth: 210,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: 16,
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    receivedMsgView: {
      backgroundColor: '#6366F1',
      alignSelf: 'flex-start',
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 0,
    },

    msgText: {
      fontSize: 14,
      marginStart: 8,
      fontWeight: '400',
    },

    receivedMsg: {
      color: '#FFFFFF',
    },
  });
