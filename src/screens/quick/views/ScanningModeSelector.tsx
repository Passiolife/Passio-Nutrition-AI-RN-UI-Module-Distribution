import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICONS } from '../../../assets';
import { ShowToast } from '../../../utils';
import { useBranding } from '../../../contexts';
import type { ScanningMode } from '../QuickScanningScreen';

interface ScanningModeSelectorProps {
  mode: ScanningMode;
  setMode: (mode: ScanningMode) => void;
}

const ScanningModeSelector: React.FC<ScanningModeSelectorProps> = ({
  mode,
  setMode,
}) => {
  const branding = useBranding();

  return (
    <View style={styles.container}>
      {['Visual', 'Barcode', 'NutritionFact'].map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.iconsContainer,
            mode === item && styles.iconsContainerSelected,
          ]}
          onPress={() => {
            setMode(item as ScanningMode);
            ShowToast(`${item} Mode`);
          }}
        >
          <Image
            tintColor={mode === item ? branding.white : undefined}
            source={
              item === 'Visual'
                ? ICONS.modeVisual
                : item === 'Barcode'
                  ? ICONS.modeBarcode
                  : ICONS.modeNutritionFact
            }
            resizeMode="contain"
            style={styles.icons}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 8,
  },
  icons: {
    height: 24,
    width: 24,
  },
  iconsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
    borderRadius: 32,
    padding: 6,
  },
  iconsContainerSelected: {
    backgroundColor: 'rgba(79, 70, 229, 1)',
  },
});

export default ScanningModeSelector;
