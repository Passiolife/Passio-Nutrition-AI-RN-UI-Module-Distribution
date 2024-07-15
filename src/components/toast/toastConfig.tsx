import React from 'react';
import { StyleSheet, View } from 'react-native';

import { scaledSize, scaleHeight, scaleWidth, screenWidth } from '../../utils';

import { Text } from '../texts';

export const toastConfig = {
  error: ({ text1 }: { text1: string; hide: () => void }) => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText1Style}>{text1}</Text>
      </View>
    );
  },

  success: ({ text1 }: { text1: string }) => (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.text1Style} color="white">
            {text1}
          </Text>
        </View>
      </View>
    </View>
  ),
};

export const styles = StyleSheet.create({
  closeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scaleWidth(24),
  },
  closeIcon: {
    height: scaledSize(25),
    width: scaledSize(25),
  },
  closeIconError: {
    height: scaleHeight(18),
    tintColor: '#fff',
    width: scaleWidth(18),
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: scaledSize(7),
    borderWidth: 0.2,
    marginBottom: 120,
    flexDirection: 'row',
    height: scaledSize(50),
    overflow: 'hidden',
    marginHorizontal: scaleWidth(16),
  },
  errorContainer: {
    backgroundColor: '#FF3333',
    borderColor: '#FF3333',
    borderRadius: scaledSize(7),
    borderWidth: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    height: scaledSize(50),
    marginBottom: 120,
    overflow: 'hidden',
    marginHorizontal: scaleWidth(16),
    width: screenWidth - 32,
    paddingHorizontal: scaleWidth(22),
  },
  errorText1Style: {
    alignItems: 'flex-start',
    color: '#fff',
  },
  hitSlop: {
    bottom: scaledSize(20),
    left: scaledSize(50),
    right: scaledSize(50),
    top: scaledSize(20),
  },
  icon: {
    height: scaleHeight(24),
    width: scaleWidth(24),
  },
  iconView: {
    borderRadius: 20,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scaleWidth(23),
  },
  text1Style: {
    alignItems: 'flex-start',
  },
  viewSepratorStyle: {
    backgroundColor: 'rgba(79, 70, 229, 1)',
    width: scaleWidth(14),
    opacity: 0.8,
  },
});
