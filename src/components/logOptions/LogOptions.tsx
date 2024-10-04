import React, { useState } from 'react';
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
  onTakePicture: () => void;
  onTakeCamera: () => void;
  onAiAdvisor: () => void;
  onMyFoods: () => void;
}

type Type = 'All' | 'UseImage';

export const LogOptions = ({
  onFavorite,
  onFoodScanner,
  onTextSearch,
  onVoiceLogging,
  onTakePicture,
  onTakeCamera,
  onMyFoods,
  onAiAdvisor,
}: Props) => {
  const branding = useBranding();
  const styles = logOptionsStyle(branding);
  const [type, setType] = useState<Type>('All');

  const renderItem = (icon: number, title: string, onPress: () => void) => {
    return (
      <Pressable onPress={onPress} style={styles.optionContainer}>
        <Image
          source={icon}
          style={[styles.optionIcon, styles.iconColor]}
          resizeMode="contain"
        />
        <Text weight="500" size="_16px" color="text" style={styles.optionTitle}>
          {title}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.main}>
      {type === 'All' ? (
        <>
          {renderItem(ICONS.menuMyFoods, 'My Foods', onMyFoods)}
          {renderItem(ICONS.menuFav, 'Favorites', onFavorite)}
          {renderItem(ICONS.menuVoiceLogging, 'Voice Logging', onVoiceLogging)}
          {renderItem(ICONS.menuAIAdviosr, 'AI Advisor', onAiAdvisor)}
          {renderItem(ICONS.menuUseImage, 'Use Image', () => {
            setType('UseImage');
          })}
          {renderItem(ICONS.menuSearch, 'Text Search', onTextSearch)}
          {renderItem(ICONS.menuFoodScanner, 'Food Scanner', onFoodScanner)}
        </>
      ) : (
        <>
          <>
            {renderItem(ICONS.logOptionSearch, 'Take Photos', onTakeCamera)}
            {renderItem(
              ICONS.logOptionFoodScanner,
              'Select Photos',
              onTakePicture
            )}
          </>
        </>
      )}
    </View>
  );
};
