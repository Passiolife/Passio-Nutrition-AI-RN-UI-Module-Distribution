import React from 'react';
import { StyleSheet, View } from 'react-native';

import { screenHeight, screenWidth } from '../../utils';

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
  center: ({ text1 }: { text1: string }) => (
    <View style={styles.quickSCanMode}>
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
    marginRight: 24,
  },
  closeIcon: {
    height: 25,
    width: 25,
  },
  closeIconError: {
    height: 18,
    tintColor: '#fff',
    width: 18,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 7,
    borderWidth: 0.2,
    marginBottom: 16,
    flexDirection: 'row',
    height: 50,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  quickSCanMode: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 7,
    borderWidth: 0.2,
    marginBottom: screenHeight / 3,
    flexDirection: 'row',
    height: 50,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  errorContainer: {
    backgroundColor: '#FF3333',
    borderColor: '#FF3333',
    borderRadius: 7,
    borderWidth: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    overflow: 'hidden',
    marginHorizontal: 16,
    width: screenWidth - 32,
    paddingHorizontal: 22,
  },
  errorText1Style: {
    alignItems: 'flex-start',
    color: '#fff',
  },
  hitSlop: {
    bottom: 20,
    left: 50,
    right: 50,
    top: 20,
  },
  icon: {
    height: 24,
    width: 24,
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
    paddingHorizontal: 23,
  },
  text1Style: {
    alignItems: 'flex-start',
  },
  viewSepratorStyle: {
    backgroundColor: 'rgba(79, 70, 229, 1)',
    width: 14,
    opacity: 0.8,
  },
});
