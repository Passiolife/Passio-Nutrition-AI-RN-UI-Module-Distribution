import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Branding, useBranding } from '../../contexts';

interface Props extends React.PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<Props> = ({ children, style }) => {
  const branding = useBranding();

  const styles = cardStyle(branding);
  return <View style={[styles.container, style]}>{children}</View>;
};

const cardStyle = ({ card }: Branding) => {
  return StyleSheet.create({
    container: {
      backgroundColor: card,
      borderRadius: 12,
      shadowColor: '#00000029',
      shadowOpacity: 1,
      shadowOffset: {
        width: 1.5,
        height: 2.5,
      },
      shadowRadius: 2.85,
      elevation: 12,
    },
  });
};
