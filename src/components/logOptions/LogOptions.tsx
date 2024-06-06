import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useBranding } from '../../contexts';
import logOptionsStyle from './LogOptions.styles';
import { Text } from '../texts';
import { ICONS } from '../../assets';
interface Props {
  onClose: () => void;
  onFoodScanner: () => void;
  onTextSearch: () => void;
  onFavorite: () => void;
  onVoiceLogging: () => void;
}

export const LogOptions = ({
  onFavorite,
  onFoodScanner,
  onTextSearch,
  onVoiceLogging,
}: Props) => {
  const branding = useBranding();
  const styles = logOptionsStyle(branding);

  const renderItem = (icon: number, title: string, onPress: () => void) => {
    return (
      <Pressable onPress={onPress} style={styles.optionContainer}>
        <Image source={icon} style={styles.optionIcon} resizeMode="contain" />
        <Text weight="500" size="_16px" color="text" style={styles.optionTitle}>
          {title}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.main}>
      {renderItem(ICONS.Mic, 'Voice Logging', onVoiceLogging)}
      {renderItem(ICONS.logOptionFoodScanner, 'Food Scanner', onFoodScanner)}
      {renderItem(ICONS.logOptionSearch, 'Text Search', onTextSearch)}
      {renderItem(ICONS.logOptionFavorite, 'Favorites', onFavorite)}
    </View>
  );
};
