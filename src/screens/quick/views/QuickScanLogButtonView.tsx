import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BasicButton, LinkText, Text } from '../../../components';

interface Props {
  onOpenFoodLogEditor?: () => void;
  onSaveFoodLog?: () => void;
  onFoodSearchManuallyPress?: () => void;
  hideSearch?: boolean;
}

export const QuickScanLogButtonView = ({
  onOpenFoodLogEditor,
  onSaveFoodLog,
  onFoodSearchManuallyPress,
  hideSearch,
}: Props) => {
  return (
    <View style={styles.container}>
      {!hideSearch && (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignSelf: 'center',
          }}
        >
          <Text weight="400" size="_14px">
            {' Not what you’re looking for?  '}
          </Text>
          <LinkText
            onPress={onFoodSearchManuallyPress}
            weight="600"
            color="primaryColor"
          >
            Search Manually
          </LinkText>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          marginVertical: 16,
        }}
      >
        <BasicButton
          secondary
          onPress={onOpenFoodLogEditor}
          style={styles.button}
          text={'Edit'}
        />
        <BasicButton text="Log" onPress={onSaveFoodLog} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  icon: {
    height: 24,
    width: 24,
    marginVertical: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
