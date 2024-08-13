import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useBranding } from '../../contexts';
import type { Branding } from '../../contexts';
import { Text } from '../texts';
import {
  PassioSDK,
  PassioTokenBudget,
} from '@passiolife/nutritionai-react-native-sdk-v3';

interface SwitchTabProps {
  style?: StyleProp<ViewStyle>;
}

export const SDKUsagesView = React.memo(({ style }: SwitchTabProps) => {
  const styles = switchTabStyle(useBranding());
  const [log, setLog] = useState('');

  useEffect(() => {
    PassioSDK.setAccountListener({
      onTokenBudgetUpdate: (tokenBudget: PassioTokenBudget) => {
        setLog(JSON.stringify(tokenBudget));
      },
    });
  }, []);
  return (
    <View style={[styles.container, style]}>
      <Text>{log}</Text>
    </View>
  );
});

const switchTabStyle = ({}: Branding) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      position: 'absolute',
      marginHorizontal: 16,
      backgroundColor: 'white',
      left: 0,
      right: 0,
      zIndex: 1000,
      bottom: 0,
    },
  });
