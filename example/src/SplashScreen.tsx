import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

export const SplashScreen = () => {
  return (
    <ImageBackground
      resizeMethod="resize"
      resizeMode="stretch"
      source={require('../assets/image/splash.png')}
      style={styles.container}
    >
      <Image
        source={require('../assets/image/passio_logo.png')}
        style={styles.logo}
        resizeMode="contain"
        resizeMethod="resize"
      />
      <View style={styles.actions}>
        <Text style={styles.config}>
          {'Please wait...\nSDK Configuring...'}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 1)',
  },
  actions: {
    flex: 1,
  },
  config: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  logo: {
    height: 150,
    width: 300,
    alignSelf: 'center',
    flex: 1,
  },
});
