import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WidgetsCard } from '../components';
import { ICONS } from '../assets';

export const BlankScreen = () => {
  return (
    <View style={styles.bodyContainer}>
      <Text>WIP</Text>
      <WidgetsCard
        widgetTitle="Water"
        leftIcon={ICONS.blueWaterDrop}
        rightIcon={ICONS.newAddPlus}
        value={45}
        unitValue="OZ"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
